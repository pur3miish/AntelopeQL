'use strict'

const { GraphQLScalarType } = require('graphql/type/definition.js')

const block_timestamp_type = new GraphQLScalarType({
  description: '`Block timestamp type`',
  name: 'block_timestamp_type',
  parseValue: block_time_stamp => {
    if (block_time_stamp == '') return ''
    if (Number.isNaN(Date.parse(block_time_stamp)))
      throw new Error('Invalid block timestamp')
    return block_time_stamp
  }
})

module.exports = block_timestamp_type