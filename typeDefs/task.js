const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        tasks( cursor: Int, limit: Int ): [Task!]
        task( id: ID! ) : Task
    }

    input createTaskInput {
        name: String!
        completed: Boolean!
    }

    extend type Mutation {
        createTask( input: createTaskInput ) : Task
        updateTask( id: ID!, input: updateTaskInput! ) : Task
        deleteTask( id: ID! ) : Task
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