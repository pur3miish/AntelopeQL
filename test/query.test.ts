import AntelopeQL from "../src/antelopeql.js";

describe("testing v1/chain/", () => {
  it("get_account", async () => {
    const query = /* GraphQL */ `
      {
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

    const data = await AntelopeQL({
      query,
      rpc_url: "https://jungle.relocke.io"
    });
    console.log(data);
  });
});
