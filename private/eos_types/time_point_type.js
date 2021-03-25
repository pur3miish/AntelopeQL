'use strict'

const { GraphQLScalarType } = require('graphql/type/definition.js')

const time_point_type = new GraphQLScalarType({
  description: `\`time point\`

  Number of milliseconds since epoch (Unix time).
  `,
  name: 'time_point',
  parseValue: time => time
})

module.exports = time_point_type
