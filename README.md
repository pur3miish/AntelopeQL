![smartql logo](https://raw.githubusercontent.com/pur3miish/smartql/main/static/smartql.svg)

[![NPM Package](https://img.shields.io/npm/v/smartql.svg)](https://www.npmjs.org/package/smartql) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/pur3miish/smartql/blob/main/LICENSE)

> _Smart contracts & GraphQL._

A GraphQL implementation for interacting with EOSIO based blockchains.

# Setup

```shell
$ npm i smartql
```

# Support

- [Node.js](https://nodejs.org/en/) `>= 12`
- [Browser list](https://github.com/browserslist/browserslist) `> 0.5%, not OperaMini all, not IE > 0, not dead`
- GraphQL 15

Consider a [BigInt](https://caniuse.com/?search=bigint) polyfill library for safari 13.

# API

## function SmartQL

The core function to build and execute a GraphQL request for EOSIO based blockchain.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `arg` | object | Argument. |
| `arg.query` | string | GraphQL query string. |
| `arg.contract` | string | Account name that holds the smart contract. |
| `arg.rpc_url` | string | URL to connect to RPC. |
| `arg.variables` | object? | GraphQL variables. |
| `arg.operationName` | object? | GraphQL opperation name. |
| `arg.private_keys` | Array<string>? | List of EOS wif private keys. |

**Returns:** object — Reponse from a GraphQL query.

### Examples

_Ways to `require`._

> ```js
> const SmartQL = require('smartql')
> ```

_Ways to `import`._

> ```js
> import SmartQL from 'smartql'
> ```

_SmartQL query - Get account balance._

> ```GraphQL
> query { account(scope: "eosio") { balance } }
> ```
>
> ```js
> SmartQL({
>   query,
>   contract: 'eosio.token',
>   rpc_url: 'https://api.relocke.io',
>   private_keys: ['5a12…']
> }).then(console.log)
> ```
>
> The logged output was { "data": { "account": \[{ "balance": "… EOS" }] }

_SmartQL mutation - Transfer EOS tokens._

> ```GraphQL
> mutation {
>  transaction(
>    actions: {
>      transfer: {
>        to: eoshackathon,
>        from: pur3miish222,
>        quantity: "4.6692 EOS",
>        memo: "Feigenbaum constant",
>        authorization: { actor: pur3miish222 }
>    }
>  }
> ) {
>    transaction_id
> }
> }
> ```
>
> ```js
> SmartQL({
>   query: mutation,
>   rpc_url: 'https://api.relocke.io',
>   contract: 'eosio.token',
>   private_keys: ['5K7…']
> }).then(console.log)
> ```
>
> The logged output was "data": { "transfer": { "transaction_id": "855ff441ebfc20d0909f81b97ac41ebe29bffbdf996545439ac79bf2e5f4f4ec" } }
