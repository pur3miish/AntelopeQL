# New EOS Account

Example of how to create a new EOS account.

### Background

Because account creations require you to delegate some bandwidth and RAM to the account being created, you will need to create an atomic query. In other words we need to create actions on the blockchain that are executed in sequence from top to bottom.

```GraphQL
mutation {
  eosio(
    actions: [{
      # new account - action 1 (executed first).
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
    }, {
    # Delegate bandwidth to new account - action 2
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
    }, {
    # Buy RAM for new account - action 3
      buyrambytes: {
        payer: ihack4google
				bytes: 15000
        receiver: pur3miish111
        authorization: {
          actor: ihack4google # Authority for action 3
        }
      }
  }]
  configuration: {
    max_cpu_usage_ms: 2 # Set the maximum amount of CPU for the txn.
  }
  ) {
    transaction_id
  }
}
```

```js
import SmartQL from 'smartql'

SmartQL({
  query, // the query string above.
  private_keys: ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'],
  contract: 'eosio', // smart contract accountname for creating new account.
  rpc_url: "https://api.relocke.io // RPC url for sending txn to.
  // list of required private keys.
}).then(console.log)
```

> The logged output should include a `transaction_id` if new account was successfully created.

### Troubleshooting

Ensure you have adequate bandwidth and EOS tokens on the creators account or txn will fail.
