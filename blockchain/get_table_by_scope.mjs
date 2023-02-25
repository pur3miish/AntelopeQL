import {
  GraphQLError,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

import name_type from "../eosio_types/name_type.mjs";

const table_type = new GraphQLObjectType({
  name: "table_type",
  fields: {
    rows: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "table_rows_type",
          fields: {
            scope: { type: name_type },
            table_name: { type: name_type, resolve: ({ table }) => table },
            ram_payer: {
              type: name_type,
              description: "The account that pays for the data entries.",
              resolve: ({ payer }) => payer
            },
            count: {
              type: name_type,
              description: "No. of entries in the table."
            }
          }
        })
      )
    },
    more: {
      type: name_type
    }
  }
});

const get_table = {
  description: "Retrieve a table from the blockchain.",
  type: table_type,
  args: {
    account_name: {
      description: "The account name of the `smart contract`.",
      type: new GraphQLNonNull(name_type)
    },
    table_name: {
      description: "The table name on the smart contract.",
      type: name_type
    },
    limit: {
      description:
        "Limit number of results returned (how many items to return).",
      type: GraphQLInt,
      defaultValue: 10
    },
    lower_bound: {
      description:
        "Filters results to return the first element that is not less than provided value in the table.",
      type: GraphQLString
    },
    upper_bound: {
      description:
        "Filters results to return the first element that is greater than provided value in the table.",
      type: GraphQLString
    }
  },
  async resolve(
    _,
    { account_name, table_name, limit, lower_bound, upper_bound },
    { network: { fetch, rpc_url, ...fetchOptions } }
  ) {
    const uri = `${rpc_url}/v1/chain/get_table_by_scope`;
    const data = await fetch(uri, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({
        code: account_name,
        table: table_name,
        limit,
        lower_bound,
        upper_bound,
        json: true,
        show_payer: true
      })
    }).then((req) => req.json());

    if (data.error) throw new GraphQLError(data.message, { extensions: data });

    return data;
  }
};

export default get_table;
