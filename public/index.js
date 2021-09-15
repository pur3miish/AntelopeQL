'use strict'

const { public_key_from_private } = require('eos-ecc')
const {
  Source,
  execute,
  parse,
  validate,
  formatError,
  GraphQLError
} = require('graphql')
const build_schema = require('../private/build_schema')
const get_abi = require('../private/network/get_abi')

/**
 * The core function to build and execute a GraphQL request for EOSIO based blockchain.
 * @name SmartQL
 * @kind function
 * @param {object} arg Argument.
 * @param {string} arg.query GraphQL query string.
 * @param {string} arg.contract Account name that holds the smart contract.
 * @param {string} arg.rpc_url Endpoint URL to connect to the blockchain.
 * @param {object} [arg.variables] GraphQL variables.
 * @param {bool} [arg.broadcast] Push the transaction to the blockchain, else return the serialized transaction.
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
 *   rpc_url: 'https://eos.relocke.io'
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
const SmartQL = async ({
  query,
  contract,
  rpc_url,
  variables,
  operationName,
  private_keys = [],
  broadcast = true
}) => {
  try {
    let documentAST

    // Validate graphql query.
    documentAST = parse(new Source(query))

    let key_chain = []

    if (broadcast && private_keys.length) {
      // Remove any duplicate keys.
      private_keys = [...new Set(private_keys)]

      // Validate wif private keys and calc the corresponding public key(s).
      key_chain = await Promise.all(
        [...private_keys].map(async pk => ({
          public_key: await public_key_from_private(pk),
          private_key: pk
        }))
      )
    }

    // Fetch application binary interface (abi) for a given smart contract.
    const abi = await get_abi({ rpc_url, contract })
    // build schema
    const schema = build_schema(abi, contract, broadcast)
    // validate schema
    const queryErrors = validate(schema, documentAST)
    if (queryErrors.length) throw new GraphQLError(queryErrors)

    const result = await execute({
      schema,
      document: documentAST,
      rootValue: '',
      contextValue: {
        contract,
        rpc_url,
        key_chain
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
