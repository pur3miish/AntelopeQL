![antelopeql logo](https://raw.githubusercontent.com/pur3miish/antelopeql/main/static/antelopeql.svg)

# AntelopeQL

[![NPM Package](https://img.shields.io/npm/v/antelopeql.svg)](https://www.npmjs.org/package/antelopeql) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/pur3miish/antelopeql/blob/main/LICENSE)

AntelopeQL (_Antelope Query Language_)

AntelopeQL is a GraphQL client and server library that allows developers to interact with the Antelope blockchain using GraphQL. It provides a unified interface to communicate with different blockchains within the Antelope ecosystem, enabling developers to leverage the unique features and capabilities of each blockchain while still benefiting from a consistent development experience.

As a GraphQL client library, AntelopeQL simplifies the process of building and executing GraphQL queries and mutations, handling errors, and signing transactions. As a server library, it provides a framework for building GraphQL APIs that can interact with the Antelope blockchain and other data sources.

With AntelopeQL, developers can focus on building the frontend and business logic of their DApps, while relying on the library to handle the complexities of interacting with multiple blockchains in the Antelope ecosystem.

**For a live example of AntelopeQL GUI see: [antelopeql.relocke.io](https://antelopeql.relocke.io).**

![antelopeql screenshot](https://raw.githubusercontent.com/pur3miish/antelopeql/main/static/antelopeql-screen.png)

## Installation

For [Node.js](https://nodejs.org), to install [`AntelopeQL`](https://npm.im/antelopeql) and the peer dependency [`graphql`](https://npm.im/graphql) run:

```sh
npm install antelopeql graphql
```

## Examples

See the examples folder on how to run AntelopeQL as a [Node.js](https://nodejs.org) endpoint.

### Query a blockchain account

```js
import AntelopeQL from "antelopeql/antelopeql.mjs";

const { data } = await AntelopeQL({
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
  }`,
  rpc_url: "https://jungle.relocke.io"
});

console.log(data);
```

> Logged output included an account infomation.

### Transfer EOS cryptocurrency

```js
import AntelopeQL from "antelopeql/antelopeql.mjs";
import sign_txn from "antelopeql-ecc/sign_txn.mjs";

const { data } = await AntelopeQL({
  query: /*GraphQL*/ `
    mutation {
      send_transaction(actions: [{
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
  }`,
  contracts: ["eosio.token", "eosio"], // List of smart contracts
  signTransaction: async (hash) => {
    const wif_private_key = "PVT_K1_…"; // your private key
    const signature = await sign_txn({ hash, wif_private_key });
    return [signature]; // signaures must return array
  },
  rpc_url: "https://eos.relocke.io" // eos blockchain url.
});

console.log(data);
```

> Logged output includes transaction_id and block_num

### Ways to require in CJS

> **Note**
>
> As this package is [ESM](https://nodejs.org/docs/latest-v16.x/api/esm.html) if you need to require it in a [Common JS](https://nodejs.org/docs/latest-v16.x/api/modules.html) package, then you can import like this:

```js
(async function () {
  const { default: AntelopeQL } = await import("antelopeql/antelopeql.mjs");
  const { data } = await AntelopeQL({…})
})();
```

## Requirements

Supported runtime environments:

- [Node.js](https://nodejs.org) versions `>=18.0.0`.
- Browsers matching the [Browserslist](https://browsersl.ist) query [`> 0.5%, not OperaMini all, not dead`](https://browsersl.ist/?q=%3E+0.5%25%2C+not+OperaMini+all%2C+not+dead).

## Exports

The [npm](https://npmjs.com) package [`AntelopeQL`](https://npm.im/antelopeql) features [optimal JavaScript module design](https://jaydenseric.com/blog/optimal-javascript-module-design). It doesn’t have a main index module, so use deep imports from the ECMAScript modules that are exported via the [`package.json`](./package.json) field [`exports`](https://nodejs.org/api/packages.html#exports):
