'use strict'

const {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = require('graphql')

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
      type: GraphQLString
    }
  })
})

const packed_transaction_type = new GraphQLObjectType({
  name: 'packed_transaction',
  description: 'Packed transaction, chain ID and transaction header',
  fields: () => ({
    chain_id: {
      type: GraphQLString,
      description: 'Chain id'
    },
    transaction_header: {
      type: GraphQLString,
      description: 'Transaction header for TaPos'
    },
    transaction_body: {
      type: GraphQLString,
      description: 'Packed transaction data'
    }
  })
})

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
      resolve: ({ processed }) => processed.producer_block_id
    },
    resource_cost: {
      description:
        'A resource object for the network cost of running the transaction',
      type: bandwidth_cost_type,
      resolve: ({ processed }) => processed.receipt
    },
    elapsed: {
      type: GraphQLInt,
      resolve: ({ processed }) => processed.elapsed
    },
    net_usage: {
      type: GraphQLInt,
      resolve: ({ processed }) => processed.net_usage
    },
    scheduled: {
      type: GraphQLBoolean,
      resolve: ({ processed }) => processed.scheduled
    },
    action_traces: {
      description: 'A JSON string for the transaction action trace.',
      type: GraphQLString,
      resolve: ({ processed }) => JSON.stringify(processed.action_traces)
    }
  })
})

module.exports = {
  transaction_receipt_type,
  bandwidth_cost_type,
  packed_transaction_type
}
