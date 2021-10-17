'use strict'
const { GraphQLInputObjectType, GraphQLInt } = require('graphql')
const configuration_default_value = require('./configuration_default_value.js')

const configuration_type = new GraphQLInputObjectType({
  name: 'configuration_type',
  description:
    'Configuration input to control various aspects of the transaction.',
  fields: () => ({
    blocksBehind: {
      description: 'Number of blocks behind the current block',
      type: GraphQLInt,
      defaultValue: configuration_default_value.blocksBehind
    },
    expireSeconds: {
      description: 'Seconds past before transaction is no longer valid',
      type: GraphQLInt,
      defaultValue: configuration_default_value.expireSeconds
    },
    max_net_usage_words: {
      description: `Maximum NET bandwidth usage a transaction can consume, \nwhen set to 0 there is no limit`,
      type: GraphQLInt,
      defaultValue: configuration_default_value.max_net_usage_words
    },
    max_cpu_usage_ms: {
      description: `Maximum CPU bandwidth usage a transaction can consume, \nwhen set to 0 there is no limit`,
      type: GraphQLInt,
      defaultValue: configuration_default_value.max_cpu_usage_ms
    },
    delay_sec: {
      type: GraphQLInt,
      description: 'Number of seconds that the transaciton will be delayed by',
      defaultValue: configuration_default_value.delay_sec
    }
  })
})

module.exports = configuration_type
