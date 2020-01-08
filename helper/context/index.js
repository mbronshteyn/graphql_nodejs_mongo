const jwt = require('jsonwebtoken');

module.exports.verifyUser = async (req) => {
    try {
        req.email = null;
        const {authorization} = req.headers;
        const token = authorization.split(' ')[1];
        console.log('===', token);
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.email = payload.email;
    } catch (error) {
        console.error(error);
        throw error;
    }
};