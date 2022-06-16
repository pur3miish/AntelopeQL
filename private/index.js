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
 * @param {Array<string>} arg.contracts List of accounts that holds smart contracts.
 * @param {string} arg.rpc_url [Nodeos](https://developers.eos.io/manuals/eos/v2.1/nodeos/index) endpoint URL.
 * @param {bool} [arg.broadcast] Specifies if mutation will return `packed transaction` or `transaction receipt`.
 * @param {Array<string>} [arg.private_keys] List of EOSIO wif private keys.
 * @param {object} [extensions] Extend the GraphQL schema by providing mutations and query fields.
 * @param {object} [extensions.query_fields] GraphQL query fields.
 * @param {object} [extensions.mutation_fields] GraphQL mutation fields.
 * @returns {packed_transaction | transaction_receipt} Response from the SmartQL (graphql) query.
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
 *
 * ```js
 * SmartQL({
 *   query: mutation,
 *   rpc_url: 'https://eos.relocke.io',
 *   contracts: ['eosio.token'],
 *   private_keys: ['5K7…']
 * }).then(console.log)
 * ```
 * The logged output was
 * "data": {
 *   "transfer": {
 *     "transaction_id": "855ff441ebfc20d0909f81b97ac41ebe29bffbdf996545439ac79bf2e5f4f4ec"
 *   }
 *  }
 */
async function SmartQL(
  {
    query,
    contracts,
    rpc_url,
    variables,
    operationName,
    broadcast = true,
    private_keys = []
  },
  { query_fields = {}, mutation_fields = {} } = {
    query_fields: {},
    mutation_fields: {}
  }
) {
  let documentAST
  try {
    documentAST = parse(new Source(query))
  } catch (err) {
    return { errors: [err.toJSON()] } // if there is a query error return.
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

  let index = 0

  try {
    for (const { abi, error } of abis) {
      if (!abi)
        return {
          errors: [
            {
              message: `No smart contract found for “${contracts[index]}”.`,
              ...error
            }
          ]
        }

      const abi_ast = abi_to_ast(abi, contracts[index])

      let ast_name = contracts[index].replace(/[.]+/gmu, '_')
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
        ...build_mutation_fields(abi_ast, broadcast)
      }

      index++
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
      ...eosio_mutation_fields,
      ...transactions(eosio_mutation_fields, _abi_ast, broadcast)
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
      rpc_url,
      private_keys
    },
    variableValues: variables,
    operationName,
    fieldResolver: (rootValue, args, ctx, { fieldName }) => rootValue[fieldName]
  })

  return { ...handleErrors(errors), data }
}

module.exports = SmartQL
