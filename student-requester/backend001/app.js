const express = require('express');

const bodyParser = require('body-parser');

var cors = require('cors')

var cookieParser = require('cookie-parser');
const morgan = require('morgan');

const path = require('path');

const app = express();
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'))
app.use(cors())

// routes which handle requests 
const api = require("./api/routes/route.js")
app.use("/products", api)
//routes which calls contract methods
const api1 = require("./api/routes/smartcontract.js")
app.use("/smartcontract", api1)
app.use((req, res, next) => {
    const error = new Error("not found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;