const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    id:{type: String},
    studentid: { type: String },
    ecategory: { type: String },
    Startyear: { type: String },
    Endyear: { type: String },
    Groupname: { type: String },
    Branchname: { type: String },
    level: { type: String },
    class: { type: String },
    ImageHash: [{ type: String }],
    imageArray: [ { type: String } ],
    addsubjects: [{
        subjectname: { type: String },
        subjectmarks: { type: String }
    }]

})

module.exports = mongoose.model('certificate', userSchema, 'certificates')