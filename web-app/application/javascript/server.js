'use strict';
require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

//Import Routes
const userRoute = require('./routes/user')

app.use(cors({origin: 'http://localhost:3001', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser())

// implement the authorize middleware at the logout

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