const mongoose = require('mongoose')

const Schema = mongoose.Schema

const permission_statusSchema = new Schema({
    ID: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    }
});



module.exports = mongoose.model('Permission_status', permission_statusSchema, 'Permission_status');