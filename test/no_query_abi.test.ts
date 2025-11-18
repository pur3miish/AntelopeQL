import { ok } from "assert";

import { AntelopeQL } from "../src/antelopeql.js";

describe("Serialize ABI test", () => {
  it("Validate parsed values", async () => {
    const data = await AntelopeQL({
      query: /* GraphQL */ `
        {
          jungle {
            get_blockchain {
              get_account(account_name: "relockeblock") {
                account_name
              }
            }
          }
        }
      `
    });

    ok(
      data.data?.jungle?.get_blockchain?.get_account?.account_name ==
        "relockeblock",
      "Expected account name"
    );
  });
});
