const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: {},
        required: true
    },
    registerDate: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: false,
        require: true
    },
    resetLink: {
        data: String,
        default: ''
    }
})

module.exports = mongoose.model('User', UserSchema);