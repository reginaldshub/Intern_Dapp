const express = require('express')
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3')
const mongoose = require('mongoose')
const router = express.Router();

const HelloWorldABI = require("../../HelloWorldABI.json");
const Profile = require('../models/profile.js')
const studentProfile = require('../models/studentProfile.js');

const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))
console.log('Reading Contract...');
const input = fs.readFileSync('api/routes/PermissionList.sol');

// api to deploy the contract into the ethereum network
// router.post('/commit', (req, response) => {
//     userData = req.body;
//     console.log(userData);
//     studentProfile.findOne({ userId: userData._id }, (error, student) => {
//         if (error) {
//             console.log(error);
//         } 
//         else if (student.contract_address) {
//             response.status(200).json({ message: 'you already deployed the contract' });
//         }
//         else {
//             console.log(student.name);
//             console.log('Compiling Contract...');
//             const output = solc.compile(input.toString(), 1);
//             for (var contractName in output.contracts) {
//                 const bytecode = output.contracts[contractName].bytecode;
//                 console.log(bytecode);
//                 const abi = output.contracts[contractName].interface;
//                 fs.writeFile("./HelloWorldABI.JSON", abi, function (err) {

//                     if (err) {
//                         return console.log(err);
//                     }
//                     console.log("ABI Saved");
//                 });
//                 const helloWorldContract = web3.eth.contract(JSON.parse(abi));
//                 console.log('unlocking local geth account');
//                 try {
//                     web3.personal.unlockAccount(student.account_address, userData.password);
//                 } catch (e) {
//                     console.log(e);
//                     return;
//                 }
//                 console.log("Deploying the contract");
//                 const helloWorldContractInstance = helloWorldContract.new(student.name, {
//                     data: '0x' + bytecode,
//                     from: student.account_address,
//                     gas: 2000000
//                 }, (err, res) => {
//                     if (err) {
//                         console.log(err);
//                         return;
//                     }
//                     // If we have an address property, the contract was deployed
//                     if (res.address) {
//                         console.log("contract addres");
//                         console.log('Contract address: ' + res.address);
//                         student.contract_address = res.address;
//                         student.State = "committed";
//                         console.log(student.State)
//                         student.save((error, data) => {
//                             if (error) {
//                                 console.log(error);
//                                 response.json({ message: "deployed and but contract_address is not saved" })
//                             } else {
//                                 console.log(data)

//                                 response.status(200).json({ message: "deployed contract" });
//                             }
//                         })
//                     }

//                 });
//             }
//         }
//     })
// })

//api to request the permission from the student

router.post("/reqper", (req, res) => {
    userData = req.body;
    console.log(userData);
    Profile.findOne({ userId: userData._reqid }, (error, requester) => {
        if (error) {
            console.log(error)
        } else {
            console.log(requester.account_address);
            console.log('unlocking the get account')
            try {
                web3.personal.unlockAccount(requester.account_address, userData.password);
            } catch (e) {
                console.log(e);
                return;
            }
            studentProfile.findOne({ userId: userData._id }, (error, student) => {
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
                            res.status(200).send(result);
                        } else {
                            console.log(error);
                        }
                    });
                }
            })
        }
    })
})

// api to get the requesters

router.post('/requesters', (req, res) => {
    userData = req.body;
    console.log(userData);
    studentProfile.findOne({ userId: userData._id }, (error, student) => {
        if (error) {
            console.log(error)
        } else {
            console.log(student.contract_address);
            const tempContract = web3.eth.contract(HelloWorldABI);
            var tempContractInstance = tempContract.at(student.contract_address);
            console.log(tempContractInstance.getAllRequesters.call({ from: student.account_address }))
        }
    })
})


// api to grant the permission for the requester

router.post("/grant", (req, res) => {
    userData = req.body;
    console.log(userData);
    Profile.findOne({ userId: userData._reqid }, (error, requester) => {
        if (error) {
            console.log(error)
        } else {
            console.log(requester.account_address);
            studentProfile.findOne({ userId: userData._id }, (error, student) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log('unlocking the geth account')
                    try {
                        web3.personal.unlockAccount(student.account_address, userData.password);
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
                    }, function (error, result) {
                        if (!error) {
                            res.status(200).send(result);
                        } else {
                            console.log(error);
                        }
                    });
                }
            })
        }
    })
})



// api to deny the permission for the requester

router.post("/deny", (req, res) => {
    userData = req.body;
    console.log(userData);
    Profile.findOne({ userId: userData._reqid }, (error, requester) => {
        if (error) {
            console.log(error)
        } else {
            console.log(requester.account_address);
            studentProfile.findOne({ userId: userData._id }, (error, student) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log('unlocking the get account')
                    try {
                        web3.personal.unlockAccount(student.account_address, userData.password);
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
                    }, function (error, result) {
                        if (!error) {
                            res.status(200).send(result);
                        } else {
                            console.log(error);
                        }
                    });
                }
            })
        }
    })
})

router.post('/statusofreq', (req, res) => {
    userData = req.body;
    console.log(userData);
    const tempContract = web3.eth.contract(HelloWorldABI);
    var tempContractInstance = tempContract.at("0xb4f62b00b9a58e3079d22c72c2c51ec8ac0be6e9");
console.log(tempContractInstance.getPermissionStatus.call("0x2463f4c2404ac36ebe5da89bfe788ddfa8d11c47", { from: "0xbe5126597392442f2a802537dfe1c735ec56b579" }).toString())
    // console.log(tempContractInstance.getPermissionStatus.call({from:"0x2463f4c2404ac36ebe5da89bfe788ddfa8d11c47"}).toString())
})

module.exports = router;