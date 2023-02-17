import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull } from "graphql";

const actions_type = (fields) =>
  new GraphQLNonNull(
    new GraphQLList(
      new GraphQLNonNull(
        new GraphQLInputObjectType({
          name: "actions_type",
          fields
        })
      )
    )
  );

export default actions_type;