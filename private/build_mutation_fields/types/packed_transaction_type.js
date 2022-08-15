'use strict'

const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql')
const signature_type = require('../../eosio_types/signature_type.js')
/**
 * The packed transaction type.
 * @kind typedef
 * @name packed_transaction
 * @type {object}
 * @prop {string} chain_id Hash representing the blockchain.
 * @prop {string} transaction_header Hex string representing the serialized transaction header.
 * @prop {string} transaction_body Hex string representing the serialized transaction body.
 * @prop {Array<string>} signatures List of required signatures to satisfy authorizations.
 * @prop {Array<string>} meta_signatures List of all signatures from the supplied private keys.
 */
const packed_transaction_type = new GraphQLObjectType({
  name: 'packed_transaction',
  description: 'Packed transaction, chain ID and transaction header',
  fields: () => ({
    chain_id: {
      type: GraphQLString,
      description: 'chain id'
    },
    transaction_header: {
      type: GraphQLString,
      description: 'Transaction header for TaPoS protection.'
    },
    transaction_body: {
      type: GraphQLString,
      description: 'Packed transaction.'
    },
    signatures: {
      type: new GraphQLList(signature_type),
      description: 'List of required signatures to satisfy authorization.'
    },
    meta_signatures: {
      type: new GraphQLList(signature_type),
      description:
        'List of all corresponding signatures from the list of given private keys.'
    }
  })
})

module.exports = packed_transaction_type
