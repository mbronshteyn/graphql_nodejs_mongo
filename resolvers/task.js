const uuid = require('uuid');
const {combineResolvers} = require('graphql-resolvers');

const {users, tasks} = require('../constants');
const Task = require('../database/models/task');
const User = require('../database/models/user');
const {isAuthenticated} = require('./middleware/index');

module.exports = {
    Query: {
        tasks: () => {
            console.log(tasks);
            return tasks;
        },
        task: (_, {id}) => tasks.find(task => task.id === id),
    },
    Mutation: {
        createTask: combineResolvers(isAuthenticated, async (_, {input}, {email}) => {
            try {
                const user = await User.findOne({email});
                const task = new Task({...input, user: user.id});
                const result = await task.save();
                user.tasks.push(result.id);
                await user.save();
                return result;
            } catch (error) {
                console.log(error);
                throw error;
            }
        })
    },
    Task: {
        // extract userId from parent ( Task ) object
        user: ({userId}) => {
            console.log(`userId: ${userId}`);
            return users.find(user => user.id === userId)
        },
    },
};
