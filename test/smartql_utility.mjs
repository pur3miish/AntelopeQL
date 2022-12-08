import { createRequire } from 'module'
import {
  GraphQLObjectType,
  GraphQLSchema,
  Source,
  execute,
  parse,
  validate
} from 'graphql'
import fetch from 'node-fetch'
import build_graphql_fields_from_abis from '../build_graphql_fields_from_abis.js'
import actions from '../graphql_input_types/actions.js'
import serialize_transaction from '../serialize_transaction.js'

const require = createRequire(import.meta.url)
const ABI_LIST = [
  { account_name: 'eosio', abi: require('./abis/eosio.json') },
  { account_name: 'eosio.token', abi: require('./abis/eosio.token.json') },
  { account_name: 'nutrijournal', abi: require('./abis/nutrientjrn.abi.json') },
  {
    account_name: 'relockeblock',
    abi: require('./abis/variantTypeExample.abi.json')
  }
]

const { mutation_fields, query_fields, ast_list } =
  build_graphql_fields_from_abis(ABI_LIST)

const queries = new GraphQLObjectType({
  name: 'Query',
  description: 'Query table data from EOSIO blockchain.',
  fields: query_fields
})

const action_fields = actions(mutation_fields)
const mutations = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Push transactions to the blockchain.',
  fields: {
    serialize_transaction: serialize_transaction(action_fields, ast_list)
  }
})

const schema = new GraphQLSchema({ query: queries, mutation: mutations })

const SmartQL = query => {
  const document = parse(new Source(query))
  const queryErrors = validate(schema, document)
  if (queryErrors.length) throw queryErrors

  const smartql_rpc = { fetch, rpc_url: 'http://127.0.0.1:8888' }

  return execute({
    schema,
    document,
    contextValue: {
      smartql_rpc
    },
    fieldResolver(rootValue, args, ctx, { fieldName }) {
      return rootValue[fieldName]
    }
  })
}

export default SmartQL
