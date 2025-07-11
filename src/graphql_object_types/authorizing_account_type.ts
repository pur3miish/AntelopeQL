import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFieldConfigMap
} from "graphql";

export interface AuthorizingAccount {
  actor: string;
  permission?: string;
}

const authorizing_account_type = new GraphQLObjectType<AuthorizingAccount>({
  name: "authorizing_account_type",
  fields: (): GraphQLFieldConfigMap<AuthorizingAccount, any> => ({
    actor: {
      type: new GraphQLNonNull(GraphQLString)
    },
    permission: {
      type: GraphQLString
    }
  })
});

export default authorizing_account_type;
