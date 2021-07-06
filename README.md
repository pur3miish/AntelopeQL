![smartql logo](https://raw.githubusercontent.com/pur3miish/smartql/main/static/smartql.svg)

# SmartQL

> _Smart contracts & GraphQL._

A GraphQL implementation for interacting with EOSIO based blockchains.

A working example of SmartQL can be found here [here](https://relocke.io/smartql).

# Setup

```shell
$ npm i smartql
```

# Support

- [Node.js](https://nodejs.org/en/) `>= 12`
- [Browser list](https://github.com/browserslist/browserslist) `> 0.5%, not OperaMini all, not IE > 0, not dead`.

Consider a [BigInt](https://caniuse.com/?search=bigint) polyfill library for safari 13.

# API

## function SmartQL

The core function to build and execute a GraphQL request.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `arg` | object | argument. |
| `arg.query` | string | GraphQL query string. |
| `arg.contract` | string | Account name that holds the smart constract. |
| `arg.rpc_urls` | Array<string> | List of URLs to connect to RPC. |
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

> ```js
> SmartQL({
>   query: `{
>   account(scope: "eosio") {
>     balance
>   }
>  }`,
>   contract: 'eosio.token',
>   rpc_urls: [
>     'https://jungle3.cryptolions.io:443',
>     'https://jungle.eosphere.io:443'
>   ]
> }).then(console.log)
> ```
>
> The logged output was { "data": { "account": \[{ "balance": "1297726572.6175 EOS" }] }

_SmartQL mutation - Transfer EOS tokens._

> ```js
> import eosjs from 'eosjs-ecc'
>
> const mutation = `
> mutation {
>  transfer(
>    data: {
>     to: "ihack4google",
>     from: "eoshackathon",
>     memo: "Feigenbaum constants",
>     quantity: "4.6692 EOS"
>    },
>   authorization: {
>     actor: "eoshackathon"
>   }) {
>   transaction_id
>   }
> }
>
> SmartQL({
>   query: mutation,
>   rpc_urls: ['https://jungle3.cryptolions.io:443', 'https://jungle.eosphere.io:443'],
>   contract: "eosio.token",
>   private_keys: [5K7…]
> }).then(console.log)
> ```
>
> The logged output was "data": { "transfer": { "transaction_id": "855ff441ebfc20d0909f81b97ac41ebe29bffbdf996545439ac79bf2e5f4f4ec" } }
