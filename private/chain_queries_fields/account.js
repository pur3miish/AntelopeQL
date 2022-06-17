'use strict'

const {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const asset_type = require('../eosio_types/asset_type.js')
const name_type = require('../eosio_types/name_type.js')
const public_key_type = require('../eosio_types/public_key_type.js')
const get_account = require('../network/get_account.js')

const resource_type = new GraphQLObjectType({
  name: 'resource_type',
  fields: () => ({
    owner: { type: name_type },
    net_weight: { type: GraphQLString },
    cpu_weight: { type: GraphQLString },
    ram_bytes: { type: GraphQLString }
  })
})

const bandwidth_type = new GraphQLObjectType({
  name: 'bandwith_type',
  fields: () => ({
    used: { type: GraphQLString },
    available: { type: GraphQLString },
    max: { type: GraphQLString }
  })
})

const EOS_key_type = new GraphQLObjectType({
  name: 'key_type',
  fields: () => ({
    key: { type: public_key_type },
    weight: { type: GraphQLInt }
  })
})

const require_auth_type = new GraphQLObjectType({
  name: 'require_auth_type',
  fields: () => ({
    threshold: { type: GraphQLInt },
    keys: { type: new GraphQLList(EOS_key_type) },
    accounts: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'accounts_auth_type',
          fields: () => ({
            weight: { type: GraphQLInt },
            permission: {
              type: new GraphQLObjectType({
                name: 'account_auth_permission_type',
                fields: () => ({
                  actor: { type: name_type },
                  permission: { type: name_type }
                })
              })
            }
          })
        })
      )
    },
    waits: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'account_auth_waits_type',
          description:
            'specifies that a transaction will not be executed without a required delay',
          fields: () => ({
            wait_sec: { type: GraphQLInt },
            weight: { type: GraphQLInt }
          })
        })
      )
    }
  })
})

const permission_type = new GraphQLObjectType({
  name: 'permission_type',
  description: 'EOS account permissions',
  fields: {
    perm_name: { type: name_type },
    parent: { type: name_type },
    required_auth: { type: require_auth_type }
  }
})

const account_type = new GraphQLObjectType({
  name: 'account_type',
  description: 'Returns details about a specific account on the blockchain',
  fields: () => ({
    account_name: {
      type: name_type
    },
    head_block_num: { type: GraphQLString },
    head_block_time: { type: GraphQLString },
    privileged: { type: GraphQLBoolean },
    last_code_update: { type: GraphQLString },
    created: { type: GraphQLString },
    core_liquid_balance: { type: asset_type },
    ram_quota: { type: GraphQLString },
    net_weight: { type: GraphQLString },
    cpu_weight: { type: GraphQLString },
    net_limit: { type: bandwidth_type },
    cpu_limit: { type: bandwidth_type },
    ram_usage: { type: GraphQLString },
    permissions: {
      description: 'List of the EOS `account_name` permissions',
      type: new GraphQLList(permission_type)
    },
    total_resources: {
      type: resource_type
    },
    self_delegated_bandwidth: {
      type: new GraphQLObjectType({
        name: 'self_delegated_badwidth',
        description: 'Lists the amount of bandwidth your account has delegated',
        fields: () => ({
          to: { type: name_type },
          from: { type: name_type },
          net_weight: { type: asset_type },
          cpu_weight: { type: asset_type }
        })
      })
    },
    refund_request: {
      type: new GraphQLObjectType({
        name: 'account_refund_request',
        description: '',
        fields: () => ({
          owner: { type: name_type },
          request_time: { type: GraphQLString },
          net_amount: { type: asset_type },
          cpu_amount: { type: asset_type }
        })
      })
    },
    voter_info: {
      type: new GraphQLObjectType({
        name: 'voter_info_type',
        fields: () => ({
          owner: { type: GraphQLString },
          proxy: { type: GraphQLString },
          producers: {
            type: new GraphQLList(GraphQLString)
          },
          staked: { type: GraphQLInt },
          last_vote_weight: { type: GraphQLString },
          proxied_vote_weight: { type: GraphQLString },
          is_proxy: { type: GraphQLInt },
          flags1: { type: GraphQLInt },
          reserved2: { type: GraphQLInt },
          reserved3: { type: GraphQLString }
        })
      })
    }
  })
})

const account = {
  description: `Retreive various details about a specific account on the blockchain.`,
  type: account_type,
  args: {
    account_name: {
      description: 'Account name',
      type: new GraphQLNonNull(name_type)
    }
  },
  async resolve(_, { account_name }, { rpc_url }) {
    return get_account({ rpc_url, account_name })
  }
}

module.exports = account
