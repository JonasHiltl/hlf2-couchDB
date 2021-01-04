const express = require('express');
const { v4: uuidv4 } = require('uuid');
require('dotenv/config');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
const User = require('../models/User');
const fabricUser = require('../fabricUser');
const generateAuthToken = require('../utils/generateAuthToken');
const validInfo = require('../middleware/validInfo');
const authorize = require('../middleware/authorize');

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth : {
        user: process.env.emailUser,
        pass: process.env.emailPw,
    }
})

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
            message: 'This email is already registered',
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
        password: bcryptPassword,
    });

    try{
        const fabricRes = await fabricUser.Enroll(UUID);

        const savedUser = await user.save();

        // 2. send Email with link to :-id/:token
        const emailVerificationUrl = `http://localhost:3000/account/confirmation/${UUID}`;
        transporter.sendMail({
            to: lowerEmail,
            from: 'jonashiltl2003@gmail.com',
            subject: 'Confirmation Email',
            html: `
                <h4>Hello, ${firstName}.</h4> 
                <p>Please click this link to confirm your email: <a href= ${emailVerificationUrl}>${emailVerificationUrl}</a><p/>
                `
        });

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
                message: 'Please enter your email'
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

        const databaseUser = await User.findOne({ email: lowerEmail });
        //check if account is activated
        if (!databaseUser.active) {
            return res.send({
                message: 'Please confirm your email to login',
                success: false,
            }).status(401)
        }
        //check if incoming password is the same as the database password
        const databasePassword = databaseUser.password;
        const validPassword = await bcrypt.compare(password, databasePassword);
        if (!validPassword) {
            return res.send({
                message: 'Email or Password is incorrect',
                success: false
            }).status(401)
        }
        try{
            
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
        }catch (error)  {
            res.json({
                error: error,
                message: 'There was a Problem authorizing you',
                success: false
            }).status(500)

        }

    } catch (error)  {
        res.json({
            error: error,
            message: 'There was a Problem with our Servers',
            success: false
        }).status(500)
    }
});

router.get('/users/me', async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const verify = jwt.verify(token, process.env.jwtSecret);
        const user_id = verify.user.id;
        const user = await User.findOne({ _id: user_id });
        return res.json({
            user,
            success: true
        }).status(200)
    } catch (error) {
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
            .json({
                message: 'Successfully logged out',
                success: true
            })
    } catch (error) {
        res.json({
            error: error,
            message: 'There was a Problem with our Servers',
            success: false
        }).status(500)
    }
});

router.get('/verify', authorize, async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        res.json({
            error: error,
            message: 'There was a Problem with our Servers',
            success: false
        }).status(500)
    }
});

router.get('/confirmation/:token', async (req, res) => {
    try {
        //check if token is same as -id from server
        const userId = req.params.token
        const user = await User.findById( userId );
        await User.updateOne({ _id: user}, {active: true});
    } catch (e) {
        res.send('error');
    }

    const in15Secs = new Date(new Date().getTime() + 15 * 1000);
    return res
            .cookie('confirmMessage', 'Your Email is now confirmed, you can log in now',{
                expires: in15Secs
            })
            .redirect('http://localhost:3001/login');
});

router.put('/reset-password', async (req, res) => {
    const { email } = req.body;
    try {
        const lowerEmail = email.toLowerCase();
        const user = await User.findOne({email: lowerEmail})
        if (!user) {
            return res.json({
                message: 'User with this email does not exist',
                success: false
            }).status(401)
        }
        const token = jwt.sign({_id: user._id},process.env.resetSecret, {expiresIn: '30min'});
        transporter.sendMail({
            to: lowerEmail,
            from: 'jonashiltl2003@gmail.com',
            subject: 'Reset your Password',
            html: `
                <p>Please click on the given link to reset your password</p> 
                <a href=http://localhost:3001/reset-password/confirm/${token}>Reset your Password here</a>`
        });
        return user.updateOne({resetLink: token}, function (error, success) { 
            if(error) {
                return res.json({
                    message: 'Error sending the Email',
                    success: false
                })
            } else {
                res.json({
                    message: 'Email has been sent',
                    success: true
                }).status(200)}
            })
    } catch (error) {
        res.json({
            error: error,
            message: 'There was a Problem with our Servers',
            success: false
        }).status(500)
    }
});

router.post('/reset-password/confirm', async (req, res) => {
    const { password, resetLink } = req.body
    try {
        if (!resetLink) {
            return res.json({
                message: 'Authentication error',
                success: false
            }).status(401)
        }
        jwt.verify(resetLink, process.env.resetSecret, function (error, decodedUser) {
            if (error) {
                return res.json({
                    message: 'Incorrect token or is expired. Please request a new Email',
                    success: false
                }).status(401)
            }
            User.findOne({resetLink}, async (error, user) => {
                if(error || !user) {
                    return res.json({
                        message: 'User with this token does not exist',
                        success: false
                    }).status(401)
                }
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const bcryptPassword = await bcrypt.hash (password, salt);
                await User.updateOne({ _id: user._id}, {password: bcryptPassword});
                return res.json({
                    message: 'Your password has been changed',
                    success: true
                }).status(200)
            })
        })
    } catch (error) {
        res.json({
            error: error,
            message: 'There was a Problem with our Servers',
            success: false
        }).status(500)
    }
});

module.exports = router