import { GraphQLScalarType } from "graphql/index.mjs";

const varuint32_type = new GraphQLScalarType({
  description: `\`varint32\`

  A Signed LEB128 variable-length integer, limited to 32 bits (i.e., the values [-2^(32-1), +2^(32-1)-1]), represented by at most ceil(32/7) bytes that may contain padding 0x80 or 0xFF bytes.

  `,
  name: "varint32",
  parseValue: (varint32) => varint32
});

export default varuint32_type;
