import http from "http";
import fetch from "node-fetch";

import SmartQL from "../smartql.mjs";

const host = "localhost";
const port = 8080;

const requestListener = function (req, res) {
  req.on("data", async (d) => {
    const { query, operationName } = JSON.parse(d.toString());
    const network = {
      fetch: await fetch,
      rpc_url: "http://127.0.0.1:8888" // chain endpoint.
      // headers: { "content-type": "application/json" } // Optional
    };

    const data = await SmartQL(
      { query, operationName },
      {
        // contracts: ["eosio.token", "eosio"],
        private_keys: ["5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"]
      },
      network
    );

    res.setHeader("Content-Type", "application/json").end(JSON.stringify(data));
  });
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
