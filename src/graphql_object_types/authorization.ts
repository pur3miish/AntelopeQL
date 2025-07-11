import { GraphQLObjectType, GraphQLString } from "graphql";

export interface AuthorizationType {
  actor: string;
  permission?: string;
}

export const authorization_type = new GraphQLObjectType<AuthorizationType>({
  name: "authorization_type",
  fields: (): Record<keyof AuthorizationType, any> => ({
    actor: { type: GraphQLString },
    permission: { type: GraphQLString }
  })
});
