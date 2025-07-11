import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull } from "graphql";
const actions_type = (fields, typeResolution = "") => new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(new GraphQLInputObjectType({
    name: "actions_type" + typeResolution,
    fields
}))));
export default actions_type;
//# sourceMappingURL=actions.js.map