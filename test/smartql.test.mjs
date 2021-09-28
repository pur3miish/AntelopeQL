import { ok } from 'assert'
import smartql from '../public/index.js'

export default tests => {
  const rpc_url = 'https://jungle.relocke.io'
  tests.add('SmartQL balance query', async () => {
    const { data: query_data } = await smartql({
      query: /* GraphQL */ `
        {
          account(arg: { scope: "eosio" }) {
            balance
          }
        }
      `,
      rpc_url,
      contract: 'eosio.token'
    })

    ok(query_data.account[0].balance.match(/^[0-9.]+[\sA-Z]+$/gmu))

    const {
      data: {
        eosio_token: { transaction_body }
      }
    } = await smartql({
      query: /* GraphQL */ `
        mutation {
          eosio_token(
            actions: {
              transfer: {
                to: "relocke"
                from: "eosio"
                memo: "0"
                quantity: "50000.0000 EOS"
                authorization: { actor: "eosio" }
              }
            }
            configuration: { delay_sec: 4, max_cpu_usage_ms: 0 }
          ) {
            chain_id
            transaction_header
            transaction_body
          }
        }
      `,
      rpc_url,
      contract: 'eosio.token',
      broadcast: false
    })

    ok(
      transaction_body ==
        '000100a6823403ea3055000000572d3ccdcd010000000000ea305500000000a8ed3232220000000000ea3055000000404144a3ba0065cd1d0000000004454f53000000000130000000000000000000000000000000000000000000000000000000000000000000',
      'Expected output for token transfer.'
    )
  })
}
