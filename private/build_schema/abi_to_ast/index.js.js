'use strict'

const ast_to_input_types = require('./ast_to_input_types.js')
const ast_to_object_types = require('./ast_to_object_types')

/**
 * This function makes a few transfomations to the ABI to make it easier to build GraphQL Schema.
 * It creates a crude abstract syntax tree (AST) from the application binary interface (ABI) of a given smart contract.
 * The output of this function can be consumed by other functions within this project to create a GraphQL Object & Object input types.
 * GraphQL object types are a GraphQL defined type, please see [GraphQL doc](https://graphql.org/graphql-js/object-types/).
 * @name abi_ast
 * @kind function
 * @param {object} ABI EOS ABI.
 * @returns {object} ABI_AST.
 * @ignore
 */
function abi_to_ast(ABI) {
  // Becuase GraphQL name types can only include [A-Za-Z_].
  const abi_ast = {
    ...ABI
  }

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

  // Handle variant types
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

  return {
    abi_ast,
    ast_object_types: ast_to_object_types(abi_ast),
    ast_input_object_types: ast_to_input_types(abi_ast)
  }
}

module.exports = abi_to_ast
