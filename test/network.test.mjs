import { rejects, throws } from 'assert'
import get_abi from '../private/network/get_abi.js'
import SmartQL from '../public/index.js'

export default test => {
  test.add("get abi", async () => {
    const data = await SmartQL({
      query: /* GraphQL */ `mutation {
        transaction(actions: {
          transfer: {
            to: "pur3miish222"
            from:"ihack4google",
            memo: "",
            quantity: "0.0001 EOS"
            authorization: {
              actor: ihack4google
            }
          }
        }) {
          transaction_id
        }
      }`,
      contract: "eosio.token",
      rpc_url: "https://api.relocke.io",
      private_keys: ["5K7xR2C8mBzMo4aMPJyBPp7Njc3XvszeJSfTApa51rc2d54rrd3"]
    })



    console.log(data)
    // const abi = await get_abi({ contract: "eosio.token", rpc_url: "https://api.relocke.io" })

    // rejects(() => get_abi({ contract: "pur3miish222", rpc_url: "https://api.relocke.io" }))
    // rejects(() => get_abi({ contract: null }))
    // rejects(() => get_abi({ contract: "eosio.token",  rpc_url: "https_adsd" }))
  })
}
