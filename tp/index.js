const { TransactionProcessor } = require("sawtooth-sdk/processor")
const subscriber = require('./subscriber/index')
const Handler = require('./handler')
const transactionProcessor = new TransactionProcessor("tcp://localhost:4004")
transactionProcessor.addHandler(new Handler())
transactionProcessor.start()

subscriber.start();