import { GraphQLScalarType } from "graphql";

export const boolean_type = new GraphQLScalarType({
  name: "bool",
  description: "`Boolean type` true=1 or false=0",

  parseValue(value: unknown): boolean {
    // Accept true, false, 1, 0 (coerce to boolean)
    if (value === 1 || value === "1") return true;
    if (value === 0 || value === "0") return false;
    if (typeof value === "boolean") return value;
    throw new TypeError("Boolean type must be true, false, 1, or 0");
  },

  serialize(value: unknown): boolean {
    // Serialize truthy/falsy to boolean
    return Boolean(value);
  }
});
