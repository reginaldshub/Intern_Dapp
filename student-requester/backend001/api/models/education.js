const mongoose = require('mongoose')

const Schema = mongoose.Schema

const educationSchema = new Schema({
    category : {type:String},
    level : {type:String},    
})

module.exports = mongoose.model('education', educationSchema, 'education')