import assertSnapshot from "snapshot-assertion";

import AntelopeQL from "../antelopeql.mjs";

export default async (tests) => {
  tests.add("Test eosio queries", async () => {
    const query = /* GraphQL */ `
      query test1 {
        get_blockchain {
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

    const { data } = await AntelopeQL({
      query,
      fetch,
      rpc_url: "https://jungle.relocke.io",
      headers: { "Content-Type": "application/json" }
    });
    assertSnapshot(JSON.stringify(data), "test/snapshots/test1.json");
  });
};
