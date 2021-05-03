### Account Resources

This example illustrates how to buy ram and delegate bandwidth to your account.

```graphql
  mutation {
      transaction(actions: {
        # action 1 - Delegate bandwidth.
        delegatebw: {
          authorization: { actor: "ihack4google" }
          from: "ihack4google",
          receiver: "ihack4google",
          stake_net_quantity: "0.5000 EOS",
          stake_cpu_quantity: "0.5000 EOS",
          transfer: 0
        }
        # action 2 - buy ram for account.
        buyram:{
          authorization: { actor: "ihack4google" } # the authority for the action.
          payer: "ihack4google"
          quant: "0.5000 EOS",
          receiver: "ihack4google"
        }
      }) {
        transaction_id
        block_num
        block_time
      }
  }
```
