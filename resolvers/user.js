const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {combineResolvers} = require('graphql-resolvers');

const User = require('../database/models/user');
const Task = require('../database/models/task');
const {isAuthenticated} = require('./middleware/index');

const PubSub = require('../subscription');
const {userEvents} = require('../subscription/events');


module.exports = {
    Query: {
        user: combineResolvers(isAuthenticated, async (_, __, {email}) => {
            try {
                console.log(`=== ${email}`);
                const user = await User.findOne({email});
                if (!user) {
                    throw new Error('User not found');
                }
                return user;
            } catch (error) {
                console.error(error);
                throw error;
            }
        })
    },
    Mutation: {
        signup: async (_, {input}) => {
            try {
                const user = await User.findOne({email: input.email});
                if (user) {
                    throw new Error(`User email ${input.email} already exist`);
                }
                const hashedPassword = await bcrypt.hash(input.password, 12);
                const newUser = new User({...input, password: hashedPassword});
                const result = await newUser.save();

                PubSub.publish(userEvents.USER_CREATED, {
                    userCreated: result
                });

                return result;

            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        login: async (_, {input}) => {
            try {
                const user = await User.findOne({email: input.email});
                if (!user) {
                    throw new Error(`User email ${input.email} not found`);
                }
                const isPasswordValid = await bcrypt.compare(input.password, user.password);
                if (!isPasswordValid) {
                    throw new Error('Incorrect Password');
                }

                const secret = process.env.JWT_SECRET_KEY;
                const token = jwt.sign({email: user.email}, secret, {expiresIn: '1d'});

                return {token};

            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    },
    Subscription: {
        userCreated: {
            subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED)
        }
    },

    User: {
        tasks: async ({id}) => {
            try {
                const tasks = await Task.find({user: id});
                return tasks;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },
};