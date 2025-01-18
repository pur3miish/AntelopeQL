import { GraphQLError, GraphQLList, GraphQLObjectType } from "graphql";
import sha256 from "universal-sha256-js/sha256.mjs";

import bytes_type from "../eosio_types/bytes_type.mjs";
import public_key_type from "../eosio_types/public_key_type.mjs";

export const packed_transaction_fields = {
  chain_id: {
    type: bytes_type,
    description: "A unique ID that specifies which chain we are operating on."
  },
  transaction_header: {
    type: bytes_type,
    description: "Serialized transaction header."
  },
  transaction_body: {
    type: bytes_type,
    description: "Serialized transaction body _(bytecode instructions)_."
  },
  required_keys: {
    type: new GraphQLList(public_key_type),
    description: "List of public keys needed to authorize transaction",
    async resolve({ available_keys, transaction }, args, getContext, info) {
      const { network } = getContext(
        { available_keys, transaction },
        args,
        info
      );

      if (available_keys?.length) {
        const keys = await Promise.all(available_keys);

        const req = await fetch(
          network.rpc_url + "/v1/chain/get_required_keys",
          {
            method: "post",
            body: JSON.stringify({
              transaction: {
                ...transaction,
                // Transform the transaction.actions into appropriate form for get_required_keys.
                actions: transaction.actions.map(({ hex_data, ...action }) => ({
                  ...action,
                  data: hex_data
                }))
              },
              available_keys: keys
            }),
            ...network.fetchOptions
          }
        ).then((res) => res.json());

        if (req.error)
          throw new GraphQLError(req.message, { extensions: req.error });
        return req.required_keys;
      }
    }
  },
  hash: {
    type: bytes_type,
    description: "Transaction hash to sign to authorize transaction",
    async resolve({ chain_id, transaction_header, transaction_body }) {
      const transaction_bytes =
        chain_id +
        transaction_header +
        transaction_body +
        "0000000000000000000000000000000000000000000000000000000000000000";

      const hash_to_sign = await sha256(
        Uint8Array.from(
          transaction_bytes
            .match(/[a-fA-F0-9]{2}/gmu)
            .map((i) => Number(`0x${i}`))
        )
      );

      return [...hash_to_sign]
        .map((x) => Number(x).toString(16).padStart(2, "0"))
        .join("");
    }
  }
};

/**
 * The packed transaction type.
 * @kind typedef
 * @name packed_transaction
 * @type {Object}
 * @prop {String} chain_id Hash representing the blockchain.
 * @prop {String} transaction_header Hex string representing the serialized transaction header.
 * @prop {String} transaction_body Hex string representing the serialized transaction body.
 * @prop {String} transaction_body Hex string representing the serialized transaction body.
 */
const packed_transaction_type = new GraphQLObjectType({
  name: "packed_transaction",
  description: "Packed transaction, chain ID and transaction header",
  fields: packed_transaction_fields
});

export default packed_transaction_type;
