# SmartQL changelog

## 13.0.3

- Dependency updates.

## 13.0.2

### Patch

- Removed `process.env.BLOCKCHAIN` from type.
- Typo fixes.

## 13.0.1

### Patch

- Bug fixes in readme.
- Fixed GraphQL ESM deep imports.

## 13.0.0

### Major

- [smartql.mjs](./smartql.mjs) now uses one object argument.
- Removed main index export for [smartql.mjs](./smartql.mjs)

## 12.0.0

### Major

- Now using [ESM](https://nodejs.org/docs/latest-v16.x/api/esm.html) instead of [CJS](https://nodejs.org/docs/latest-v16.x/api/modules.html).
- [Library module anti-pattern](https://jaydenseric.com/blog/optimal-javascript-module-design) approach

### Minor

- Fixed mutation signing bug.
- `get_required_keys` is now integrated into the smartql.
- Renamed argument variables.
- Added RPC URL headers argument for SmartQL.
- Signal argument added to SmartQL network.

### Patch

- Typo fixes in readme

## 11.1.3

### Patch

- Dependency now install @ latests.

## 11.1.2

### Patch

- Reverted destructured inports.

## 11.1.1

### Patch

- Changed function name to from eosio to antelope.
- Added index for destructured inports.

## 11.1.0

### Minor

- Support for (PUB_K1) public keys added
- Query resolver now detects the encode type from the key type.

### Patch

- Depen updated.
- Secondary index bug fix.
- Fixed ABI types issues.
- Added asset type checks (range errors).
- Added symbol and symbol code type checks.
- Dependency updates

## 11.0.2

### Patch

- Fixed `get_table` `limit` argument type, `boolean` is now `GraphQLInt`.

## 11.0.1

### Patch

- `smartql` core function now doesn't throw an error when no actions are available on ABI.
- Fixed to smartql JSDoc example in readme.
- Fixed variant type bug in for query and data serialisation.

## 11.0.0

### Major

- Added support for context free actions [#12](https://github.com/relocke/smartql/issues/12).
- Changed export folder strucutre.
- SmartQL core function argument changes.
- Added `build_graphql_fields_from_abis` function to build customisable GraphQL fields for integrating into your GraphQL service.

### Patch

- typo fixes to `serialize`.

## 10.0.1

### Patch

- Fixes to push transaction mutation resolver.

## 10.0.0

### Major

- `push_transaction` mutation inputs are more intuitive (include `transaction_body` & `transaction_header`).

### Minor

- readme.md more descriptive.

## 9.0.0

### Major

- Removed internal signature in favour of serialized transaction type.
- Simplified mutation schema to include two mutations fields, `serialize_transaction` and `push_transaction`.
- Removed broadcast type.

### Minor

- `eosio_types/bytes` no longer serilaizes data on return.
- `bytes` type is now used for `push_transaction` mutation `packed_trx`.

### Patch

- depen updates.

## 8.1.2

### Patch

- `get_required_keys` now provides a more descriptive error for missing keys.

## 8.1.1

### Patch

- Bug fixe, mutation error @@iterator issue resolved.

## 8.1.0

### Minor

- Added `signatures` and `meta signatures` to the graphql mutation non broadcast `packed_transaction_type`.

### Patch

- Added .js extention to files.

## 8.0.1

### Patch

- Fixes to `get_accounts_by_authorizers`, added default array to keys resolver argument and await the public key scalar type as it returns a promise.

## 8.0.0

### Major

- Now supports eosio update authorizations mutation.

## 7.3.0

### Major

- SmartQL query blockchain get account will return a more descriptive error.

## 7.2.0

### Major

- Changes to reported error object.

## 7.1.0

### Major

- RPC Error reporting is more descriptive.

### Patch

- Added ReLocke (EOS and Jungle) rpc url end points to read me.
- Added list of endpoints BPs need to support.

## 7.0.1

### Patch

- Dependency updated.
- Fixes [#2](https://github.com/pur3miish/base58-js/issues/2).

## 7.0.0

### Major

- Destructured imports.
- Base query string changed to include contract base.
- Can now extend GraphQL schema.
- Can now handle multiple `EOSIO` Smart contracts.

### Minor

- Added chain queries and mutations.
- Added no query argument option, where the smart contract has no query.
- Can now handle account names that begin with numerical values.
- Optional arguments supported.
- Added support for variant types.

### Patch

- Peer dependency GraphQL ^16.
- Refactored code base to set up unit test.
- Removed graphql non null type from top level GraphQL mutations.
- Updated dependencies.

## 6.0.4

### Patch

- Updated peer dependency `eoc-ecc` to ^2.

## 6.0.3

### Patch

- Updated depen.

## V6.0.2

### Patch

- Added GraphQL Enum type to `key_type` for SmartQL queries.
- Set default key type to `name`.
- Key type encoding for smartql query.

## 6.0.1

## Patch

- SmartQL queries now handles errors returned from EOSIO rpc table requests, Errors are thrown with `GraphQLErrors`.

## 6.0.0

### Major

- Better stability for handling name collisions in GraphQL.
- Favour terse introspection schema.

## 5.1.0

### Minor

- Auth actor is now non nullable field.

### 5.0.0

### Major

- Restructured GraphQL API to be contract specific, i.e. GraphQL types are now generated with contract name specific names to prevent any duplicate error types thrown by GraphQL.
- New `build_fields` function available in public dir, generate GraphQL query and mutation fields for a contract that can be readily consumed by a GraphQL schema.
- GraphQL type that are specific to EOSIO are moved to public Dir _(available for deep imports)_.

### Minor

- Abstracted the EOSIO type serialisation into its own package [eosio-wasm-js](https://github.com/pur3miish/eosio-wasm-js).

### Patch

## 4.0.0

### Major

- Restructured the query input arguments to an object type.
- Renamed table by scope to `table entries`.
- Can selectively broadcast transactions.

### Minor

- Descriptions updated.
- Table_row_arguments scope is now a GraphQLString instead of a name type.
- Now throws a GraphQL error for mutation adding EOSIO specific error details to the return value.

### Patch

- Added GraphQL peer dependency to readme.
- New logo design
- Updated dependencies

## 3.0.0

### Major

- Removed RPC URL list in favour of one rpc url string.

### Patch

- closes #9.

- renamed `get_table_by_rows` to `get_table_rows`.

- content type header added to `get_table_rows` & `get_table_by_scope`

## 2.0.1

### Patch

- Fixed mjs import bug.

- Added license badge and NPM version to `readme.md`.

## 2.0.0

### Major

- Supports atomic transactions.
- Now uses `universal-ecdsa` for digital signatures.
- Now supporting optional (?) data types for ABI.
- Closes [#5](https://github.com/pur3miish/smartql/issues/5).
- Closes [#6](https://github.com/pur3miish/smartql/issues/6).

### Minor

- Added some `examples`.
- Fixes [#1](https://github.com/pur3miish/smartql/issues/1) configuration args.
- Removed Asset type constraints on mutation input type, closes [#2](https://github.com/pur3miish/smartql/issues/2).
- Supports actions with no input data, closes [#3](https://github.com/pur3miish/smartql/issues/3).

### Patch

- closed #7.
- Fixed `smartql.svg` alignment being cut off.
- Removed inline html from `readme.md`.

## 1.0.0-rc

Initial Release.
