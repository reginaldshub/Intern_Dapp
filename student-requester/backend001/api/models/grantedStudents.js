const mongoose = require('mongoose')

const Schema = mongoose.Schema

const grantedStudentsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('grantedStudents', grantedStudentsSchema, 'grantedStudents');
