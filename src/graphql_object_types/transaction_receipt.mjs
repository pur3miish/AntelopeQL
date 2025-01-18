import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

import name_type from "../eosio_types/name_type.mjs";
import authorizing_account_type from "./authorization.mjs";

/**
 * @typedef {Enumerator} Transaction_status
 * @prop {String} executed succeed, no error handler executed.
 * @prop {String} soft_fail objectively failed (not executed), error handler executed.
 * @prop {String} hard_fail objectively failed and error handler objectively failed thus no state change.
 * @prop {String} delayed transaction delayed/deferred/scheduled for future execution.
 * @prop {String} expired transaction expired and storage space refunded to user.
 */
const transaction_status = new GraphQLEnumType({
  name: "transaction_receipt_status",
  description: `Describes the status of the transaction.`,
  values: {
    executed: {
      value: "executed",
      description: "succeed, no error handler executed"
    },
    soft_fail: {
      value: "soft_fail",
      description: "objectively failed (not executed), error handler executed"
    },
    hard_fail: {
      value: "hard_fail",
      description:
        "objectively failed and error handler objectively failed thus no state change"
    },
    delayed: {
      value: "delayed",
      description: "transaction delayed/deferred/scheduled for future execution"
    },
    expired: {
      value: "expired",
      description: "transaction expired and storage space refunded to user"
    }
  }
});

/**
 * Bandwidth reciept for Antelope transaction.
 * @typedef {Object} Bandwidth_cost
 * @prop {Number} net_usage_words Consumption of network bandwidth (bytes).
 * @prop {Number} cpu_usage_us Consumption of CPU bandwidth (µs).
 * @prop {Transaction_status} status Transaction receipt status Enum.
 */
const bandwidth_cost_type = new GraphQLObjectType({
  name: "bandwidth_cost",
  fields: () => ({
    cpu_usage_us: {
      type: GraphQLInt,
      resolve: ({ cpu_usage_us }) => cpu_usage_us
    },
    net_usage_words: {
      type: GraphQLInt,
      resolve: ({ net_usage_words }) => net_usage_words
    },
    status: {
      type: transaction_status
    }
  })
});

const action_trace_type = new GraphQLObjectType({
  name: "action_trace",
  description: "list of actions that the transaction includes.",
  fields: () => ({
    account: {
      type: name_type,
      description: "Contract name of the action you are calling.",
      resolve: ({ act }) => act.account
    },
    name: {
      type: name_type,
      description: "The action name of the contract.",
      resolve: ({ act }) => act.name
    },
    authorization: {
      type: new GraphQLList(authorizing_account_type),
      description: "Action authorization",
      resolve: ({ act }) => act.authorization
    },
    data: {
      type: GraphQLString,
      description: "JSON representation of the action data.",
      resolve: ({ act }) => JSON.stringify(act.data)
    },
    inline_traces: {
      description: "Inline action trace.",
      type: new GraphQLList(action_trace_type),
      resolve: ({ inline_traces }) => inline_traces
    }
  })
});

/**
 * @typedef {Object} transaction_receipt
 * @type {Object}
 * @prop {String} transaction_id ID of the transaction.
 * @prop {Number} block_num Block number where teh transaction can be found.
 * @prop {Stiring} block_time The time of the transaction.
 * @prop {String} producer_block_id The block producer ID that processed the transaction.
 * @prop {Bandwidth_cost} resource_cost Network cost for the transaction.
 * @prop {Boolean} scheduled Scheduled transactions are executed at a later time.
 */
const transaction_receipt_type = new GraphQLObjectType({
  name: "transaction_receipt",
  description: "Receipt for the action (mutation) for a blockchain transaction",
  fields: () => ({
    transaction_id: {
      type: GraphQLID,
      description: "`Antelope` blockchain transaction id “reciept”"
    },
    block_num: {
      type: GraphQLInt,
      description: "What block the transaction is located in",
      resolve: ({ processed }) => processed.block_num
    },
    block_time: {
      type: GraphQLString,
      description: "transaction time (GMT)",
      resolve: ({ processed }) => processed.block_time
    },
    producer_block_id: {
      type: GraphQLString,
      description: "Block producer ID that processed the transaction.",
      resolve: ({ processed }) => processed.producer_block_id
    },
    resource_cost: {
      description:
        "A resource object for the network cost of running the transaction",
      type: bandwidth_cost_type,
      resolve: ({ processed }) => processed.receipt
    },
    scheduled: {
      type: GraphQLBoolean,
      description: "Scheduled transactions are executed at a later time.",
      resolve: ({ processed }) => processed.scheduled
    },
    action_traces: {
      description:
        "A JSON string trace of the actions performed for the transaction.",
      type: new GraphQLList(action_trace_type),
      resolve: ({ processed }) => processed.action_traces
    }
  })
});

export default transaction_receipt_type;
