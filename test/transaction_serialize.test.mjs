import { strictEqual } from 'assert'
import actions from '../private/serialize/actions.js'
import transaction_header from '../private/serialize/transaction_header.js'

export default tests => {
  tests.add('transaction header serialisation', () => {
    strictEqual(
      transaction_header({
        ref_block_time: '2021-03-11T07:21:20',
        ref_block_num: 31557,
        ref_block_prefix: 1084217410,
        expiration: 180,
        delay_sec: 0,
        max_net_usage_words: 0,
        max_cpu_usage_ms: 0
      }),
      'b4457b42d89f40000000'
    )
  })

  tests.add('transaction action serialisation', () => {
    strictEqual(
      actions([
        {
          account: 'eosio.token',
          action: 'transfer',
          authorization: [
            {
              actor: 'rattusmcugee',
              permission: 'active'
            }
          ],
          data: '105455355d1aa182a014d348629db3b9112700000000000004454f530000000000'
        }
      ]),
      '0100a6823403ea3055000000572d3ccdcd01a014d348629db3b900000000a8ed323221105455355d1aa182a014d348629db3b9112700000000000004454f530000000000'
    )
  })
}
