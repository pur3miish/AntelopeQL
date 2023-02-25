import serialize from "eosio-wasm-js/serialize.mjs";
import serialize_transaction_header from "eosio-wasm-js/transaction_header.mjs";
import { GraphQLError } from "graphql";

const defeaul_config = {
  blocksBehind: 3,
  expireSeconds: 30,
  max_net_usage_words: 0,
  max_cpu_usage_ms: 0,
  delay_sec: 0
};

const validate_actions = () => {
  throw new GraphQLError(`Invalid SmartQL query.`, {
    extensions: {
      why: "SmartQL enforces one action per object in the list to preserve the top to bottom execution order.",
      example: "actions: [{ action1: … }, { action2: … }]"
    }
  });
};

/**
 * Serializes GraphQL mutation actions into binary instructions.
 * @param {Array<Object>} actions List of actions to serialize.
 * @param {Array<Object>} ast_list Abstract syntax tree list of data to serialize.
 * @returns {String} Serialized transaction body as hexadecimal string.
 */
async function get_transaction_body(actions, ast_list) {
  let actions_list_to_serialize = [];

  for (const action of actions) {
    if (Object.values(action).length > 1) validate_actions(action);

    const [contract] = Object.keys(action);
    const [values] = Object.values(action);
    const action_fields = Object.keys(values);
    if (action_fields.length > 1) validate_actions(action);

    actions_list_to_serialize.push(
      ...action_fields.map((action) => ({
        contract,
        action,
        data: values[action]
      }))
    );
  }

  let _actions = [];
  let _context_free_actions = [];

  let transaction_extensions =
    "000000000000000000000000000000000000000000000000000000000000000000";

  for (const action of actions_list_to_serialize) {
    const {
      contract,
      action: action_name,
      data: { authorization, ...data }
    } = action;

    const build_serialize_list = async (data, instructions) => {
      let serialize_list = [];
      for (const instruction of instructions) {
        const { $info, name, type } = instruction;
        const datum = data[name];
        const next_instruction = ast_list[contract][type]; // Indicates that the AST type is not serialisable, but is another type on the AST list.

        // Handles ABI variant types see https://en.cppreference.com/w/cpp/utility/variant
        if ($info.variant) {
          if (Object.keys(data).length > 1)
            throw new Error(`Must only include one type for variant.`);
          if (!datum) continue;
          else
            serialize_list.push({
              type: "varuint32",
              value: instructions.findIndex((i) => i.type == type)
            });
        }

        if ($info.binary_ex) $info.optional = false; // Binary extentions are optional (GraphQL types) but should not serialize an optional type.

        if ($info.optional)
          serialize_list.push({ type: "bool", value: datum != undefined }); // Add an optional item to serialize list.

        if ($info.list)
          if (datum !== undefined)
            serialize_list.push({ type: "varuint32", value: datum.length }); // Add an length of list to serialize list.

        // Indicates that we need to recursion loop through each data item.
        if (next_instruction)
          if ($info.list) {
            if (datum != undefined && !$info.binary_ex)
              for await (const d of datum)
                serialize_list.push(
                  ...(await build_serialize_list(await d, next_instruction))
                );
          }
          // None list recursion
          else
            serialize_list.push(
              ...(await build_serialize_list(datum, next_instruction))
            );
        // Indicates that the list of data can be serilaized and so is pushed into serialize_list.
        else if ($info.list && datum !== undefined)
          for await (const d of datum) serialize_list.push({ type, value: d });
        else if (datum !== undefined)
          serialize_list.push({ type, value: datum }); // Native eoio types than can be serialized.
      }

      return serialize_list;
    };

    const hex_string = await build_serialize_list(
      data,
      ast_list[contract][action_name]
    ).then(async (list) => {
      let hex_string = "";
      for await (const { type, value } of list)
        hex_string += await serialize[type](await value);
      return hex_string;
    });

    if (authorization?.length)
      _actions.push({
        account: contract.replace(/_/gmu, "."),
        action: action_name.replace(/_/gmu, "."),
        authorization,
        data,
        hex_data: hex_string
      });
    else
      _context_free_actions.push({
        account: contract.replace(/_/gmu, "."),
        action: action_name.replace(/_/gmu, "."),
        authorization: [],
        data,
        hex_data: hex_string
      });
  }

  return {
    context_free_actions: _context_free_actions.map(
      ({ action: name, ...action }) => ({ ...action, name })
    ),
    actions: _actions.map(({ action: name, ...action }) => ({
      ...action,
      name
    })),
    transaction_extensions: [],
    transaction_body:
      serialize.actions(_context_free_actions) +
      serialize.actions(_actions) +
      transaction_extensions
  };
}

/**
 * Mutation resolver for serializing EOSIO transactions.
 * @param {Object} args Args.
 * @param {Object} args.actions Actions list to be serialized.
 * @param {Object} [args.configuration] Action configuaration.
 * @param {SmartQLRPC} network SmartQL context contain fetch and url string.
 * @param {Object} ast_list Abstract syntax tree list of the contract actions.
 * @returns {Object} Transaction object.
 */
async function mutation_resolver(
  { actions, configuration = defeaul_config },
  network,
  ast_list
) {
  if (configuration.max_cpu_usage_ms > 0xff)
    throw new Error("Invalid max_cpu_usage_ms value (maximum 255).");
  if (configuration.max_net_usage_words > 0xffffffff)
    throw new Error(
      "Invalid max_net_usage_words value (maximum 4,294,967,295)."
    );

  const { fetch, rpc_url, ...fetchOptions } = network;
  const { transaction_body, ...transaction_list } = await get_transaction_body(
    actions,
    ast_list
  );

  const { chain_id, head_block_num } = await fetch(
    `${rpc_url}/v1/chain/get_info`,
    {
      method: "POST",
      ...fetchOptions
    }
  ).then((req) => req.json());

  const block_num_or_id = head_block_num - configuration.blocksBehind;

  const { timestamp, block_num, ref_block_prefix } = await fetch(
    `${rpc_url}/v1/chain/get_block`,
    {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({
        block_num_or_id
      })
    }
  ).then((req) => req.json());

  // // TaPoS expiry time.
  const expiration =
    Math.round(Date.parse(timestamp + "Z") / 1000) +
    configuration.expireSeconds;

  const txn_header = {
    expiration,
    ref_block_num: block_num & 0xffff,
    ref_block_prefix,
    max_net_usage_words: configuration.max_net_usage_words,
    max_cpu_usage_ms: configuration.max_cpu_usage_ms,
    delay_sec: configuration.delay_sec
  };

  // Generates a transaction header for a EOS transaction.
  const transaction_header = serialize_transaction_header(txn_header);
  txn_header.expiration = timestamp;

  return {
    chain_id,
    transaction_header,
    transaction_body,
    transaction: {
      ...txn_header,
      ...transaction_list
    }
  };
}

export default mutation_resolver;
