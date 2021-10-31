![smartql logo](https://raw.githubusercontent.com/pur3miish/smartql/main/static/smartql.svg)

# SmartQL

[![NPM Package](https://img.shields.io/npm/v/smartql.svg)](https://www.npmjs.org/package/smartql) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/pur3miish/smartql/blob/main/LICENSE)

> _Smart contracts & GraphQL._

A GraphQL implementation for interacting with EOSIO based blockchains.

_See a working example of [SmartQL](https://smartql.relocke.io?1=eosio&2=eosio.token)._

# Setup

```shell
$ npm i smartql
```

```shell
$ npm i graphql eos-ecc # peer dependencies
```

_If you plan on signing with a 3rd party tool or are just making queries [eos-ecc](https://github.com/pur3miish/eos-ecc) is not needed._

# Support

- [Node.js](https://nodejs.org/en/) `>= 12`
- [Browser list](https://github.com/browserslist/browserslist) `> 0.5%, not OperaMini all, not IE > 0, not dead`
- GraphQL 15

Consider a [BigInt](https://caniuse.com/?search=bigint) polyfill library for safari 13.

# API

- [function SmartQL](#function-smartql)
- [type authorization](#type-authorization)
- [type Bandwidth_cost](#type-bandwidth_cost)
- [type packed_transaction](#type-packed_transaction)
- [type transaction_receipt](#type-transaction_receipt)
- [type transaction_status](#type-transaction_status)

## function SmartQL

The core function to build and execute a GraphQL request for EOSIO based blockchains.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `arg` | object | Argument. |
| `arg.query` | string | GraphQL query string. |
| `arg.operationName` | object? | GraphQL opperation name. |
| `arg.variables` | object? | GraphQL variables. |
| `arg.contracts` | Array\<string> | List of accounts that holds smart contracts. |
| `arg.rpc_url` | string | [Nodeos](https://developers.eos.io/manuals/eos/v2.1/nodeos/index) endpoint URL. |
| `arg.broadcast` | bool? | Specifies if mutation will return `packed transaction` or `transaction receipt`. |
| `arg.private_keys` | Array\<string>? | List of EOSIO wif private keys. |
| `extensions` | object? | Extend the GraphQL schema by providing mutations and query fields. |
| `extensions.queries_fields` | object? | GraphQL query fields. |
| `extensions.mutation_fields` | object? | GraphQL mutation fields. |

**Returns:** [packed_transaction](#type-packed_transaction) | [transaction_receipt](#type-transaction_receipt) — Response from the SmartQL (graphql) query.

### Examples

_Ways to `require`._

> ```js
> const { SmartQL } = require('smartql')
> ```

_Ways to `import`._

> ```js
> import { SmartQL } from 'smartql'
> ```

_SmartQL query - Get account balance._

> ```GraphQL
>  query {
>     eosio_token {
>          account(arg: { scope: "pur3miish222" }) {
>            balance
>          }
>     }
>  }
> ```
>
> ```js
> SmartQL({
>   query,
>   contracts: ['eosio.token'],
>   rpc_url: 'https://eos.relocke.io'
> }).then(console.log)
> ```
>
> The logged output was: { "data": { "account": \[{ "balance": "… EOS" }] }

_SmartQL mutation - Transfer EOS tokens with memo._

> ```GraphQL
> mutation {
>  eosio_token(
>    actions: {
>      transfer: {
>        to: eoshackathon,
>        from: pur3miish222,
>        quantity: "4.6692 EOS",
>        memo: "Feigenbaum constant",
>        authorization: { actor: pur3miish222 }
>      }
>    }
>  ) {
>    transaction_id
>  }
> }
> ```
>
> ```js
> SmartQL({
>   query: mutation,
>   rpc_url: 'https://eos.relocke.io',
>   contracts: ['eosio.token'],
>   private_keys: ['5K7…']
> }).then(console.log)
> ```
>
> The logged output was "data": { "transfer": { "transaction_id": "855ff441ebfc20d0909f81b97ac41ebe29bffbdf996545439ac79bf2e5f4f4ec" } }

---

## type authorization

The action authorization type for action validation.

**Type:** object

| Property     | Type   | Description                                      |
| :----------- | :----- | :----------------------------------------------- |
| `actor`      | string | Name of the account that is trying to authorize. |
| `permission` | string | Name of the `permission` of the the `actor`      |

---

## type Bandwidth_cost

Bandwidth reciept for EOSIO transaction.

| Property | Type | Description |
| :-- | :-- | :-- |
| `net_usage_words` | number | Consumption of network bandwidth (bytes). |
| `cpu_usage_us` | number | Consumption of CPU bandwidth (µs). |
| `status` | Transaction_status | Transaction receipt status Enum. |

---

## type packed_transaction

The packed transaction type.

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `chain_id` | string | Hash representing the blockchain. |
| `transaction_header` | string | Hex string representing the serialized transaction header. |
| `transaction_body` | string | Hex string representing the serialized transaction body. |

---

## type transaction_receipt

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `transaction_id` | string | ID of the transaction. |
| `block_num` | number | Block number where teh transaction can be found. |
| `block_time` | stiring | The time of the transaction. |
| `producer_block_id` | string | The block producer ID that processed the transaction. |
| `resource_cost` | bandwidth_cost | Network cost for the transaction. |
| `scheduled` | bool | Scheduled transactions are executed at a later time. |

---

## type transaction_status

**Type:** enum

| Property | Type | Description |
| :-- | :-- | :-- |
| `executed` | string | succeed, no error handler executed. |
| `soft_fail` | string | objectively failed (not executed), error handler executed. |
| `hard_fail` | string | objectively failed and error handler objectively failed thus no state change. |
| `delayed` | string | transaction delayed/deferred/scheduled for future execution. |
| `expired` | string | transaction expired and storage space refuned to user. |
