const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);


