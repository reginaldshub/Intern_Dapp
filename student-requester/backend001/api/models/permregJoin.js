const mongoose = require('mongoose')

const Schema = mongoose.Schema

const perm_register_join = new Schema({
    requesterID: {
        type: String
    },
    studentName: {
        type: String
    },
    studentID: {
        type: String
    },
    Created_time: {
        type: String
    },
    Status: {
        type: String
    },
    requesterName: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    Roles: {
        type: String
    },
    phone: {
        type: Number
    },
    password: {
        type: String
    }
});



module.exports = mongoose.model('perm_register_join', perm_register_join, 'perm_register_join');
