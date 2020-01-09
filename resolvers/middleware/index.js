const {skip} = require('graphql-resolvers');

module.exports.isAuthenticated = (_, __, {email}) => {

    if (!email) {
        throw new Error('Access Denied! Please login to continue')
    }

    return skip;
};