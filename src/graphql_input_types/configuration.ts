import { GraphQLInputObjectType, GraphQLInt } from "graphql";

export interface ConfigurationType {
  blocksBehind: number;
  expireSeconds: number;
  max_net_usage_words: number;
  max_cpu_usage_ms: number;
  delay_sec?: number;
}

export const configuration_default_value: ConfigurationType = {
  blocksBehind: 3,
  expireSeconds: 30,
  max_net_usage_words: 0,
  max_cpu_usage_ms: 0,
  delay_sec: 0
};

export const configuration_type = new GraphQLInputObjectType({
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
      description:
        "Maximum NET bandwidth usage a transaction can consume, when set to 0 there is no limit",
      type: GraphQLInt,
      defaultValue: configuration_default_value.max_net_usage_words
    },
    max_cpu_usage_ms: {
      description:
        "Maximum CPU bandwidth usage a transaction can consume, when set to 0 there is no limit",
      type: GraphQLInt,
      defaultValue: configuration_default_value.max_cpu_usage_ms
    }
  })
});
