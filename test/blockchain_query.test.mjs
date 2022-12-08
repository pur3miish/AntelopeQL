import fetch from 'node-fetch'
import deserialize_action_data from '../blockchain/deserialize_action_data.js'

const smartql_rpc = {
  rpc_url: 'https://api.kylin.alohaeos.com',
  fetch
}

const JSON_output_for_deserialized = `{"account":"relocke","permission":"active","parent":"owner","auth":{"threshold":1,"keys":[{"key":"EOS5FfrbHXE3oC3BDZNCTHEqkxEQFGJSeQMnq8yWa2eJLdZYYP6TU","weight":1},{"key":"EOS6hMLF2sPrxhu9SK4dJ9LaZimfzgfmP7uX1ahUPJUcUpS4p2G39","weight":2}],"accounts":[{"permission":{"actor":"nutrijournal","permission":"active"},"weight":2}],"waits":[{"wait_sec":14,"weight":2}]},"authorized_by":"relockeblock"}`

export default tests => {
  tests.add('EOSIO types - validating parse values', async () => {
    deserialize_action_data
      .resolve(
        null,
        {
          code: 'eosio',
          action: 'updateauth',
          binargs:
            '000000404144a3ba00000000a8ed32320000000080ab26a70100000002000230181e888a73d27774005d50cdbd1b34f0d9d62a02077682187e9c3b39f1e0ca01000002ee19f0d3ca1c117ce6e066d57fbb3b1bab6db917d60fc22d501d97857e01ef1402000110cdbc9a3e77b39e00000000a8ed32320200010e000000020000118d474144a3ba'
        },
        { smartql_rpc }
      )
      .then(data => data == JSON_output_for_deserialized)
  })
}
