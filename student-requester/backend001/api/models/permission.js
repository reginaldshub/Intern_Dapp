const mongoose = require('mongoose')

const Schema = mongoose.Schema

const permissionSchema = new Schema({
    requesterID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    Created_time: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true
    }
});



module.exports = mongoose.model('permission', permissionSchema, 'permission');
