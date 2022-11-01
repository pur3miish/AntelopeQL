'use strict'

const {
  GraphQLObjectType,
  GraphQLSchema,
  validate,
  execute,
  Source,
  parse
} = require('graphql')
const handleErrors = require('../private/handle_errors.js')
const abi_to_ast = require('./abi_to_ast.js')
const build_mutation_fields = require('./build_mutation_fields/index.js')
const transactions = require('./build_mutation_fields/transactions.js')
const build_query_fields = require('./build_query_fields/index.js')
const push_transaction = require('./chain_mutation_fields/push_transaction.js')
const chain_queries_fields = require('./chain_queries_fields/index.js')
const get_abi = require('./network/get_abi.js')

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
 * @param {object} [extensions] Extend the GraphQL schema by providing additional mutations and query fields.
 * @param {object} [extensions.query_fields] GraphQL query fields.
 * @param {object} [extensions.mutation_fields] GraphQL mutation fields.
 * @returns {packed_transaction} Response from the SmartQL (graphql) query.
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { SmartQL } = require('smartql')
 * const { sign_txn } = require('eos-ecc')
 * ```
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { SmartQL } from 'smartql'
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
async function SmartQL(
  { query, variables, operationName, contracts = [], rpc_url },
  { query_fields = {}, mutation_fields = {} } = {
    query_fields: {},
    mutation_fields: {}
  }
) {
  if (!rpc_url) throw new TypeError('Please provide `rpc_url` string.')

  let documentAST
  try {
    documentAST = parse(new Source(query))
  } catch (err) {
    return { errors: [err.toJSON()] } // If there is a query error return.
  }

  let eosio_mutation_fields = {}
  const abis = []

  // Fetch the relevant ABIs for EOSIO accounts.
  try {
    for (const contract of contracts)
      abis.push(await get_abi({ rpc_url, contract }))
  } catch (err) {
    return { errors: [JSON.parse(err.message)] }
  }

  let _abi_ast = {}

  try {
    for (const { abi, error, account_name } of abis) {
      if (!abi)
        return {
          errors: [
            {
              message: `No smart contract found for “${account_name}”.`,
              ...error
            }
          ]
        }

      const abi_ast = abi_to_ast(abi, account_name)

      let ast_name = account_name.replace(/[.]+/gmu, '_')
      ast_name = ast_name.match(/^[1-5]/gmu) ? '_' + ast_name : ast_name

      _abi_ast = {
        ..._abi_ast,
        [ast_name]: abi_ast
      }

      query_fields = {
        ...query_fields,
        ...build_query_fields(abi_ast)
      }

      eosio_mutation_fields = {
        ...eosio_mutation_fields,
        ...build_mutation_fields(abi_ast)
      }
    }
  } catch (err) {
    return handleErrors(JSON.parse(err.message))
  }

  const queries = new GraphQLObjectType({
    name: 'Query',
    description: 'Query data from the blockchain.',

    fields: {
      blockchain: {
        description: `Retrieve various stats and data for the state of the blockchain (including account and currency info).`,
        type: new GraphQLObjectType({
          name: 'blockchain',
          fields: {
            ...chain_queries_fields
          }
        }),
        resolve() {
          return {}
        }
      },
      ...query_fields
    }
  })

  const mutations = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Update the state of various `smart contracts`.',
    fields: {
      push_transaction,
      ...mutation_fields,
      ...transactions(eosio_mutation_fields, _abi_ast)
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
    contextValue: {
      rpc_url
    },
    variableValues: variables,
    operationName,
    fieldResolver: (rootValue, args, ctx, { fieldName }) => rootValue[fieldName]
  })

  return { ...handleErrors(errors), data }
}

module.exports = SmartQL
