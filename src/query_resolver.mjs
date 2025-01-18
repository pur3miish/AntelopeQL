import { GraphQLError } from "graphql";

/**
 * AntelopeQL Query resolver.
 * @param {Object} root GraphQL resolver root query.
 * @param {String} root.code Contract code calling, passed from antelopeql_fields resolver.
 * @param {Object} args Query arguments.
 * @param {Object} args.arg argument data.
 * @param {Object} ctx GraphQL context.
 * @param {AntelopeQLRPC} ctx.network Object containing connection url and fetch.
 * @param {Object} info GraphQL resovler info argument.
 * @returns {Object} Returned data from table.
 */
export default async function query_resolver(
  { code },
  { arg },
  getContext,
  info
) {
  const { network } = getContext({ code }, { arg }, info);

  const { fetch, rpc_url, ...fetchOptions } = network;
  const { fieldName: query_name } = info;
  const table = query_name.replace(/_/gmu, ".");

  if (
    arg.key_type == "i256" ||
    arg.key_type == "ripemd160" ||
    arg.key_type == "sha256"
  ) {
    arg.encode_type = "hex";
    arg.lower_bound = arg.lower_bound ?? "00";
  }
  const uri = rpc_url + "/v1/chain/get_table_rows";

  const data = await fetch(uri, {
    method: "POST",
    ...fetchOptions,
    body: JSON.stringify({ json: true, code, table, ...arg })
  }).then((req) => req.json());

  if (data.error) throw new GraphQLError(data.message, { extensions: data });

  return data.rows;
}
