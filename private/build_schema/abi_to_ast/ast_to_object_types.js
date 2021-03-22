'use strict'
const { GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql')
const eos_types = require('../../eos_types')

/**
 * Builds a GraphQL object types from an ABI AST to build GraphQL Query fields.
 * @kind function
 * @name ast_to_graphql_object_types
 * @param {object} ABI_AST This AST is build from `abi_to_ast`.
 * @returns {object} Builds GraphQL fields for GraphQL Object types.
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
          name: struct_name,
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
