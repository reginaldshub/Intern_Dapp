const mongoose = require('mongoose')

const Schema = mongoose.Schema

const registerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    Roles: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    password: {
        type: String,
        require: true
    },
    account_address:{
        type:String
    },
    contract_address:{
        type:String
    }

}
);


module.exports = mongoose.model('register', registerSchema, 'registers');
