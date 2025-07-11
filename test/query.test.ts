import AntelopeQL from "../src/antelopeql.js";

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

describe("testing v1/chain/", () => {
  it("get_account", async () => {
    const { data, errors } = await AntelopeQL({
      query,
      rpc_url: "https://jungle.relocke.io"
    });
  });
});

// assertSnapshot(JSON.stringify(data), "test/snapshots/test1.json");
