import {
  GraphQLError,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString
} from "graphql";

import name_type from "../eosio_types/name_type.mjs";
import symbol_code_type from "../eosio_types/symbol_code_type.mjs";

const currency_balance = {
  description: "Retrieve current balance.",
  type: new GraphQLList(GraphQLString),
  args: {
    code: {
      description: "The account name that holds the currency tokens",
      type: name_type,
      defaultValue: "eosio.token"
    },
    account: {
      description: "Account name to query the balance for.",
      type: new GraphQLNonNull(name_type)
    },
    symbol: {
      description: "The crytpo currency token symbol.",
      type: new GraphQLNonNull(symbol_code_type)
    }
  },
  async resolve(root, args, getContext, info) {
    const {
      network: { fetch, rpc_url, ...fetchOptions }
    } = getContext(root, args, info);

    const uri = `${rpc_url}/v1/chain/get_currency_balance`;
    const req = await fetch(uri, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({
        ...args,
        json: true
      })
    });
    const data = await req.json();

    if (data.error) throw new GraphQLError(data.message, { extensions: data });

    return data;
  }
};

export default currency_balance;
