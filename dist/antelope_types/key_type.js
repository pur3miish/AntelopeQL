import { GraphQLInt, GraphQLObjectType } from "graphql";
import public_key_type from "./public_key_type.js";
const Antelope_key_type = new GraphQLObjectType({
    name: "key_type",
    fields: () => ({
        key: { type: public_key_type },
        weight: { type: GraphQLInt }
    })
});
export default Antelope_key_type;
//# sourceMappingURL=key_type.js.map