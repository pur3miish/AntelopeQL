# SmartQL changelog

## Next

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
