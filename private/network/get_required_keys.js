'use strict'

const rpc_call = require('./rpc_call')

/**
 * Returns the required keys for a given transaction.
 * @param {object} arg Argument.
 * @param {string} arg.transaction EOSIO transaction.
 * @param {string} arg.available_keys List of available public keys
 * @param {string} arg.rpc_url Endpoint to send transcations to.
 * @returns {Array<strings>} List of public keys indicating transaction.
 */
async function get_required_keys({ rpc_url, transaction, available_keys }) {
  const info = await rpc_call(`${rpc_url}/v1/chain/get_required_keys`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      transaction,
      available_keys,
      json: true
    })
  })
  return info
}

module.exports = get_required_keys

// const req = await fetch(
// process.env.API_URI + '/v1/chain/get_required_keys',
// {
//   method: 'post',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     transaction: {
//       expiration: '2021-09-15T03:29:15',
//       ref_block_num: 34854,
//       ref_block_prefix: 1209700322,
//       max_net_usage_words: 0,
//       max_cpu_usage_ms: 0,
//       delay_sec: 0,
//       context_free_actions: [],
//       actions: [
//         {
//           account: 'eosio.token',
//           name: 'transfer',
//           authorization: [
//             { actor: 'ihack4google', permission: 'active' }
//           ],
//           data: 'a022a39411884c0b304dc60e2a38c8206d0000000000000004454f530000000000'
//         }
//       ],
//       transaction_extensions: []
//     },
//     available_keys: [
//       'EOS5hwG4sTLMy5yx8CW1fLYWkoUG3TAmhdejCAMXEGKR2GRXwtoPx',
//       'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV',
//       'EOS6hMLF2sPrxhu9SK4dJ9LaZimfzgfmP7uX1ahUPJUcUpS4p2G39',
//       'EOS7Jsktf3uiUxj6uXWDeGE92K7wHXoeRfKkyXCudUftigCucMkXv',
//       'EOS7YqT9B3rw4WvQoAGzupzaGdeMthKUgyGjWQzUJM123WwQLjXBp',
//       'EOS87U41tTLiEjWX1S8GPAzaX48inKnJ4bnsSk6hGs1Cb3w72dHnQ'
//     ]
//   })
// }
// )
