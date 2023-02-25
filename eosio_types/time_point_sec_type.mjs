import { GraphQLScalarType } from "graphql/index.mjs";

const time_point_sec_type = new GraphQLScalarType({
  description: `\`time point sec\`

  Number of seconds since epoch (Unix time).
  `,
  name: "time_point_sec",
  parseValue: (time) => time
});

export default time_point_sec_type;
