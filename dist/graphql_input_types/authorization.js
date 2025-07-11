import { GraphQLInputObjectType, GraphQLNonNull } from "graphql";
import name_type from "../antelope_types/name_type.js";
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
//# sourceMappingURL=authorization.js.map