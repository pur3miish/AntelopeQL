import { GraphQLError } from "graphql/index.mjs";

/**
 * Pushes a serialized transaction to the blockchain.
 * @param {Object} root Argument
 * @param {String} root.transaction_header Serialized transaction header.
 * @param {String} root.transaction_body Serialized transaction body.
 * @param {Array<String>} root.signatures List of signatures to validate transaction.
 * @param {Object} network Argument
 * @param {fetch} network.fetch Custom fetch.
 * @param {String} network.rpc_url Chain rpc url.
 * @param {Object} network.headers transaction headers.
 *
 */
export default async function push_transaction_rpc(
  { transaction_header, transaction_body, signatures },
  network
) {
  const { fetch, rpc_url, ...fetchOptions } = network;
  const pushed_txn_req = await fetch(`${rpc_url}/v1/chain/push_transaction`, {
    method: "POST",
    ...fetchOptions,
    body: JSON.stringify({
      signatures,
      compression: 0,
      packed_context_free_data: "",
      packed_trx: transaction_header + transaction_body
    })
  });
  const pushed_transaction = await pushed_txn_req.json();
  if (pushed_transaction.error)
    throw new GraphQLError(pushed_transaction.message, {
      extensions: pushed_transaction.error
    });

  return pushed_transaction;
}
