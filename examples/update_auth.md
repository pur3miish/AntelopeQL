# Update EOS acount authority

In this example we are updating the EOS account ihack4google account authority.


```GraphQL
mutation {
  transaction(actions: {
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
  ) {
    transaction_id
    block_time
    resource_cost {
      cpu_usage_us
      net_usage_words
      status
    }
  }
}
```
