const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const {connection} = require('./database/util');

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
    resolvers
});

apolloServer.applyMiddleware({app, path: '/graphql'});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
    console.log(`graphql server is: ${apolloServer.graphqlPath}`);
});