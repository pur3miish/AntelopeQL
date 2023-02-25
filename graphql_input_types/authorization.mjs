import { GraphQLInputObjectType, GraphQLNonNull } from "graphql/index.mjs";

import name_type from "../eosio_types/name_type.mjs";

/**
 * The action authorization type for action validation.
 * @kind typedef
 * @name authorization
 * @type {Object}
 * @prop {String} actor Name of the account that is trying to authorize.
 * @prop {String} permission Name of the `permission` of the the `actor`
 */

const authorization_type = new GraphQLInputObjectType({
  name: "authorization",
  description: "Authorization object type.",
  fields: () => ({
    actor: {
      description: "The name of the account name to sign the transaction.",
      type: new GraphQLNonNull(name_type)
    },
    permission: {
      description: "The name of the account permission.",
      type: name_type,
      defaultValue: "active"
    }
  })
});

export default authorization_type;
