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
      signTransaction: async (hash) => {
        const signature_1 = await sign_txn({
          hash,
          wif_private_key: "PVT_K1_..."
        });

        return [signature_1];
      },
      contracts: ["eosio", "eosio.token"],
      rpc_url: "https://eos.relocke.io"
    });

    res.end(JSON.stringify(data));
  });
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
