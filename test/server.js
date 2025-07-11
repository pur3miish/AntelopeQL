/* eslint-disable */
import legacy_to_private_key from "antelope-ecc/keys/legacy_to_private_key.js";
import private_key_to_wif from "antelope-ecc/keys/private_key_to_wif.js";
import sign from "antelope-ecc/sign.js";
import http from "http";

import AntelopeQL from "../dist/antelopeql.js";

const server = http.createServer((req, res) => {
  let body = "";

  // Set headers early, before any other operations
  res.writeHead(200, { "Content-Type": "application/json" });

  req.on("data", (chunk) => {
    body += chunk.toString(); // Convert the chunk to a string and append it to the body
  });

  req.on("end", async () => {
    try {
      const { query, variables, operationName } = JSON.parse(body);

      const data = await AntelopeQL({
        query,
        contracts: ["eosio", "eosio.token"],
        operationName,
        variableValues: variables,
        signTransaction: async (hash) => {
          const signature_1 = await sign({
            hash,
            wif_private_key: await private_key_to_wif(
              await legacy_to_private_key(
                "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
              )
            )
          });

          return [signature_1];
        },
        contracts: ["eosio", "eosio.token"],
        // rpc_url: "https://eos.greymass.com/"
        // rpc_url: "https://eos.eosusa.io"
        // rpc_url: "https://mainnet.genereos.io"
        rpc_url: "https://jungle.relocke.io"
        // rpc_url: "http://192.168.64.10:8888"
      });

      // Send the response body after all processing
      res.end(JSON.stringify(data));
    } catch (error) {
      // If there is an error, handle it properly (e.g., send a 500 response)
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error processing request");
    }
  });

  req.on("error", (err) => {
    // Handle request errors (e.g., JSON parsing errors, network errors)
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Invalid request");
  });
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
