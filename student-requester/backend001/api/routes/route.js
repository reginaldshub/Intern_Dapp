const express = require('express')
const fs = require('fs');
var FS = require('fs-extra')
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

// IPFS Imports and env

const path = require('path');
const multer = require('multer');
const ipfsAPI = require('ipfs-api');
const MAX_SIZE = 52428800;
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, './../../uploads'));
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    },
    // filename(req, file, cb) {
    //     cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
    // },
});

const upload = multer({ storage });
// var upload = multer({ storage: storage }).array('image', 5);

const ipfs = ipfsAPI({
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http'
});
// End of ipfs

// const PUC = require('../models/puc.js')
// const DEGREE = require('../models/degree.js')

const Web3 = require('web3')
console.log('Reading Contract...');
const input = fs.readFileSync('/home/reginaldanthony/code/Intern_Dapp/student-requester/backend001/api/routes/PermissionList.sol');

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
        // mongoose.connect('mongodb://localhost:27017/StudentRequesterApp', { useNewUrlParser: true });
        // mongoose.connection.on('connected', () => {
        //     console.log('connected to database StudentRequesterApp')
        // })
        // mongoose.connection.on('error', (err) => {
        //     console.log('Database error' + err)
        // })
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
    console.log(userData);
    Register.findOne({ email: userData.email }, (error, user) => {
        if (error) {
            console.log(error)
        } else {
            if (!user) {
                res.status(401).send({ message: "invalid email" })
            } else if (user.password !== userData.password) {
                res.status(401).send({ message: "invalid password" })
            } else {
                let payload = { subject: user._id }
                let token = jwt.sign(payload, 'secretKey')
                if (user.Roles == "student") {
                    studentProfile.findOne({ name: user.name }, (error, profile) => {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log(profile)
                            if (profile != null && profile.account_address) {
                                res.status(200).json({
                                    token: token,
                                    role: user.Roles,
                                    name: user.name,
                                    _id: user._id,
                                    name: user.name,
                                    account: profile.account_address,
                                    message: 'logged in sucessfully'
                                })
                            } else {
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
                } else {
                    Profile.findOne({ name: user.name }, (error, profile) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            // console.log("success"+ user.name)
                            if (profile != null && profile.account_address) {
                                res.status(200).json({
                                    token: token,
                                    role: user.Roles,
                                    name: user.name,
                                    _id: user._id,
                                    name: user.name,
                                    account: profile.account_address,
                                    message: 'logged in sucessfully'
                                })
                            } else {
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
                }
                // console.log(user.Roles);
                // res.json({
                //     message: "logged in sucessfully",
                //     role: user.Roles
                // })


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
                            web3.personal.unlockAccount("0xf10caa74888f217c718ec6d8aa16d0a36f4ddb9e", "password")
                        }
                        catch (e) {
                            console.log(e);
                            return;
                        }
                        web3.eth.sendTransaction({
                            from: "0xf10caa74888f217c718ec6d8aa16d0a36f4ddb9e",
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
        // else if (user.account_address) {
        //     console.log('you have an account');
        //     res.status(200).json({ accountNo: user.account_address });
        // }
        else {
            if (!web3.isConnected()) {
                res.json({
                    message: "geth is not running please run the geth"
                })
                console.log('geth not running');
            } else {
                console.log('geth running');

                web3.personal.newAccount(userData.password, (err, result) => {
                    if (err) {
                        console.log('error');
                    } else {
                        console.log(result);
                        user.account_address = result;
                        user.State = "saved";

                        try {
                            web3.personal.unlockAccount("0xf10caa74888f217c718ec6d8aa16d0a36f4ddb9e", "password")
                        }
                        catch (e) {
                            console.log(e);
                            return;
                        }
                        web3.eth.sendTransaction({
                            from: "0xf10caa74888f217c718ec6d8aa16d0a36f4ddb9e",
                            to: result,
                            value: web3.toWei("3", 'ether')
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
                                res.status(200).json({
                                    accountNo: result
                                });
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
    var userData = req.body;
    console.log("user", userData);
    let certificates = new Certificates(userData);
    Certificates.findOne({ $and: [{ studentid: userData.studentid }, { level: userData.level }] }, (error, certres) => {
        if (error) {
            console.log(error)
        }
        else if (certres) {
            Certificates.updateOne({ $and: [{ studentid: userData.studentid }, { level: userData.level }] }, { $set: userData }, { new: true },
                (err, doc) => {
                    if (!err) {
                        // console.log(doc);
                        res.status(200).json({ message: "updated success", doc: doc })
                    }
                    else { console.log('error' + JSON.stringify(err, undefined, 2)); }
                });
        }
        else {
            console.log("Else")
            certificates.save((err, user) => {
                console.log(user)
                if (err) {
                    console.log("not saved")
                } else {
                    // console.log("added sucessfully")
                    res.status(200).json({ message: "added sucessfully" });
                }
            })
        }
    })
});

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

    // console.log(profileData);
    let profile = new Profile(profileData)
    // console.log(profile);
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
    // console.log("params post" + req.body.name + JSON.stringify(req.body.Id))
    // console.log("req" + JSON.stringify(req.params.id))
    // console.log("body" + JSON.stringify(req.body))
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
    // console.log(userData)
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

    // console.log(profileData);
    let profile = new studentProfile(profileData)
    // console.log(profile);
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
router.post('/studentSelfCertificate', (req, res) => {
    let searchData = req.body;
    console.log(searchData)
    if (searchData.level != null) {
        if ((searchData.level != "" && searchData.level != null && searchData.level != undefined) &&
            (searchData.id != "" && searchData.id != null && searchData.id != undefined)) {
            Certificates.find({ $and: [{ studentid: searchData.id }, { level: searchData.level }] }, (error, certi) => {
                if (certi.length > 0) {
                    // console.log(certi)
                    res.status(200).json({ certificate: certi })
                } else {
                    res.status(200).json({ status: "empty" })
                }

            })
        }
    }
    else {
        if ((searchData.studentId != "" && searchData.studentId != null && searchData.studentId != undefined) &&
            (searchData.name != "" && searchData.name != null && searchData.name != undefined)) {
            Certificates.find({ studentid: searchData.studentId }, (error, sslc) => {
                if (sslc) {
                    console.log(sslc)
                    res.status(200).json({ certificate: sslc, status: "found" })
                } else {
                    console.log("sslc")
                    res.status(200).json({ status: "empty" })
                }

            })
        }
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
        // else if (student.contract_address) {
        //     response.status(200).json({ message: student.contract_address });
        // }
        else {
            console.log(student.name);
            console.log('Compiling Contract...');
            const output = solc.compile(input.toString(), 1);
            for (var contractName in output.contracts) {
                const bytecode = output.contracts[contractName].bytecode;
                console.log(bytecode);
                const abi = output.contracts[contractName].interface;
                fs.writeFileSync("./HelloWorldABI.JSON", abi, function (err) {

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
                    gas: 4382070
                }, (err, res) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    // If we have an address property, the contract was deployed
                    if (res.address) {
                        console.log('Contract address: ' + res.address);
                        student.contract_address = res.address;
                        student.State = "committed";
                        console.log(student.State)
                        student.save((error, data) => {
                            if (error) {
                                console.log(error);
                                response.json({ message: "deployed and but contract_address is not saved" })
                            } else {

                                const fileFolder = `./uploads/${userData.account}`;

                                fs.readdirSync(fileFolder).forEach(file => {
                                    console.log(file)
                                    let data = fs.readFileSync(`${fileFolder}/${file}`);
                                    ipfs.add(data, (err, files) => {
                                        // console.log(file);
                                        // fs.unlink(req.file.path);
                                        // fs.unlink(req.file.path, err => { if (err) console.log(err) });
                                        if (files) {
                                            console.log(files)
                                            var hash = 'http://localhost:8080/ipfs/';
                                            hash += files[0].hash;
                                            console.log(hash);
                                            studentProfile.findOne({ account_address: userData.account }, (error, studentProfileRes) => {
                                                if (error) {
                                                    console.log(error)
                                                } else {
                                                    let img = '';
                                                    img = `${userData.account}&${file}`;
                                                    console.log("img" + img)
                                                    Certificates.find({ $and: [{ studentid: studentProfileRes.userId }, { imageArray: img }] }, (error, certiresponse) => {
                                                        if (error) {
                                                            console.log(error)
                                                        } else {
                                                            console.log("inside Certificates")
                                                            console.log(certiresponse)
                                                            const studentContract = web3.eth.contract(HelloWorldABI);
                                                            var studentContractInstance = studentContract.at(res.address);
                                                            // console.log(certiresponse[0].class);

                                                            // if (certiresponse[0].class == 'tenth') {

                                                            function tenth() {
                                                                return new Promise((resolve, reject) => {
                                                                    console.log("tenth")
                                                                    studentContractInstance.add10thFile(file, hash, {
                                                                        from: userData.account,
                                                                        gas: 4000000
                                                                    }, function (error, transactionHash) {
                                                                        if (transactionHash) {
                                                                            console.log("tenth" + transactionHash);

                                                                            console.log(certiresponse.ImageHash)
                                                                            if (certiresponse.ImageHash != undefined) {
                                                                                Certificates.updateOne({ $and: [{ studentid: studentProfileRes.userId }, { imageArray: img }] }, { $push: { ImageHash: hash } }, { new: true },
                                                                                    (err, doc) => {
                                                                                        if (!err) {
                                                                                            resolve(console.log("updated TEnth"))
                                                                                        }
                                                                                    })
                                                                            } else {
                                                                                Certificates.updateOne({ $and: [{ studentid: studentProfileRes.userId }, { imageArray: img }] }, { $addToSet: { ImageHash: hash } }, { new: true },
                                                                                    (err, doc) => {
                                                                                        if (!err) {
                                                                                            resolve(console.log("added tenth"))
                                                                                        }
                                                                                    })
                                                                            }
                                                                        } else {
                                                                            reject(console.log("outside" + error));
                                                                        }
                                                                    });
                                                                })
                                                            }
                                                            // else if (certiresponse[0].class == 'puc') {
                                                            function puc() {
                                                                return new Promise((resolve, reject) => {
                                                                    console.log("Puc")
                                                                    studentContractInstance.add12thFile(file, hash, {
                                                                        from: userData.account,
                                                                        gas: 4000000
                                                                    }, function (error, transactionHash) {
                                                                        if (transactionHash) {
                                                                            console.log("puc" + transactionHash);

                                                                            console.log(certiresponse.ImageHash)
                                                                            if (certiresponse.ImageHash != undefined) {
                                                                                Certificates.updateOne({ $and: [{ studentid: studentProfileRes.userId }, { imageArray: img }] }, { $push: { ImageHash: hash } }, { new: true },
                                                                                    (err, doc) => {
                                                                                        if (!err) {
                                                                                            resolve(console.log("updated PUC"))
                                                                                        }
                                                                                    })
                                                                            } else {
                                                                                Certificates.updateOne({ $and: [{ studentid: studentProfileRes.userId }, { imageArray: img }] }, { $addToSet: { ImageHash: hash } }, { new: true },
                                                                                    (err, doc) => {
                                                                                        if (!err) {
                                                                                            resolve(console.log("added Puc"))
                                                                                        }
                                                                                    })
                                                                                // Certificates.updateOne({ $and: [{ studentid: studentProfileRes.userId }, { imageArray: img }] }, { $addToSet: { ImageHash: hash } }, { new: true },
                                                                                //     (err, doc) => {
                                                                                //         if (!err) {
                                                                                //             console.log("updated PUC")
                                                                                //         }
                                                                                //     })
                                                                            }
                                                                        } else {
                                                                            reject(console.log(error));
                                                                        }
                                                                    });
                                                                })
                                                            }
                                                            // else if (certiresponse[0].class == 'degree') {
                                                            function degree() {
                                                                return new Promise((resolve, reject) => {
                                                                    console.log("degree")
                                                                    studentContractInstance.addGradFile(file, hash, {
                                                                        from: userData.account,
                                                                        gas: 4000000
                                                                    }, function (error, transactionHash) {
                                                                        if (transactionHash) {
                                                                            console.log("degreee" + transactionHash);
                                                                            console.log(certiresponse.ImageHash)
                                                                            if (certiresponse.ImageHash != undefined) {
                                                                                Certificates.updateOne({ $and: [{ studentid: studentProfileRes.userId }, { imageArray: img }] }, { $push: { ImageHash: hash } }, { new: true },
                                                                                    (err, doc) => {
                                                                                        if (!err) {
                                                                                            resolve(console.log("updated Degree"))
                                                                                        }
                                                                                    })
                                                                            } else {
                                                                                Certificates.updateOne({ $and: [{ studentid: studentProfileRes.userId }, { imageArray: img }] }, { $addToSet: { ImageHash: hash } }, { new: true },
                                                                                    (err, doc) => {
                                                                                        if (!err) {
                                                                                            resolve(console.log("add degree"))
                                                                                        }
                                                                                    })
                                                                            }
                                                                        } else {
                                                                            reject(console.log(error));
                                                                        }
                                                                    });

                                                                })
                                                            }
                                                            // else if (certiresponse[0].class == 'masters') {
                                                            function masters() {
                                                                return new Promise((resolve, reject) => {
                                                                    studentContractInstance.addPostGradFile(file, hash, {
                                                                        from: userData.account,
                                                                        gas: 4000000
                                                                    }, function (error, transactionHash) {
                                                                        if (transactionHash) {
                                                                            console.log(transactionHash);
                                                                            if (certiresponse.ImageHash != undefined) {
                                                                                Certificates.updateOne({ $and: [{ studentid: studentProfileRes.userId }, { imageArray: img }] }, { $push: { ImageHash: hash } }, { new: true },
                                                                                    (err, doc) => {
                                                                                        if (!err) {
                                                                                            resolve(console.log("updated MAsters"))
                                                                                        }
                                                                                    })
                                                                            } else {
                                                                                Certificates.updateOne({ $and: [{ studentid: studentProfileRes.userId }, { imageArray: img }] }, { $addToSet: { ImageHash: hash } }, { new: true },
                                                                                    (err, doc) => {
                                                                                        if (!err) {
                                                                                            resolve(console.log("updated Masters"))
                                                                                        }
                                                                                    })
                                                                            }
                                                                        } else {
                                                                            reject(console.log(error));
                                                                        }
                                                                    });
                                                                })
                                                            }

                                                            async function synchronousCall() {
                                                                try {
                                                                    if (certiresponse[0].class == 'tenth')
                                                                        var ten = await tenth();
                                                                    else if (certiresponse[0].class == 'puc')
                                                                        var pu = await puc();
                                                                    else if (certiresponse[0].class == 'degree')
                                                                        var degre = await degree();
                                                                    else if (certiresponse[0].class == 'masters')
                                                                        var master = await masters();
                                                                    else
                                                                        console.log("Failed")

                                                                    console.log("DB" + updateDB);
                                                                }
                                                                catch (err) {
                                                                    console.log("catch");
                                                                }
                                                            }
                                                            synchronousCall();

                                                            // else {
                                                            //     console.log(certiresponse)
                                                            // }
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        else {
                                            console.log("run ipfs")
                                        }
                                    });
                                })
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
// router.post('/grant', (req, res) => {
//     let requesterID = req.body.requesterID;
//     let studentID = req.body.studentID;
//     var myquery = { $and: [{ requesterID: requesterID }, { studentID: studentID }] };
//     let status = req.body.Status;
//     console.log(req.body);
//     var myquery = { $and: [{ requesterID: requesterID }, { studentID: studentID }] };
//     // var newvalues = { $set: { Status: status } };
//     Profile.findOne({ userId: requesterID }, (error, requester) => {
//         if (error) {
//             console.log(error)
//         } else {
//             studentProfile.findOne({ userId: studentID }, (error, student) => {
//                 if (error) {
//                     console.log(error)
//                 } else {
//                     if (!web3.isConnected()) {
//                         console.log("please run the node")
//                     } else {
//                         console.log('unlocking the geth account')
//                         try {
//                             web3.personal.unlockAccount(student.account_address, "password");
//                         } catch (e) {
//                             console.log(e);
//                             return;
//                         }
//                         const tempContract = web3.eth.contract(HelloWorldABI);
//                         var tempContractInstance = tempContract.at(student.contract_address);

//                         tempContractInstance.grantPermission(requester.account_address, {
//                             from: student.account_address,
//                             gas: 4000000
//                         }, function (error, transactionHash) {
//                             if (!error) {
//                                 transaction.findOne(myquery, function (err, contract) {
//                                     if (contract) {
//                                         contract.grantTransactionHash = transactionHash
//                                         console.log(contract.grantTransactionHash);
//                                         if (err) {
//                                             console.log("err")
//                                             throw err;
//                                         } else {
//                                             contract.save((err, transactiondata) => {
//                                                 if (err) {
//                                                     throw err;
//                                                 } else {
//                                                     console.log("executed");
//                                                     console.log(transactiondata);
//                                                     var status = "Pending"
//                                                     var newvalues = { $set: { Status: status } };
//                                                     permission.updateOne(myquery, newvalues, function (err, user) {
//                                                         if (err) {
//                                                             throw err;
//                                                         } else {
//                                                             console.log(user);
//                                                             res.status(200).json({ status: "Pending" });
//                                                         }
//                                                     });
//                                                 }
//                                             })
//                                         }
//                                     }
//                                 });
//                             } else {
//                                 console.log(error);
//                             }
//                         });
//                     }
//                 }
//             })
//         }
//     })
// })

//for testing grant
router.post('/grant', (req, res, next) => {
    let requesterID = req.body.requesterID;
    let studentID = req.body.studentID;
    var myquery = { $and: [{ requesterID: requesterID }, { studentID: studentID }] };
    let status = req.body.Status;
    console.log(req.body);
    var myquery = { $and: [{ requesterID: requesterID }, { studentID: studentID }] };
    // var newvalues = { $set: { Status: status } };
    Profile.findOne({ userId: requesterID }, (error, requester) => {
        if (error) {
            console.log(error)
        } else {
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
                        const tempContract = web3.eth.contract(HelloWorldABI);
                        var tempContractInstance = tempContract.at(student.contract_address);

                        // event
                        var events = tempContractInstance.GrantEvent({ fromBlock: 0, toBlock: 'latest' });
                        events.watch((error, result) => {
                            if (result) {
                                console.log(result);
                                console.log("Requester    " + result.args._requester);

                                console.log("Status   " + result.args._status);
                                var _status = result.args._status;
                                if (result.args._status) {
                                permission_status.find({ ID: _status }, (err, result1) => {
                                    console.log(result1);
                                    var statusName = result1['0'].Name;
                                    var newvalues = { $set: { Status: statusName } };
                                    console.log("db    " + statusName);
                                    permission.updateOne(myquery, newvalues, function (err, user) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            res.status(200).json({ res: status });
                                        }
                                    });
                                })
                            }
                            } else {
                                res.status(400).json({ res: status });
                            }
                        })
                        // would get all past logs again.
                        // var myResults = events.get(function(error, logs){                            
                        //     console.log(logs);
                        //  });

                        tempContractInstance.grantPermission(requester.account_address, {
                            from: student.account_address,
                            gas: 4000000
                        }, function (error, transactionHash) {
                            if (!error) {
                                transaction.findOne(myquery, function (err, contract) {
                                    if (contract) {
                                        contract.grantTransactionHash = transactionHash
                                        // console.log(contract.grantTransactionHash);
                                        if (err) {
                                            console.log("err")
                                            throw err;
                                        } else {
                                            contract.save((err, transactiondata) => {
                                                if (err) {
                                                    throw err;
                                                } else {
                                                    // console.log("executed");
                                                    // console.log(transactiondata);
                                                    var status = "Pending"
                                                    var newvalues = { $set: { Status: status } };
                                                    // permission.updateOne(myquery, newvalues, function (err, user) {
                                                    //     if (err) {
                                                    //         throw err;
                                                    //     } else {
                                                    //         console.log(user);
                                                    //         res.status(200).json({ status: "Pending" });
                                                    //     }
                                                    // });
                                                }
                                            })
                                        }
                                    }
                                });
                            } else {
                                console.log(error);
                            }
                        });
                        // watch for an event with {some: 'args'}
                        // var events = tempContractInstance.GrantEvent({}, { fromBlock: 15800, toBlock: 'latest' });
                        // events.watch(function (error, result) {
                        //     if(!error)
                        //     console.log("result" + result);
                        // });
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
                                    contract.denyTransactionHash = transactionHash;
                                    console.log(contract);
                                    console.log(contract.grantTransactionHash);
                                    if (err) {
                                        throw err;
                                    } else {
                                        contract.save((err, transactiondata) => {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log(transactiondata);
                                                res.status(200).json({ status: "denyHash" });
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

    // console.log(req.body.level);
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


// Image Upload to IPFS
// router.post('/upload', upload.single('image'), (req, res) => {
//     // console.log(req)
//     let studentid = req.body.studentid;
//     console.log(req.body)
//     if (!req.file) {
//         return res.status(422).json({
//             error: 'File needs to be provided.',
//         });
//     }

//     const mime = req.file.mimetype;
//     if (mime.split('/')[0] !== 'image') {
//         fs.unlink(req.file.path);

//         return res.status(422).json({
//             error: 'File needs to be an image.',
//         });
//     }

//     console.log("ENtered")
//     const fileSize = req.file.size;
//     if (fileSize > MAX_SIZE) {
//         fs.unlink(req.file.path);

//         return res.status(422).json({
//             error: `Image needs to be smaller than ${MAX_SIZE} bytes.`,
//         });
//     }
//     const data = fs.readFileSync(req.file.path);
//     return ipfs.add(data, (err, files) => {
//         // fs.unlink(req.file.path);
//         fs.unlink(req.file.path, err => { if (err) console.log(err) });
//         if (files) {
//             var hash = 'http://localhost:8080/ipfs/';
//             hash += files[0].hash;
//             console.log(req.body.level+"Level"+ req.body.studentid)
//             Certificates.updateOne({ $and: [{ studentid: req.body.studentid }, { level: req.body.level }] }, { $set: { ImageHash: hash } }, (error, present) => {
//                 if (error) {
//                     console.log(error)
//                 }
//                 else {
//                     // // res.status(200).json({
//                     // //    hash: files[0].hash
//                     // })
//                     console.log("updated Hash")
//                 }
//             })
//             console.log(files[0].hash)
//             return res.json({
//                 hash: files[0].hash,
//             });
//         }

//         return res.status(500).json({
//             error: err,
//         });
//     });

// });


// Image Upload to FS (uploads Folder)
router.post('/upload', upload.array("uploads[]", 12), (req, res) => {

    console.log(req.files);
    var files = [];
    files = req.files;

    try {
        if (!fs.existsSync('./uploads/' + req.body.account)) {
            fs.mkdir('./uploads/' + req.body.account)
        }
        else {
            console.log("DIR EXISTS");
        }
    } catch (err) {
        console.error(err);
    }


    let imageArray = [];

    function Move() {
        return new Promise((resolve, reject) => {
            // req.files.forEach(function (item, index, arr) {
            for (let i = 0; i < files.length; i++) {
                // console.log(files[i].originalname);
                FS.move('./uploads/' + files[i].originalname, './uploads/' + req.body.account + '/' + files[i].originalname, (err, abc) => {
                    if (err) reject(console.error(err))
                    else {
                        console.log("rename");
                        fs.rename(`./uploads/${req.body.account}/${files[i].originalname}`, `./uploads/${req.body.account}/${req.body.class}_${i + 1}.${files[i].mimetype.split('/')[1]}`, function (err) {
                            if (err) reject(err);
                            imageArray[i] = `${req.body.account}&${req.body.class}_${i + 1}.${files[i].mimetype.split('/')[1]}`;
                            if (i == files.length - 1) {
                                console.log("resolve");
                                resolve("moved");
                            }
                        });

                    }
                })
            }

        })
    }
    // // })


    function UpdateDB() {
        return new Promise((resolve, reject) => {
            console.log("ImageArray" + imageArray)
            Certificates.updateOne({ $and: [{ studentid: req.body.studentid }, { level: req.body.level }] }, { $set: { imageArray: imageArray } }, (error, present) => {
                if (error) {
                    reject(console.log(error))
                }
                else {

                    console.log("updated ImageArray" + imageArray)
                    resolve(res.status(200).json({
                        imageArray: imageArray
                    }))
                }
            })
        })
    }

    async function synchronousCall() {
        try {
            var move = await Move();
            var updateDB = await UpdateDB();

            console.log("DB" + updateDB);
        }
        catch (err) {
            console.log("catch");
        }
    }
    synchronousCall();


    // console.log(req.files[0]);
    // for (var i = 0; i < req.files.length; i++) {
    //     const data = fs.readFileSync(req.files[i].path);
    //     ipfs.add(data, (err, files) => {
    //         // fs.unlink(req.file.path);
    //         // fs.unlink(req.file.path, err => { if (err) console.log(err) });
    //         if (files) {
    //             var hash = 'http://localhost:8080/ipfs/';
    //             hash += files[0].hash;
    //             array.push(hash);
    //         }
    //     });
    // }
    // return res.json({
    //     hash: array,
    // });
    // });
});

// Image Upload to FS (uploads Single Image)
router.post('/uploadsingle', upload.single('image'), function (req, res) {
    console.log(req.body)
    let imageArray = [];
    try {
        if (!fs.existsSync('./uploads/' + req.body.account)) {
            fs.mkdirSync('./uploads/' + req.body.account)
        }
    }
    catch (error) {
        console.log(error);
    }

    function Move() {
        return new Promise((resolve, reject) => {
            FS.move('./uploads/' + req.file.originalname, './uploads/' + req.body.account + '/' + req.file.originalname, function (err) {
                if (err) reject(console.error(err));
                else {
                    fs.rename(`./uploads/${req.body.account}/${req.file.originalname}`, `./uploads/${req.body.account}/${req.body.class}.${req.file.mimetype.split('/')[1]}`, function (err) {
                        if (err) { reject(console.log(err)); }
                        else {
                            resolve(console.log("renamed"));
                            imageArray[0] = `${req.body.account}&${req.body.class}.${req.file.mimetype.split('/')[1]}`;
                        }
                    });
                }
            });
        })
    }


    function UpdateDB() {
        return new Promise((resolve, reject) => {
            Certificates.updateOne({ $and: [{ studentid: req.body.studentid }, { level: req.body.level }] }, { $set: { imageArray: imageArray } }, (error, present) => {
                if (error) {
                    reject(console.log(error))
                }
                else {
                    resolve(res.status(200).json({
                        imageArray: imageArray
                    }))
                }
            })
        })
    }

    async function synchronousCall() {
        try {
            var move = await Move();
            var updateDB = await UpdateDB();

            console.log("DB" + updateDB);
        }
        catch (err) {
            console.log("catch");
        }
    }
    synchronousCall();




    // let imageArray = [];


    // setTimeout(() => {
    // Certificates.updateOne({ $and: [{ studentid: req.body.studentid }, { level: req.body.level }] }, { $set: { imageArray: imageArray } }, (error, present) => {
    //     if (error) {
    //         console.log(error)
    //     }
    //     else {
    //         res.status(200).json({
    //             imageArray: imageArray[0]
    //         })
    //         console.log("updated ImageArray" + imageArray[0])
    //     }
    // })
    // }, 700)

    // console.log(req.files[0]);
    // for (var i = 0; i < req.files.length; i++) {
    //     const data = fs.readFileSync(req.files[i].path);
    //     ipfs.add(data, (err, files) => {
    //         // fs.unlink(req.file.path);
    //         // fs.unlink(req.file.path, err => { if (err) console.log(err) });
    //         if (files) {
    //             var hash = 'http://localhost:8080/ipfs/';
    //             hash += files[0].hash;
    //             array.push(hash);
    //         }
    //     });
    // }
    // return res.json({
    //     hash: array,
    // });
    // });

})

router.get("/:id", (req, res) => {

    console.log(req.params);
    var sp = req.params.id.split('&');
    res.sendFile(path.join(__dirname, `./../../uploads/${sp[0]}/${sp[1]}`));
});


router.post("/testinn", (req, res) => {
    // var name = "foo";
    // var func = new Function(
    //      "return function " + name + "(){ console.log('sweet!')}"
    // )();

    // func();



    if (!web3.isConnected()) {
        console.log("please run the node");
    } else {
        console.log('unlocking the geth account');
        try {
            web3.personal.unlockAccount('0x2fba3f7ecd8de3eba2a31a4fa2322d6202fc4246', "password");
        } catch (e) {
            console.log(e);
            return;
        }
        const tempContract = web3.eth.contract(HelloWorldABI);
        var tempContractInstance = tempContract.at('0xe8123bddcd3a1eb245567f7113ac04367d70679c');
        // console.log(tempContractInstance)
        tempContractInstance.gethpostgradFiles(function (error, transactionHash) {
            if (transactionHash) {
                console.log("secFiles" + transactionHash)
            } else {
                console.log(error);
            }
        })
        // tempContractInstance.addGradFile("file", "hash", {
        //     from: '0x2fba3f7ecd8de3eba2a31a4fa2322d6202fc4246',
        //     gas: 4000000
        // }, function (error, transactionHash) {
        //     if (transactionHash) {
        //         console.log("tenth" + transactionHash);
        //     }
        //     else console.log("error")
        // })
    }
})

// router.post("/testingipfs", async (req, res) => {
//     const fileFolder = `./uploads/${req.body.account}`;

//     await fs.readdirSync(fileFolder).forEach(file => {

//         let data = fs.readFileSync(`${fileFolder}/${file}`);
//         ipfs.add(data, (err, files) => {
//             console.log(file);
//             // fs.unlink(req.file.path);
//             // fs.unlink(req.file.path, err => { if (err) console.log(err) });
//             if (files) {
//                 console.log(files)
//                 var hash = 'http://localhost:8080/ipfs/';
//                 hash += files[0].hash;
//                 // console.log(hash);
//                 studentProfile.findOne({ account_address: req.body.account }, (error, student) => {
//                     if (error) {
//                         console.log(error)
//                     } else {

//                         Certificates.find({ $and: [{ studentid: student.userId }, { imageArray: file }] }, (error, certiresponse) => {
//                             if (error) {
//                                 console.log(error)
//                             } else {

//                                 const studentContract = web3.eth.contract(HelloWorldABI);
//                                 var studentContractInstance = studentContract.at(res.address);
//                                 studentContractInstance.add10thFile(filename, ipfsHAsh, {
//                                     from: userData.account,
//                                     gas: 4000000
//                                 }, function (error, transactionHash) {
//                                     if (!error) {
//                                         console.log(transactionHash);
//                                         if (certiresponse.ImageHash != undefined) {
//                                             Certificates.updateOne({ $and: [{ studentid: student.userId }, { imageArray: file }] }, { $push: { ImageHash: hash } }, { new: true },
//                                                 (err, doc) => {
//                                                     if (!err) {
//                                                         console.log("updated Degree")
//                                                     }
//                                                 })
//                                         } else {
//                                             Certificates.updateOne({ $and: [{ studentid: student.userId }, { imageArray: file }] }, { $addToSet: { ImageHash: hash } }, { new: true },
//                                                 (err, doc) => {
//                                                     if (!err) {
//                                                         console.log("updated")
//                                                     }
//                                                 })
//                                         }
//                                     } else {
//                                         console.log(error);
//                                     }
//                                 });
//                             }
//                         })
//                     }
//                 })
//             }
//             else {
//                 console.log("run ipfs")
//             }
//         });
//     })

//     // studentProfile.findOne({ userId: '5c4da4850dcc9d3293913132' }, (error, student) => {
//     //     if (error) {
//     //         console.log(error)
//     //     } else {
//     //         if (!web3.isConnected()) {
//     //             console.log("please run the node");
//     //         } else {
//     //             console.log('unlocking the geth account');
//     //             try {
//     //                 web3.personal.unlockAccount(student.account_address, "password");
//     //             } catch (e) {
//     //                 console.log(e);
//     //                 return;
//     //             }
//     //             // console.log(student);
//     //             const tempContract = web3.eth.contract(HelloWorldABI);
//     //             var tempContractInstance = tempContract.at(student.contract_address);               
//     //             // console.log(tempContractInstance)
//     //             tempContractInstance.getsecFiles( function (error, transactionHash) {
//     //                 if (!error) {
//     //                     console.log("secFiles"+transactionHash)
//     //                 } else {
//     //                     console.log(error);
//     //                 }
//     //             });

//     //             // let filename = 'tenth.jpeg';
//     //             // let ipfsHAsh = '0x0112nsdfd1213e'
//     //             // tempContractInstance.add10thFile(filename, ipfsHAsh,{
//     //             //     from: student.account_address,
//     //             //     gas: 4000000
//     //             // }, function (error, transactionHash) {
//     //             //     if (!error) {
//     //             //         console.log(transactionHash)
//     //             //     } else {
//     //             //         console.log(error);
//     //             //     }
//     //             // });

//     //         }
//     //     }
//     // })

// })

module.exports = router;
