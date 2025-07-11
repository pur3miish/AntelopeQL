import { GraphQLError, GraphQLResolveInfo } from "graphql";

/** Network config with fetch and rpc_url */
interface AntelopeQLRPC {
  fetch: typeof fetch;
  rpc_url: string;
  [key: string]: any; // additional fetch options like headers, signal, etc.
}

/** Arguments passed to the resolver */
interface QueryArg {
  key_type?: string;
  encode_type?: string;
  lower_bound?: string;
  [key: string]: any; // other possible query arguments
}

/** Context returned by getContext */
interface Context {
  network: AntelopeQLRPC;
  [key: string]: any;
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
export default async function query_resolver(
  root: Root,
  args: Args,
  getContext: (root: Root, args: Args, info: GraphQLResolveInfo) => Context,
  info: GraphQLResolveInfo
): Promise<any[]> {
  const { code } = root;
  const { arg } = args;
  const { network } = getContext(root, args, info);

  const { fetch, rpc_url, ...fetchOptions } = network;
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
