const express = require('express');
const { v4: uuidv4 } = require('uuid');
require('dotenv/config');
const bcrypt = require('bcrypt');
const User = require('../models/User')
const fabricUser = require('../fabricUser');

const router = express.Router();

//need to save the information off-chain in postgres
// use CORS package to whitelist domains for security
router.post('/register', async (req, res) => {
    // destructure req.body
    const {firstName, lastName, email, password} = req.body;

    //check if UUID already exists
    let UUID = uuidv4();
    const UUIDExists = await User.exists({ _id: UUID });
    if (UUIDExists) {
        UUID = uuidv4()
    };

    //check if firstName is empty
    if (!firstName) {
        res.end({
            success:false,
            message: 'First name cannot be blank'
        })
    }

    //check if lastName is empty
    if (!lastName) {
        res.end({
            success:false,
            message: 'Last name cannot be blank'
        })
    }

    //check if email already exists
    const lowerEmail = email.toLowerCase();
    const emailExists = await User.exists({ email: lowerEmail });
    if (emailExists) {
        res.send({
            message: 'This email is already registered',
            success: false,
            status: 409
        })
        return;
    };

    //hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash (password, salt);

    const user = new User({
        _id: UUID,
        firstName: firstName,
        lastName: lastName,
        email: lowerEmail,
        password: bcryptPassword
    });

    try{
        const fabricRes = await fabricUser.Enroll(UUID);

        const savedUser = await user.save();
        res.json({
            savedUser,
            message: 'Your account got created, have fun exploring the App!',
            status: 200,
            success: true
        })
    }
    catch (error)  {
        res.json({ 
            error: error,
            message: 'There was a Problem with our Servers',
            status: 500,
            success: false
        });
    }
});

router.post('/login', async function (req, res) {
    try{

    } catch (error)  {

    }
});

module.exports = router