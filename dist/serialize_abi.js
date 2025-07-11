// @ts-ignore
import serialize from "eosio-wasm-js/serialize.js";
import { abi_to_graphql_ast } from "./abi_to_graphql_ast.js";
// The ABI constant, strongly typed
const ABI = {
    version: "eosio::abi/1.1",
    structs: [
        {
            name: "extensions_entry",
            base: "",
            fields: [
                { name: "tag", type: "uint16" },
                { name: "value", type: "bytes" }
            ]
        },
        {
            name: "type_def",
            base: "",
            fields: [
                { name: "new_type_name", type: "string" },
                { name: "type", type: "string" }
            ]
        },
        {
            name: "field_def",
            base: "",
            fields: [
                { name: "name", type: "string" },
                { name: "type", type: "string" }
            ]
        },
        {
            name: "struct_def",
            base: "",
            fields: [
                { name: "name", type: "string" },
                { name: "base", type: "string" },
                { name: "fields", type: "field_def[]" }
            ]
        },
        {
            name: "action_def",
            base: "",
            fields: [
                { name: "name", type: "name" },
                { name: "type", type: "string" },
                { name: "ricardian_contract", type: "string" }
            ]
        },
        {
            name: "table_def",
            base: "",
            fields: [
                { name: "name", type: "name" },
                { name: "index_type", type: "string" },
                { name: "key_names", type: "string[]" },
                { name: "key_types", type: "string[]" },
                { name: "type", type: "string" }
            ]
        },
        {
            name: "clause_pair",
            base: "",
            fields: [
                { name: "id", type: "string" },
                { name: "body", type: "string" }
            ]
        },
        {
            name: "error_message",
            base: "",
            fields: [
                { name: "error_code", type: "uint64" },
                { name: "error_msg", type: "string" }
            ]
        },
        {
            name: "variant_def",
            base: "",
            fields: [
                { name: "name", type: "string" },
                { name: "types", type: "string[]" }
            ]
        },
        {
            name: "abi_def",
            base: "",
            fields: [
                { name: "version", type: "string" },
                { name: "types", type: "type_def[]" },
                { name: "structs", type: "struct_def[]" },
                { name: "actions", type: "action_def[]" },
                { name: "tables", type: "table_def[]" },
                { name: "ricardian_clauses", type: "clause_pair[]" },
                { name: "error_messages", type: "error_message[]" },
                { name: "abi_extensions", type: "extensions_entry[]" },
                { name: "variants", type: "variant_def[]" }
            ]
        }
    ]
};
const AST = abi_to_graphql_ast(ABI);
/**
 * @param abi - Antelope ABI object to serialize
 * @returns hex string of serialized ABI
 */
export default async function serialize_abi(abi) {
    let JSON_ABI = { ...abi };
    // Ensure array fields exist on ABI.structs[9] (abi_def fields)
    ABI.structs[9].fields.forEach(({ name }) => {
        if (JSON_ABI[name] === undefined) {
            JSON_ABI[name] = [];
        }
    });
    const build_serialize_list = async (data, instructions) => {
        const serialize_list = [];
        for (const instruction of instructions) {
            const { $info, name, type } = instruction;
            const datum = data[name];
            const next_instruction = AST[type];
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
    const ser_list = await build_serialize_list(JSON_ABI, AST.abi_def);
    let hex_string = "";
    ser_list.forEach(({ type, value }) => (hex_string += serialize[type](value)));
    return hex_string;
}
//# sourceMappingURL=serialize_abi.js.map