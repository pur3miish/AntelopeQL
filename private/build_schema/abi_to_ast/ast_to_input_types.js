'use strict'
const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList
} = require('graphql')
const eos_types = require('../../eos_types')

/**
 * Creates an EOSIO GraphQL input object type from AST
 * @param {object} ABI_AST Syntax tree for generating GraphQL input object types.
 * @returns {object} GraphQL input types.
 */
function ast_to_input_types(ABI_AST) {
  const abi_ast = ABI_AST.structs.reduce(
    (
      acc,
      { name: struct_name, fields: struct_fields, base },
      _,
      structs_array
    ) => {
      const handle_base_fields = (baseValue, fields = []) => {
        const field = ABI_AST.structs.find(({ name }) => baseValue == name)
        if (!field)
          throw new Error(`Could not find base value “${baseValue}” on ABI`)

        if (field.base == '') return [...field.fields, ...fields]
        return handle_base_fields(field.base, fields)
      }

      if (base !== '') struct_fields = handle_base_fields(base, struct_fields)

      const handle_input_GraphQLObjectType = objectType => {
        if (!Object.keys(objectType.fields()).length) return null
        return new GraphQLInputObjectType(objectType)
      }
      return {
        ...acc,
        [struct_name]: handle_input_GraphQLObjectType({
          name: struct_name + '_data_type',
          fields: () => {
            const graphql_type_fields = struct_fields.reduce(
              (acc, { name: struct_field_name, type: struct_field_type }) => {
                let isListType

                /**
                 * abi field list (array) item.
                 */
                if (struct_field_type.endsWith('[]')) {
                  isListType = true
                  struct_field_type = struct_field_type.slice(0, -2)
                }

                /**
                 * Optional abi fields type
                 */
                if (struct_field_type.endsWith('?'))
                  struct_field_type = struct_field_type.slice(0, -1)

                /**
                 * variant type
                 */
                if (struct_field_type.endsWith('$'))
                  struct_field_type = struct_field_type.slice(0, -1)

                /**
                 * Check if a struct_field_type is a struct.
                 */
                const field_struct = structs_array.find(
                  ({ name }) => name == struct_field_type
                )

                /**
                 * This generates the types from a series of conditionals
                 * based on abi data
                 */
                const handle_type = field_struct
                  ? abi_ast[field_struct.name]
                  : eos_types[struct_field_type]
                  ? eos_types[struct_field_type]
                  : GraphQLString

                /**
                 * This is the graphql type
                 */
                const type = isListType ? GraphQLList(handle_type) : handle_type

                return {
                  ...acc,
                  [struct_field_name]: {
                    type,
                    description: ''
                  }
                }
              },
              {}
            )

            return graphql_type_fields
          }
        })
      }
    },
    {}
  )

  return abi_ast
}

module.exports = ast_to_input_types
