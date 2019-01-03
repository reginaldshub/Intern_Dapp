const express = require('express')

const router =  express.Router();

const Student = require('../models/login.js')
const mongoose = require('mongoose')
const db = "mongodb://santhosh123:santhosh123@ds133533.mlab.com:33533/eventsdb"
mongoose.connect(db, { useNewUrlParser: true },err=>{
 if(err){
     console.log("the error" +err)
 }else{
     console.log("connected to mongodb")
 }

})

router.post('/',(req,res,next)=>{
    let login = req.body;
    let student = new Student(login);
    student.save((err,user)=>{
        if(err){
            console.log(err);

        }else{
            res.status(200).json({
                message:"saved successfully"
            });
        }
    })

})
router.get('/:id',(req,res,next)=>{
    const id = req.params.id;
    if(id){
        res.status(200).json({
            message: id
        })
    }
})
router.post('/login',(req,res)=>{
    let userData = req.body;
    Student.findOne({email:userData.email},(error,user)=>{
        if(error){
           console.log(error)
        }else{
            if(!user){
                res.status(401).send({message:"invalid email"})
            }else if(user.password !== userData.password){
                res.status(401).send({message:"invalid password"})
            }else{
                res.send("logged in")
            }
        }
    })
})

module.exports = router;