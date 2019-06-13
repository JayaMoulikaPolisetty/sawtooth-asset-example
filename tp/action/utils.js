const env = require('./../env');
const crypto = require('crypto')

const {
    InvalidTransaction,
    InternalError
} = require('sawtooth-sdk/processor/exceptions')
const cbor = require('cbor');

const _hash = (x, len = -62) =>
    crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0,len)

module.exports = {
    userAddress: (name) => `${env.family.prefix}${_hash(name, 64)}`,

    assetAddress: (name, asset) => `${env.family.prefix}${_hash(name, 32)}${_hash(asset, 32)}`,

    toInternalError: (err) => {
        let message = (err.message) ? err.message : err
        throw new InternalError(message)
    },
    toInvalidTransaction: (err) => {
        let message = (err.message) ? err.message : err
        throw new InvalidTransaction(message)
    },
    setEntry: (context, address, stateValue) => {
        let dataBytes = cbor.encode(stateValue)
        let entries = {
            [address]: dataBytes 
        }
        return context.setState(entries)
    }










}