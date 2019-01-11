const express = require('express')
// var cookieParser = require('cookie-parser')
const router = express.Router();

const Register = require('../models/register.js')
const Profile = require('../models/profile.js')
const studentProfile = require('../models/studentProfile.js')

const mongoose = require('mongoose')
const db = "mongodb://admin:admin123@ds247944.mlab.com:47944/student-requester"
mongoose.connect(db, { useNewUrlParser: true }, err => {
    if (err) {
        console.log("the error" + err)
    } else {
        console.log("connected to mongodb")
    }

})

// router.get('/123', (req, res, next) => {
//     const id = req.params.id;
//     if (id) {
//         res.status(200).json({
//             message: id
//         })
//     }
// })
router.post('/login', (req, res) => {
    let userData = req.body;
    Register.findOne({ email: userData.email }, (error, user) => {
        if (error) {
            console.log(error)
        } else {
            if (!user) {
                res.send({ message: "invalid email" })
            } else if (user.password !== userData.password) {
                res.send({ message: "invalid password" })
            } else {
                // console.log(user);
                res.json({
                    message: "logged in sucessfully",
                    role: user.Roles, _id: user._id
                })
            }
        }
    })
})


router.post('/register', (req, res) => {
    let userData = req.body;
    let register = new Register(userData)
    console.log("Register" + register);
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

// router.get('/tom', (req, res) => {
//     res.json({message:"tony"})
//     res.send("tony");
// res.cookie('tony,s Cookies', 'First Cookie');
// console.logsz("tony");
// })

router.post('/getprofile', (req, res) => {
    let userData = req.body;
    let profile = new Profile(userData)
    // console.log("profile"+profile.userId);
    Profile.findOne({ userId: profile.userId }, (error, user) => {
        if (error) {
            console.log(error)
        }
        // else {
        //     if (!user) {
        //         res.status(401).send({ message: "invalid email" })
        //     } 
        // else if (user.password !== userData.password) {
        //     res.status(401).send({ message: "invalid password" })
        // }
        else {
            // console.log(user);
            if (user != null) {
                res.json({
                    message: "searched in profile sucessfully",
                    user: user, hide: false
                })
            } else {
                res.json({
                    message: "not registered",
                    user: user, hide: true
                })
            }
        }
    })
})
// })

router.post('/setprofile', (req, res) => {
    let profileData = req.body;

    console.log(profileData);
    let profile = new Profile(profileData)
    console.log(profile);
    profile.save((err, user) => {
        if (err) {
            res.send("not saved")
        } else {
            res.json({
                message: "added successfully"
            })
        }
    })

})

router.put('/requester/:id', (req, res) => {
    console.log("params post" + req.body.name + req.body.Id)
    console.log("req" + req.params.id)
    console.log("body" + JSON.stringify(req.body))
    var profile = {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        url: req.body.url,
        email: req.body.email,
        country: req.body.country,
        phone: req.body.phone
    };

    Profile.findOneAndUpdate(req.body.Id, { $set: profile }, { new: true },
        (err, doc) => {
            if (!err) { res.send({ message: "updated success", doc: doc }) }
            else { console.log('error' + JSON.stringify(err, undefined, 2)); }
        });
});


// Student Part


router.post('/getstudentprofile', (req, res) => {
    let userData = req.body;
    let profile = new studentProfile(userData)
    studentProfile.findOne({ userId: profile.userId }, (error, user) => {
        if (error) {
            console.log(error)
        }
        else {
            if (user != null) {
                res.json({
                    message: "searched in profile sucessfully",
                    user: user, hide: false
                })
            } else {
                res.json({
                    message: "not registered",
                    user: user, hide: true
                })
            }
        }
    })
})

router.post('/setstudentprofile', (req, res) => {
    let profileData = req.body;

    console.log(profileData);
    let profile = new studentProfile(profileData)
    console.log(profile);
    profile.save((err, user) => {
        if (err) {
            res.send("not saved")
        } else {
            res.json({
                message: "added successfully"
            })
        }
    })
})

router.put('/student/:id',(req,res)=>{
    console.log("params post"+req.body.name+req.body.Id)
    console.log("req"+req.params.id)
    console.log("body"+JSON.stringify(req.body))
    var profile = {   
    name: req.body.name,
    address: req.body.address,
    city : req.body.city,
    state : req.body.state,
    pincode: req.body.pincode,
    gender: req.body.gender,
    dob: req.body.dob,
    country: req.body.country,
    phone: req.body.phone
       };

    studentProfile.findOneAndUpdate(req.body.Id,{ $set:profile},{ new:true },
        (err,doc)=>{
            if(!err){res.send({message:"updated success", doc:doc})}
            else {console.log('error' + JSON.stringify(err,undefined,2));}
        }); 
});
module.exports = router;