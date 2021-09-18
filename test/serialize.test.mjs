import { rejects } from 'assert'
import serialize_transaction_data from '../private/build_schema/build_mutation_fields/serialize_transaction_data.js'

export default test => {
  test.add('serialize', () => {
    rejects(() =>
      serialize_transaction_data({ data: null, actionType: 'kool' })
    )
  })
}
