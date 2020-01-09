const jwt = require('jsonwebtoken');

const User = require('../../database/models/user');

module.exports.verifyUser = async (req) => {
    try {
        req.loggedInUserId = null;
        req.email = null;
        const {authorization} = req.headers;
        if (authorization) {
            const token = authorization.split(' ')[1];
            console.log('===', token);
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.email = payload.email;
            const user = await User.findOne({email: payload.email});
            req.loggedInUserId = user.id;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};