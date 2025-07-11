import { GraphQLScalarType } from "graphql";

const block_timestamp_type = new GraphQLScalarType({
  name: "block_timestamp_type",
  description: "`Block timestamp type`",
  parseValue(value: unknown): string {
    if (typeof value !== "string") {
      throw new TypeError("Block timestamp must be a string");
    }
    if (value === "") return "";
    if (Number.isNaN(Date.parse(value))) {
      throw new TypeError("Invalid block timestamp " + value);
    }
    return value;
  }
});

export default block_timestamp_type;
