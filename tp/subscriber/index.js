/**
 * Copyright 2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ----------------------------------------------------------------------------
 */
'use strict'

const _ = require('lodash')
const { Stream } = require('sawtooth-sdk/messaging/stream')
const config = require('../env')

const {
  Message,
  EventList,
  EventSubscription,
  EventFilter,
  StateChangeList,
  ClientEventsSubscribeRequest,
  ClientEventsSubscribeResponse
} = require('sawtooth-sdk/protobuf')


const PREFIX = config.family.prefix;
const NULL_BLOCK_ID = '0000000000000000'
const VALIDATOR_URL = config.validatorUrl
const stream = new Stream(VALIDATOR_URL)

const getBlockInfo = blockId => {
    return new Promise((resolve, reject) => {
      request({
        uri: `${config.restApiUrl}/blocks/${blockId}`,
        method: 'GET',
      }, (err, response, result) => {
        if (err) return reject(err);
        resolve(JSON.parse(result));
      });
    });
  }

// Parse Block Commit Event
const getBlock = events => {
  const block = _.chain(events)
    .find(e => e.eventType === 'sawtooth/block-commit')
    .get('attributes')
    .map(a => [a.key, a.value])
    .fromPairs()
    .value()

  return {
    blockNum: parseInt(block.block_num),
    blockId: block.block_id,
    stateRootHash: block.state_root_hash
  }
}

// Parse State Delta Event
const getChanges = events => {
  const event = events.find(e => {
    return e.eventType === 'sawtooth/state-delta'
  })

  if (!event) return []

  const changeList = StateChangeList.decode(event.data)
  return changeList.stateChanges
    .filter((change) => {
      return change.address.slice(0, 6) === PREFIX
    })
}

// Handle event message received by stream
const handleEvent = msg => {
    if (msg.messageType === Message.MessageType.CLIENT_EVENTS) {
        const events = EventList.decode(msg.content).events
        getBlockInfo(getBlock(events).blockId).then(response => {
          let txid = response.data.batches[0].header.transaction_ids[0];
          console.log(getChanges(events));
          console.log(getBlock(events));
          const obj = {
            transactionId: txid,
            blockId: getBlock(events).blockId,
            data: getChanges(events).data,
            stateAddress: getChanges(events).stateAddress
          }
          if (obj.data != undefined) {
            console.log(obj)
    
            let jsonObject = JSON.parse(obj.data)
            console.log(jsonObject);
            
            // if (jsonObject.createIdentity) {
            //   // update database
            //   // delete obj["data"]
            //   identityKeyController.updateIdentityKeyDetails(jsonObject._id, { blockchain_id: obj })
            //   // console.log("update database.....")
            // } else {
            //   kafka.sendMessageToKafkaServer(obj);
            //   console.log("sent to kafka")
            //   // if (getChanges(events).action == "create") {
            //   //   graph.createNode(obj.data)
            //   // }
            //   // else if(getChanges(events).action == "transfer") {
            //   //   graph.createRelationship(obj.data)
            //   // }
            // }
          }
        }).catch(err => {
          console.log(err)
        })
        //console.log(events)
        // console.log(getBlock(events));
        // console.log(getChanges(events));
      } else {
        console.warn('Received message of unknown type:', msg.messageType)
      }
}

// Send delta event subscription request to validator
const subscribe = () => {
  const blockSub = EventSubscription.create({
    eventType: 'sawtooth/block-commit'
  })
  const deltaSub = EventSubscription.create({
    eventType: 'sawtooth/state-delta',
    filters: [EventFilter.create({
      key: 'address',
      matchString: `^${PREFIX}.*`,
      filterType: EventFilter.FilterType.REGEX_ANY
    })]
  })

  return stream.send(
    Message.MessageType.CLIENT_EVENTS_SUBSCRIBE_REQUEST,
    ClientEventsSubscribeRequest.encode({
      lastKnownBlockIds: [NULL_BLOCK_ID],
      subscriptions: [blockSub, deltaSub]
    }).finish()
  )
    .then(response => ClientEventsSubscribeResponse.decode(response))
    .then(decoded => {
      const status = _.findKey(ClientEventsSubscribeResponse.Status,
                               val => val === decoded.status)
      if (status !== 'OK') {
        throw new Error(`Validator responded with status "${status}"`)
      }
    })
}

// Start stream and send delta event subscription request
const start = () => {
    console.log("Subscriber started");
    
  return new Promise(resolve => {
    stream.connect(() => {
      stream.onReceive(handleEvent)
      subscribe().then(resolve)
    })
  })
}

module.exports = {
  start
}
