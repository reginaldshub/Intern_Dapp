const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    requesterID:{
        type: String,
        required: true
    },
    studentID:{
        type: String,
        required: true
    },
    requestTransactionHash:{
        type:String
    },
    grantTransactionHash:{
        type:String
    },
    denyTransactionHash:{
        type:String
    }
})

module.exports = mongoose.model('transaction', userSchema, 'transactions')