const express = require('express')

const router = express.Router();

const jwt = require('jsonwebtoken');
const Register = require('../models/register.js')
const Profile = require('../models/profile.js')
const studentProfile = require('../models/studentProfile.js');
const Accounts = require('../models/account.js')
const grantedStudents = require('../models/grantedStudents.js');
const permission = require('../models/permission.js');
const SSLC = require('../models/sslc.js')

const Web3 = require('web3')

const mongoose = require('mongoose')
// const db = "mongodb://santhosh123:santhosh123@ds133533.mlab.com:33533/eventsdb"
const db = "mongodb://admin:admin123@ds247944.mlab.com:47944/student-requester"
mongoose.connect(db, { useNewUrlParser: true }, err => {
    if (err) {
        console.log("the error" + err)
    } else {
        console.log("connected to mongodb")
    }

})

// function verifyToken(req, res, next) {
//     if (!req.headers.authorization) {
//         return res.status(401).send('Unauthorized request')
//     }
//     let token = req.headers.authorization.slice(7);
//     if (token === 'null') {
//         return res.status(401).send('Unauthorized request')
//     }
//     let payload = jwt.verify(token, 'secretKey');
//     console.log(payload);
//     if (!payload) {
//         console.log("executed");
//         return res.status(401).send('Unauthorized request')
//     }
//     req.userId = playload.subject;
//     next()
// }

function verifyToken(req, res, next) {
    // check header or url parameters or post parameters for token 

    var token = req.headers.authorization.slice(7);
    // decode token 
    if (token) {
        // verifies secret and checks exp 
        jwt.verify(token, 'secretKey', function (err, decoded) {
            if (err) {
                return res.status(401).send('Unauthorized request')
            }
            else {

                req.decoded = decoded;
                next();
                // if everything is good, save to request for use in other routes 
            }
        });
    } else {
        // if there is no token 
        // return an error 
        console.log("exec");
        return res.status(403).send({ success: false, message: 'No token provided.' });
    }
};

//connection to the localnetwork
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))
//checking for the connection


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
                // console.log(user.Roles);
                // res.json({
                //     message: "logged in sucessfully",
                //     role: user.Roles
                // })
                let payload = { subject: user._id }
                let token = jwt.sign(payload, 'secretKey')
                res.status(200).json({
                    token: token,
                    role: user.Roles,
                    _id: user._id,
                    message: 'logged in sucessfully'
                })
            }
        }
    })
})



router.post('/register', (req, res) => {

    let userData = req.body;
    console.log('backend');
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
                    // res.json({
                    //     message: "registered successfully"
                    // })
                    let payload = { subject: user._id }
                    let token = jwt.sign(payload, 'secretKey')
                    res.status(200).json({
                        token: token,
                        message: "registered sucessfully"
                    })
                }
            })
        }
    })
})

// web3.eth.getMining((error, result) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(result);
//     }
// })

// web3.eth.getBalance("0x4af692cf7948c78bc7e94561b84b6e0f3d3552e6",(error,result)=>{
// console.log(result.toString());
// })

// api to create local network account
router.post('/create', verifyToken, (req, res) => {
    let userData = req.body;
    let account = new Accounts(userData)
    if (!web3.isConnected()) {
        res.json({
            message: "geth is not running please run the geth"
        })
    } else {
        web3.personal.newAccount(account.password, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                account.network = 'local';
                account.accountNumber = result;
                account.save((err, user) => {
                    if (err) {
                        res.send("not saved")
                    } else {
                        res.json({
                            message: "created successfully",
                            result: result
                        })
                    }
                })
                //res.json({account:result});
            }
        })
    }
})
//set the account address
router.post('/set', verifyToken, (req, res) => {
    let userData = req.body;
    let account = new Accounts(userData)
    account.save((err, user) => {
        if (err) {
            res.send("not saved")
        } else {
            res.json({
                message: "added successfully"
            })
        }
    })
})

router.post('/sslc', (req, res) => {
    let userData = req.body;
    console.log(userData);
    let sslc = new SSLC(userData)
    console.log(sslc);
    sslc.save((err, user) => {
        if (err) {
            res.send("not saved")
        } else {
            console.log(user);

        }
    })
})

router.post('/getprofile', verifyToken, (req, res) => {
    let userData = req.body;
    let profile = new Profile(userData)

    Profile.findOne({ userId: profile.userId }, (error, user) => {
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


router.post('/setprofile', verifyToken, (req, res) => {
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

router.put('/requester/:id', verifyToken, (req, res) => {
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


router.post('/getstudentprofile', verifyToken, (req, res) => {
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

router.post('/setstudentprofile', verifyToken, (req, res) => {
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

router.put('/student/:id', verifyToken, (req, res) => {
    console.log("params post" + req.body.name + req.body.Id)
    console.log("req" + req.params.id)
    console.log("body" + JSON.stringify(req.body))
    var profile = {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        gender: req.body.gender,
        dob: req.body.dob,
        country: req.body.country,
        phone: req.body.phone
    };

    studentProfile.findOneAndUpdate(req.body.Id, { $set: profile }, { new: true },
        (err, doc) => {
            if (!err) { res.send({ message: "updated success", doc: doc }) }
            else { console.log('error' + JSON.stringify(err, undefined, 2)); }
        });
});

router.post('/checkaccess', verifyToken, (req, res) => {
    let searchData = req.body;

    Register.findOne({ name: searchData.name }, (error, reg_user) => {
        if (error) {
            console.log(error)
        }
        else if (reg_user) {
            if (reg_user.Roles == "student") {
                permission.findOne({ studentID: reg_user._id }, (error, User) => {
                    if (User) {
                        res.json({ status: User.Status, name: searchData.name, user: User })
                    } else {
                        res.json({ status: "request", user: reg_user })
                    }
                })
            } else {
                res.json({ status: "not student" })
            }
        }
        else {
            res.json({ status: "student not registered" })
        }
    })
})

router.get('/grantedlist', (req, res) => {
    permission.find({}, (error, user) => {
        if (error) {
            console.log(error)
        } else {
            console.log(user);
            res.status(200).json({ students: user })
        }
    })
})

router.post('/request', verifyToken, (req, res) => {
    let permissionData = req.body;
    let permissionObject = new permission(permissionData)
    // console.log(profile);
    permissionObject.save((err, user) => {
        if (err) {
            res.send("not saved")
        } else {
            res.json({
                message: "added successfully",
                user: user
            })
        }
    })
})

router.post('/certificate', verifyToken, (req, res) => {
    let searchData = req.body;

    Register.findOne({ name: searchData.name }, (error, reg_user) => {
        if (error) {
            console.log(error)
        }
        else if (reg_user) {
            if (reg_user.Roles == "student") {
                permission.findOne({ studentID: reg_user._id }, (error, User) => {
                    if (User) {
                        SSLC.findOne({ studentid: User.studentID }, (error, sslc) => {
                            if (sslc) {
                                console.log(sslc);
                                res.json({ certificate: sslc })
                            }else{
                                res.json({ status: "noEntry Found" })
                            }
                            
                        })
                    } else {
                        res.json({ status: "request", user: reg_user })
                    }
                })
            } else {
                res.json({ status: "not student" })
            }
        }
        else {
            res.json({ status: "student not registered" })
        }
    })
})



module.exports = router;
