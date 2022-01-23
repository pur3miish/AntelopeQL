'use strict'

const { GraphQLObjectType, GraphQLInt, GraphQLEnumType } = require('graphql')

/**
 * @kind typedef
 * @name transaction_status
 * @type {enum}
 * @prop {string} executed succeed, no error handler executed.
 * @prop {string} soft_fail objectively failed (not executed), error handler executed.
 * @prop {string} hard_fail objectively failed and error handler objectively failed thus no state change.
 * @prop {string} delayed transaction delayed/deferred/scheduled for future execution.
 * @prop {string} expired transaction expired and storage space refunded to user.
 */
const transaction_status = new GraphQLEnumType({
  name: 'transaction_receipt_status',
  description: `Describes the status of the transaction.`,
  values: {
    executed: {
      value: 'executed',
      description: 'succeed, no error handler executed'
    },
    soft_fail: {
      value: 'soft_fail',
      description: 'objectively failed (not executed), error handler executed'
    },
    hard_fail: {
      value: 'hard_fail',
      description:
        'objectively failed and error handler objectively failed thus no state change'
    },
    delayed: {
      value: 'delayed',
      description: 'transaction delayed/deferred/scheduled for future execution'
    },
    expired: {
      value: 'expired',
      description: 'transaction expired and storage space refunded to user'
    }
  }
})

/**
 * Bandwidth reciept for EOSIO transaction.
 * @kind typedef
 * @name Bandwidth_cost
 * @prop {number} net_usage_words Consumption of network bandwidth (bytes).
 * @prop {number} cpu_usage_us Consumption of CPU bandwidth (µs).
 * @prop {Transaction_status} status Transaction receipt status Enum.
 */
const bandwidth_cost_type = new GraphQLObjectType({
  name: 'bandwidth_cost',
  fields: () => ({
    cpu_usage_us: {
      type: GraphQLInt,
      resolve: ({ cpu_usage_us }) => cpu_usage_us
    },
    net_usage_words: {
      type: GraphQLInt,
      resolve: ({ net_usage_words }) => net_usage_words
    },
    status: {
      type: transaction_status
    }
  })
})

module.exports = bandwidth_cost_type
