import { GraphQLObjectType, GraphQLString } from "graphql";

export interface AuthorizationType {
  actor: string;
  permission?: string;
}

const authorization_type = new GraphQLObjectType<AuthorizationType>({
  name: "authorization_type",
  fields: (): Record<keyof AuthorizationType, any> => ({
    actor: { type: GraphQLString },
    permission: { type: GraphQLString }
  })
});

export default authorization_type;
