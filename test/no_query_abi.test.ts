import { ok } from "assert";

import AntelopeQL from "../src/antelopeql.js";

describe("Serialize ABI test", () => {
  it("Validate parsed values", async () => {
    const { data, errors } = await AntelopeQL({
      query: /* GraphQL */ `
        {
          get_blockchain {
            get_account(account_name: "relockeblock") {
              account_name
            }
          }
        }
      `,
      rpc_url: "https://jungle.relocke.io",
      fetchOptions: {
        headers: { "Content-Type": "application/json" }
      },
      ABIs: [
        {
          account_name: "relockeblock",
          abi: {
            version: "eosio::abi/1.2",
            types: [],
            structs: [
              {
                name: "sell",
                base: "",
                fields: [
                  {
                    name: "from",
                    type: "name"
                  },
                  {
                    name: "name",
                    type: "string"
                  },
                  {
                    name: "quantity",
                    type: "uint8"
                  },
                  {
                    name: "price",
                    type: "asset"
                  }
                ]
              }
            ],
            actions: [
              {
                name: "sell",
                type: "sell",
                ricardian_contract: ""
              }
            ],
            tables: [],
            ricardian_clauses: [],
            error_messages: [],
            abi_extensions: [],
            variants: [],
            action_results: [],
            kv_tables: {}
          }
        }
      ]
    });

    ok(data && !errors);
  });
});
