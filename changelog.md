# AntelopeQL changelog

## 3.0.0

### Major

- Multi-chain support added to AntelopeQL.
- Extensible schema via the new options object.
- Full control over RequestInit, enabling request caching and ABI-fetch customization.
- Complete TypeScript support, including default chain definitions.
- Custom Antelope chains can now be added or overridden, allowing full modification of existing RPC URLs.

## Patch

- Dependency updates.

## 2.0.0

### Major

- name change for pushed_transaction and push_serialized_transaction to send_transaction and send_serialized_transaction.
- Removed antelope-ecc signature to allow users to handle their own transactions signing.
- Removed delay second transaction configuration object.

### Minor

- Added serialize ABI function that enables the use of eosio::setcode
- Added get required Keys function to the blockchain api
- Added required keys parameter to the serialised transaction mutation
- Fixed to `get_accounts_by_authorizers` keys query.

## Patch

- Bug fix for EOSIO ABI types.
- fetch Options added to all fetch requests.

## 1.1.2

- Replaced eosio-ecc package with with antelope-ecc.

## 1.1.1

- Big fix, AntelopeQL was throwing an error wen a smart contract had no tables or actions on the smart contract.

## 1.1.0

- Added the ability to pass an ABI's directly to AntelopeQL.
- [`get_abis`](./get_abis.mjs) export added for fetching a list of contracts ABIs.
- Added ricardian contract to description.

### Patch

- Renamed some of the old EOSIO descriptions to Antelope.

## 1.0.0

- Initial release
