// @ts-ignore
import serialize from "eosio-wasm-js/serialize.js";
// @ts-ignore
import serialize_transaction_header from "eosio-wasm-js/transaction_header.js";
import { GraphQLError } from "graphql";
const default_config = {
    blocksBehind: 3,
    expireSeconds: 30,
    max_net_usage_words: 0,
    max_cpu_usage_ms: 0
};
const validate_actions = () => {
    throw new GraphQLError(`Invalid AntelopeQL query.`, {
        extensions: {
            why: "AntelopeQL enforces one action per object in the list to preserve the top to bottom execution order.",
            example: "actions: [{ action1: … }, { action2: … }]"
        }
    });
};
async function get_transaction_body(actions, ast_list) {
    let actions_list_to_serialize = [];
    for (const action of actions) {
        if (Object.values(action).length > 1)
            validate_actions();
        const [contract] = Object.keys(action);
        const [values] = Object.values(action);
        const action_fields = Object.keys(values);
        if (action_fields.length > 1)
            validate_actions();
        actions_list_to_serialize.push(...action_fields.map((actionName) => ({
            contract,
            action: actionName,
            data: values[actionName]
        })));
    }
    let _actions = [];
    let _context_free_actions = [];
    const transaction_extensions = "00";
    for (const action of actions_list_to_serialize) {
        const { contract, action: action_name, data: { authorization, ...data } } = action;
        const build_serialize_list = async (data, instructions) => {
            let serialize_list = [];
            for (const instruction of instructions) {
                const { $info, name, type } = instruction;
                const datum = data[name];
                const next_instruction = ast_list[contract]?.[type];
                if ($info.variant) {
                    if (Object.keys(data).length > 1)
                        throw new Error(`Must only include one type for variant.`);
                    if (!datum)
                        continue;
                    serialize_list.push({
                        type: "varuint32",
                        value: instructions.findIndex((i) => i.type === type)
                    });
                }
                if ($info.binary_ex)
                    $info.optional = false;
                if ($info.optional)
                    serialize_list.push({ type: "bool", value: datum !== undefined });
                if ($info.list && datum !== undefined)
                    serialize_list.push({ type: "varuint32", value: datum.length });
                if (next_instruction) {
                    if ($info.list) {
                        if (datum !== undefined && !$info.binary_ex) {
                            for await (const d of datum) {
                                serialize_list.push(...(await build_serialize_list(await d, next_instruction)));
                            }
                        }
                    }
                    else {
                        serialize_list.push(...(await build_serialize_list(datum, next_instruction)));
                    }
                }
                else if ($info.list && datum !== undefined) {
                    for await (const d of datum)
                        serialize_list.push({ type, value: d });
                }
                else if (datum !== undefined) {
                    serialize_list.push({ type, value: datum });
                }
            }
            return serialize_list;
        };
        const hex_string = await build_serialize_list(data, ast_list[contract][action_name]).then(async (list) => {
            let hex_string = "";
            for await (const { type, value } of list)
                hex_string += await serialize[type](await value);
            return hex_string;
        });
        if (authorization?.length)
            _actions.push({
                account: contract.replace(/_/g, "."),
                action: action_name.replace(/_/g, "."),
                authorization,
                data,
                hex_data: hex_string
            });
        else
            _context_free_actions.push({
                account: contract.replace(/_/g, "."),
                action: action_name.replace(/_/g, "."),
                authorization: [],
                data,
                hex_data: hex_string
            });
    }
    return {
        context_free_actions: _context_free_actions.map(({ action: name, ...rest }) => ({
            ...rest,
            name
        })),
        actions: _actions.map(({ action: name, ...rest }) => ({
            ...rest,
            name
        })),
        transaction_extensions: [],
        transaction_body: serialize.actions(_context_free_actions) +
            serialize.actions(_actions) +
            transaction_extensions
    };
}
async function mutation_resolver({ actions, configuration = default_config }, network, ast_list) {
    if ((configuration.max_cpu_usage_ms ?? 0) > 0xff)
        throw new Error("Invalid max_cpu_usage_ms value (maximum 255).");
    if ((configuration.max_net_usage_words ?? 0) > 0xffffffff)
        throw new Error("Invalid max_net_usage_words value (maximum 4,294,967,295).");
    const { fetch, rpc_url, ...fetchOptions } = network;
    const { transaction_body, ...transaction_list } = await get_transaction_body(actions, ast_list);
    const response = await fetch(`${rpc_url}/v1/chain/get_info`, {
        method: "POST",
        ...fetchOptions
    });
    const { chain_id, head_block_num } = (await response.json());
    const block_num_or_id = head_block_num - (configuration.blocksBehind ?? 3);
    const blockResponse = await fetch(`${rpc_url}/v1/chain/get_block`, {
        method: "POST",
        ...fetchOptions,
        body: JSON.stringify({ block_num_or_id })
    });
    const { timestamp, block_num, ref_block_prefix } = await blockResponse.json();
    const expiration = Math.round(Date.parse(timestamp + "Z") / 1000) +
        (configuration.expireSeconds ?? 30);
    const txn_header = {
        expiration,
        ref_block_num: block_num & 0xffff,
        ref_block_prefix,
        max_net_usage_words: configuration.max_net_usage_words ?? 0,
        max_cpu_usage_ms: configuration.max_cpu_usage_ms ?? 0,
        delay_sec: 0
    };
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
//# sourceMappingURL=mutation_resolver.js.map