import { GraphQLError, GraphQLObjectType } from "graphql";

import deserialize_action_data from "./blockchain/deserialize_action_data.mjs";
import get_abi from "./blockchain/get_abi.mjs";
import get_account from "./blockchain/get_account.mjs";
import get_accounts_by_authorizers from "./blockchain/get_accounts_by_authorizers.mjs";
import get_block from "./blockchain/get_block.mjs";
import get_currency_balance from "./blockchain/get_currency_balance.mjs";
import get_currency_stats from "./blockchain/get_currency_stats.mjs";
import get_info from "./blockchain/get_info.mjs";
import get_producers from "./blockchain/get_producers.mjs";
import get_ram_price from "./blockchain/get_ram_price.mjs";
import get_table from "./blockchain/get_table_by_scope.mjs";

const blockchain_query_field = {
  description: `Retrieve infomation about the blockchain, cryptocurrency and accounts.`,
  type: new GraphQLObjectType({
    name: "blockchain",
    fields: {
      get_account,
      get_abi,
      get_accounts_by_authorizers,
      get_block,
      get_currency_balance,
      get_currency_stats,
      get_info,
      get_producers,
      deserialize_action_data,
      get_table,
      get_ram_price
    }
  }),
  resolve(_, __, { network: { fetch, rpc_url } }) {
    if (!fetch)
      throw new GraphQLError(
        "Fetch was not supplied to the `antelopeql_context`."
      );
    if (!rpc_url)
      throw new GraphQLError("No RPC url supplied to `antelopeql_context`");
    return {};
  }
};

export default blockchain_query_field;
