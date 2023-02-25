import { GraphQLScalarType } from "graphql/index.mjs";

const signature_type = new GraphQLScalarType({
  description: `\`Signature type\`

  EOS K1 signature supported.`,
  name: "signature",
  parseValue(signature) {
    if (signature == "") return "";
    if (typeof signature !== "string")
      throw new TypeError("Expected signature to be string");

    if (signature.slice(0, 7) != "SIG_K1_")
      throw new TypeError("Signature prefix is should be SIG_K1_.");
    return signature;
  }
});

export default signature_type;
