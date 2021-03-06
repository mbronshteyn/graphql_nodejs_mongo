const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');
const Dataloader = require('dataloader');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const {connection} = require('./database/util');
const {verifyUser} = require('./helper/context');
const loaders = require('./loaders');

const app = express();

dotEnv.config();

// database connectivity
connection();

// body parser middleware
app.use(express.json());

// setup cors
app.use(cors());

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req, connection}) => {

        const contextObj = {};

        if (req) {
            // verify user.  if user jwt token is not correct
            // req.email will be set to null in verifyUser
            await verifyUser(req);
            contextObj.email = req.email;
            contextObj.loggedInUserId = req.loggedInUserId;
        }

        contextObj.loaders = {
            user: new Dataloader(keys => loaders.user.batchUsers(keys))
        };

        return contextObj;
    },
    formatError: (error) => {
        console.log(error);
        return {
            message: error.message
        }
    }
});

apolloServer.applyMiddleware({app, path: '/graphql'});

const PORT = process.env.PORT || 3000;

const httpServer = app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
    console.log(`graphql server is: ${apolloServer.graphqlPath}`);
});

apolloServer.installSubscriptionHandlers(httpServer);