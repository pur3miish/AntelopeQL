import { GraphQLScalarType } from "graphql";

const block_timestamp_type = new GraphQLScalarType({
  description: "`Block timestamp type`",
  name: "block_timestamp_type",
  parseValue(block_time_stamp) {
    if (block_time_stamp == "") return "";
    if (Number.isNaN(Date.parse(block_time_stamp)))
      throw new TypeError("Invalid block timestamp " + block_time_stamp);
    return block_time_stamp;
  }
});

export default block_timestamp_type;
