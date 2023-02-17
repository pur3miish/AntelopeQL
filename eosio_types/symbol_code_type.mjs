import { GraphQLScalarType } from "graphql";

const symbol_code_type = new GraphQLScalarType({
  description: `\`Symbol code type\``,
  name: "symbol_code",
  parseValue: (symbol_code) => {
    if (!symbol_code.match(/[A-Z]{1,7}/gmu))
      throw new Error("Invalid symbol code.");
    return symbol_code;
  }
});

export default symbol_code_type;
