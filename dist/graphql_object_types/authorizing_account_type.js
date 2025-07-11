import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
const authorizing_account_type = new GraphQLObjectType({
    name: "authorizing_account_type",
    fields: () => ({
        actor: {
            type: new GraphQLNonNull(GraphQLString)
        },
        permission: {
            type: GraphQLString
        }
    })
});
export default authorizing_account_type;
//# sourceMappingURL=authorizing_account_type.js.map