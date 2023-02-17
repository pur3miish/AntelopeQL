import { GraphQLError } from "graphql";

/**
 * SmartQL Query resolver.
 * @param {object} root GraphQL resolver root query.
 * @param {string} root.code Contract code calling, passed from smartql_fields resolver.
 * @param {object} args Query arguments.
 * @param {object} args.arg argument data.
 * @param {object} ctx GraphQL context.
 * @param {SmartQLRPC} ctx.network Object containing connection url and fetch.
 * @param {object} info GraphQL resovler info argument.
 * @returns {object} Returned data from table.
 */
export default async function query_resolver(
  { code },
  { arg },
  { network },
  info
) {
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
