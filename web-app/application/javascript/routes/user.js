const express = require('express');
const { v4: uuidv4 } = require('uuid');
require('dotenv/config');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const fabricUser = require('../fabricUser');
const generateAuthToken = require('../utils/generateAuthToken');
const validInfo = require('../middleware/validInfo');
const authorize = require('../middleware/authorize')

const router = express.Router();

//need to save the information off-chain in postgres
// use CORS package to whitelist domains for security
router.post('/register', validInfo, async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    //check if UUID already exists
    let UUID = uuidv4();
    const UUIDExists = await User.exists({ _id: UUID });
    if (UUIDExists) {
        UUID = uuidv4()
    };

    //check if firstName is empty
    if (!firstName) {
        returnres.end({
            success:false,
            message: 'Please enter your first name'
        }).status(409)
    }

    //check if lastName is empty
    if (!lastName) {
        return res.end({
            success:false,
            message: 'Please enter your last name'
        }).status(409)
    }

    //check if email already exists
    const lowerEmail = email.toLowerCase();
    const emailExists = await User.exists({ email: lowerEmail });
    if (emailExists) {
        return res.send({
            message: 'This Email is already registered',
            success: false,
        }).status(409)
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
        return res.json({
            savedUser,
            message: 'Your account got created, have fun exploring the App!',
            success: true
        }).status(200)
    }
    catch (error)  {
        res.json({ 
            error: error,
            message: 'There was a Problem with our Servers',
            success: false
        }).status(500);
    }
});

router.post('/login',validInfo, async (req, res) => {
    const {email, password} = req.body;

    try{

        if (!email) {
            return res.end({
                success:false,
                message: 'Please enter your Email'
            })
        }
        if (!password) {
            return res.end({
                success:false,
                message: 'Please enter your Password'
            })
        }

        //check if email exists
        const lowerEmail = email.toLowerCase();
        const emailExists = await User.exists({ email: lowerEmail });
        if (!emailExists) {
            return res.send({
                message: 'Email or Password is incorrect',
                success: false,
            }).status(401)
        }

        //check if incoming password is the same as the database password
        const databaseUser = await User.findOne({ email: lowerEmail });
        const databasePassword = databaseUser.password;
        const validPassword = await bcrypt.compare(password, databasePassword);
        if (!validPassword) {
            return res.send({
                essage: 'Email or Password is incorrect',
                success: false
            }).status(401)
        }
        const accessToken = generateAuthToken(databaseUser._id);
        var in1h = new Date(new Date().getTime() + 60 * 60 * 1000);
        return res
                    .status(200)
                    .cookie('accessToken', accessToken, {
                        sameSite: 'strict',
                        path: '/',
                        expires: in1h,
                        httpOnly: true
                    }).send({
                        message: "Successfully logged in",
                        success: true
                    })

    } catch (error)  {
        res.json({
            error: error,
            message: 'There was a Problem with our Servers',
            success: false
        }).status(500)
    }
});

router.get('/logout', async (req, res) => {
    try {
        res
            .status(200)
            .clearCookie('accessToken')
            .send('Successfully logged out')
    } catch (error) {
        res.json({
            error: error,
            message: 'There was a Problem with our Servers',
            success: false
        }).status(500)
    }
})

router.post("/verify", authorize, (req, res) => {
    try {
      res.json(true);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

module.exports = router