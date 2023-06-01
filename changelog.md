# AntelopeQL changelog

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
