import { GraphQLObjectType, GraphQLString } from "graphql";

/**
 * The packed transaction type.
 * @kind typedef
 * @name packed_transaction
 * @type {Object}
 * @prop {String} chain_id Hash representing the blockchain.
 * @prop {String} transaction_header Hex string representing the serialized transaction header.
 * @prop {String} transaction_body Hex string representing the serialized transaction body.

 */
const packed_transaction_type = new GraphQLObjectType({
  name: "packed_transaction",
  description: "Packed transaction, chain ID and transaction header",
  fields: {
    chain_id: {
      type: GraphQLString,
      description: "A unique ID that Specifies which chain we are operating on."
    },
    transaction_header: {
      type: GraphQLString,
      description: "Serialized transaction header _(TaPoS protection)_."
    },
    transaction_body: {
      type: GraphQLString,
      description: "Serialized transaction body _(bytecode instructions)_."
    }
  }
});

export default packed_transaction_type;
