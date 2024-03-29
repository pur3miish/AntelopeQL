import { GraphQLScalarType } from "graphql";

const extended_asset_type = new GraphQLScalarType({
  description: `\`Extended_asset\`

Extended asset which stores the information of the owner of the asset.

### extended asset
- Start with asset type followed by “@” and the account name.

example:

1.0000 EOS@eosio.token
  `,
  name: "extended_asset",
  parseValue: (extended_asset) => extended_asset
});

export default extended_asset_type;
