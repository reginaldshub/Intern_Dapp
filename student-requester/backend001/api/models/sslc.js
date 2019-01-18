const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    studentid : {type:String},
    ecategory : {type:String},
    Startyear : {type:String},
    Endyear   : {type:String},
    Groupname : {type:String},
    addsubjects:[{
        subjectname:{type:String},
        subjectmarks:{type:String}
    }]
    
})

module.exports = mongoose.model('sslc', userSchema, 'sslcs')