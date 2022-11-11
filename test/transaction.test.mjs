import SmartQL from '../index.js'

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
  rpc_url: 'http://127.0.0.1:8888'
}).then(data => data)
