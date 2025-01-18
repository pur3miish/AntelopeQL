import { GraphQLScalarType } from "graphql";

const signature_type = new GraphQLScalarType({
  description: `\`Signature type\`

  Antelope based signature, K1, R1 WA.`,
  name: "signature",
  parseValue(signature) {
    if (signature == "") return "";
    if (typeof signature !== "string")
      throw new TypeError("Expected signature to be string");

    return signature;
  }
});

export default signature_type;
