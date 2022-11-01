# SmartQL changelog

# 10.0.1

## Patch

- Fixes to push transaction mutation resolver.

# 10.0.0

## Major

- `push_transaction` mutation inputs are more intuitive (include `transaction_body` & `transaction_header`).

## Minor

- readme.md more descriptive.

# 9.0.0

## Major

- Removed internal signature in favour of serialised transaction type.
- Simplified mutation schema to include two mutations fields, `serialize_transaction` and `push_transaction`.
- Removed broadcast type.

## Minor

- `eosio_types/bytes` no longer serilaizes data on return.
- `bytes` type is now used for `push_transaction` mutation `packed_trx`.

## Patch

- depen updates.

# 8.1.2

## Patch

- `get_required_keys` now provides a more descriptive error for missing keys.

# 8.1.1

## Patch

- Bug fixe, mutation error @@iterator issue resolved.

# 8.1.0

## Minor

- Added `signatures` and `meta signatures` to the graphql mutation non broadcast `packed_transaction_type`.

## Patch

- Added .js extention to files.

# 8.0.1

## Patch

- Fixes to `get_accounts_by_authorizers`, added default array to keys resolver argument and await the public key scalar type as it returns a promise.

# 8.0.0

## Major

- Now supports eosio update authorizations mutation.

# 7.3.0

## Major

- SmartQL query blockchain get account will return a more descriptive error.

# 7.2.0

## Major

- Changes to reported error object.

# 7.1.0

## Major

- RPC Error reporting is more descriptive.

## Patch

- Added ReLocke (EOS and Jungle) rpc url end points to read me.
- Added list of endpoints BPs need to support.

# 7.0.1

## Patch

- Dependency updated.
- Fixes [#2](https://github.com/pur3miish/base58-js/issues/2).

# 7.0.0

## Major

- Destructured imports.
- Base query string changed to include contract base.
- Can now extend GraphQL schema.
- Can now handle multiple `EOSIO` Smart contracts.

## Minor

- Added chain queries and mutations.
- Added no query argument option, where the smart contract has no query.
- Can now handle account names that begin with numerical values.
- Optional arguments supported.
- Added support for variant types.

## Patch

- Peer dependency GraphQL ^16.
- Refactored code base to set up unit test.
- Removed graphql non null type from top level GraphQL mutations.
- Updated dependencies.

# V6.0.4

## Patch

- Updated peer dependency `eoc-ecc` to ^2.

# V6.0.3

## Patch

- Updated depen.

# V6.0.2

## Patch

- Added GraphQL Enum type to `key_type` for SmartQL queries.
- Set default key type to `name`.
- Key type encoding for smartql query.

# V6.0.1

## Patch

- SmartQL queries now handles errors returned from EOSIO rpc table requests, Errors are thrown with `GraphQLErrors`.

# V6.0.0

## Major

- Better stability for handling name collisions in GraphQL.
- Favour terse introspection schema.

# V5.1.0

## Minor

- Auth actor is now non nullable field.

# V5.0.0

## Major

- Restructured GraphQL API to be contract specific, i.e. GraphQL types are now generated with contract name specific names to prevent any duplicate error types thrown by GraphQL.
- New `build_fields` function available in public dir, generate GraphQL query and mutation fields for a contract that can be readily consumed by a GraphQL schema.
- GraphQL type that are specific to EOSIO are moved to public Dir _(available for deep imports)_.

## Minor

- Abstracted the EOSIO type serialisation into its own package [eosio-wasm-js](https://github.com/pur3miish/eosio-wasm-js).

## Patch

## V4.0.0

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

## V3.0.0

### Major

- Removed RPC URL list in favour of one rpc url string.

### Patch

- closes #9.

- renamed `get_table_by_rows` to `get_table_rows`.

- content type header added to `get_table_rows` & `get_table_by_scope`

## V2.0.1

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
