const {combineResolvers} = require('graphql-resolvers');

const Task = require('../database/models/task');
const User = require('../database/models/user');
const {isAuthenticated, isTaskOwner} = require('./middleware/index');
const {stringToBase64, base64ToString} = require('../helper');

module.exports = {
    Query: {
        tasks: combineResolvers(isAuthenticated, async (_, {cursor, limit = 2}, {loggedInUserId}) => {
            try {
                const query = {user: loggedInUserId};
                if (cursor) {
                    query['_id'] = {
                        '$lt': base64ToString(cursor)
                    }
                }
                // fetch and extra record
                // compare there response siz with limit
                // if there is one more
                // we have more records to fetch
                let tasks = await Task.find(query).sort({id: -1}).limit(limit + 1);
                const hasNextPage = tasks.length > limit;
                tasks = hasNextPage ? tasks.slice(0, -1) : tasks;
                return {
                    taskFeed: tasks,
                    pageInfo: {
                        nextPageCursor: hasNextPage ? stringToBase64(tasks[tasks.length - 1].id) : null,
                        hasNextPage
                    }
                }
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),

        task: combineResolvers(isAuthenticated, isTaskOwner,
            async (_, {id}) => {
                try {
                    const task = await Task.findById(id);
                    return task;
                } catch (error) {
                    console.log(error);
                    throw error;
                }
            })
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
        }),
        updateTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, {id, input}) => {
            try {
                const task = await Task.findByIdAndUpdate(id, {...input}, {new: true});
                return task;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
        deleteTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, {id}, {loggedInUserId}) => {
            try {
                const task = Task.findByIdAndDelete(id);
                User.updateOne({_id: loggedInUserId}, {$pull: {tasks: task.id}});
                return task;
            } catch (error) {
                console.log(error);
                throw error;
            }
        })
    },
    Task: {
        // extract userId from parent ( Task ) object
        user: async (parent, _, {loaders}) => {
            try {
                // use dataloaders to avoid unnecessary trips to the database
                const user = await loaders.user.load(parent.user.toString());
                return user;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
};
