'use strict';
require('dotenv').config();
const mongoose = require('mongoose')

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Import Routes
const userRoute = require('./routes/user')

//Middlewares = functions that get run whenever a route is called. For example an auth function that runs ever API call
app.use(bodyParser.json());
app.use('/account', userRoute);

//connect to db
mongoose.connect(
    process.env.DB_CONNECTION, 
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => console.log('connected to db!')
);

app.listen(3000, ()=>{
    console.log("***********************************");
    console.log("API server listening at localhost:3000");
    console.log("***********************************");
  });