import {
  GraphQLError,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

import bytes_type from "../eosio_types/bytes_type.mjs";
import authorization_type from "../graphql_object_types/authorization.mjs";

const action_type = new GraphQLObjectType({
  name: "action_type",
  fields: () => ({
    account: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    authorization: {
      type: new GraphQLList(authorization_type)
    },
    data: {
      type: GraphQLString,
      description: "JSON representation of the transaction data.",
      resolve({ data }) {
        return JSON.stringify(data);
      }
    },
    hex_data: {
      type: bytes_type
    }
  })
});

const producer_type = new GraphQLObjectType({
  name: "producer_type",
  fields: () => ({
    producer_name: {
      type: GraphQLString
    },
    block_signing_key: {
      type: GraphQLString,
      description: `Base58 encoded Antelope public key.`
    }
  })
});

const new_producer_type = new GraphQLObjectType({
  name: "new_producer_type",
  fields: () => ({
    version: {
      type: GraphQLString
    },
    producers: {
      type: new GraphQLList(producer_type)
    }
  })
});

const packed_transaction_type = new GraphQLObjectType({
  name: "packed_transaction_type",
  fields: () => ({
    expiration: {
      type: GraphQLString
    },
    ref_block_num: {
      type: GraphQLString
    },
    ref_block_prefix: {
      type: GraphQLString
    },
    max_net_usage_words: {
      type: GraphQLString
    },
    max_cpu_usage_ms: {
      type: GraphQLString
    },
    delay_sec: {
      type: GraphQLString
    },
    context_free_actions: {
      type: new GraphQLList(action_type)
    },
    actions: {
      type: new GraphQLList(action_type)
    }
  })
});

const trx_type = new GraphQLObjectType({
  name: "trx_type",
  fields: () => ({
    id: {
      type: GraphQLID
    },
    signatures: {
      type: new GraphQLList(GraphQLString)
    },
    compression: {
      type: GraphQLString
    },
    packed_context_free_data: {
      type: GraphQLString
    },
    context_free_data: {
      type: new GraphQLList(GraphQLString)
    },
    packed_trx: {
      type: GraphQLString
    },
    transaction: {
      type: packed_transaction_type
    }
  })
});

const transactions_type = new GraphQLObjectType({
  name: "transaction_type",
  fields: () => ({
    status: {
      type: GraphQLString,
      description: "List of valid transaction receipts included in block."
    },
    cpu_usage_us: {
      type: GraphQLString
    },
    net_usage_words: {
      type: GraphQLString
    },
    trx: {
      type: trx_type
    }
  })
});

const block_type = new GraphQLObjectType({
  name: "block_type",
  description: "Return info relating to a specific block.",
  fields: () => ({
    timestamp: {
      description: "Date/time string in the format `YYYY-MM-DDTHH:MM:SS.sss`",
      type: GraphQLString
    },
    producer: {
      description: "The `name` of the producer.",
      type: GraphQLString
    },
    confirmed: {
      description:
        "Number of prior blocks confirmed by this block producer in current schedule",
      type: GraphQLString
    },
    previous: {
      description: "The `sha256` hash representing the previous.",
      type: GraphQLString
    },
    transaction_mroot: {
      description: "The transaction merkle root `sha256`.",
      type: GraphQLString
    },
    action_mroot: {
      description: "The action merkle root `sha256` string.",
      type: GraphQLString
    },
    schedule_version: {
      description:
        "Number of times producer schedule has changed since genesis.",
      type: GraphQLString
    },
    new_producers: {
      description: "A list of new producers.",
      type: new_producer_type
    },
    header_extensions: {
      type: new GraphQLList(GraphQLString)
    },
    producer_signature: {
      type: GraphQLString,
      description: `Base58 encoded Antelope cryptographic signature.`
    },
    transactions: {
      type: new GraphQLList(transactions_type),
      description: "List of valid transaction receipts included in block."
    },
    block_extensions: {
      type: new GraphQLList(GraphQLString)
    },
    id: {
      description: "The ID of the a given block `sha256`.",
      type: GraphQLString
    },
    block_num: {
      description:
        "Height of this block in the chain, no. of blocks since genesis.",
      type: GraphQLString
    },
    ref_block_prefix: {
      description: "32-bit portion of block ID",
      type: GraphQLString
    }
  })
});

const get_block = {
  type: block_type,
  args: {
    block_num_or_id: {
      description: "The `block number` or a `block id`.",
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(
    _,
    { block_num_or_id },
    { network: { fetch, rpc_url, ...fetchOptions } }
  ) {
    const uri = `${rpc_url}/v1/chain/get_block`;
    const req = await fetch(uri, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({
        block_num_or_id,
        json: true
      })
    });
    const data = await req.json();

    if (data.error) throw new GraphQLError(data.message, { extensions: data });

    return data;
  }
};

export default get_block;
