'use strict'

/**
 * This function makes a few transfomations to the ABI to make it easier to build GraphQL Schemas.
 * It creates a crude abstract syntax tree (AST) from the application binary interface (ABI) of a given smart contract.
 * The output of this function can be consumed by other functions within this project to create a GraphQL Object & Object input types.
 * GraphQL object types are a GraphQL defined type, please see [GraphQL doc](https://graphql.org/graphql-js/object-types/).
 * @name abi_ast
 * @kind function
 * @param {object} ABI EOSIO ABI.
 * @param {string} contract Name of the account that holds the contract.
 * @returns {object} ABI_AST.
 * @ignore
 */
function abi_to_ast(ABI, contract) {
  /*
   * EOSIO account names with periods need to be replaced with “_” as periods are invalid graphql chars.
   * Moreover prefix graphql fields unique names specific to the smart contract.
   * this prevents any GraphQL Duplicate errors being thrown.
   */
  let gql_contract = contract.replace(/[.]+/gmu, '_')

  /*
   * Because GraphQL types must start with [_a-zA-Z], so we append an “_”
   * If there are any `names` that begin with a numberical.
   */
  if (gql_contract.match(/^[1-5]/gmu)) gql_contract = '_' + gql_contract

  const abi_ast = { ...ABI, contract, gql_contract }

  /*
   * Trim ricardian contracts so that the description only inlcudes the title.
   */
  abi_ast.actions.forEach((action, index) => {
    const description = action.ricardian_contract.match(/^title: .+$/gmu)
    abi_ast.actions[index].ricardian_contract = description
      ? description[0].replace('title: ', '')
      : ''
  })

  //  Handle ABI types
  if (abi_ast.types && abi_ast.types.length) {
    abi_ast.structs = abi_ast.structs.concat(
      abi_ast.types.map(({ new_type_name, type }) => ({
        name: new_type_name,
        base: '',
        fields: [{ name: new_type_name, type }]
      }))
    )
    delete abi_ast.types
  }

  // Handle ABI variant types.
  if (abi_ast.variants && abi_ast.variants.length) {
    abi_ast.structs = abi_ast.structs.concat(
      ...abi_ast.variants.map(({ name, types }) => ({
        name,
        base: '',
        fields: types.map(item => ({
          name: item,
          type: item
        }))
      }))
    )

    delete abi_ast.variants
  }

  delete abi_ast.ricardian_clauses
  delete abi_ast.error_messages
  delete abi_ast.action_results
  delete abi_ast.kv_tables
  delete abi_ast.abi_extensions
  delete abi_ast.version

  return abi_ast
}

module.exports = abi_to_ast
