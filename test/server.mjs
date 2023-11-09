import sign_txn from "antelope-ecc/sign_txn.mjs";
import http from "http";

import AntelopeQL from "../antelopeql.mjs";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString(); // Convert the chunk to a string and append it to the body
  });

  req.on("end", async () => {
    res.writeHead(200, { "Content-Type": "application/json" });
    const { query, variables } = JSON.parse(body);

    const data = await AntelopeQL({
      query,
      variableValues: variables,
      // eslint-disable-next-line no-unused-vars
      signTransaction: async (hash) => {
        const wif_private_key = "PVT_K1_...";
        const sig = await sign_txn({ hash, wif_private_key });

        return [sig];
      },
      contracts: ["eosio", "eosio.token", "relockebanks"],
      ABIs: [
        // { abi, account_name: "variant_abi" }
      ],
      rpc_url: "https://jungle.relocke.io"
    });

    res.end(JSON.stringify(data));
  });
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
