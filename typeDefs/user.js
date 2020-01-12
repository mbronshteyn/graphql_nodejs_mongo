const {gql} = require('apollo-server-express');

module.exports = gql`

    extend type Query {
        user : User
    }

    extend type Mutation {
        signup( input: signupInput ): User
        login( input: loginInfo ) : Token
    }

    extend type Subscription {
        userCreated: User
    }

    type Token {
        token: String!
    }

    input loginInfo {
        email: String!
        password: String!
    }

    input signupInput {
        name: String!
        password: String!
        email: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
        createdAt: Date!
        updatedAt: Date!
    }
`;