'use strict'

const {
  GraphQLObjectType,
  GraphQLSchema,
  validate,
  execute,
  Source,
  parse
} = require('graphql')
const blockchain = require('./public/build_query_fields/types/blockchain.js')
const push_transaction = require('./public/chain_mutation_fields/push_transaction.js')
const fields_from_abis = require('./public/fields_from_abis.js')
const handleErrors = require('./public/handle_errors.js')
const get_abi = require('./public/network/get_abi.js')

/**
 * The core function to build and execute a GraphQL request for EOSIO based blockchains.
 * @name SmartQL
 * @kind function
 * @param {object} arg Argument.
 * @param {string} arg.query GraphQL query string.
 * @param {object} [arg.operationName] GraphQL opperation name.
 * @param {object} [arg.variables] GraphQL variables.
 * @param {Array<string>} arg.contracts List of contracts.
 * @param {string} arg.rpc_url [Nodeos](https://developers.eos.io/manuals/eos/v2.1/nodeos/index) endpoint URL.
 * @returns {packed_transaction} Response from the SmartQL (graphql) query.
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const SmartQL = require('smartql')
 * const { sign_txn } = require('eos-ecc')
 * ```
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import SmartQL from 'smartql'
 * import { sign_txn } from 'eos-ecc'
 * ```
 * @example <caption>SmartQL query - Get account balance.</caption>
 * ```GraphQL
 *  query {
 *     eosio_token {
 *          account(arg: { scope: "pur3miish222" }) {
 *            balance
 *          }
 *     }
 *  }
 * ```
 *
 * ```js
 * SmartQL({
 *   query,
 *   contracts: ['eosio.token'],
 *   rpc_url: 'https://eos.relocke.io'
 * }).then(console.log)
 * ```
 *
 * The logged output was:
 * { "data": { "account": [{ "balance": "… EOS" }] }
 *
 * @example <caption>SmartQL mutation - Transfer EOS tokens with memo.</caption>
 * ```GraphQL
 * mutation {
 *  serialize_transaction(
 *    actions: [{eosio_token: {transfer: {to: eoshackathon, from: pur3miish222, quantity: "4.6692 EOS", memo: "Feigenbaum constant", authorization: {actor: pur3miish222}}}}]
 *  ) {
 *    chain_id
 *    transaction_header
 *    transaction_body
 *  }
 *}
 * ```
 *
 * ```js
 * SmartQL({
 *   query: serialize_transaction,
 *   rpc_url: 'https://eos.relocke.io',
 *   contracts: ['eosio.token'],
 * }).then(console.log)
 * ```
 * The logged output was
 * "data": {
 *   "transfer": {
 *      "chain_id": "2a02a0…",
 *      "transaction_header": "fa453…",
 *      "transaction_body": "82dfe45…"
 *   }
 *  }
 *
 *  ```GraphQL
 *   mutation ($signatures: [signature!]) {
 *     push_transaction(transaction_header: "fa453…", transaction_body: "fafa…" signatures: $signatures) {
 *       transaction_id
 *     }
 *   }
 * ```
 *```js
 *  SmartQL({
 *       query: push_transaction,
 *       variables: {
 *         signatures: [
 *           await sign_txn({
 *             hex: 'fa453…', // <chain_id><transaction_header><transaction_body>
 *             wif_private_key:
 *               '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
 *           })
 *         ]
 *       },
 *       rpc_url: 'https://eos.relocke.io'
 *     }).then(console.log)
 * ```
 * Logged output is successful when transaction_id is present.
 *
 */
async function SmartQL({
  query,
  variables,
  operationName,
  contracts = [],
  rpc_url
}) {
  if (!rpc_url) throw new TypeError('Please provide `rpc_url` string.')

  let documentAST
  try {
    documentAST = parse(new Source(query))
  } catch (err) {
    return { errors: [err.toJSON()] } // If there is a query error return.
  }

  const abis = []

  // Fetch the relevant ABIs for EOSIO accounts.
  try {
    for (const contract of contracts)
      abis.push(await get_abi({ rpc_url, contract }))
  } catch (err) {
    return { errors: [JSON.parse(err.message)] }
  }

  abis.forEach(abi => {
    if (abi.errors) throw abi.errors
  })

  const { query_fields, mutation_fields } = fields_from_abis(abis)

  const queries = new GraphQLObjectType({
    name: 'Query',
    description: 'Query data from the blockchain.',
    fields: {
      blockchain,
      ...query_fields
    }
  })

  const mutations = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Update the state of various `smart contracts`.',
    fields: {
      push_transaction,
      ...mutation_fields
    }
  })

  const schema = new GraphQLSchema({
    query: queries,
    mutation: mutations
  })

  const queryErrors = validate(schema, documentAST)
  if (queryErrors.length) return { errors: queryErrors }

  const { errors, data } = await execute({
    schema: schema,
    document: documentAST,
    rootValue: '',
    contextValue: { rpc_url },
    variableValues: variables,
    operationName,
    fieldResolver: (rootValue, args, ctx, { fieldName }) => rootValue[fieldName]
  })

  return { ...handleErrors(errors), data }
}

module.exports = SmartQL
