'use strict'

const { public_key_from_private } = require('eos-ecc')
const { Source, execute, parse, validate, formatError } = require('graphql')
const build_schema = require('../private/build_schema')
const get_abi = require('../private/network/get_abi')
const get_account_by_authorizers = require('../private/network/get_accounts_by_authorizers.js')

/**
 * The core function to build and execute a GraphQL request.
 * @name SmartQL
 * @kind function
 * @param {object} arg Argument.
 * @param {string} arg.query GraphQL query string.
 * @param {string} arg.contract Account name that holds the smart constract.
 * @param {Array<string>} arg.rpc_urls List of URLs to connect to RPC.
 * @param {object} [arg.variables] GraphQL variables.
 * @param {object} [arg.operationName] GraphQL opperation name.
 * @param {Array<string>} [arg.private_keys] List of EOS wif private keys.
 * @returns {object} Reponse from a GraphQL query.
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const SmartQL = require('smartql')
 * ```
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import SmartQL from 'smartql'
 * ```
 * @example <caption>SmartQL query - Get account balance.</caption>
 * ```GraphQL
 * query { account(scope: "eosio") { balance } }
 * ```
 * ```js
 * SmartQL({
 *   query,
 *   contract: 'eosio.token',
 *   rpc_urls: ['https://jungle3.cryptolions.io:443'],
 *   private_keys: ['5a12…']
 * }).then(console.log)
 * ```
 * The logged output was
 * { "data": { "account": [{ "balance": "… EOS" }] }
 *
 * @example <caption>SmartQL mutation - Transfer EOS tokens.</caption>
 * ```GraphQL
 * mutation {
 *  transaction(
 *    actions: {
 *      transfer: {
 *        to: eoshackathon,
 *        from: pur3miish222,
 *        quantity: "4.6692 EOS",
 *        memo: "Feigenbaum constant",
 *        authorization: { actor: pur3miish222 }
 *    }
 *  }
 * ) {
 *    transaction_id
 * }
 * }
 * ```
 * ```js
 * SmartQL({
 *   query: mutation,
 *   rpc_urls: ['https://jungle3.cryptolions.io:443'],
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
const SmartQL = async ({
  query,
  contract,
  rpc_urls,
  variables,
  operationName,
  private_keys = []
}) => {
  try {
    let documentAST
    try {
      // Validate graphql query.
      documentAST = parse(new Source(query))
    } catch (err) {
      throw new Error(err)
    }

    // fetch ABI for a given smart contract.
    const abi = await get_abi({
      rpc_urls,
      contract
    })

    let key_chain = []
    let auth_accounts

    if (private_keys.length) {
      // Remove duplicate keys
      const private_key_set = new Set()
      private_keys.forEach(i => private_key_set.add(i))

      // Validate wif private keys and calcualte the corresponding public key.
      key_chain = await Promise.all(
        [...private_key_set].map(async pk => ({
          public_key: await public_key_from_private(pk),
          private_key: pk
        }))
      )

      // Fetch valid account authorities from the calculated public keys.
      const { accounts } = await get_account_by_authorizers({
        rpc_urls,
        keys: key_chain.map(({ public_key }) => public_key)
      })
      auth_accounts = accounts
    }

    // build schema
    const schema = build_schema(abi, contract)
    const queryErrors = validate(schema, documentAST)
    if (queryErrors.length) throw queryErrors

    const result = await execute({
      schema,
      document: documentAST,
      rootValue: '',
      contextValue: {
        contract,
        rpc_urls,
        key_chain,
        auth_accounts
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
