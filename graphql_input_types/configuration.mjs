// @ts-check

import { GraphQLInputObjectType, GraphQLInt } from "graphql/index.mjs";

const configuration_default_value = {
  blocksBehind: 3,
  expireSeconds: 30,
  max_net_usage_words: 0,
  max_cpu_usage_ms: 0,
  delay_sec: 0
};

/**
 * Handles various elements relating to the `EOSIO` transaction.
 * @typedef {Object} configuration_type
 * @param {Number} blocksBehind Number of blocks behind the current block (TaPoS protection).
 * @param {Number} expireSeconds Seconds past before transaction is no longer valid (TaPoS protection)
 * @param {Number} max_net_usage_words Maximum NET bandwidth usage a transaction can consume (0 there is no limit).
 * @param {Number} max_cpu_usage_ms Maximum NET bandwidth usage a transaction can consume (0 there is no limit).
 * @param {Number} delay_sec Number of seconds that the transaciton will be delayed by.
 */
const configuration_type = new GraphQLInputObjectType({
  name: "configuration_type",
  description:
    "Configuration input to control various aspects of the transaction.",
  fields: () => ({
    blocksBehind: {
      description: "Number of blocks behind the current block",
      type: GraphQLInt,
      defaultValue: configuration_default_value.blocksBehind
    },
    expireSeconds: {
      description: "Seconds past before transaction is no longer valid",
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
      description: "Number of seconds that the transaciton will be delayed by",
      defaultValue: configuration_default_value.delay_sec
    }
  })
});

export default configuration_type;
