import { ok } from "assert";

import { RelockeQL } from "../src/relockeql.js";

describe("Serialize ABI test", () => {
  it("Validate parsed values", async function () {
    this.timeout(10000);

    const data = await RelockeQL({
      query: /* GraphQL */ `
        {
          jungle {
            get_blockchain {
              get_account(account_name: "eosio") {
                account_name
              }
            }
          }
        }
      `
    });

    ok(
      data.data?.jungle?.get_blockchain?.get_account?.account_name == "eosio",
      "Expected account name"
    );
  });
});
