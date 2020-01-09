const mongoose = require('mongoose');

module.exports.connection = async () => {
    try {
        const dbUrl = process.env.MONGO_DB;
        await mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log(`DB ${dbUrl} connected successfully`)
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports.isValidObjectId = async () => {
    return await mongoose.Types.ObjectId.isValidObjectId(id);
};