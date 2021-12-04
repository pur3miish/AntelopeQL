'use strict'

const {
  GraphQLError,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const fetch = require('isomorphic-fetch')
const authorization_type = require('../build_mutation_fields/types/authorization_type.js')
const name_type = require('../eosio_types/name_type.js')
const public_key_type = require('../eosio_types/public_key_type')

const authorizing_account_type = new GraphQLObjectType({
  name: 'authorizing_account_type',
  fields: () => ({
    actor: {
      type: new GraphQLNonNull(GraphQLString)
    },
    permission: {
      type: GraphQLString
    }
  })
})

const authorized_accounts_type = new GraphQLObjectType({
  name: 'authorized_accounts_type',
  fields: () => ({
    account_name: {
      type: GraphQLString
    },
    permission_name: {
      type: GraphQLString
    },
    authorizing_key: {
      type: GraphQLString
    },
    authorizing_account: {
      type: authorizing_account_type
    },
    weight: {
      type: GraphQLString
    },
    threshold: {
      type: GraphQLString
    }
  })
})

const accounts_by_authorizers_type = new GraphQLObjectType({
  name: 'accounts_by_authorizers',
  fields: () => ({
    accounts: {
      type: new GraphQLList(authorized_accounts_type)
    }
  })
})

const accounts_by_authorizers = {
  description:
    'Fetch permissions authorities that are, in part or whole, satisfiable.',
  type: accounts_by_authorizers_type,
  args: {
    accounts: {
      type: new GraphQLList(name_type)
    },
    authorization: {
      type: new GraphQLList(authorization_type)
    },
    keys: {
      type: new GraphQLList(public_key_type)
    }
  },
  async resolve(_, { accounts = [], keys, authorization = [] }, { rpc_url }) {
    const req = await fetch(rpc_url + '/v1/chain/get_accounts_by_authorizers', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        keys,
        accounts: [...accounts, ...authorization]
      })
    })

    const { error, ...data } = await req.json()
    if (error && error.details) throw new GraphQLError(JSON.stringify(error))

    return data
  }
}

module.exports = accounts_by_authorizers
