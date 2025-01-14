// @ts-check

/**
 * The Application Binary Interface (ABI) is a JSON-based description on how to convert user actions between their JSON and Binary representations.
 * @typedef {Object} ABI
 * @property {Array<Types>} types List of types.
 * @property {Array<Struct>} structs List of contract structs.
 * @property {Array<Action>} actions List of contract actions.
 * @property {Array<Table>} tables List of contract tables.
 */

/**
 * @typedef {Object} Types
 * @property {String} new_type_name
 * @property {String} type
 */

/**
 * A contract action is a description of what argument a contract function may take, its graphql representation is called a mutation.
 * @typedef {Object} Action
 * @property {String} name Contract action name as defined in the smart contract.
 * @property {String} type The name of the implicit struct as described in the ABI.
 * @property {String} [ricardian_contract] Describing the actions intended functionality.
 */

/**
 * Struct can be thought of as a user defined data structures, that a contract will utilise in its actions or table types.
 * @typedef  {Object} Struct
 * @property {String} name The name of the struct.
 * @property {String} base Inheritance, parent struct.
 * @property {Array<Field>} fields List of fields describing the struct.
 */

/**
 * Struct can be thought of as a user defined data structure that that contract will utilise in its actions or table.
 * @typedef Field
 * @property {String} name The name of the struct.
 * @property {String} type The type of struct either a native data type or user defeind struct.
 */

/**
 * Tables are user defined database structures that hold data. GraphQL as queries.
 * @typedef Table
 * @property {String} name The name of the database.
 * @property {String} index_type The type of primary index of this table
 * @property {String} type Corresponding struct.
 */

/**
 * Abstract syntax tree of a contract ABI.
 * @typedef AST
 * @property {String} name The name of the AST item.
 * @property {String} type AST type.
 * @property {Array<AST_INFO>} $info List of meta info regarding AST.
 */

/**
 * @typedef AST_INFO
 * @property {Boolean} object
 * @property {Boolean} optional
 * @property {Boolean} list
 * @property {Boolean} binary_ex
 * @property {Boolean} variant
 */

export const supported_antelope_chain_endpoints = [
  "get_info",
  "get_abi",
  "get_accounts_by_authorizers",
  "get_block",
  "get_currency_balance",
  "get_currency_stats",
  "get_required_keys",
  "get_producers",
  "get_table",
  "abi_bin_to_json"
];
