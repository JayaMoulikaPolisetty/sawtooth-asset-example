const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')
const cbor = require('cbor')

const env = require('./env');
const { performTransaction } = require('./action');
const utils = require('./action/utils');

class Handler extends TransactionHandler {
    constructor(){
        super(env.family.name, [env.family.version], env.familyAddress)
    }

    apply(transactionProcessRequest, context) {
     
        let payload = JSON.parse(cbor.decode(transactionProcessRequest.payload))
            console.log(payload)
            return performTransaction(transactionProcessRequest, context, payload)
            .then(addresses => {
                if (addresses.length === 0) {
                    throw new InternalError('State Error!')
                }
                console.log(`Action Received ${JSON.stringify(payload)}`)
            })
            .catch (utils.toInvalidTransaction);
       
      }
}

module.exports = Handler