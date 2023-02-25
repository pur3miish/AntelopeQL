import { GraphQLScalarType } from "graphql";

const time_point_type = new GraphQLScalarType({
  description: `\`time point\`

  Number of milliseconds since epoch (Unix time).
  `,
  name: "time_point",
  parseValue: (time) => time
});

export default time_point_type;
