const { addAsset, transferAsset, getAsset } = require('./asset');
const utils = require('./utils');

module.exports = {
    performTransaction: (transactionProcessRequest, context, payload) => {
        const { Action, Data } = payload;
        console.log("action :" +Action);
        console.log("data :" +payload.Data );
        
        switch (Action) {
            case 'addAsset':
                return addAsset({ context, data: Data })
            case 'transferAsset':
                return transferAsset({ context, data: Data })
            case 'getAsset':
                return getAsset({ context, data: payload.Data})
            default:
                utils.toInvalidTransaction(`Action is not Valid ${JSON.stringify(payload)}`)
                break;
        }
    }
}