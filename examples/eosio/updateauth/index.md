# Update EOS acount authority

In this example we are updating the EOS account ihack4google account authority.

### The GraphQL query

```GraphQL
mutation {
serialize_transaction(
  actions: [{
   	eosio: {
    	 updateauth:{
        account: "ihack4google"
        permission: "active",
        parent: "owner",
        auth: {
          threshold: 2, # set to two meaning we need 2 signatures for the active authority to work
          keys: [{
            key: "EOS6hMLF2sPrxhu9SK4dJ9LaZimfzgfmP7uX1ahUPJUcUpS4p2G39",
            weight: 1
          }, {
            key: "EOS7Jsktf3uiUxj6uXWDeGE92K7wHXoeRfKkyXCudUftigCucMkXv",
            weight: 1
          }]
          accounts: [{ # Assign another accounts authority to sign on behalf of ihack4google active perm.
            permission: {
              actor: "4343kekistan",
              permission: "active"
            }
            weight: 1
          }]
          waits: [] # no delay.
        }
        authorization: {
          actor:"ihack4google"
        }
      }
  	}
	}],
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

## The JS

```js
const SmartQL = require('smartql')

SmartQL({
  query, // The GraphQL query string.
  rpc_url: 'https://eos.relocke.io', // end point to send request.
  contracts: ['eosio'] // The smart contract are interacting with.
}).then(console.log)
```

> The logged output was { transaction_id: "4…", block_time: … }
