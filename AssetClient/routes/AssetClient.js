const { createHash } = require('crypto')
const { CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const fetch = require('node-fetch');
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const cbor = require('cbor');
const sjcl = require('sjcl')
const request = require('request')
const STORAGE_KEY = 'asset_track.encryptedKey'
let STORAGE_USER = 'asset_track.user'
const localStorage = require('localStorage')
const env = require('../env');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
let dbo;
let encryptedKey = null


MongoClient.connect(url, function (err, db) {
    dbo = db.db("myblockchaindb");
    console.log(" Database Connected");

})
const context = createContext('secp256k1')
let signerPublicKey = null;
let signer = null;
let privateKey = null;
let publicKey = null;
let user= null;
let privKey = null;


function hash(v) {
    return createHash('sha512').update(v).digest('hex');
}

class AssetClient {
    constructor(userDetails) {

        // encryptedKey = localStorage.getItem(STORAGE_KEY)
        // if(encryptedKey != undefined || encryptedKey != null){
        // privateKey = sjcl.decrypt(userDetails.userId, encryptedKey);
        //         console.log("privateKey after decryption : " + privateKey);
           
        //     privKey = Secp256k1PrivateKey.fromHex(privateKey);
        //     console.log("privkey : " + JSON.stringify(privKey));
        //     res.signer = new CryptoFactory(context).newSigner(privKey);
        //     res.publicKey = res.signer.getPublicKey().asHex();
        //     console.log("this public key " + res.publicKey);
        //     res.address = env.family.prefix;

        //     localStorage.setItem(STORAGE_KEY , res.encryptedKey)
        //     localStorage.setItem(STORAGE_USER, userDetails.userId)   
       
    }
        //  var resultPromise = this.getUserPriKey(userDetails.userId)
        // console.log("user details ID " +userDetails.userId);
        //     //privateKey =  this.getUserPriKey(userDetails.userId);

        //     resultPromise.then(function(result){

        //     })


   

    //     console.log("encryptedKey " +res.encryptedKey);

    //     if(res.encryptedKey != undefined)
    //     {
    //         privateKey = sjcl.decrypt(userDetails.userId,  res.encryptedKey);
    //         console.log("privateKey after decryption : "+privateKey);
    //     }
    //     privKey = Secp256k1PrivateKey.fromHex(privateKey);
    // this.signer = new CryptoFactory(context).newSigner(privKey);

    // this.publicKey = this.signer.getPublicKey().asHex();
    // console.log("this public key " + this.publicKey);

    // this.address = env.family.prefix; 
    // var keys = this.generateKeys();
    //     privateKey = keys.privateKey;
    //     this.publicKey = keys.publicKey;

    //     const encryptedKey = sjcl.encrypt(userDetails.userId, privateKey.asHex())
    //     //localStorage.setItem(STORAGE_KEY, encryptedKey)

    //     var obj = {userId : userDetails.userId, encryptedKey : encryptedKey}
    //     dbo.collection("keystorage").insertOne(obj, function(err, res) {
    //         if(err)throw err;
    //         console.log("EcryptedKey stored in database  for user " +userDetails.userId);



    // privateKey = this.getUserPriKey(userDetails.userId, userDetails.password);
    // console.log("privateKey " +privateKey);

    // if(privateKey != null){
    // console.log("Executing this part");
    // privKey = Secp256k1PrivateKey.fromHex(privateKey);
    // this.signer = new CryptoFactory(context).newSigner(privKey);

    // this.publicKey = this.signer.getPublicKey().asHex();
    // console.log("this public key " + this.publicKey);

    // this.address = env.family.prefix;
    // }
    // else{
    //     var keys = this.generateKeys();
    //     privateKey = keys.privateKey;
    //     this.publicKey = keys.publicKey;

    //     const encryptedKey = sjcl.encrypt(userDetails.userId, privateKey.asHex())
    //     //localStorage.setItem(STORAGE_KEY, encryptedKey)

    //     var obj = {userId : userDetails.userId, encryptedKey : encryptedKey}
    //     dbo.collection("keystorage").insertOne(obj, function(err, res) {
    //         if(err)throw err;
    //         console.log("EcryptedKey stored in database  for user " +userDetails.userId);

    //     })


    // }

    //  data(userDetails){
    //    dbo.collection("keystorage").findOne({ userId: userDetails.userId }, function (err, res) {
    //         if (err) throw err;
    //         return res;
    // })
    // }

     login(userDetails){
        dbo.collection("keystorage").findOne({ userId: userDetails.userId }, function (err, res) {
            if (err) throw err;
        if(res != null || res!=undefined){
            privateKey = sjcl.decrypt(userDetails.userId, res.encryptedKey);
            console.log("privateKey after decryption : " + privateKey);
                   
                    privKey = Secp256k1PrivateKey.fromHex(privateKey);
                    console.log("privkey : " + JSON.stringify(privKey));
                    res.signer = new CryptoFactory(context).newSigner(privKey);
                    res.publicKey = res.signer.getPublicKey().asHex();
                    console.log("this public key " + res.publicKey);
                    res.address = env.family.prefix;
        
                    localStorage.setItem(STORAGE_KEY , res.encryptedKey)            
                    localStorage.setItem(STORAGE_USER, userDetails.userId) 
                    return true;           
        }
       else{

       }
    })
    }



   

    //        if (res.encryptedKey != undefined && res.encryptedKey != null) {
    //             privateKey = sjcl.decrypt(userDetails.userId, res.encryptedKey);
    //             console.log("privateKey after decryption : " + privateKey);
           
    //         privKey = Secp256k1PrivateKey.fromHex(privateKey);
    //         console.log("privkey : " + JSON.stringify(privKey));
    //         res.signer = new CryptoFactory(context).newSigner(privKey);
    //         res.publicKey = res.signer.getPublicKey().asHex();
    //         console.log("this public key " + res.publicKey);
    //         res.address = env.family.prefix;

    //         localStorage.setItem(STORAGE_KEY , res.encryptedKey)
    //         localStorage.setItem(STORAGE_USER, userDetails.userId)
    //         return true;
    //        }
           
    //        else {
    //           return false;
    //        }
    //     }
    // }

    // getUserPriKey(userId) {
    //     return new Promise(function (resolve, reject) {
    //         dbo.collection('keystorage').findOne({ userId: userId }, function (res) {
    //             privateKey = sjcl.decrypt(userId, res.encryptedKey)
    //             console.log("privateKey after decryption : " + privateKey);
    //             //privKey = Secp256k1PrivateKey.fromHex(privateKey);

    //             privKey = Secp256k1PrivateKey.fromHex(privateKey);
    //             console.log("buffered privKey: " + privKey);

    //             this.signer = new CryptoFactory(context).newSigner(privKey);

    //             this.publicKey = this.signer.getPublicKey().asHex();
    //             console.log("this public key " + this.publicKey);

    //             this.address = env.family.prefix;
    //         })
    //     })
    // }

    generateKeys() {

        privateKey = context.newRandomPrivateKey()
        publicKey = context.getPublicKey(privateKey).asHex()
        return {
            privateKey, publicKey
        }

    }

    async getDetails(user){
        console.log("userId" +user);
        return new Promise((resolve,reject) => { dbo.collection('keystorage').findOne({userId: user},function(err,res){
            if(err)throw err;

            //console.log("res" +res.userId);
           resolve(res)
        })
    });
    }



    signup(userDetails) {
        var keys = this.generateKeys();
        privateKey = keys.privateKey;
        this.publicKey = keys.publicKey;

        const encryptedKey = sjcl.encrypt(userDetails.userId, privateKey.asHex())

        dbo.collection('keystorage').insertOne({ userId: userDetails.userId, encryptedKey: encryptedKey }, function (err, res) {
            if (err) throw err;
            else {
                return true;
            }
        })
    }

    addAsset(asset) {
        this._wrap_and_send("addAsset", [asset])
    }

    transferAsset(asset){
        console.log(asset);
        
        this._wrap_and_send('transferAsset', [asset])
        
    }

    _wrap_and_send(action, values) {
        const address = env.family.prefix;
        console.log("wrapping for: " + address);
        console.log("action :" + action);
        console.log(values[0]);

        var payload = "";
        var Action = action;
        encryptedKey = localStorage.getItem(STORAGE_KEY)
        console.log("ecnryptedKey while adding : "+encryptedKey);
        user = localStorage.getItem(STORAGE_USER)
        console.log("user : "+user);
        
        privateKey = sjcl.decrypt(user, encryptedKey)
        privKey = Secp256k1PrivateKey.fromHex(privateKey);
        signer =new CryptoFactory(context).newSigner(privKey);
        console.log("signer: " +signer);
        
       

        payload = { "Action": Action, "Data": JSON.parse(JSON.stringify(values[0])) };
        console.log(' payload : ' + payload);
        console.log("payload action " + payload.Action);

        console.log("payload dAta: " + payload.Data);

        var inputAddressList = env.familyAddress;
        var outputAddressList = env.familyAddress;
        const payloadBytes = cbor.encode(JSON.stringify(payload));
        const transactionHeaderBytes = protobuf.TransactionHeader.encode({
            familyName: env.family.name,
            familyVersion: env.family.version,
            inputs: inputAddressList,
            outputs: outputAddressList,
            signerPublicKey: signer.getPublicKey().asHex(),
            nonce: "" + Math.random(),
            batcherPublicKey: signer.getPublicKey().asHex(),
            dependencies: [],
            payloadSha512: hash(payloadBytes),
        }).finish();
        const transaction = protobuf.Transaction.create({
            header: transactionHeaderBytes,
            headerSignature: signer.sign(transactionHeaderBytes),
            payload: payloadBytes
        });
        const transactions = [transaction];
        const batchHeaderBytes = protobuf.BatchHeader.encode({
            signerPublicKey: signer.getPublicKey().asHex(),
            transactionIds: transactions.map((txn) => txn.headerSignature),
        }).finish();
        const batchSignature = signer.sign(batchHeaderBytes);
        const batch = protobuf.Batch.create({
            header: batchHeaderBytes,
            headerSignature: batchSignature,
            transactions: transactions,
        });

        const batchListBytes = protobuf.BatchList.encode({
            batches: [batch]
        }).finish();
        this._send_to_rest_api(batchListBytes);
    }

    _send_to_rest_api(batchListBytes) {
        if (batchListBytes == null) {
            var geturl = 'http://rest-api:8008/state/' + this.address
            console.log("Getting from: " + geturl);
            return fetch(geturl, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    var data = responseJson.data;
                    return data;
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        else {
            console.log("posting data ");
            console.log("public key" + this.publicKey);

            request.post({
                url: 'http://localhost:8008/batches',
                body: batchListBytes,
                headers: { 'Content-Type': 'application/octet-stream' }
            }, (err, response) => {
                if (err) return console.log(err)

                console.log(response.body)

            })
        }
    }

}

module.exports.AssetClient = AssetClient