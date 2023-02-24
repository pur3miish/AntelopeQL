import {
  GraphQLError,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

import name_type from "../eosio_types/name_type.mjs";
import symbol_code_type from "../eosio_types/symbol_code_type.mjs";

const currency_stats_type = new GraphQLObjectType({
  name: "currency_stats_type",
  fields: () => ({
    supply: {
      type: GraphQLString
    },
    max_supply: {
      type: GraphQLString
    },
    issuer: {
      type: name_type
    }
  })
});

const get_currency_stats = {
  description: "Retrieve currency stats.",
  type: currency_stats_type,
  args: {
    code: {
      type: new GraphQLNonNull(name_type)
    },
    symbol: {
      type: new GraphQLNonNull(symbol_code_type)
    }
  },
  async resolve(
    _,
    { symbol, ...args },
    { network: { fetch, rpc_url, ...fetchOptions } }
  ) {
    const uri = `${rpc_url}/v1/chain/get_currency_stats`;
    const req = await fetch(uri, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({
        symbol,
        json: true,
        ...args
      })
    });
    const data = await req.json();

    if (data.error) throw new GraphQLError(data.message, { extensions: data });

    return data[symbol];
  }
};

export default get_currency_stats;
