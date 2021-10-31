'use strict'

const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
  GraphQLID
} = require('graphql')
const bandwidth_cost_type = require('./bandwidth_cost_type.js')

/**
 * @kind typedef
 * @name transaction_receipt
 * @type {object}
 * @prop {string} transaction_id ID of the transaction.
 * @prop {number} block_num Block number where teh transaction can be found.
 * @prop {stiring} block_time The time of the transaction.
 * @prop {string} producer_block_id The block producer ID that processed the transaction.
 * @prop {bandwidth_cost} resource_cost Network cost for the transaction.
 * @prop {bool} scheduled Scheduled transactions are executed at a later time.
 */
const transaction_receipt_type = new GraphQLObjectType({
  name: 'transaction_receipt',
  description: 'Receipt for the action (mutation) for a blockchain transaction',
  fields: () => ({
    transaction_id: {
      type: GraphQLID,
      description: 'EOSIO blockchain transaction id “reciept”'
    },
    block_num: {
      type: GraphQLInt,
      description: 'What block the transaction is located in',
      resolve: ({ processed }) => processed.block_num
    },
    block_time: {
      type: GraphQLString,
      description: 'transaction time (GMT)',
      resolve: ({ processed }) => processed.block_time
    },
    producer_block_id: {
      type: GraphQLString,
      description: 'Block producer ID that processed the transaction.',
      resolve: ({ processed }) => processed.producer_block_id
    },
    resource_cost: {
      description:
        'A resource object for the network cost of running the transaction',
      type: bandwidth_cost_type,
      resolve: ({ processed }) => processed.receipt
    },
    scheduled: {
      type: GraphQLBoolean,
      description: 'Scheduled transactions are executed at a later time.',
      resolve: ({ processed }) => processed.scheduled
    },
    action_traces: {
      description:
        'A JSON string trace of the actions performed for the transaction.',
      type: GraphQLString,
      resolve: ({ processed }) => JSON.stringify(processed.action_traces)
    }
  })
})

module.exports = transaction_receipt_type
