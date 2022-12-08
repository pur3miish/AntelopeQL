import { deepStrictEqual } from 'assert'
import SmartQL from './smartql_utility.mjs'

export default async tests => {
  tests.add('serialize_transaction mutations', async () => {
    const eosio_setparams = /* GraphQL */ `
      mutation {
        serialize_transaction(
          actions: [
            {
              eosio: {
                setparams: {
                  params: {
                    blockchain_parameters_t: {
                      max_block_net_usage: 45
                      target_block_net_usage_pct: 90
                      max_transaction_net_usage: 4
                      base_per_transaction_net_usage: 4
                      net_usage_leeway: 4
                      context_free_discount_net_usage_num: 4
                      context_free_discount_net_usage_den: 100
                      max_block_cpu_usage: 4
                      target_block_cpu_usage_pct: 4
                      max_transaction_cpu_usage: 4
                      min_transaction_cpu_usage: 4
                      max_transaction_lifetime: 4
                      deferred_trx_expiration_window: 567
                      max_transaction_delay: 45
                      max_inline_action_size: 4
                      max_inline_action_depth: 4
                      max_authority_depth: 94
                      max_action_return_value_size: 984
                    }
                  }
                }
              }
            }
          ]
        ) {
          transaction_body
        }
      }
    `

    deepStrictEqual(
      (await SmartQL(eosio_setparams)).data.serialize_transaction
        .transaction_body,
      '010000000000ea30550000c0d25c53b3c200482d000000000000005a00000004000000040000000400000004000000640000000400000004000000040000000400000004000000370200002d0000000400000004005e00d803000000000000000000000000000000000000000000000000000000000000000000000000',
      'eosio::setparams'
    )

    const context_free_action = /* GraphQL */ `
      mutation {
        serialize_transaction(
          actions: [
            { nutrijournal: { login: { account: "relockeblock" } } }
            {
              eosio_token: {
                transfer: {
                  from: "nutrijournal"
                  to: "relockeblock"
                  memo: ""
                  quantity: "0.0001 EOS"
                  authorization: { actor: "relockeblock" }
                }
              }
            }
          ]
        ) {
          transaction_body
        }
      }
    `

    deepStrictEqual(
      (await SmartQL(context_free_action)).data.serialize_transaction
        .transaction_body,
      '0110cdbc9a3e77b39e0000000080e9188d000800118d474144a3ba0100a6823403ea3055000000572d3ccdcd0100118d474144a3ba00000000a8ed32322110cdbc9a3e77b39e00118d474144a3ba010000000000000004454f530000000000000000000000000000000000000000000000000000000000000000000000000000',
      'context free action with eosio.token transfer.'
    )

    const eosio_update_auth = /* GraphQL */ `
      mutation updateauth {
        serialize_transaction(
          actions: [
            {
              eosio: {
                updateauth: {
                  authorization: { actor: "relockeblock" }
                  account: "relocke"
                  permission: "active"
                  parent: "owner"
                  authorized_by: "relockeblock"
                  auth: {
                    keys: [
                      {
                        key: "EOS5FfrbHXE3oC3BDZNCTHEqkxEQFGJSeQMnq8yWa2eJLdZYYP6TU"
                        weight: 1
                      }
                      {
                        key: "EOS6hMLF2sPrxhu9SK4dJ9LaZimfzgfmP7uX1ahUPJUcUpS4p2G39"
                        weight: 2
                      }
                    ]
                    waits: [{ wait_sec: 14, weight: 2 }]
                    threshold: 1
                    accounts: [
                      {
                        weight: 2
                        permission: {
                          actor: "nutrijournal"
                          permission: "active"
                        }
                      }
                    ]
                  }
                }
              }
            }
          ]
        ) {
          transaction_body
        }
      }
    `

    deepStrictEqual(
      (await SmartQL(eosio_update_auth)).data.serialize_transaction
        .transaction_body,
      '00010000000000ea30550040cbdaa86c52d50100118d474144a3ba00000000a8ed32328701000000404144a3ba00000000a8ed32320000000080ab26a70100000002000230181e888a73d27774005d50cdbd1b34f0d9d62a02077682187e9c3b39f1e0ca01000002ee19f0d3ca1c117ce6e066d57fbb3b1bab6db917d60fc22d501d97857e01ef1402000110cdbc9a3e77b39e00000000a8ed32320200010e000000020000118d474144a3ba000000000000000000000000000000000000000000000000000000000000000000',
      'eosio::updateauth.'
    )

    const powerup_query = /* GraphQL */ `
      mutation {
        serialize_transaction(
          actions: [
            {
              eosio: {
                powerup: {
                  authorization: { actor: nutrijournal }
                  days: 1
                  payer: nutrijournal
                  receiver: nutrijournal
                  net_frac: "900000"
                  cpu_frac: "900000"
                  max_payment: "0.5000 EOS"
                }
              }
            }
          ]
        ) {
          transaction_body
        }
      }
    `

    deepStrictEqual(
      (await SmartQL(powerup_query)).data.serialize_transaction
        .transaction_body,
      '00010000000000ea3055000000a0eaab38ad0110cdbc9a3e77b39e00000000a8ed32323410cdbc9a3e77b39e10cdbc9a3e77b39e01000000a0bb0d0000000000a0bb0d0000000000881300000000000004454f5300000000000000000000000000000000000000000000000000000000000000000000000000',
      'eosio::powerup serialization.'
    )

    const nutrientjrnl_addnutrient = /* GraphQL */ `
      mutation transation {
        serialize_transaction(
          actions: [
            {
              nutrijournal: {
                addnutrient: {
                  nutrient: water
                  hashname: "039058c6f2c0cb492c533b0a4d14ef77cc0f78abccced5287d84a1a2011cfb81"
                  fullname: "water"
                  essential: true
                  classification: "macronutrient"
                  info: [
                    {
                      text: "Water contains one part oxygen and two parts hydrogen."
                      ref: [2, 34]
                    }
                    { text: "water is essential to life.", ref: [1, 2, 6] }
                  ]
                  foods: ["apples", "oranges"]
                  authorization: [{ actor: "nutrijournal" }]
                }
              }
            }
          ]
        ) {
          transaction_body
        }
      }
    `

    deepStrictEqual(
      (await SmartQL(nutrientjrnl_addnutrient)).data.serialize_transaction
        .transaction_body,
      '000110cdbc9a3e77b39e00f254ee663d53320110cdbc9a3e77b39e00000000a8ed3232d0010000000080abb2e101039058c6f2c0cb492c533b0a4d14ef77cc0f78abccced5287d84a1a2011cfb81010577617465720101010d6d6163726f6e75747269656e740236576174657220636f6e7461696e73206f6e652070617274206f787967656e20616e642074776f20706172747320687964726f67656e2e02020000000000000022000000000000001b776174657220697320657373656e7469616c20746f206c6966652e03010000000000000002000000000000000600000000000000020000000060156b35000000002b36cda5000000000000000000000000000000000000000000000000000000000000000000',
      'nutrijournal::addnutrient'
    )

    const optional_example_nutrientjrnl = /* GraphQL */ `
      mutation transation {
        serialize_transaction(
          actions: [
            {
              nutrijournal: {
                addnutrient: {
                  nutrient: water
                  fullname: "water"
                  classification: "macronutrient"
                  info: []
                  foods: []
                  authorization: [{ actor: "nutrijournal" }]
                }
              }
            }
          ]
        ) {
          transaction_body
        }
      }
    `
    deepStrictEqual(
      (await SmartQL(optional_example_nutrientjrnl)).data.serialize_transaction
        .transaction_body,
      '000110cdbc9a3e77b39e00f254ee663d53320110cdbc9a3e77b39e00000000a8ed3232220000000080abb2e1000105776174657200010d6d6163726f6e75747269656e740000000000000000000000000000000000000000000000000000000000000000000000',
      'nutrijournal::addnutrient with optional arguments'
    )

    const variantexample = /* GraphQL */ `
      mutation {
        serialize_transaction(
          actions: [
            {
              relockeblock: {
                variantex: {
                  cool: { coolinfo: { lasetname: "locke", first: "john" } }
                  authorization: { actor: "relockeblock" }
                }
              }
            }
          ]
        ) {
          transaction_body
        }
      }
    `
    deepStrictEqual(
      (await SmartQL(variantexample)).data.serialize_transaction
        .transaction_body,
      '000100118d474144a3ba0000e82a4fe3aed90100118d474144a3ba00000000a8ed32320f010000000000301b7d056c6f636b65000000000000000000000000000000000000000000000000000000000000000000',
      'variant ABI type example.'
    )
    const variantexample2 = /* GraphQL */ `
      mutation {
        serialize_transaction(
          actions: [
            {
              relockeblock: {
                variantex: {
                  cool: { asset: "14.88 TOKEN" }
                  authorization: { actor: "relockeblock" }
                }
              }
            }
          ]
        ) {
          transaction_body
        }
      }
    `
    deepStrictEqual(
      (await SmartQL(variantexample2)).data.serialize_transaction
        .transaction_body,
      '000100118d474144a3ba0000e82a4fe3aed90100118d474144a3ba00000000a8ed32321100d00500000000000002544f4b454e0000000000000000000000000000000000000000000000000000000000000000000000',
      'variant ABI type example2.'
    )
  })
}
