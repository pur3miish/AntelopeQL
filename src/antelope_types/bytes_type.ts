import { GraphQLScalarType } from "graphql";

const bytes_type = new GraphQLScalarType({
  name: "bytes",
  description: "Hexadecimal text string type.",
  parseValue(value: unknown): string {
    if (typeof value !== "string") {
      throw new TypeError("Value must be a string");
    }
    if (value === "") return value;
    if (!/^[A-Fa-f0-9]+$/gmu.test(value)) {
      throw new TypeError("Invalid hexadecimal string: " + value);
    }
    if (value.length % 2 !== 0) {
      throw new TypeError("Invalid hexadecimal string length");
    }
    return value;
  }
});

export default bytes_type;
