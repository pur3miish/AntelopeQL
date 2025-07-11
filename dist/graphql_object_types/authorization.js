import { GraphQLObjectType, GraphQLString } from "graphql";
const authorization_type = new GraphQLObjectType({
    name: "authorization_type",
    fields: () => ({
        actor: { type: GraphQLString },
        permission: { type: GraphQLString }
    })
});
export default authorization_type;
//# sourceMappingURL=authorization.js.map