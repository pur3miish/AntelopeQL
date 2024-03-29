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
  async resolve(root, { quantity }, getContext, info) {
    const {
      network: { fetch, rpc_url, ...fetchOptions }
    } = getContext(root, { quantity }, info);

    const data = await fetch(rpc_url + "/v1/chain/get_table_rows", {
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
    }).then((req) => req.json());

    if (data.error) throw new GraphQLError(data.message, { extensions: data });

    if (data.rows) {
      // Connector Balance / (Smart Token’s Outstanding supply × Connector Weight)
      const [RAM] = data.rows;

      const CORE_ASSET = RAM.quote.balance;
      const CORE_TOKEN = CORE_ASSET.match(/[\sA-Z]+/gmu);

      const [, decimal] = String(
        CORE_ASSET.replace(/[A-Za-z\s]+/gmu, "")
      ).split(".");

      const precision = decimal?.length ?? 0;

      const supply = RAM.base.balance.replace(" RAM", "");
      const total_value = RAM.quote.balance.replace(CORE_TOKEN, "");
      const byte_price = quantity * (total_value / supply);
      return parseFloat(byte_price).toFixed(precision) + CORE_TOKEN;
    }
  }
};

export default get_ram_price;
