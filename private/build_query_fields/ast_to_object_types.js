'use strict'
const { GraphQLList, GraphQLObjectType } = require('graphql/type/definition.js')
const { GraphQLString } = require('graphql/type/scalars.js')
const eos_types = require('../eosio_types/index.js')

/**
 * Builds GraphQL Query fields object types from an `ABI AST`.
 * @kind function
 * @name ast_to_graphql_object_types
 * @param {object} ABI_AST Syntax tree for generating GraphQL input object types.
 * @returns {object} GraphQL fields for GraphQL Object types.
 * @ignore
 */
function ast_to_graphql_object_types(ABI_AST) {
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

      return {
        ...acc,
        [struct_name]: new GraphQLObjectType({
          name: `${ABI_AST.gql_contract}_` + struct_name,
          fields: () => {
            const graphql_type_fields = struct_fields.reduce(
              (acc, { name: struct_field_name, type: struct_field_type }) => {
                let isListType
                let variant

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
                if (struct_field_type.endsWith('$')) {
                  variant = true
                  struct_field_type = struct_field_type.slice(0, -1)
                }

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
                 *  graphql type
                 */
                const type = isListType ? GraphQLList(handle_type) : handle_type

                return {
                  ...acc,
                  [struct_field_name]: {
                    type,
                    description: '',
                    resolve(rootValue, args, ctx, { fieldName, returnType }) {
                      if (variant)
                        return {
                          [returnType]: Object.fromEntries(
                            new Map([rootValue[fieldName]])
                          )
                        }

                      return rootValue[fieldName]
                    }
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

  return ABI_AST.tables.map(table => ({
    [table.name]: abi_ast[table.type]
  }))
}

module.exports = ast_to_graphql_object_types
