'use strict'

const { throws } = require('assert')
const ast_to_input_types = require('../private/build_schema/abi_to_ast/ast_to_input_types.js')
const ast_to_object_types = require('../private/build_schema/abi_to_ast/ast_to_object_types.js')
const abi_to_ast = require('../private/build_schema/abi_to_ast/index.js')
const invalidBaseFields = require('./abis/basefields_error.json')

module.exports = tests => {
  tests.add('ast_to_object_types', async () => {
    throws(
      () => abi_to_ast(invalidBaseFields),
      'Expected throw for invalid base fields in ABI'
    )
    throws(() => abi_to_ast(), 'Expected throw for abi_to_ast')
    throws(() => ast_to_input_types(), 'Expected throw for ast_to_input_types')
    throws(
      () => ast_to_object_types(),
      'Expected throw for ast_to_object_types'
    )
  })
}
