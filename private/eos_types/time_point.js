'use strict'

const { GraphQLScalarType } = require('graphql/type/definition.js')

const time_point_type = new GraphQLScalarType({
  description: `\`time point\`

  Number of milliseconds since epoch (Unix time).
  `,
  name: 'time_point',
  parseValue: time => {
    if (time == '') return ''
    time = BigInt(time)
    if (time <= 2n ** 64n) throw new Error('Invalid time point (ms)')
    return time
  }
})

module.exports = time_point_type
