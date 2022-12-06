'use strict'

const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLError,
  GraphQLNonNull
} = require('graphql')
const name_type = require('../eosio_types/name_type.js')
const public_key_type = require('../eosio_types/public_key_type.js')
const authorizing_account_type = require('../graphql_object_types/authorizing_account_type.js')

const authorized_accounts_type = new GraphQLObjectType({
  name: 'authorized_accounts_type',
  fields: () => ({
    account_name: {
      type: name_type
    },
    permission_name: {
      type: name_type
    },
    authorizing_key: {
      type: public_key_type
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
      type: new GraphQLList(new GraphQLNonNull(name_type))
    },
    keys: {
      type: new GraphQLList(new GraphQLNonNull(public_key_type))
    }
  },
  async resolve(
    _,
    { accounts = [], keys = [] },
    { smartql_rpc: { fetch, rpc_url } }
  ) {
    const uri = `${rpc_url}/v1/chain/get_accounts_by_authorizers`
    const data = await fetch(uri, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        keys: await Promise.all(keys),
        accounts,
        json: true
      })
    }).then(req => req.json())

    if (data.error) throw new GraphQLError(data.message, { extensions: data })
    return data
  }
}

module.exports = accounts_by_authorizers
