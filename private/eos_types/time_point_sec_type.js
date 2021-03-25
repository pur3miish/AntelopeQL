'use strict'

const { GraphQLScalarType } = require('graphql/type/definition.js')

const time_point_sec_type = new GraphQLScalarType({
  description: `\`time point sec\`

  Number of seconds since epoch (Unix time).
  `,
  name: 'time_point_sec',
  parseValue: time => time
})

module.exports = time_point_sec_type
