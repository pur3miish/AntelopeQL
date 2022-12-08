import fetch from 'node-fetch'
import smartql from '../smartql.js'

const smartql_rpc = { fetch, rpc_url: process.env.rpc_url }

export default async tests => {
  tests.add('smartql tests', async () => {
    console.log(
      await smartql(
        { query: /* GraphQL */ `` },
        { contracts: ['relockeblock'] },
        smartql_rpc
      )
    )
  })
}
