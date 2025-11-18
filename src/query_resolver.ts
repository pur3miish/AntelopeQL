import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { type Context } from "./types/Context.js";

/** Arguments passed to the resolver */
interface QueryArg {
  key_type?: string;
  encode_type?: string;
  lower_bound?: string;
  [key: string]: any; // other possible query arguments
}

/** Root object received by resolver */
interface Root {
  code: string;
}

/** Args object received by resolver */
interface Args {
  arg: QueryArg;
}

/**
 * AntelopeQL Query resolver.
 * @param root GraphQL resolver root query
 * @param args Query arguments object
 * @param getContext Function returning the context object
 * @param info GraphQL resolver info object
 * @returns Data rows from the queried table
 */
export async function query_resolver(
  root: Root,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
): Promise<any[]> {
  const { code } = root;
  const { arg } = args;
  const { rpc_url, fetchOptions } = context.network(root, args, info);

  const { fieldName: query_name } = info;
  const table = query_name.replace(/_/g, ".");

  if (
    arg.key_type === "i256" ||
    arg.key_type === "ripemd160" ||
    arg.key_type === "sha256"
  ) {
    arg.encode_type = "hex";
    arg.lower_bound = arg.lower_bound ?? "00";
  }

  const uri = rpc_url + "/v1/chain/get_table_rows";

  const response = await fetch(uri, {
    method: "POST",
    ...fetchOptions,
    body: JSON.stringify({ json: true, code, table, ...arg })
  });

  const data = await response.json();

  if (data.error) {
    throw new GraphQLError(data.message, { extensions: data });
  }

  return data.rows;
}
