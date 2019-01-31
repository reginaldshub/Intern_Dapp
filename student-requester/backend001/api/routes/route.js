const express = require('express')
const fs = require('fs');
const solc = require('solc');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Register = require('../models/register.js')
const Profile = require('../models/profile.js')
const studentProfile = require('../models/studentProfile.js');
const Accounts = require('../models/account.js')
const grantedStudents = require('../models/grantedStudents.js');
const permission = require('../models/permission.js');
const SSLC = require('../models/sslc.js')
const Certificates = require('../models/certificates.js')
const HelloWorldABI = require("../../HelloWorldABI.json");
const perm_register_join = require('../models/permregJoin.js')
// const PUC = require('../models/puc.js')
// const DEGREE = require('../models/degree.js')

const Web3 = require('web3')
console.log('Reading Contract...');
const input = fs.readFileSync('api/routes/PermissionList.sol');

// console.log(input);
// console.log('Compiling Contract...');
// const output = solc.compile(input.toString(), 1);
// console.log(output);

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
                    name: user.name,
                    _id: user._id,
                    name: user.name,
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

// router.post('/reqcreate', (req, res) => {
//     let userData = req.body;
//     console.log(userData._id);
//     Profile.findOne({ userId: userData._id }, (error, user) => {
//         if (error) {
//             console.log(error)
//         } else if (user.account_address) {
//             console.log('you have an account');
//             console.log(user);
//         } else {
//             console.log('create');
//             if (!web3.isConnected()) {
//                 // res.json({
//                 //     message: "geth is not running please run the geth"
//                 // })
//                 console.log('not running');
//             } else {
//                 console.log('running');
//                 web3.personal.newAccount(userData.password, (err, result) => {
//                     if (err) {
//                         console.log('error');
//                     } else {
//                         user.account_address = result;
//                         user.network = "localhost";
//                         user.state = "saved";
//                         console.log(user.account_address)
//                         user.save((error, data) => {
//                             console.log('save');
//                             if (error) {
//                                 console.log(error);
//                             } else {
//                                 console.log(data);
//                             }
//                         })
//                     }
//                 })


//             }

//         }

//     })
//     // let account = new Accounts(userData)
//     // if (!web3.isConnected()) {
//     //     res.json({
//     //         message: "geth is not running please run the geth"
//     //     })
//     // } else {
//     //     web3.personal.newAccount(account.password, (err, result) => {
//     //         if (err) {
//     //             res.send(err);
//     //         } else {
//     //             account.network = 'local';
//     //             account.accountNumber = result;
//     //             account.save((err, user) => {
//     //                 if (err) {
//     //                     res.send("not saved")
//     //                 } else {
//     //                     res.json({
//     //                         message: "created successfully",
//     //                         result: result
//     //                     })
//     //                 }
//     //             })
//     //             //res.json({account:result});
//     //         }
//     //     })
//     // }
// })
//api to create local network account for requester

// api to create local network account
router.post('/reqcreate', verifyToken, (req, res) => {
    let userData = req.body;
    console.log(userData._id);
    console.log(req.body);
    Profile.findOne({ userId: userData._id }, (error, requester) => {
        if (error) {
            console.log(error)
        }
        // else if (requester.account_address) {
        //     console.log('you have an account');
        //     console.log(requester);
        // }
        else {
            console.log(requester);
            console.log('create');
            if (!web3.isConnected()) {
                // res.json({
                //     message: "geth is not running please run the geth"
                // })
                console.log('not running');
            } else {
                console.log('running');

                web3.personal.newAccount(userData.password, (err, result) => {
                    if (err) {
                        console.log('error');
                    } else {
                        // console.log(result);
                        requester.account_address = result;
                        requester.state = "saved";

                        try {
                            web3.personal.unlockAccount("0xaf01f28ecde578c0c0f2d3c303ac39e4a307d6c7", "Accion")
                        }
                        catch (e) {
                            console.log(e);
                            return;
                        }
                        web3.eth.sendTransaction({
                            from: "0xaf01f28ecde578c0c0f2d3c303ac39e4a307d6c7",
                            to: result,
                            value: web3.toWei("25", 'ether')
                        }, (error, res) => {
                            if (error) {
                                console.log(error)
                            } else {
                                console.log(res);
                            }
                        })

                        console.log(requester.account_address)
                        requester.save((error, data) => {
                            console.log('save');
                            if (error) {
                                console.log(error);
                            } else {
                                res.status(200).json("saved");
                            }
                        })
                    }

                })


            }

        }

    })

})

// api to create local network account
router.post('/create', verifyToken, (req, res) => {
    let userData = req.body;
    console.log(userData._id);
    studentProfile.findOne({ userId: userData._id }, (error, user) => {
        if (error) {
            console.log(error)
        }
        // else if (user.account_address) {
        //     console.log('you have an account');
        //     console.log(user);
        // }
        else {
            console.log('create');
            if (!web3.isConnected()) {
                // res.json({
                //     message: "geth is not running please run the geth"
                // })
                console.log('not running');
            } else {
                console.log('running');

                web3.personal.newAccount(userData.password, (err, result) => {
                    if (err) {
                        console.log('error');
                    } else {
                        // console.log(result);
                        user.account_address = result;
                        user.state = "saved";

                        try {
                            web3.personal.unlockAccount("0xaf01f28ecde578c0c0f2d3c303ac39e4a307d6c7", "Accion")
                        }
                        catch (e) {
                            console.log(e);
                            return;
                        }
                        web3.eth.sendTransaction({
                            from: "0xaf01f28ecde578c0c0f2d3c303ac39e4a307d6c7",
                            to: result,
                            value: web3.toWei("25", 'ether')
                        }, (error, res) => {
                            if (error) {
                                console.log(error)
                            } else {
                                console.log(res);
                            }
                        })

                        console.log(user.account_address)
                        user.save((error, data) => {
                            console.log('save');
                            if (error) {
                                console.log(error);
                            } else {
                                res.status(200).json("saved");
                            }
                        })
                    }

                })


            }

        }

    })
    // let account = new Accounts(userData)
    // if (!web3.isConnected()) {
    //     res.json({
    //         message: "geth is not running please run the geth"
    //     })
    // } else {
    //     web3.personal.newAccount(account.password, (err, result) => {
    //         if (err) {
    //             res.send(err);
    //         } else {
    //             account.network = 'local';
    //             account.accountNumber = result;
    //             account.save((err, user) => {
    //                 if (err) {
    //                     res.send("not saved")
    //                 } else {
    //                     res.json({
    //                         message: "created successfully",
    //                         result: result
    //                     })
    //                 }
    //             })
    //             //res.json({account:result});
    //         }
    //     })
    // }
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

router.post('/reqset', verifyToken, (req, res) => {
    let userData = req.body;
    console.log(userData)
    Profile.findOne({ email: userData.email }, (error, user) => {
        if (error) {
            console.log(error)
        } else if (user.account_address) {
            console.log('you have an account');
            console.log(user);
        } else {
            console.log('attaching');
            console.log(user);
            user.account_address = userData.accountNumber;
            user.network = userData.network;
            user.save((error, data) => {
                console.log('save');
                if (error) {
                    console.log(error);
                } else {
                    console.log(data);
                }
            })
        }
    })
})

router.post('/marks', (req, res) => {
    let userData = req.body;
    console.log(userData);
    let certificates = new Certificates(userData)
    console.log(certificates);
    certificates.save((err, user) => {
        if (err) {
            res.send("not saved")
        } else {
            res.status(200).json("added sucessfully");
        }
    })
})

router.post('/puc', (req, res) => {
    let userData = req.body;
    console.log(userData);
    let puc = new PUC(userData)
    console.log(puc);
    puc.save((err, user) => {
        if (err) {
            res.send("not saved")
        } else {
            console.log(user);

        }
    })
})

router.post('/degree', (req, res) => {
    let userData = req.body;
    console.log(userData);
    let degree = new DEGREE(userData)
    console.log(degree);
    degree.save((err, user) => {
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
    console.log("params post" + req.body.name + JSON.stringify(req.body.Id))
    console.log("req" + JSON.stringify(req.params.id))
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
// api to grant the permission

router.post('/grantT', (req, res) => {
    let requesterID = req.body.requesterID;
    let studentID = req.body.studentID;
    let status = req.body.Status;
    console.log(req.body);
    var myquery = { $and: [{ requesterID: requesterID }, { studentID: studentID }] };
    var newvalues = { $set: { Status: status } };
    Profile.findOne({ userId: requesterID }, (error, requester) => {
        if (error) {
            console.log(error)
        } else {
            console.log(requester);

            studentProfile.findOne({ userId: studentID }, (error, student) => {
                if (error) {
                    console.log(error)
                } else {
                    if (!web3.isConnected()) {
                        console.log("please run the node")
                    } else {
                        console.log('unlocking the geth account')
                        try {
                            web3.personal.unlockAccount(student.account_address, "Accion");
                        } catch (e) {
                            console.log(e);
                            return;
                        }
                        console.log(student.contract_address);
                        const tempContract = web3.eth.contract(HelloWorldABI);
                        var tempContractInstance = tempContract.at(student.contract_address);
                        tempContractInstance.grantPermission(requester.account_address, {
                            from: student.account_address,
                            gas: 4000000
                        }, function (error, transactionHash) {
                            if (!error) {
                                console.log(transactionHash); 
                                waitForReceipt(transactionHash);
                            } else {
                                console.log(error);
                            }
                        });

                        function waitForReceipt(hash) {
                            web3.eth.getTransactionReceipt(hash, function (err, receipt) {
                                if (err) {
                                    error(err);
                                }

                                if (receipt !== null) {
                                    // Transaction went through
                                    console.log(receipt);
                                    console.log(tempContractInstance.getPermissionStatus.call(requester.account_address, { from: student.account_address }).toString())
                                    permission.updateOne(myquery, newvalues, function (err, user) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            res.json({ res: user.nModified });
                                        }
                                    });
                                } else {
                                    // Try again in 1 second
                                    setTimeout(() => {
                                        waitForReceipt(hash);
                                    }, 1000);
                                }
                            });
                        }
                        
                    }
                }
            })
        }
    })
})

// api to deny the permission 

router.post('/denyT', (req, res) => {
    let requesterID = req.body.requesterID;
    let studentID = req.body.studentID;
    let status = req.body.Status;
    var myquery = { $and: [{ requesterID: requesterID }, { studentID: studentID }] };
    var newvalues = { $set: { Status: status } };
    Profile.findOne({ userId: requesterID }, (error, requester) => {
        if (error) {
            console.log(error)
        } else {
            console.log(requester.account_address);
            studentProfile.findOne({ userId: studentID }, (error, student) => {
                if (error) {
                    console.log(error)
                } else {
                    if (!web3.isConnected()) {
                        console.log("please run the node")
                    } else {
                        console.log('unlocking the geth account')
                        try {
                            web3.personal.unlockAccount(student.account_address, "Accion");
                        } catch (e) {
                            console.log(e);
                            return;
                        }
                        console.log(student.contract_address);
                        const tempContract = web3.eth.contract(HelloWorldABI);
                        var tempContractInstance = tempContract.at(student.contract_address);
                        tempContractInstance.denyPermission(requester.account_address, {
                            from: student.account_address,
                            gas: 4000000
                        }, function (error, transactionHash) {
                            if (!error) {
                                console.log(transactionHash);

                                waitForReceipt(transactionHash);
                            } else {
                                console.log(error);
                            }
                        });

                        function waitForReceipt(hash) {
                            web3.eth.getTransactionReceipt(hash, function (err, receipt) {
                                if (err) {
                                    error(err);
                                }

                                if (receipt !== null) {
                                    // Transaction went through
                                    console.log(receipt);
                                    console.log(tempContractInstance.getPermissionStatus.call(requester.account_address, { from: student.account_address }).toString())
                                    permission.updateOne(myquery, newvalues, function (err, user) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            res.json({ res: user.nModified });
                                        }
                                    });
                                } else {
                                    // Try again in 1 second
                                    setTimeout(() => {
                                        waitForReceipt(hash);
                                    }, 1000);
                                }
                            });
                        }
                    }
                }
            })
        }
    })

})





// Student Part

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
    // Profile.findOne({ name: searchData.studentName }, (error, profile_data) => {
    //     if (error) {
    //         console.log(error)
    //     }else if(profile_data.STATE == 'committed'){

    //     }else{

    //     }
    // })
    Register.findOne({ name: searchData.studentName }, (error, reg_user) => {
        if (error) {
            console.log(error)
        }
        else if (reg_user) {
            if (reg_user.Roles == "student") {
                permission.findOne({ studentID: reg_user._id, requesterID: searchData.id }, (error, User) => {
                    if (User) {
                        res.json({ status: User.Status, name: searchData.studentName, user: User })
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




router.post('/grantedlist', (req, res) => {
    var requesterID = { requesterID: req.body.requesterID };
    var studentID = { studentID: req.body.studentID };
    var status = { status: req.body.status };
    var query;
    if (requesterID.requesterID != undefined && studentID.studentID != undefined && status.status != undefined) {
        query = { $and: [requesterID, studentID, status] };
    } else {
        if (requesterID.requesterID != undefined) {
            if (status.status != null) {
                console.log("both requester and student");
                query = { $and: [requesterID, status] };
            } else {
                console.log('only requester');
                query = requesterID;
            }
        }
        if (studentID.studentID != undefined) {
            if (status.status != null) {
                console.log("both student and student");
                query = { $and: [studentID, status] };
            } else {
                console.log('only student');
                query = studentID;
            }
        }
        if (status.status != null) {
            console.log("only status");
            query = status;
        }
    }

    permission.find(query, async (error, user) => {
        // console.log(query);
        if (error) {
            console.log(error)
        } else {
            var name_array = [];
            for (var i = 0; i < user.length; i++) {
                Register.findOne({ _id: user[i].studentID }, (error, reg_user) => {
                    if (error) {
                        console.log(error)
                    } else {
                        name_array.push(reg_user.name);
                    }
                })
            }

            setTimeout(() => {
                // console.log(name_array)
                res.status(200).json({ students: user, name: name_array })
            }, 700)
        }
    })

    // if (requesterID != null) {
    // mongo db tried aggregation
    // const db = "mongodb://admin:admin123@ds247944.mlab.com:47944/student-requester"
    // mongoose.connect(db, { useNewUrlParser: true }, err => {
    //     if (err) {
    //         console.log("the error" + err)
    //     } else {
    //         permission.aggregate([
    //             {
    //                 $lookup:
    //                 {
    //                     from: 'Register',
    //                     localField: 'requesterID',
    //                     foreignField: '_id',
    //                     as: 'requesterName'
    //                 }
    //             }
    //         ]).then((res, err) => {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             else {
    //                 console.log(res)
    //                 res.status(200).json({ res: res })
    //             }
    //         });
    //     }

    // })
    // end of aggregation


    // }
    // if (studentID != null) {
    //     console.log(studentID);
    //     permission.find({ studentID: studentID }, (error, user) => {
    //         if (error) {
    //             console.log(error)
    //         } else {
    //             var name_array = [];
    //             for (var i = 0; i < user.length; i++) {
    //                 Register.findOne({ _id: user[i].requesterID }, (error, reg_user) => {
    //                     if (error) {
    //                         console.log(error)
    //                     } else {
    //                         name_array.push(reg_user.name);
    //                     }
    //                 })
    //             }

    //             setTimeout(() => {
    //                 // console.log(name_array)
    //                 res.status(200).json({ students: user, name: name_array })
    //             }, 2000)
    //         }
    //     })
    // }
    // if (status != null) {
    //     permission.find({ Status: status }, async (error, user) => {
    //         if (error) {
    //             console.log(error)
    //         } else {
    //             res.status(200).json({ students: user })
    //         }
    //     })
    // }
})

router.post('/requestT', verifyToken, (req, res) => {
    // console.log(JSON.stringify(res.body))
    let permissionData = req.body;
    console.log(permissionData)
    let permissionObject = new permission(permissionData)
    Profile.findOne({ userId: permissionData.requesterID }, (error, requester) => {
        if (error) {
            console.log(error)
        } else {
            if (!web3.isConnected()) {
                console.log("please run the node")
            } else {
                console.log(requester.account_address);
                console.log('unlocking the get account')
                try {
                    web3.personal.unlockAccount(requester.account_address, "Accion");
                } catch (e) {
                    console.log(e);
                    return;
                }
                studentProfile.findOne({ userId: permissionData.studentID }, (error, student) => {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log(student.contract_address);

                        const tempContract = web3.eth.contract(HelloWorldABI);
                        var tempContractInstance = tempContract.at(student.contract_address);
                        tempContractInstance.requestPermission(requester.name, 100, {
                            from: requester.account_address,
                            gas: 4000000
                        }, function (error, result) {
                            if (!error) {
                                console.log(result);
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

                            } else {
                                console.log(error);
                            }
                        });
                    }
                })
            }
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
                        Certificates.find({ studentid: User.studentID }, (error, sslc) => {
                            if (sslc) {
                                res.json({ certificate: sslc })
                            } else {
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
//deploying the smart contract
router.post('/commit', (req, response) => {
    userData = req.body;
    console.log(userData);
    studentProfile.findOne({ userId: userData._id }, (error, user) => {
        if (error) {
            console.log(error)

        } else if (user.contract_address) {
            response.json({ message: 'you already deployed the contract' });
        }
        else {
            console.log(user.name);
            console.log('Compiling Contract...');
            const output = solc.compile(input.toString(), 1);
            for (var contractName in output.contracts) {
                const bytecode = output.contracts[contractName].bytecode;
                console.log(bytecode);
                const abi = output.contracts[contractName].interface;
                fs.writeFile("./HelloWorldABI.JSON", abi, function (err) {

                    if (err) {
                        return console.log(err);
                    }
                    console.log("ABI Saved");
                });
                const helloWorldContract = web3.eth.contract(JSON.parse(abi));
                console.log('unlocking local geth account');
                const password = "30";
                try {
                    web3.personal.unlockAccount(user.account_address, userData.password);
                } catch (e) {
                    console.log(e);
                    return;
                }
                console.log("Deploying the contract");
                const helloWorldContractInstance = helloWorldContract.new(user.name, {
                    data: '0x' + bytecode,
                    from: user.account_address,
                    gas: 2000000
                }, (err, res) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    // If we have an address property, the contract was deployed
                    if (res.address) {
                        console.log("contract addres");
                        console.log('Contract address: ' + res.address);
                        user.contract_address = res.address;
                        user.save((error, data) => {
                            if (error) {
                                console.log(error);
                                response.json({ message: "deployed and but contract_address is not saved" })
                            } else {
                                console.log(data)

                                response.json({ message: "deployed contract" });
                            }
                        })
                    }

                });
                // console.log(helloWorldContractInstance);
            }
        }
    })
})


// function waitForReceipt(hash) {
//     web3.eth.getTransactionReceipt(hash, function (err, receipt) {
//         if (err) {
//             error(err);
//         }

//         if (receipt !== null) {
//             // Transaction went through
//             console.log(receipt);
//         } else {
//             // Try again in 1 second
//             setTimeout(() => {
//                 waitForReceipt(hash);
//             }, 1000);
//         }
//     });
// }
// waitForReceipt("0xee6e940491895b5f5adf4feb34b0ea98eac0c230a5b216a3b64ada65d0821c03")

router.post('/checkstatus',(req,res)=>{
    let requesterID = req.body.requesterID;
    let studentID = req.body.studentID;
    console.log(req.body);
    var myquery = { $and: [{ requesterID: requesterID }, { studentID: studentID }] };
    Profile.findOne({ userId: requesterID }, (error, requester) => {
        if (error) {
            console.log(error)
        } else {
            console.log(requester);
            studentProfile.findOne({ userId: studentID }, (error, student) => {
                if (error) {
                    console.log(error)
                } else {
                    if (!web3.isConnected()) {
                        console.log("please run the node")
                    } else {
                        console.log('unlocking the geth account')
                        try {
                            web3.personal.unlockAccount(student.account_address, "Accion");
                        } catch (e) {
                            console.log(e);
                            return;
                        }
                        console.log(student.contract_address);
                        const tempContract = web3.eth.contract(HelloWorldABI);
                        var tempContractInstance = tempContract.at(student.contract_address);
                        tempContractInstance.getPermissionStatus(requester.account_address, {
                            from: student.account_address
                        }, function (error, status) {
                            if (!error) {
                                console.log( status.toString()); 
                            } else {
                                console.log(error);
                            }
                        });
                        
                    }
                }
            })
        }
    })
})


router.post('/grant', (req, res) => {
    let requesterID = req.body.requesterID;
    let studentID = req.body.studentID;
    let status = req.body.Status;
    console.log(req.body);
    var myquery = { $and: [{ requesterID: requesterID }, { studentID: studentID }] };
    // var newvalues = { $set: { Status: status } };
    Profile.findOne({ userId: requesterID }, (error, requester) => {
        if (error) {
            console.log(error)
        } else {
            console.log(requester);

            studentProfile.findOne({ userId: studentID }, (error, student) => {
                if (error) {
                    console.log(error)
                } else {
                    if (!web3.isConnected()) {
                        console.log("please run the node")
                    } else {
                        console.log('unlocking the geth account')
                        try {
                            web3.personal.unlockAccount(student.account_address, "Accion");
                        } catch (e) {
                            console.log(e);
                            return;
                        }
                        console.log(student.contract_address);
                        const tempContract = web3.eth.contract(HelloWorldABI);
                        var tempContractInstance = tempContract.at(student.contract_address);
                        tempContractInstance.grantPermission(requester.account_address, {
                            from: student.account_address,
                            gas: 4000000
                        }, function (error, transactionHash) {
                            if (!error) {
                                transaction.findOne(myquery, function (err, contract) {
                                    contract.grantTransactionHash=transactionHash
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log(contract);
                                    }
                                });
                            } else {
                                console.log(error);   
                            }
                        });                        
                    }
                }
            })
        }
    })
})

router.post('/request', verifyToken, (req, res) => {
    // console.log(JSON.stringify(res.body))
    let permissionData = req.body;
    console.log(permissionData)
    let transactionobject = new transaction(permissionData);
    let permissionObject = new permission(permissionData)
    Profile.findOne({ userId: permissionData.requesterID }, (error, requester) => {
        if (error) {
            console.log(error)
        } else {
            if (!web3.isConnected()) {
                console.log("please run the node")
            } else {
                console.log(requester.account_address);
                console.log('unlocking the get account')
                try {
                    web3.personal.unlockAccount(requester.account_address, "Accion");
                } catch (e) {
                    console.log(e);
                    return;
                }
                studentProfile.findOne({ userId: permissionData.studentID }, (error, student) => {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log(student.contract_address);
                        const tempContract = web3.eth.contract(HelloWorldABI);
                        var tempContractInstance = tempContract.at(student.contract_address);
                        tempContractInstance.requestPermission(requester.name, 100, {
                            from: requester.account_address,
                            gas: 4000000
                        }, function (error, result) {
                            if (!error) {
                                console.log(result);
                                transactionobject.save((err,contract)=>{
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log(contract);
                                    }
                                })
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

                            } else {
                                console.log(error);
                            }
                        });
                    }
                })
            }
        }
    })
})

module.exports = router;
