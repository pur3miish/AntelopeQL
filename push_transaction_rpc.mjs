import { GraphQLError } from "graphql";

/**
 * Pushes a serialized transaction to the blockchain.
 * @param {object} root Argument
 * @param {string} root.transaction_header Serialized transaction header.
 * @param {string} root.transaction_body Serialized transaction body.
 * @param {Array<string>} root.signatures List of signatures to validate transaction.
 * @param {object} network Argument
 * @param {fetch} network.fetch fetch implimentation.
 * @param {string} network.rpc_url Chain rpc url.
 * @param {object} network.headers transaction headers.
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
