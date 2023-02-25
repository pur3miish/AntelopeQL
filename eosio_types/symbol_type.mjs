import { GraphQLScalarType } from "graphql/index.mjs";

const symbol_type = new GraphQLScalarType({
  description: `\`Symbol type\`

---

An eosio symbol is an all uppercase string of 7 or less characters from [A-Z].

  ### Symbol rules

  - Ends with a symbol up to 7 characters long
  - Symbol must be uppercase
  - Maximum value (2^62 - 1)
  - Maximum decimal precision of 18

  `,
  name: "symbol",
  parseValue: (symbol) => {
    if (!symbol.match(/^[0-9]{1,2},[A-Z]{1,7}$/gmu))
      throw new Error(
        "Invalid symbol format, correct format is <precision,code>"
      );
    const [precision] = symbol.split(",");

    if (!(precision > -1 && precision < 18))
      throw new RangeError("Invalid symbol precision, maximum 18");

    return symbol;
  }
});

export default symbol_type;
