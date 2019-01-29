const mongoose = require('mongoose')

const Schema = mongoose.Schema

const studentProfileSchema = new Schema({
    userId: {
        type: String
    },
    name: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    pincode: {
        type: Number
    },
    gender: {
        type: String
    },
    dob: {
        type: Date
    },
    country: {
        type: String
    },
    phone: {
        type: Number
    },
    account_address:{
        type:String
    },
    contract_address:{
        type:String
    },
    State:{
    type:String
    }
});


module.exports = mongoose.model('studentProfile', studentProfileSchema, 'studentProfile');
