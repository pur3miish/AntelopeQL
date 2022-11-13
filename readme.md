![smartql logo](https://raw.githubusercontent.com/pur3miish/smartql/main/static/smartql.svg)

# SmartQL

[![NPM Package](https://img.shields.io/npm/v/smartql.svg)](https://www.npmjs.org/package/smartql) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/pur3miish/smartql/blob/main/LICENSE)

A [GraphQL](https://graphql.org/) implementation for interacting with [EOSIO]([https://medium.com/coinmonks/difference-between-eosio-software-and-eos-blockchain-13bcc57d1d9d]) based blockchains.

# Setup

```shell
$ npm i smartql
```

```shell
$ npm i graphql eos-ecc # for generating EOSIO signatures.
```

# Support

- [Node.js](https://nodejs.org/en/) `>= 15`
- [Browser list](https://github.com/browserslist/browserslist) `> 0.5%, not OperaMini all, not IE > 0, not dead`
- [GraphQL](https://github.com/graphql/graphql-js) `>= 15`

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
| `arg.contracts` | Array\<string> | List of contracts. |
| `arg.rpc_url` | string | [Nodeos](https://developers.eos.io/manuals/eos/v2.1/nodeos/index) endpoint URL. |

**Returns:** [packed_transaction](#type-packed_transaction) — Response from the SmartQL (graphql) query.

### Examples

_Ways to `require`._

> ```js
> const SmartQL = require('smartql')
> const { sign_txn } = require('eos-ecc')
> ```

_Ways to `import`._

> ```js
> import SmartQL from 'smartql'
> import { sign_txn } from 'eos-ecc'
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
>  serialize_transaction(
>    actions: [{eosio_token: {transfer: {to: eoshackathon, from: pur3miish222, quantity: "4.6692 EOS", memo: "Feigenbaum constant", authorization: {actor: pur3miish222}}}}]
>  ) {
>    chain_id
>    transaction_header
>    transaction_body
>  }
> }
> ```
>
> ```js
> SmartQL({
>   query: serialize_transaction,
>   rpc_url: 'https://eos.relocke.io',
>   contracts: ['eosio.token']
> }).then(console.log)
> ```
>
> The logged output was "data": { "transfer": { "chain_id": "2a02a0…", "transaction_header": "fa453…", "transaction_body": "82dfe45…" } }
>
> ```GraphQL
>  mutation ($signatures: [signature!]) {
>    push_transaction(transaction_header: "fa453…", transaction_body: "fafa…" signatures: $signatures) {
>      transaction_id
>    }
>  }
> ```
>
> ```js
> SmartQL({
>   query: push_transaction,
>   variables: {
>     signatures: [
>       await sign_txn({
>         hex: 'fa453…', // <chain_id><transaction_header><transaction_body>
>         wif_private_key: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
>       })
>     ]
>   },
>   rpc_url: 'https://eos.relocke.io'
> }).then(console.log)
> ```
>
> Logged output is successful when transaction_id is present.

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
| `expired` | string | transaction expired and storage space refunded to user. |
