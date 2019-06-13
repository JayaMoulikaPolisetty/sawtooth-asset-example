const utils = require('./utils');
const cbor = require('cbor')

module.exports = {
    addAsset : async ({ context, data }) => {
        const { assetId, assetQuantity, assetPrice,userId } = data;
       
        const assetAddress = utils.assetAddress(userId,assetId);
       
        
        console.log("assetAddress: " +assetAddress);
        
        const possibleAddressValues = await context.getState([assetAddress]).catch(utils.toInvalidTransaction);
        console.log("possible address values" +possibleAddressValues)
        let stateValueRep = possibleAddressValues[assetAddress]
        let stateValue
        console.log("statevalue length" +stateValueRep.length);
        console.log("statevalue : "+stateValueRep);
        
        if(stateValueRep && stateValueRep.length)
        {
            stateValue = cbor.decode(stateValueRep)
            console.log("stateValue after decoding : " +stateValue.assetQuantity);
            
            if(stateValue.assetId === data.assetId)
            {
                console.log("Existing asset Quantity : "+stateValue.assetQuantity);
                
                stateValue.assetQuantity = parseInt(stateValue.assetQuantity)+parseInt(assetQuantity)

                console.log("after adding asset Quantity : "+stateValue.assetQuantity);
            }else{
                stateValue = data
            }
        }else{
            
            stateValue = data
            console.log("stateValue sending to blockchain: "+stateValue);
            
        }
            
        return utils.setEntry(context, assetAddress, stateValue).catch(console.error);
        },

    transferAsset : async ({ context, data}) => {
        const { assetId, assetQuantity,userId, receiver } = data;
       
        const senderAddress = utils.assetAddress(userId, assetId);
        console.log( "sender Address: "+senderAddress);
        
        const receiverAddress =  utils.assetAddress(receiver, assetId)
        console.log("receiver Address : "+receiverAddress);
        
        //const assetAddress = utils.userAddress(assetId)
        const possibleAddressValues = await context.getState([senderAddress]).catch(utils.toInvalidTransaction);
        console.log("possible address values" +possibleAddressValues);
        
        let stateValueRep = possibleAddressValues[senderAddress]
        let stateValue
        let transferringAsset
        if(stateValueRep && stateValueRep.length)
        {
            stateValue = cbor.decode(stateValueRep)
            console.log("state value: "+stateValue);
            
            if(parseInt(stateValue.assetQuantity) >= parseInt(data.assetQuantity))
            {
                
                stateValue.assetQuantity = parseInt(stateValue.assetQuantity) - parseInt(data.assetQuantity);
                transferringAsset = data
                transferringAsset.assetPrice = stateValue.assetPrice
                transferringAsset.userId = receiver
            }
            else{
                throw new toInvalidTransaction("Asset quantity is not enough to transfer")
            }
        }
        else{
            throw new toInvalidTransaction("Asset not found")
        }

         utils.setEntry(context, receiverAddress, transferringAsset).catch(console.error)
        
        
        return utils.setEntry(context, senderAddress, stateValue).catch(console.error);

    },

}
