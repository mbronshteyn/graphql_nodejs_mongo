const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        tasks: [Task!]
        task( id: ID! ) : Task
    }

    input createTaskInput {
        name: String!
        completed: Boolean!
    }

    extend type Mutation {
        createTask( input: createTaskInput ) : Task
        updateTask( id: ID!, input: updateTaskInput! ) : Task
    }

    input updateTaskInput {
        name: String
        completed: Boolean
    }

    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
        createdAt: Date!
        updatedAt: Date!
    }
`;