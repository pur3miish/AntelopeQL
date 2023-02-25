import { GraphQLObjectType, GraphQLString } from "graphql/index.mjs";

const authorization_type = new GraphQLObjectType({
  name: "authorization_type",
  fields: () => ({
    actor: {
      type: GraphQLString
    },
    permission: {
      type: GraphQLString
    }
  })
});

export default authorization_type;
