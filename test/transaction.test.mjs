import { SmartQL } from '../public/index.mjs'

const mutation = /* GraphQL */ `
  mutation {
    relocke(actions: [{ bwaction: { authorization: { actor: "relocke" } } }]) {
      transaction_id
    }
  }
`

SmartQL({
  query: mutation,
  contract: ['relocke'],
  rpc_url: 'http://127.0.0.1:8888',
  broadcast: true,
  private_keys: ['5K7xR2C8mBzMo4aMPJyBPp7Njc3XvszeJSfTApa51rc2d54rrd3']
}).then(data => data)
