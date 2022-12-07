'use strict'
const {
  GraphQLError,
  GraphQLObjectType,
  GraphQLSchema,
  parse,
  Source,
  validate,
  execute
} = require('graphql')
const blockchain = require('./blockchain/index.js')
const build_graphql_fields_from_abis = require('./build_graphql_fields_from_abis.js')
const actions = require('./graphql_input_types/actions.js')
const push_serialized_transaction = require('./push_serialized_transaction.js')
const push_transaction = require('./push_transaction.js')
const serialize_transaction = require('./serialize_transaction.js')

/**
 * SmartQL’s remote procedure call (RPC) object for interacting with EOSIO based blockchains.
 * @kind typedef
 * @name SmartQLRPC
 * @type {object}
 * @prop {Function} fetch Your fetch implimentation.
 * @prop {string} rpc_url Remote proceedure call (RPC) Uniform Resource Locator (URL).
 * @ignore
 */

/**
 * The core function for interacting with blockchain.
 * @kind function
 * @name smartql
 * @param {object} GraphQLQuery Object that [GraphQL.execute](https://graphql.org/graphql-js/execution/#:~:text=execute,-export%20function%20execute&text=Implements%20the%20%22Evaluating%20requests%22%20section,immediately%20explaining%20the%20invalid%20input.) will consume.
 * @param {string} GraphQLQuery.query GraphQL query that will instuct SmartQL what CRUD operation to perform on the EOSIO based blockchain.
 * @param {object} [GraphQLQuery.variableValues] GraphQL variables.
 * @param {string} [GraphQLQuery.operationName] GraphQL operation name (query resolution).
 * @param {object} SmartQL Argument
 * @param {Array<string>} [SmartQL.contracts] List of EOSIO accounts that hold smart contract you wish to interact with.
 * @param {Array<string>} [SmartQL.private_keys] List of wif private keys that will be used to sign transaction actions aka mutations.
 * @param {SmartQLRPC} smartql_rpc Argument.
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const smartql = require('smartql')
 * ```
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import smartql from 'smartql'
 * ```
 * @example <caption>`Usage`</caption>
 * ```js
 * import fetch from 'isomorphic-fetch' // Your fetch implementation.
 * const query = `{ eosio_token { accounts(arg: { scope: "relockeblock" }){ balance } } }`
 * const smartql_rpc = { fetch, rpc_url: 'https://eos.relocke.io' } // connection configuration
 *
 * smartql({ query }, { contracts: ['eosio.token'] }, smartql_rpc }).then(console.log)
 * ```
 * > Logged output was "data": {"eosio_token": {"accounts": [{"balance": "100.0211 EOS"}]}}}
 */
async function smartql(
  { query, variableValues, operationName },
  { contracts = [], private_keys = [] },
  smartql_rpc
) {
  try {
    const { fetch, rpc_url } = smartql_rpc
    const uri = `${rpc_url}/v1/chain/get_abi`

    const abi_req = contracts.map(account_name =>
      fetch(uri, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          account_name,
          json: true
        })
      }).then(req => req.json())
    )

    const ABIs = await Promise.all(abi_req)
    for (let i = 0; i < contracts.length; i++) {
      if (ABIs[i].error)
        throw new GraphQLError(ABIs[i].message, { extensions: ABIs[i] })
      if (!ABIs[i].abi)
        throw new GraphQLError(`No smart contract found for “${contracts[i]}”.`)
    }

    const { mutation_fields, query_fields, ast_list } =
      build_graphql_fields_from_abis(ABIs)

    const queries = new GraphQLObjectType({
      name: 'Query',
      description: 'Query table data from EOSIO blockchain.',
      fields: { blockchain, ...query_fields }
    })

    const action_fields = actions(mutation_fields)

    const mutations = new GraphQLObjectType({
      name: 'Mutation',
      description: 'Push transactions to the blockchain.',
      fields: {
        push_transaction: push_transaction(action_fields, ast_list),
        serialize_transaction: serialize_transaction(action_fields, ast_list),
        push_serialized_transaction
      }
    })

    const schema = new GraphQLSchema({
      query: queries,
      mutation: mutations
    })

    const document = parse(new Source(query))
    const queryErrors = validate(schema, document)
    if (queryErrors.length) return { errors: queryErrors }

    return execute({
      schema,
      document,
      rootValue: '',
      contextValue: {
        smartql_rpc,
        private_keys
      },
      variableValues,
      operationName,
      fieldResolver(rootValue, args, ctx, { fieldName }) {
        return rootValue[fieldName]
      }
    })
  } catch (err) {
    return { errors: [err] }
  }
}

module.exports = smartql
