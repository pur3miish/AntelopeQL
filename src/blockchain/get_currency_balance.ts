import {
  GraphQLError,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString
} from "graphql";

import name_type from "../antelope_types/name_type.js";
import symbol_code_type from "../antelope_types/symbol_code_type.js";

interface CurrencyBalanceArgs {
  code?: string; // defaults to "eosio.token"
  account: string;
  symbol: string;
}

export interface Context {
  network(
    root: any,
    args: any,
    info: any
  ): {
    rpc_url: string | URL | Request;
    fetchOptions: RequestInit;
  };
  signTransaction?: (transaction: any) => Promise<any>;
}

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
      description: "The crypto currency token symbol.",
      type: new GraphQLNonNull(symbol_code_type)
    }
  },
  async resolve(
    root: unknown,
    args: CurrencyBalanceArgs,
    context: Context,
    info: unknown
  ): Promise<string[]> {
    const { rpc_url, fetchOptions } = context.network(root, args, info);

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

    return data as string[];
  }
};

export default currency_balance;
