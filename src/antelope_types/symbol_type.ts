import { GraphQLScalarType } from "graphql";

const symbol_type = new GraphQLScalarType({
  name: "symbol",
  description: `
\`Symbol type\`

---

An eosio symbol is an all uppercase string of 7 or less characters from [A-Z].

### Symbol rules

- Ends with a symbol up to 7 characters long
- Symbol must be uppercase
- Maximum value (2^62 - 1)
- Maximum decimal precision of 18
`,
  parseValue(value: unknown): string {
    if (typeof value !== "string") {
      throw new TypeError("Symbol must be a string.");
    }
    if (!/^[0-9]{1,2},[A-Z]{1,7}$/gm.test(value)) {
      throw new Error(
        "Invalid symbol format, correct format is <precision,code>"
      );
    }

    const [precisionStr] = value.split(",");
    const precision = Number(precisionStr);

    if (!(precision >= 0 && precision <= 18)) {
      throw new RangeError("Invalid symbol precision, maximum 18");
    }

    return value;
  }
});

export default symbol_type;
