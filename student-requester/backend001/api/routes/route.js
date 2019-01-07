const express = require('express')

const router = express.Router();

const  Register = require('../models/register.js')

const mongoose = require('mongoose')
const db = "mongodb://santhosh123:santhosh123@ds133533.mlab.com:33533/eventsdb"
mongoose.connect(db, { useNewUrlParser: true }, err => {
    if (err) {
        console.log("the error" + err)
    } else {
        console.log("connected to mongodb")
    }

})

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    if (id) {
        res.status(200).json({
            message: id
        })
    }
})
router.post('/login', (req, res) => {
    let userData = req.body;
    Register.findOne({ email: userData.email }, (error, user) => {
        if (error) {
            console.log(error)
        } else {
            if (!user) {
                res.status(401).send({ message: "invalid email" })
            } else if (user.password !== userData.password) {
                res.status(401).send({ message: "invalid password" })
            } else {
                console.log(user.Roles);
                res.json({message:"logged in sucessfully",
                          role:user.Roles })
            }
        }
    })
})


router.post('/register', (req, res) => {
    let userData = req.body;
    let register = new Register(userData)
    Register.findOne({ email: userData.email }, (error, user) => {
        if (error) {
            console.log(error)
        }
        else if (user) {
            res.status(200).send({ message: 'you have been already registered' });
        }
        else {
            register.save((err, user) => {
                if (err) {
                    res.send("not saved")
                } else {
                    res.json({
                        message: "registered successfully"
                    })
                }
            })
        }
    })
})

module.exports = router;