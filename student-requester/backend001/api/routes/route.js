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
const transaction = require('../models/transactionHash.js')
const permission_status = require('../models/Permission_status');
const Education = require('../models/education');
const EducationStreams = require('../models/educationStreams');

// const PUC = require('../models/puc.js')
// const DEGREE = require('../models/degree.js')

const Web3 = require('web3')
console.log('Reading Contract...');
const input = fs.readFileSync('api/routes/PermissionList.sol');

// console.log(input);
// console.log('Compiling Contract...');
// const output = solc.compile(input.toString(), 1);
// console.log(output);

//mongo connection using mongoose (mlab)
const mongoose = require('mongoose')
// const db = "mongodb://santhosh123:santhosh123@ds133533.mlab.com:33533/eventsdb" //santhosh's mlab
const db = "mongodb://admin:admin123@ds247944.mlab.com:47944/student-requester" //regi's mlab
mongoose.connect(db, { useNewUrlParser: true }, err => {
    if (err) {
        console.log("the error" + err)
    } else {
        console.log("connected to mongodb")
    }

})

//token verification
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


//Registration
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


// api to create local network account (requester)
router.post('/reqcreate', verifyToken, (req, res) => {
    let userData = req.body;
    console.log(userData._id);
    console.log(req.body);
    Profile.findOne({ userId: userData._id }, (error, requester) => {
        if (error) {
            console.log(error)
        }
        else if (requester.account_address) {
            console.log('you have an account');
            res.status(200).json({ accountNo: requester.account_address });
        }
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
                        requester.State = "saved";

                        try {
                            web3.personal.unlockAccount("0x80f38b4db9e910bb1dd3019ab44aa947180ccb3d", "password")
                        }
                        catch (e) {
                            console.log(e);
                            return;
                        }
                        web3.eth.sendTransaction({
                            from: "0x80f38b4db9e910bb1dd3019ab44aa947180ccb3d",
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
                                res.status(200).json({ accountNo: result });
                            }
                        })
                    }
                })
            }
        }
    })

})

// api to create local network account (student)
router.post('/create', verifyToken, (req, res) => {
    let userData = req.body;
    console.log(userData._id);
    studentProfile.findOne({ userId: userData._id }, (error, user) => {
        if (error) {
            console.log(error)
        }
        else if (user.account_address) {
            console.log('you have an account');
            res.status(200).json({ accountNo: user.account_address });
        }
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
                        user.State = "saved";

                        try {
                            web3.personal.unlockAccount("0x80f38b4db9e910bb1dd3019ab44aa947180ccb3d", "password")
                        }
                        catch (e) {
                            console.log(e);
                            return;
                        }
                        web3.eth.sendTransaction({
                            from: "0x80f38b4db9e910bb1dd3019ab44aa947180ccb3d",
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
                                res.status(200).json({ accountNo: result });
                            }
                        })
                    }
                })
            }
        }
    })
})

//set the account address (student)
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


//set the account address (requester)
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

// adding marks details(Certificates) of student to Certificates collection
router.post('/marks', (req, res) => {
    let userData = req.body;
    console.log(userData);
    // query = { $and: [studentEmail, studentName] };
    let certificates = new Certificates(userData);

    Certificates.findOne({ $and: [{ studentid: userData.studentid }, { level: userData.level }] }, (error, certres) => {
        if (error) {
            console.log(error)
        }
        else if (certres) {
            res.status(200).json("Duplicate Found");
        }
        else {
            console.log("Else")
            certificates.save((err, user) => {
                if (err) {
                    console.log("not saved")
                } else {
                    console.log("added sucessfully")
                    res.status(200).json("added sucessfully");
                }
            })
        }
    })

    // Certificates.findOne({ $and: [{studentid: userData.studentid},{level: userData.level}] }, (error, certres) => {
    //     if (error) {
    //         console.log(error)
    //     } else if (certres) {
    //         console.log(certres)
    //         // res.status(400).json({ status: "Duplicate Exists" });
    //     } 
    //     else {
    //         // certificates.save((err, user) => {
    //         //     if (err) {
    //         //         res.send("not saved")
    //         //     } else {
    //         //         res.status(200).json("added sucessfully");
    //         //     }
    //         // })
    //     }
    // })
})

//returns Requester profile details
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

//setting profile details for the first time(requester)
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

//updating requester profile details
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

    Profile.updateOne({ userId: req.body.userId }, { $set: profile }, { new: true },
        (err, doc) => {
            if (!err) { res.send({ message: "updated success", doc: doc }) }
            else { console.log('error' + JSON.stringify(err, undefined, 2)); }
        });
});

// Student Part Follows

//returns Student profile details
router.post('/getstudentprofile', verifyToken, (req, res) => {
    let userData = req.body;
    console.log(userData)
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

//setting profile details for the first time(student)
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

//updating student profile details
router.put('/student/:id', verifyToken, (req, res) => {
    console.log("params post" + req.body.name + JSON.stringify(req.body.userId))
    console.log("req" + req.params.id)
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

    studentProfile.updateOne({ userId: req.body.userId }, { $set: profile }, { new: true },
        (err, doc) => {
            console.log(doc);
            if (!err) { res.send({ message: "updated success", doc: doc }) }
            else { console.log('error' + JSON.stringify(err, undefined, 2)); }
        });
});

//returns with status (api for search results)
router.post('/checkaccess', verifyToken, (req, res) => {
    var studentEmail = { email: req.body.email };
    var studentName = { name: req.body.studentName };
    var id = req.body.id;
    var query;
    if (studentEmail.email != '' && studentName.name != '') {
        query = { $and: [studentEmail, studentName] };
    } else if (studentEmail.email != '') {
        console.log('only studentEmail');
        query = studentEmail;
    } else if (studentName.name != '') {
        console.log('only studentName');
        query = studentName;
    } else {
        console.log("either of them");
        query = null;
    }

    Register.findOne(query, (error, reg_user) => {
        if (error) {
            console.log("error");
        } else if (reg_user) {
            studentProfile.findOne({ userId: reg_user._id }, (error, studentProfileData) => {
                console.log(studentProfileData);
                if (error) {
                    console.log(error)
                }
                else if (studentProfileData.State == 'committed') {
                    if (reg_user.Roles == "student") {
                        permission.findOne({ studentID: reg_user._id, requesterID: id }, (error, User) => {
                            if (User) {
                                res.json({ status: User.Status, name: studentName.name, user: User })
                            } else {
                                res.json({ status: "request", user: reg_user })
                            }
                        })
                    } else {
                        res.json({ status: "Not Found" })
                    }
                } else {
                    res.json({ status: "Not Found" })
                }
            })
        } else {
            console.log("error");
            res.json({ status: "Not Found" })
        }
    })
})

//list of all requests and status
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


})

//student self certificate details
router.post('/studentSelfCertificate',  (req, res) => {
    let searchData = req.body;
    // console.log(searchData)
    if ((searchData.level != "" && searchData.level != null && searchData.level != undefined) &&
        (searchData.id != "" && searchData.id != null && searchData.id != undefined)) {
        Certificates.find({ $and: [{ studentid: searchData.id}, {level: searchData.level}] }, (error, certi) => {
            if (certi) {
                // console.log(certi)
                res.json({ certificate: certi })
            } else {
                res.json({ status: "noEntry Found" })
            }

        })
    }
    if((searchData.studentId != "" && searchData.studentId != null && searchData.studentId != undefined) &&
    (searchData.name != "" && searchData.name != null && searchData.name != undefined)){
    Certificates.find({ studentid: searchData.studentId }, (error, sslc) => {
        if (sslc) {
            console.log(sslc)
            res.json({ certificate: sslc })
        } else {
            res.json({ status: "noEntry Found" })
        }

    })
}
})

//api to post certificates of requested students
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
    studentProfile.findOne({ userId: userData._id }, (error, student) => {
        if (error) {
            console.log(error);
        }
        else if (student.contract_address) {
            response.status(200).json({ message: student.contract_address });
        }
        else {
            console.log(student.name);
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
                try {
                    web3.personal.unlockAccount(student.account_address, userData.password);
                } catch (e) {
                    console.log(e);
                    return;
                }
                console.log("Deploying the contract");
                const helloWorldContractInstance = helloWorldContract.new(student.name, {
                    data: '0x' + bytecode,
                    from: student.account_address,
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
                        student.contract_address = res.address;
                        student.State = "committed";
                        console.log(student.State)
                        student.save((error, data) => {
                            if (error) {
                                console.log(error);
                                response.json({ message: "deployed and but contract_address is not saved" })
                            } else {
                                console.log(data)

                                response.status(200).json({ message: "deployed contract" });
                            }
                        })
                    }

                });
            }
        }
    })
})

//to check status from geth and store to mongo and update
router.post('/checkstatus', (req, res) => {
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
                        console.log(student.contract_address);
                        const tempContract = web3.eth.contract(HelloWorldABI);
                        var tempContractInstance = tempContract.at(student.contract_address);
                        tempContractInstance.getPermissionStatus(requester.account_address, {
                            from: student.account_address
                        }, function (error, status) {
                            if (!error) {
                                let status1;
                                let statusName;
                                status1 = status.toString()
                                console.log(status1);
                                permission_status.find({ ID: status1 }, (err, result1) => {
                                    console.log(statusName = result1['0'].Name);
                                    var newvalues = { $set: { Status: statusName } };
                                    console.log(newvalues);
                                    permission.updateOne(myquery, newvalues, function (err, user) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            res.status(200).json({ res: statusName });
                                        }
                                    });
                                })
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

//to grant access(smart contract)
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
                            web3.personal.unlockAccount(student.account_address, "password");
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
                            // let studentaccount=student.account_address;
                            // let requestaccount=requester.account_address;
                            // let contractaddress=student.contract_address;
                            //   getandUpdateStatus(transactionHash,myquery,requester.account_address,student.contract_address,student.account_address)
                            if (!error) {
                                transaction.findOne(myquery, function (err, contract) {
                                    contract.grantTransactionHash = transactionHash
                                    console.log(contract.grantTransactionHash);
                                    if (err) {
                                        throw err;
                                    } else {
                                        contract.save((err, transactiondata) => {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log(transactiondata);
                                                res.status(200).send("sucess");
                                            }
                                        })
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

//to request access(smart contract)
router.post('/request', verifyToken, (req, res) => {
    // console.log(JSON.stringify(res.body))
    let permissionData = req.body;
    console.log(permissionData)
    let transactionobject = new transaction(permissionData)
    console.log(transactionobject);
    let permissionObject = new permission(permissionData)
    console.log(permissionObject)
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
                    web3.personal.unlockAccount(requester.account_address, "password");
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
                                transactionobject.requestTransactionHash = result;
                                console.log(transactionobject.requestTransactionHash)
                                transactionobject.save((err, contract) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //    res.status(200).send("sucess");
                                        console.log(contract);
                                        permissionObject.save((err, user) => {
                                            if (err) {
                                                res.status(400).send("not saved")
                                            } else {
                                                res.status(200).json({
                                                    message: "added successfully",
                                                    user: user
                                                })
                                            }
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

//to deny access(smart contract)
router.post('/deny', (req, res) => {
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
                            web3.personal.unlockAccount(student.account_address, "password");
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
                                transaction.findOne(myquery, function (err, contract) {
                                    contract.denyTransactionHash = transactionHash
                                    console.log(contract.grantTransactionHash);
                                    if (err) {
                                        throw err;
                                    } else {
                                        contract.save((err, transactiondata) => {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log(transactiondata);
                                                res.status(200).send("sucess");
                                            }
                                        })
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



//api to post education categories of requested level
router.post('/educationCategory', verifyToken, (req, res) => {

    console.log(req.body.level);
    let level = { level: req.body.level };
    EducationStreams.find(level, (error, streams) => {
        if (error) {
            console.log(error)
        }
        else {
            // console.log(streams);
            res.json({ streams: streams });
        }
    })
    // Education.find({}).populate('EducationStreams').exec(function(err, documents){
    //     console.log(documents);
    // })

})

function getandUpdateStatus(transactionHash, myquery, requesteraccount, contractaddress, studentaccount) {
    const tempContract = web3.eth.contract(HelloWorldABI);
    var tempContractInstance = tempContract.at(contractaddress);
    function Receipt(transactionHash) {
        web3.eth.getTransactionReceipt(transactionHash, function (err, receipt) {
            if (err) {
                error(err);
            }
            if (receipt !== null) {
                tempContractInstance.getPermissionStatus(requesteraccount, {
                    from: studentaccount
                }, function (error, status) {
                    if (!error) {
                        let status1;
                        let statusName;
                        status1 = status.toString()
                        console.log(status1);
                        permission_status.find({ ID: status1 }, (err, result1) => {
                            console.log(statusName = result1['0'].Name);
                            var newvalues = { $set: { Status: statusName } };
                            console.log(newvalues);
                            permission.updateOne(myquery, newvalues, function (err, user) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log(user);
                                }
                            });
                        })
                    } else {
                        console.log(error);
                    }
                });
            } else {
                setTimeout(() => {
                    Receipt(transactionHash);
                }, 1000);
            }
        })
    }
    Receipt(transactionHash);
}

module.exports = router;
