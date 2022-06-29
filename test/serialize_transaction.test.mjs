import { ok } from 'assert'
import { SmartQL } from '../public/index.js'

export default tests => {
  tests.add('SmartQL serialized transaction output.', async () => {
    const update_auth_query = /* GraphQL */ `
      mutation {
        eosio(
          actions: {
            updateauth: {
              account: "relockechain"
              permission: "active"
              parent: "owner"
              auth: {
                threshold: 2
                keys: [
                  {
                    key: "EOS8GZG8ohHvxyeimP6QvBokmPamtLTwGsVJugcXbFnHtYjJQMotH"
                    weight: 1
                  }
                  {
                    key: "EOS7QpboRz6DFBtzaHbN6pJZq8HX99w4ZWqsGsdzPzQgUgP9ESgfy"
                    weight: 1
                  }
                ]
                accounts: [
                  {
                    weight: 1
                    permission: { actor: "relockechain", permission: "poo" }
                  }
                ]
                waits: [{ wait_sec: 2, weight: 3 }]
              }
              authorization: { actor: "relockechain" }
            }
          }
        ) {
          chain_id
          transaction_header
          transaction_body
        }
      }
    `

    const update_auth_query_two = /* GraphQL */ `
      mutation {
        eosio(
          actions: {
            updateauth: {
              account: "relockechain"
              permission: "active"
              parent: "owner"
              auth: {
                threshold: 2
                keys: [
                  {
                    key: "EOS8GZG8ohHvxyeimP6QvBokmPamtLTwGsVJugcXbFnHtYjJQMotH"
                    weight: 1
                  }
                  {
                    key: "EOS7QpboRz6DFBtzaHbN6pJZq8HX99w4ZWqsGsdzPzQgUgP9ESgfy"
                    weight: 1
                  }
                ]
                accounts: []
                waits: []
              }
              authorization: { actor: "relockechain" }
            }
          }
        ) {
          chain_id
          transaction_header
          transaction_body
        }
      }
    `

    const {
      data: {
        eosio: { transaction_body }
      }
    } = await SmartQL({
      query: update_auth_query,
      contracts: ['eosio'],
      broadcast: 0,
      rpc_url: 'https://jungle.relocke.io'
    })

    ok(
      transaction_body ==
        '00010000000000ea30550040cbdaa86c52d501309d69484144a3ba00000000a8ed32327f309d69484144a3ba00000000a8ed32320000000080ab26a702000000020003bd31e9df14045cc250caa8a08b6732f116dbf981c1eb4ac8de226a325d5800bb010000034c43ad3d5058ac72785e3e835e1c1c9d80fbf9891f5ed733881d52443d433c21010001309d69484144a3ba00000000000028ad010001020000000300000000000000000000000000000000000000000000000000000000000000000000',
      'Update auth transaction data'
    )

    const {
      data: {
        eosio: { transaction_body: tx2 }
      }
    } = await SmartQL({
      query: update_auth_query_two,
      contracts: ['eosio'],
      broadcast: 0,
      rpc_url: 'https://jungle.relocke.io'
    })

    ok(
      tx2 ==
        '00010000000000ea30550040cbdaa86c52d501309d69484144a3ba00000000a8ed323267309d69484144a3ba00000000a8ed32320000000080ab26a702000000020003bd31e9df14045cc250caa8a08b6732f116dbf981c1eb4ac8de226a325d5800bb010000034c43ad3d5058ac72785e3e835e1c1c9d80fbf9891f5ed733881d52443d433c2101000000000000000000000000000000000000000000000000000000000000000000000000',
      'Update auth transaction data 2'
    )
  })
}
