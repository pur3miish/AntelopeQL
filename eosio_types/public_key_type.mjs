import legacy_to_public_key from "eosio-ecc/legacy_to_public_key.mjs";
import validate_public_key from "eosio-ecc/validate_public_key.mjs";
import { GraphQLScalarType } from "graphql";

const public_key_type = new GraphQLScalarType({
  description: `\`Public key type\`
  ---

  Public keys should begin with PUB_K1 (or EOS for legacy keys) and include base58 characters only.
  `,
  name: "public_key",
  async serialize(legacy_key) {
    if (!legacy_key.startsWith("EOS")) return legacy_key;

    return legacy_to_public_key(legacy_key);
  },
  async parseValue(public_key) {
    if (public_key == "") return "";

    const { valid, message } = await validate_public_key(public_key);
    if (!valid) throw new RangeError(message);
    return public_key;
  }
});

export default public_key_type;
