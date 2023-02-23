![smartql logo](/static/smartql.svg)

# SmartQL

[![NPM Package](https://img.shields.io/npm/v/smartql.svg)](https://www.npmjs.org/package/smartql) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/pur3miish/smartql/blob/main/LICENSE)

A [GraphQL](https://graphql.org/) implementation for interacting with **[Antelope](https://antelope.io/)** and [EOSIO](https://eos.io/) based blockchains.

## Live example

For a SmartQL GUI [smartql.relocke.io](https://smartql.relocke.io).

![smartql screenshot](/static/smartql-screen.png)

## Installation

For [Node.js](https://nodejs.org), to install [`smartql`](https://npm.im/eos-ecc) and the peer dependency [`graphql`](https://npm.im/graphql) run:

```sh
npm install smartql graphql
```

For [Deno.js](https://deno.land), to install [`smartql`](https://deno.land/x/smartql) add to your `deno.json` configuration file these imports:

```json
{
  "imports": {
    "universal-sha256-js/": "https://deno.land/x/sha256js/",
    "universal-hmac-sha256-js/": "https://deno.land/x/hmacsha256/",
    "universal-hmac-sha256-js/hmac-sha256-node.mjs": "https://deno.land/x/hmacsha256/hmac-sha256-deno.mjs",
    "base58-js/": "https://deno.land/x/base58/",
    "isomorphic-secp256k1-js/": "https://deno.land/x/secp256k1js/",
    "ripemd160-js/": "https://deno.land/x/ripemd160js@v2.0.3/",
    "eosio-wasm-js/": "https://deno.land/x/eosio_wasm_js/"
  }
}
```

## Examples

See the examples folder on how to run SmartQL as a [Node.js](https://nodejs.org) endpoint.

### Query a blockchain account

```js
import fetch from "node-fetch";
import SmartQL from "smartql/smartql.mjs";

const network = {
  fetch,
  rpc_url: "https://jungle.relocke.io",
  headers: {
    "content-type": "application/json"
  }
};

const { data } = await SmartQL(
  {
    query: /*GraphQL*/ `{
    blockchain{
      get_account(account_name:"relockeblock") {
        core_liquid_balance
        ram_quota
        net_weight
        cpu_weight
        ram_usage
        permissions {
          linked_actions {
            account
            action
          }
          required_auth {
            keys {
              key
              weight
            }
            threshold
          }
        }
      }
    }
  }`
  },
  {},
  network
);

console.log(data);
```

> Logged output included an account infomation.

### Transfer EOS cryptocurrency

```js
import fetch from "node-fetch";
import SmartQL from "smartql";

const network = {
  fetch,
  rpc_url: "https://eos.relocke.io", // eos blockchain.
  headers: {
    "content-type": "application/json"
  }
};

const { data } = await SmartQL(
  {
    query: /*GraphQL*/ `mutation{
      push_transaction(actions: [{
        eosio_token:{
          transfer: {
            authorization:{
              actor:"relockeblock"
            }
            to:"relockechain"
            from:"relockeblock"
            memo: ""
            quantity: "0.0002 EOS"
          }
        }
      }]) {
        transaction_id
        block_num
      }
    }`
  },
  {
    contracts: ["eosio.token"],
    private_keys: ["PVT_K1_…"] // legacy keys are supported.
  },
  network
);

console.log(data);
```

> Logged output includes transaction_id and block_num

### Ways to require in CJS

> **Note**
>
> As this package is [ESM](https://nodejs.org/docs/latest-v16.x/api/esm.html) if you need to require it in a [Common JS](https://nodejs.org/docs/latest-v16.x/api/modules.html) package, then you can import like this:

```js
(async function () {
  const { default: SmartQL } = await import("smartql");
  const {data} = await SmartQL({…})
})();
```

## Requirements

Supported runtime environments:

- [Node.js](https://nodejs.org) versions `>=16.0.0`.
- Browsers matching the [Browserslist](https://browsersl.ist) query [`> 0.5%, not OperaMini all, not dead`](https://browsersl.ist/?q=%3E+0.5%25%2C+not+OperaMini+all%2C+not+dead).

## Setup

- SmartQL as a [Node.js](/examples/as_node.mjs) server.
