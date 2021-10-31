'use strict'
const serilaize = require('eosio-wasm-js')

/**
 * Given an ABI AST and data object serialise the data to a WASM hex string.
 * @param {object} arg Argument.
 * @param {string} arg.actionType Name of the EOS action to be serialized.
 * @param {object} arg.data The data to be serialized.
 * @param {object} arg.abi_ast Abstract syntax tree of ABI.
 * @returns {string} WASM hex string of serialized transaction.
 */
async function serialize_transaction_data({
  actionType,
  data: ast_data,
  abi_ast
}) {
  const findStruct = struct_name =>
    abi_ast.structs.find(({ name }) => name == struct_name)

  // create an AST from the ABI and data.
  const abi_to_ast = ({ struct, data, ast = [] }) => {
    const { fields, base } = struct

    if (base != '') {
      const struct = findStruct(base)
      if (struct) ast = [...ast, ...abi_to_ast({ struct, data, ast })]
      else throw new Error(`Expected base field “${base}” in ABI`)
    }

    const handleFields = fields =>
      fields.forEach(({ name, type }) => {
        if (data[name] == undefined) throw new TypeError(`Expected “${name}”`)
        if (type.endsWith('$')) type = type.replace('$', '')
        if (type.endsWith('?')) type = type.replace('?', '')
        if (type.endsWith('[]')) {
          if (!data[name]) throw new TypeError(`Expected “${name}” array`)
          ast.push({
            name: name + '_length',
            type: 'varuint32',
            data: data[name].length
          })
          const _type = type.slice(0, -2)
          const _struct = findStruct(_type)
          return data[name].forEach((d, index) => {
            if (_struct) return abi_to_ast({ struct: _struct, ast, data: d })
            else ast.push({ name: name + '_' + index, type: _type, data: d })
          })
        }

        // handle variants and optional types.
        const _struct = findStruct(type)
        if (_struct)
          return abi_to_ast({
            struct: _struct,
            ast,
            data: data[name]
          })

        return ast.push({ name, type, data: data[name] })
      })

    if (fields.length) handleFields(fields)

    return ast
  }

  const ast_map = abi_to_ast({
    struct: findStruct(actionType),
    data: ast_data
  }).map(async ({ type, data }) => ({
    type,
    data: await serilaize[type](await data)
  }))

  const serialize = await Promise.all(ast_map)
  return serialize.reduce((acc, { data }) => (acc += data), '')
}

module.exports = serialize_transaction_data
