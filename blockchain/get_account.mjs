import {
  GraphQLBoolean,
  GraphQLError,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

import asset_type from "../eosio_types/asset_type.mjs";
import EOSIO_key_type from "../eosio_types/eosio_key_type.mjs";
import name_type from "../eosio_types/name_type.mjs";

const resource_type = new GraphQLObjectType({
  name: "resource_type",
  fields: () => ({
    owner: { type: name_type },
    net_weight: { type: GraphQLString },
    cpu_weight: { type: GraphQLString },
    ram_bytes: { type: GraphQLString }
  })
});

const bandwidth_type = new GraphQLObjectType({
  name: "bandwith_type",
  fields: () => ({
    used: { type: GraphQLString },
    available: { type: GraphQLString },
    max: { type: GraphQLString },
    last_usage_update_time: {
      type: GraphQLString
    }
  })
});

const require_auth_type = new GraphQLObjectType({
  name: "require_auth_type",
  fields: () => ({
    threshold: { type: GraphQLInt },
    keys: { type: new GraphQLList(EOSIO_key_type) },
    accounts: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "accounts_auth_type",
          fields: () => ({
            weight: { type: GraphQLInt },
            permission: {
              type: new GraphQLObjectType({
                name: "account_auth_permission_type",
                fields: () => ({
                  actor: { type: name_type },
                  permission: { type: name_type }
                })
              })
            }
          })
        })
      )
    }
  })
});

const linked_actions_type = new GraphQLObjectType({
  name: "linked_actions_type",
  fields: {
    account: { type: name_type },
    action: { type: name_type }
  }
});

const permission_type = new GraphQLObjectType({
  name: "permission_type",
  description: "Antelope account permissions",
  fields: {
    perm_name: { type: name_type },
    parent: { type: name_type },
    required_auth: { type: require_auth_type },
    linked_actions: {
      type: new GraphQLList(linked_actions_type)
    }
  }
});

const account_type = new GraphQLObjectType({
  name: "account_type",
  description: `Retreive details about a specific account on the blockchain.`,
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
      description: "List of the Antelope `account_name` permissions",
      type: new GraphQLList(permission_type)
    },
    total_resources: {
      type: resource_type
    },
    self_delegated_bandwidth: {
      type: new GraphQLObjectType({
        name: "self_delegated_badwidth",
        description: "Lists the amount of bandwidth your account has delegated",
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
        name: "account_refund_request",
        description: "",
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
        name: "voter_info_type",
        fields: () => ({
          owner: { type: GraphQLString },
          proxy: { type: GraphQLString },
          producers: {
            type: new GraphQLList(GraphQLString)
          },
          staked: { type: GraphQLString },
          last_vote_weight: { type: GraphQLString },
          proxied_vote_weight: { type: GraphQLString },
          is_proxy: { type: GraphQLInt },
          flags1: { type: GraphQLInt },
          reserved2: { type: GraphQLInt },
          reserved3: { type: GraphQLString }
        })
      })
    },
    subjective_cpu_bill_limit: {
      type: new GraphQLObjectType({
        name: "subjective_cpu_bill_limit_type",
        fields: {
          used: { type: GraphQLString },
          available: { type: GraphQLString },
          max: { type: GraphQLString }
        }
      })
    },
    rex_info: {
      type: new GraphQLObjectType({
        name: "rex_info_type",
        fields: {
          version: { type: GraphQLString },
          owner: { type: GraphQLString },
          vote_stake: { type: GraphQLString },
          rex_balance: { type: GraphQLString },
          matured_rex: { type: GraphQLString },
          rex_maturities: {
            type: new GraphQLList(
              new GraphQLObjectType({
                name: "pair_time_point_sec_int64",
                fields: {
                  key: { type: GraphQLString },
                  value: { type: GraphQLString }
                }
              })
            )
          }
        }
      })
    },
    eosio_any_linked_actions: {
      type: new GraphQLList(linked_actions_type)
    }
  })
});

const get_account = {
  type: account_type,
  args: {
    account_name: {
      type: new GraphQLNonNull(name_type)
    }
  },
  async resolve(root, { account_name }, getContext, info) {
    const {
      network: { fetch, rpc_url, ...fetchOptions }
    } = getContext(root, { account_name }, info);

    const uri = `${rpc_url}/v1/chain/get_account`;
    const req = await fetch(uri, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({
        account_name,
        json: true
      })
    });

    const data = await req.json();
    if (data.error) throw new GraphQLError(data.message, { extensions: data });

    return data;
  }
};

export default get_account;
