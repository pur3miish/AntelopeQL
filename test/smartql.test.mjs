import { deepStrictEqual, ok } from 'assert'
import smartql from '../public/index.js'

export default tests => {
  const rpc_url = "https://api.relocke.io"
  tests.add('SmartQL query', async () => {
    const { data } = await smartql({
      query: /* GraphQL */ `
        {
          account(scope: "eoshackathon") {
            balance
          }
        }
      `,
      rpc_url,
      contract: 'eosio.token'
    })
    // shape of the result is {"data":{"account":[{"balance":"asset"},{"balance":asset}]}}
    ok(data.account[0].balance, 'Smartql Expected balance.')
  })
  tests.add('SmartQL mutation non signing transfer', async () => {
    const { data } = await smartql({
      query: /* GraphQL */ `
        mutation {
          transfer(
            data: {
              to: "ihack4google"
              from: "eoshackathon"
              memo: ""
              quantity: "0.0001 EOS"
            }
            authorization: { actor: "eoshackathon" }
          ) {
            chain_id
            transaction_body
            transaction_header
          }
        }
      `,
      rpc_url,
      contract: 'eosio.token'
    })

    const trn_bdy =
      '000100a6823403ea3055000000572d3ccdcd013069cb0622d3305500000000a8ed3232213069cb0622d33055a022a39411884c73010000000000000004454f530000000000000000000000000000000000000000000000000000000000000000000000000000'
    deepStrictEqual(data.transfer.transaction_body, trn_bdy)
  })

  tests.add('SmartQL mutation vote producer', async () => {
    const vote_producer = /* GraphQL */ `
      mutation {
        voteproducer(
          data: {
            voter: "eoshackathon"
            proxy: ""
            producers: ["alohaeostest"]
          }
          authorization: [{ actor: "eoshackathon" }]
        ) {
          transaction_body
        }
      }
    `

    const { data } = await smartql({
      query: vote_producer,
      rpc_url,
      contract: 'eosio'
    })

    deepStrictEqual(
      data.voteproducer.transaction_body,
      '00010000000000ea30557015d289deaa32dd013069cb0622d3305500000000a8ed3232193069cb0622d3305500000000000000000190b1ca982ad36834000000000000000000000000000000000000000000000000000000000000000000',
      'Mutation on vote producer'
    )
  })
}
