const express = require('express');
const { v4: uuidv4 } = require('uuid');
require('dotenv/config');
const User = require('../models/User')
const fabricUser = require('../fabricUser');

const router = express.Router();

//need to save the information off-chain in postgres
// use CORS package to whitelist domains for security
router.post('/register', async (req, res) => {

    //check if UUID already exists
    let UUID = uuidv4();
    const UUIDExists = await User.exists({ _id: UUID });
    if (UUIDExists) {
        UUID = uuidv4()
    };

    //check if firstName is empty
    if (!req.body.firstName) {
        res.end({
            success:false,
            message: 'First name cannot be blank'
        })
    }

    //check if lastName is empty
    if (!req.body.lastName) {
        res.end({
            success:false,
            message: 'Last name cannot be blank'
        })
    }

    //check if email already exists
    const anyEmail = req.body.email;
    const email = anyEmail.toLowerCase();
    const emailExists = await User.exists({ email: email });
    if (emailExists) {
        res.send({
            message: 'This email is already registered',
            success: false,
            status: 409
        })
        return;
    };

    const user = new User({
        _id: UUID,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: email,
        password: req.body.password
    });

    try{
        let fabricRes = await fabricUser.Enroll(UUID);

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
    var email = req.body.email;
    var password = req.body.password
    try{

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        
    } catch (error)  {

    }
});

module.exports = router