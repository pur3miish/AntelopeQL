# New EOS Account

Example of how to create a new EOS account.

### Background

Because account creations require you to delegate some bandwidth and RAM to the account being created, you will need to create an atomic query. In other words we need to create actions on the blockchain that are executed in sequence from top to bottom.

```GraphQL
mutation {
serialize_transaction(
  actions: [
    # new account - action 1 (executed first).
		{ eosio: {
      newaccount: {
        creator: ihack4google # Name of the account creating the new account
        name: pur3miish111 # name of the new account
      	# Owner authority for new account
        owner: {
          threshold: 1
          keys: [{
            key: EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
            weight: 1
          }]
          accounts: []
          waits: []
        }
        # Active authority for new account
        active: {
          threshold: 1
          keys: [{
            key: EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
            weight: 1
          }]
          accounts: []
          waits: []
        }
        authorization: {
          actor: ihack4google # Authority for action 1
        }
      }
    } },
    # Delegate bandwidth to new account - action 2
    { eosio: {
    		delegatebw: {
        from: ihack4google
        receiver: pur3miish111
        stake_net_quantity: "1.0000 EOS"
        stake_cpu_quantity: "1.0000 EOS"
        transfer: 0
         authorization: {
          actor: ihack4google # Authority for action 2
        }
      }
    }},
    # Buy RAM for new account - action 3
  	{ eosio: {
    		buyrambytes: {
          payer: ihack4google
          bytes: 15000
          receiver: pur3miish111
          authorization: {
            actor: ihack4google # Authority for action 3
          }
      	}
  		}
    }
  ],
  configuration: {
    max_cpu_usage_ms: 2 # Set the maximum amount of CPU for the txn.
  }
) {
    chain_id
	  transaction_header
	  transaction_body
  }
}

```

```js
import SmartQL from 'smartql'

SmartQL({
  query, // Query string above.
  contracts: ['eosio'], // smart contracts accountname for creating new account.
  rpc_url: 'https://eos.relocke.io' // Endpoint to send your mutations to the blockchain.
}).then(console.log)
```

> The logged output should include a `chain_id`, a `transaction_header` and a `transaction_body` that can be signed by any EOS digital signature software.

## Push transaction query

```GraphQL
mutation($packed_trx, $signatures: [signature!]) {
  mutation {
    push_transaction(packed_trx: "<transaction_header><transaction_body>", signatures: ["SIG_…"]) {
      transaction_id
      resource_cost {
        cpu_usage_us
        net_usage_words
        status
      }
    }
  }
```

```js
import { sign_txn } from 'eos-ecc'

const signature = await sign_txn({
  hex: chain_id + transaction_header + transaction_body,
  wif_private_key: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
})

SmartQL({
  query: push_txn_query,
  rpc_url: 'https://eos.relocke.io',
  variables
}).then(console.log)
```

> The logged outut contined a `transaction_id`.

### Troubleshooting

Ensure you have adequate bandwidth and EOS tokens on the creators account or txn will fail.
