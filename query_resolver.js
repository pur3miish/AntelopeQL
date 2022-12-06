'use strict'
const { GraphQLError } = require('graphql')

/**
 * SmartQL Query resolver.
 * @param {object} root GraphQL resolver root query.
 * @param {string} root.code Contract code calling, passed from smartql_fields resolver.
 * @param {object} args Query arguments.
 * @param {object} args.arg argument data.
 * @param {object} ctx GraphQL context.
 * @param {SmartQLRPC} ctx.smartql_rpc Object containing connection url and fetch.
 * @param {object} info GraphQL resovler info argument.
 * @returns {object} Returned data from table.
 */
async function query_resolver({ code }, { arg }, { smartql_rpc }, info) {
  const { fetch, rpc_url } = smartql_rpc
  const { fieldName: query_name } = info
  const table = query_name.replace(/_/gmu, '.')

  const uri = rpc_url + '/v1/chain/get_table_rows'

  const req = await fetch(uri, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ json: true, code, table, ...arg })
  })

  const data = await req.json()

  if (data.error) throw new GraphQLError(data.message, { extensions: data })

  return data.rows
}

module.exports = query_resolver
