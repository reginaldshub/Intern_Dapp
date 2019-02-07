const mongoose = require('mongoose')

const Schema = mongoose.Schema

const educationStreamsSchema = new Schema({
    name : {type:String},
    level : {type:String},    
})

module.exports = mongoose.model('educationStreams', educationStreamsSchema, 'educationStreams')