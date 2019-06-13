const { createHash } = require('crypto')
const { CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const fetch = require('node-fetch');
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const cbor = require('cbor');
const request = require('request')
const env = require('../env');
const context = createContext('secp256k1')
let privateKey = null

function hash(v) {
    return createHash('sha512').update(v).digest('hex');
}

class SimpleClient {
    
    // constructor(){
    //     const context = createContext('secp256k1')
    //     const privateKey = context.newRandomPrivateKey()
    //     console.log("Private key: " + privateKey);
        
    //     this.signer = new CryptoFactory(context).newSigner(privateKey)
    //     console.log("Signer" + this.signer);
        
    //     this.publicKey = this.signer.getPublicKey().asHex();
    //     console.log("public key: "+this.publicKey);
        
    //     this.address = env.family.prefix;
    // }

    constructor(userDetails) {
        const privateKeyStrBuf = this.getUserPriKey(userDetails);
        const privateKeyStr = privateKeyStrBuf.toString().trim();
        const context = createContext('secp256k1');
        const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);
        this.signer = new CryptoFactory(context).newSigner(privateKey);
        this.publicKey = this.signer.getPublicKey().asHex();
        this.address = env.family.prefix
        console.log("Storing at: " + this.address);
    }
    
    login(userDetails){

        var privateKey = generateKeys().privateKey;
        var publicKey = generateKeys().publicKey;

        const encryptedKey = sjcl.encrypt(userDetails.userId, userDetails.password, privateKey.asHex())
        return { encryptedKey , publicKey };

    }

    generateKeys(){
      
        return {
            privateKey = context.newRandomPrivateKey(),
            publicKey = this.signer.getPublicKey().asHex()
        }

    }

   
    deposit(asset){
        this._wrap_and_send("addAsset", [asset])
    }

    transferAsset(asset)
    {
        this._wrap_and_send("transferAsset", [asset])
    }

    submit(payload) {
        this._wrap_and_send(payload)
    }

    getUserPriKey(userDetails) {
        console.log(userDetails);
        console.log("Current working directory is: " + process.cwd());
        const encryptedKey = window.localStorage.getItem(STORAGE_KEY)
        privateKey = sjcl.decrypt(userDetails.userId, userDetails.password, encryptedKey);
        return privateKey;
    }

    getUserPubKey(userid) {
        console.log(userid);
        console.log("Current working directory is: " + process.cwd());
        var userpubkeyfile = '/root/.sawtooth/keys/' + userid + '.pub';
        return fs.readFileSync(userpubkeyfile);
    }

    _wrap_and_send(action, values) {
        const address = this.address;
        console.log("wrapping for: " + address);
        console.log("action :" +action);
        console.log(values[0]);
        
        var payload = "";
        var Action = action;
        
        payload = { "Action" : Action, "Data" : JSON.parse(JSON.stringify(values[0])) };
        console.log(' payload : '+payload);
        console.log("payload action "+payload.Action);
        
        console.log("payload dAta: " +payload.Data);
        
        var inputAddressList = env.familyAddress ;
        var outputAddressList = env.familyAddress;
        const payloadBytes = cbor.encode(JSON.stringify(payload));
        const transactionHeaderBytes = protobuf.TransactionHeader.encode({
            familyName: env.family.name,
            familyVersion: env.family.version,
            inputs: inputAddressList,
            outputs: outputAddressList,
            signerPublicKey: this.signer.getPublicKey().asHex(),
            nonce: "" + Math.random(),
            batcherPublicKey: this.signer.getPublicKey().asHex(),
            dependencies: [],
            payloadSha512: hash(payloadBytes),
        }).finish();
        const transaction = protobuf.Transaction.create({
            header: transactionHeaderBytes,
            headerSignature: this.signer.sign(transactionHeaderBytes),
            payload: payloadBytes
        });
        const transactions = [transaction];
        const batchHeaderBytes = protobuf.BatchHeader.encode({
            signerPublicKey: this.signer.getPublicKey().asHex(),
            transactionIds: transactions.map((txn) => txn.headerSignature),
        }).finish();
        const batchSignature = this.signer.sign(batchHeaderBytes);
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
            console.log("public key" +this.publicKey);
            
            request.post({
                url: 'http://localhost:8008/batches',
                body: batchListBytes,
                headers: { 'Content-Type': 'application/octet-stream' }
              }, (err, response) => {
                if (err) return  console.log(err)
                                
                console.log(response.body)

              })
        }
    }
}
module.exports.SimpleClient =  SimpleClient;