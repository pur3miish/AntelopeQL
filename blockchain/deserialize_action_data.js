'use strict'

const { GraphQLString, GraphQLNonNull, GraphQLError } = require('graphql')
const bytes_type = require('../eosio_types/bytes_type.js')
const name_type = require('../eosio_types/name_type.js')

const deserialize_action_data = {
  description: 'Returns a JSON object containing deserialized action data.',
  type: GraphQLString,
  args: {
    code: {
      description: 'Account name that holds the EOSIO smart contract.',
      type: new GraphQLNonNull(name_type)
    },
    action: {
      description: 'Action name on the EOSIO smart contract.',
      type: new GraphQLNonNull(name_type)
    },
    binargs: {
      description: 'Serialized action data.',
      type: new GraphQLNonNull(bytes_type)
    }
  },
  async resolve(_, args, { smartql_rpc: { fetch, rpc_url } }) {
    const uri = `${rpc_url}/v1/chain/abi_bin_to_json`
    const req = await fetch(uri, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        ...args,
        json: true
      })
    })

    const data = await req.json()

    if (data.error) throw new GraphQLError(data.message, { extensions: data })
    return JSON.stringify(data.args)
  }
}

module.exports = deserialize_action_data
