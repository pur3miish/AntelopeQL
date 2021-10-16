'use strict'

const { GraphQLError } = require('graphql/error/GraphQLError.js')
const { formatError } = require('graphql/error/formatError.js')
const { execute } = require('graphql/execution/execute.js')
const { parse } = require('graphql/language/parser.js')
const { Source } = require('graphql/language/source.js')
const { validate } = require('graphql/validation/validate.js')
const build_schema = require('./build_schema')
const get_abi = require('./network/get_abi')

/**
 * The core function to build and execute a GraphQL request for EOSIO based blockchains.
 * @name SmartQL
 * @kind function
 * @param {object} arg Argument.
 * @param {string} arg.query GraphQL query string.
 * @param {object} [arg.operationName] GraphQL opperation name.
 * @param {object} [arg.variables] GraphQL variables.
 * @param {string} arg.contract `Account name` that holds the smart contract.
 * @param {string} arg.rpc_url [Nodeos](https://developers.eos.io/manuals/eos/v2.1/nodeos/index) endpoint URL.
 * @param {bool} [arg.broadcast] Specifies if mutation is pushed to the blockchain.
 * @param {Array<string>} [arg.private_keys] List of EOSIO wif private keys.
 * @returns {object} Reponse from a GraphQL query.
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { SmartQL } = require('smartql')
 * ```
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { SmartQL } from 'smartql'
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
 * ```js
 * SmartQL({
 *   query,
 *   contract: 'eosio.token',
 *   rpc_url: 'https://eos.relocke.io'
 * }).then(console.log)
 * ```
 * The logged output was
 * { "data": { "account": [{ "balance": "… EOS" }] }
 *
 * @example <caption>SmartQL mutation - Transfer EOS tokens.</caption>
 * ```GraphQL
 * mutation {
 *  eosio_token(
 *    actions: {
 *      transfer: {
 *        to: eoshackathon,
 *        from: pur3miish222,
 *        quantity: "4.6692 EOS",
 *        memo: "Feigenbaum constant",
 *        authorization: { actor: pur3miish222 }
 *      }
 *    }
 *  ) {
 *    transaction_id
 *  }
 * }
 * ```
 * ```js
 * SmartQL({
 *   query: mutation,
 *   rpc_url: 'https://eos.relocke.io',
 *   contract: 'eosio.token',
 *   private_keys: ['5K7…']
 * }).then(console.log)
 * ```
 * The logged output was
 * "data": {
 *   "transfer": {
 *     "transaction_id": "855ff441ebfc20d0909f81b97ac41ebe29bffbdf996545439ac79bf2e5f4f4ec"
 *   }
 * }
 */
const smartql = async ({
  query,
  contract,
  rpc_url,
  variables,
  operationName,
  broadcast = true,
  private_keys = []
}) => {
  try {
    // Validate graphql query.
    const documentAST = parse(new Source(query))
    // Fetch application binary interface (abi) for a given smart contract.
    const abi = await get_abi({ rpc_url, contract })
    // Build schema.
    const schema = build_schema(abi, contract, broadcast)
    // Validate schema.
    const queryErrors = validate(schema, documentAST)
    if (queryErrors.length) throw new GraphQLError(queryErrors)
    return execute({
      schema,
      document: documentAST,
      rootValue: '',
      contextValue: { rpc_url, private_keys },
      variableValues: variables,
      operationName,
      fieldResolver: (rootValue, args, ctx, { fieldName }) =>
        rootValue[fieldName]
    })
  } catch (err) {
    return {
      errors: Array.isArray(err) ? [...err.map(formatError)] : formatError(err)
    }
  }
}

module.exports = smartql
