import {
  GraphQLError,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

import EOSIO_key_type from "../eosio_types/eosio_key_type.mjs";
import public_key_type from "../eosio_types/public_key_type.mjs";

const producers = new GraphQLObjectType({
  name: "blockchain_block_producers",
  fields: {
    owner: {
      type: GraphQLString
    },
    total_votes: {
      type: GraphQLString
    },
    producer_key: {
      type: public_key_type
    },
    is_active: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    },
    unpaid_blocks: {
      type: GraphQLString
    },
    last_claim_time: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    producer_authority: {
      type: new GraphQLObjectType({
        name: "block_producer_authority",
        fields: {
          threshold: {
            type: GraphQLInt
          },
          keys: {
            type: new GraphQLList(EOSIO_key_type)
          }
        }
      }),
      resolve(data) {
        return data.producer_authority[1];
      }
    }
  }
});

const get_producers = {
  description: "Return info about block producers.",
  type: new GraphQLObjectType({
    name: "antelope_producers",
    fields: {
      total_producer_vote_weight: {
        type: GraphQLString
      },
      more: {
        type: GraphQLString,
        description: "the next block producer in the list"
      },
      rows: {
        type: new GraphQLList(producers)
      }
    }
  }),
  args: {
    limit: {
      description: "total number of producers to retrieve",
      type: GraphQLString,
      defaultValue: "10"
    },
    lower_bound: {
      description:
        "In conjunction with limit can be used to paginate through the results. For example, limit=10 and lower_bound=10 would be page 2.",
      type: GraphQLString
    }
  },
  async resolve(_, args, { network: { fetch, rpc_url, ...fetchOptions } }) {
    const uri = `${rpc_url}/v1/chain/get_producers`;

    const req = await fetch(uri, {
      method: "POST",
      body: JSON.stringify({ ...args, json: true }),
      ...fetchOptions
    });

    const data = await req.json();

    if (data.error) throw new GraphQLError(data.message, { extensions: data });

    return data;
  }
};

export default get_producers;
