```graphql
mutation {
  transaction(
    actions: [{
    # Action 1 - Insturct the creation of a new account.
      newaccount: {
        creator: "pur3miish222" # Account who is creating the new account.
        name: "newaccount12" # New account name.
        owner: {
          threshold: 1
          keys: {
            key: "EOS5hwG4sTLMy5yx8CW1fLYWkoUG3TAmhdejCAMXEGKR2GRXwtoPx", # Public key for new account.
            weight: 1
          }
          accounts: []
          waits: []
        }
        active: {
         threshold: 1
         keys: {
            key: "EOS6hMLF2sPrxhu9SK4dJ9LaZimfzgfmP7uX1ahUPJUcUpS4p2G39", # Different key from owner.
            weight: 1
         }
         accounts: []
         waits: []
        }
        authorization: { actor: "pur3miish222" } # Each action needs an authorization.
      }
    }
    # Actions 2 - Will be executed after Action 1, buyrambytes & delegatebw
    {
      #  Delegate some bandwidth and purchase some RAM to the newly created account.
      buyrambytes: {
        payer: "pur3miish222",
        receiver: "newaccount12",
        bytes: 9000
        authorization: { actor: "pur3miish222" }
      }
      delegatebw:{
        from: "pur3miish222"
        receiver: "newaccount12",
        stake_net_quantity: "0.2000 EOS"
        stake_cpu_quantity: "0.2000 EOS"
        transfer: 1
        authorization: { actor: "pur3miish222" }
      }
    }]
  ) {
    transaction_id
    block_num
    block_time
  }
}
```
