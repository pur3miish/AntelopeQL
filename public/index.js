'use strict'

const { Source, execute, parse, validate, formatError } = require('graphql')
const build_schema = require('../private/build_schema')
const get_abi = require('../private/network/get_abi')

/**
 * The core function to build and execute a GraphQL request.
 * @name SmartQL
 * @kind function
 * @param {object} arg argument.
 * @param {string} arg.query GraphQL query string.
 * @param {string} arg.contract Account name that holds the smart constract.
 * @param {string[]} arg.rpc_urls List of URLs to connect to RPC.
 * @param {object} [arg.variables] GraphQL variables.
 * @param {object} [arg.operationName] GraphQL opperation name.
 * @param {Function} [arg.sign] Digital signature function.
 * @returns {object} Reponse from a GraphQL query.
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const SmartQL = require('smartql')
 * ```
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import SmartQL from 'smartql'
 * ```
 * @example <caption>SmartQL query - Get user balance.</caption>
 * ```js
 * const query = `{
 *   account(scope: "eosio") {
 *     balance
 *   }
 * }`
 *
 * const rpc_urls =  ['https://jungle3.cryptolions.io:443', 'https://jungle.eosphere.io:443']
 *
 * SmartQL({
 *  query,
 *  contract: "eosio.token",
 *  rpc_urls
 * }).then(console.log)
 *
 * The logged output was
 * { "data": { "account": [{ "balance": "1297726572.6175 EOS" }] }
 * ```
 * @example <caption>SmartQL mutation - Transfer EOS tokens.</caption>
 * ```js
 * import { sign } from "eos-ecc"
 *
 * const query = `
 * mutation {
 *  transfer(
 *    data: {
 *     to: "ihack4google",
 *     from: "eoshackathon",
 *     memo: "Feigenbaum constants",
 *     quantity: "4.6692 EOS"
 *    },
 *   authorization: {
 *     actor: "eoshackathon"
 *   }) {
 *   transaction_id
 *   block_time
 *   resource_cost {
 *      cpu_usage_us
 *      net_usage_words
 *      status
 *    }
 *   }
 * }
 *
 * const rpc_urls =  ['https://jungle3.cryptolions.io:443', 'https://jungle.eosphere.io:443']
 *
 * SmartQL({
 *   query,
 *   rpc_urls,
 *   contract: "eosio.token",
 *   sign
 * }).then(console.log)
 *
 * The logged output was
 * "data": {
 *   "transfer": {
 *     "transaction_id": "855ff441ebfc20d0909f81b97ac41ebe29bffbdf996545439ac79bf2e5f4f4ec",
 *     "block_time": "2021-03-24T11:24:33.500",
 *     "resource_cost": { "cpu_usage_us": 407, "net_usage_words": 23, "status": "executed" } } \
 *    }
 *  }
 * ```
 */
const SmartQL = async ({
  query,
  contract,
  rpc_urls,
  variables,
  operationName,
  sign
}) => {
  try {
    let documentAST
    try {
      documentAST = parse(new Source(query))
    } catch (err) {
      throw new Error(err)
    }

    const abi = await get_abi({
      rpc_urls,
      contract
    })

    const schema = build_schema(abi, contract, sign)
    const queryErrors = validate(schema, documentAST)
    if (queryErrors.length) throw queryErrors

    const result = await execute({
      schema,
      document: documentAST,
      rootValue: '',
      contextValue: {
        contract,
        rpc_urls
      },
      variableValues: variables,
      operationName,
      fieldResolver: (rootValue, args, ctx, { fieldName }) =>
        rootValue[fieldName]
    })

    return result
  } catch (err) {
    return {
      errors: Array.isArray(err) ? [...err.map(formatError)] : formatError(err)
    }
  }
}

module.exports = SmartQL
