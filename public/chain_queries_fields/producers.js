'use strict'

const {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const get_producers = require('../network/get_producers.js')

const producer_list_type = new GraphQLObjectType({
  name: 'producer_list_type',
  fields: () => ({
    owner: {
      type: GraphQLString
    },
    total_votes: {
      type: GraphQLString
    },
    producer_key: {
      type: new GraphQLList(GraphQLString)
    },
    is_active: {
      type: GraphQLInt
    },
    url: {
      type: GraphQLString
    },
    unpaid_blocks: {
      type: new GraphQLList(GraphQLInt)
    },
    last_claim_time: {
      type: new GraphQLList(GraphQLString)
    },
    location: {
      type: new GraphQLList(GraphQLString)
    }
  })
})

const producers_type = new GraphQLObjectType({
  name: 'producers_type',
  fields: () => ({
    total_producer_vote_weight: {
      type: GraphQLString
    },
    more: {
      type: GraphQLString
    },
    rows: {
      type: new GraphQLList(producer_list_type)
    }
  })
})

const producers = {
  description: 'Retrieve the list of block producers.',
  type: producers_type,
  args: {
    limit: {
      type: GraphQLInt,
      defaultValue: 5
    },
    lower_bound: {
      type: GraphQLString,
      defaultValue: ''
    }
  },
  async resolve(_, args, { rpc_url }) {
    return get_producers({ rpc_url, ...args })
  }
}
module.exports = producers
