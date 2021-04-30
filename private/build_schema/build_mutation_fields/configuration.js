'use strict'
const { GraphQLInputObjectType, GraphQLInt } = require('graphql')

const defaultValue = {
  blocksBehind: 3,
  expireSeconds: 30,
  max_net_usage_words: 0,
  max_cpu_usage_ms: 1,
  delay_sec: 0
}

const configuration = new GraphQLInputObjectType({
  name: 'configuration_type',
  description:
    'Configuration input to control various aspects of the transaction.',
  fields: () => ({
    blocksBehind: {
      description: 'Number of blocks behind the current block',
      type: GraphQLInt,
      defaultValue: defaultValue.blocksBehind
    },
    expireSeconds: {
      description: 'Seconds past before transaction is no longer valid',
      type: GraphQLInt,
      defaultValue: defaultValue.expireSeconds
    },
    max_net_usage_words: {
      description: `Maximum NET bandwidth usage a transaction can consume, \nwhen set to 0 there is no limit`,
      type: GraphQLInt,
      defaultValue: defaultValue.max_net_usage_words
    },
    max_cpu_usage_ms: {
      description: `Maximum CPU bandwidth usage a transaction can consume, \nwhen set to 0 there is no limit`,
      type: GraphQLInt,
      defaultValue: defaultValue.max_cpu_usage_ms
    },
    delay_sec: {
      type: GraphQLInt,
      description: 'Number of seconds that the transaciton will be delayed by',
      defaultValue: defaultValue.delay_sec
    }
  })
}) //configuration

module.exports = { configuration, defaultValue }
