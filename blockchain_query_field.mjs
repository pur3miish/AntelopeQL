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
import get_required_keys from "./blockchain/get_required_keys.mjs";
import get_smart_contract from "./blockchain/get_smart_contract.mjs";
import get_table from "./blockchain/get_table_by_scope.mjs";

const blockchain_query_field = {
  type: new GraphQLObjectType({
    name: "blockchain_type",
    description: `Retrieve infomation about the blockchain, cryptocurrency and accounts.`,
    fields: {
      get_account,
      get_abi,
      get_accounts_by_authorizers,
      get_block,
      get_currency_balance,
      get_currency_stats,
      get_required_keys,
      get_smart_contract,
      get_info,
      get_producers,
      get_table,
      get_ram_price,
      deserialize_action_data
    }
  }),
  resolve(root, arg, getContext, info) {
    const {
      network: { rpc_url }
    } = getContext(root, arg, info);

    if (!rpc_url)
      throw new GraphQLError("No RPC url supplied to `antelopeql_context`");

    return {};
  }
};

export default blockchain_query_field;
