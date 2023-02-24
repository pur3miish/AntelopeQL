import fetch from "node-fetch";

import smartql from "../smartql.mjs";

export default async (tests) => {
  tests.add("test eosio queries on jungle blockchain", async () => {
    const query = /* GraphQL */ `
      {
        blockchain {
          get_account(account_name: "eosio") {
            account_name
            ram_quota
            privileged
            net_weight
            cpu_weight
            permissions {
              perm_name
              parent
              required_auth {
                threshold
                keys {
                  key
                  weight
                }
                accounts {
                  weight
                  permission {
                    actor
                    permission
                  }
                }
              }
            }
          }
        }
      }
    `;

    const { data } = await smartql({
      query,
      fetch,
      rpc_url: "https://jungle.relocke.io",
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(data?.blockchain);
  });
};
