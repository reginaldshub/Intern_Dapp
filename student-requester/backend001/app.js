const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const morgan = require('morgan')

var cors = require('cors')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// routes which handle requests 
const api = require("./api/routes/route.js")
app.use("/products", api)
//routes which calls contract methods
const api1 = require("./api/routes/smartcontract.js")
app.use("/smartcontract", api1)
app.use((req,res,next)=>{
    const error = new Error("not found");
    error.status = 404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})


module.exports = app;