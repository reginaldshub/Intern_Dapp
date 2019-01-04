const mongoose = require('mongoose')

const Schema = mongoose.Schema

const registerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type:String,
        required: true
    },
    phone: {
        type: Number
    },
    password: {
        type: String,
        require: true
    }

    }
);


module.exports=mongoose.model('register',registerSchema);
