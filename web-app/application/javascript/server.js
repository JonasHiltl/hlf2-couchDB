'use strict';
require("dotenv").config();

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Setting for Hyperledger Fabric
const { Wallets, FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const channelName = 'mychannel';
const mspOrg1 = 'Org1MSP';
const adminName = process.env.adminName;
const walletPath = path.join(__dirname, '..', 'wallet');
const ccpPath = path.resolve(__dirname, '..', 'connection-org1.json');

//need to save the information off-chain in postgres
// either create UUID in react or generate it in server and also save the information in postgres in the same register function
app.post('/api/register', async function (req, res) {
    var UUID = req.body.UUID
    // var firstName = req.body.firstName;
    // var lastName = req.body.lastName;
    // var username = firstName + ' ' + lastName;
    // console.log('Your username is ' + username)
    // var email = req.body.email;
    // console.log('Your email is ' + email)
    // var password = req.body.password
    try{

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userIdentity = await wallet.get(UUID)
        if (userIdentity) {
            console.log('An Identity for this "UUID" already exists in the wallet')
            var response = {
                success: false,
                message: 'You already registered successfully'
            };
            return response
        }

        const adminIdentity = await wallet.get(adminName)

    } catch (error)  {

    }
});

app.post('/api/login', async function (req, res) {
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

app.listen(3000, ()=>{
    console.log("***********************************");
    console.log("API server listening at localhost:3000");
    console.log("***********************************");
  });