import { GraphQLError, GraphQLObjectType, GraphQLString } from "graphql";
const RAM_quote_type = new GraphQLObjectType({
    name: "blockchain_ram_price",
    fields: () => ({
        quote: {
            type: GraphQLString,
            resolve: (SYS) => SYS
        }
    })
});
const get_ram_price = {
    description: "RAM quote (bytes)",
    type: RAM_quote_type,
    args: {
        quantity: {
            type: GraphQLString,
            description: "Number of bytes of RAM."
        }
    },
    async resolve(root, { quantity = "1" }, getContext, info) {
        const { network: { fetch, rpc_url, ...fetchOptions } } = getContext(root, { quantity }, info);
        const response = await fetch(`${rpc_url}/v1/chain/get_table_rows`, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify({
                code: "eosio",
                json: true,
                table: "rammarket",
                scope: "eosio",
                index_position: 1,
                key_type: "i128",
                lower_bound: "",
                upper_bound: ""
            })
        });
        const data = await response.json();
        if (data.error)
            throw new GraphQLError(data.message || "Unknown error", {
                extensions: data
            });
        if (data.rows.length === 0) {
            throw new GraphQLError("No RAM market data available");
        }
        const RAM = data.rows[0];
        // Extract CORE asset symbol from quote balance, e.g. "1000.0000 SYS"
        const CORE_ASSET = RAM.quote.balance;
        const CORE_TOKEN_MATCH = CORE_ASSET.match(/[A-Z]+/);
        const CORE_TOKEN = CORE_TOKEN_MATCH ? CORE_TOKEN_MATCH[0] : "";
        // Determine precision from decimal places
        const decimalPart = CORE_ASSET.split(" ")[0].split(".")[1] ?? "";
        const precision = decimalPart.length;
        const supplyStr = RAM.base.balance.replace(" RAM", "").replace(/,/g, "");
        const totalValueStr = RAM.quote.balance
            .replace(CORE_TOKEN, "")
            .replace(/,/g, "");
        const supply = parseFloat(supplyStr);
        const totalValue = parseFloat(totalValueStr);
        const qty = parseFloat(quantity);
        if (isNaN(supply) || isNaN(totalValue) || isNaN(qty) || supply === 0) {
            throw new GraphQLError("Invalid RAM market data for calculation");
        }
        const bytePrice = (qty * totalValue) / supply;
        const priceFormatted = bytePrice.toFixed(precision);
        return `${priceFormatted} ${CORE_TOKEN}`;
    }
};
export default get_ram_price;
//# sourceMappingURL=get_ram_price.js.map