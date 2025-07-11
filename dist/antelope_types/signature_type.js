import { GraphQLScalarType } from "graphql";
const signature_type = new GraphQLScalarType({
    name: "signature",
    description: `
\`Signature type\`

Antelope based signature, K1, R1 WA.
  `,
    parseValue(value) {
        if (value === "")
            return "";
        if (typeof value !== "string") {
            throw new TypeError("Expected signature to be a string");
        }
        return value;
    }
});
export default signature_type;
//# sourceMappingURL=signature_type.js.map