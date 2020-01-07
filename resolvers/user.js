const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {users, tasks} = require('../constants');
const User = require('../database/models/user');

module.exports = {
    Query: {
        users: () => users,
        user: (_, {id}) => users.find(user => user.id === id),
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
    User: {
        tasks: ({id}) => tasks.filter(task => task.id === id)
    },
};