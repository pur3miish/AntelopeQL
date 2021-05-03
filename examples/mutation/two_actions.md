## SmartQL mutation - two actions different authories.

![example](https://github.com/pur3miish/smartql/blob/main/static/transfer_eos_x2.png?raw=true)


Notice that the graphql mutation performs two actions both of which are the transfer action.
So in both cases we are transferring EOS:
1. `0.0001 EOS` with the default permission of `active`.
2. `0.0020 EOS` with the permission of `owner`.

Actions in the graphql list that come first will execute first.

Because SmartQL executes in an `atomic` fashion, if any of the actions fail, non of the actions will be executed and the blockchain state will not mutate.

---
**NB** - *If you do not add the appropriate private keys to the keychain in the `SmartQL GUI` the transaction will fail.
Signature generation occurs client side no private keys are transferred over the wire.*



