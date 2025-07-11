import { GraphQLError, GraphQLInputObjectType, GraphQLObjectType } from "graphql";
import { abi_to_graphql_ast, get_graphql_fields_from_AST } from "./abi_to_graphql_ast.js";
export default function build_graphql_fields_from_abis(abi_list, typeResolution = "") {
    const contract_query_fields = {};
    const contract_mutation_fields = {};
    const ast_list = {};
    for (const { abi, account_name } of abi_list) {
        const name = account_name.replace(/\./g, "_");
        const AST = abi_to_graphql_ast(abi);
        ast_list[name] = AST; // For use in serializing data in mutation resolver.
        const { query_fields, mutation_fields } = get_graphql_fields_from_AST(AST, abi, name, typeResolution);
        if (Object.keys(query_fields).length) {
            contract_query_fields[name] = {
                name,
                type: new GraphQLObjectType({
                    name: `${name}_query${typeResolution}`,
                    fields: query_fields
                }),
                resolve(root, arg, getContext, info) {
                    const { network: { rpc_url, fetch } = {} } = getContext(root, arg, info);
                    if (!fetch)
                        throw new GraphQLError("No fetch argument found on the context of the GraphQL.execute.");
                    if (!rpc_url)
                        throw new GraphQLError("No rpc_url argument found on the context of the GraphQL.execute.");
                    return { code: info.fieldName.replace(/_/g, ".") };
                }
            };
        }
        if (Object.keys(mutation_fields).length) {
            contract_mutation_fields[name] = {
                type: new GraphQLInputObjectType({
                    name: name + typeResolution,
                    fields: mutation_fields
                })
            };
        }
    }
    return {
        query_fields: contract_query_fields,
        mutation_fields: contract_mutation_fields,
        ast_list
    };
}
//# sourceMappingURL=build_graphql_fields_from_abis.js.map