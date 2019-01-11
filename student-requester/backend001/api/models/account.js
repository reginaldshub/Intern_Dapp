const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: String,
    network: String,
    accountNumber: String,
    password: String
})

module.exports = mongoose.model('account', userSchema, 'saccounts')