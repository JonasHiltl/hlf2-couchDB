'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');

const channelName = 'mychannel';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, '..', 'wallet');
const ccpPath = path.resolve(__dirname, '..',  'connection-org1.yaml');

console.log(ccpPathv2)