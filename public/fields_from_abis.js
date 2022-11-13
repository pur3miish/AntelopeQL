'use strict'

const abi_to_ast = require('./abi_to_ast.js')
const build_transactions_mutation_fields = require('./build_mutation_fields/build_transactions_mutation_fields.js')
const build_mutation_fields = require('./build_mutation_fields/index.js')
const build_query_fields = require('./build_query_fields/index.js')

/**
 * Generates GraphQL query and mutation fields from a given ABI AST.
 * @name fields_from_abis
 * @kind function
 * @param {Array<object>} abis Application binary interface.
 * @returns {object} GraphQL query and mutation fields
 * @ignore
 */
function fields_from_abis(abis) {
  let _abi_ast = {},
    eosio_query_fields = {},
    eosio_mutation_fields = {}

  for (const { abi, error, account_name } of abis) {
    if (!abi)
      return {
        errors: [
          {
            message: `No smart contract found for “${account_name}”.`,
            ...error
          }
        ]
      }

    const abi_ast = abi_to_ast(abi, account_name)

    let ast_name = account_name.replace(/[.]+/gmu, '_')
    ast_name = ast_name.match(/^[1-5]/gmu) ? '_' + ast_name : ast_name

    _abi_ast = {
      ..._abi_ast,
      [ast_name]: abi_ast
    }

    eosio_query_fields = {
      ...eosio_query_fields,
      ...build_query_fields(abi_ast)
    }

    eosio_mutation_fields = {
      ...eosio_mutation_fields,
      ...build_mutation_fields(abi_ast)
    }
  }

  return {
    query_fields: eosio_query_fields,
    mutation_fields: build_transactions_mutation_fields(
      eosio_mutation_fields,
      _abi_ast
    )
  }
}

module.exports = fields_from_abis
