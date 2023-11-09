import base58_to_binary from "base58-js/base58_to_binary.mjs";
import binary_to_base58 from "base58-js/binary_to_base58.mjs";
import { GraphQLScalarType } from "graphql";
import ripemd160 from "ripemd160-js/ripemd160.mjs";

const public_key_type = new GraphQLScalarType({
  name: "public_key",
  async parseValue(public_key) {
    if (public_key == "") return "";

    if (
      !public_key.startsWith("PUB_K1_") &&
      !public_key.startsWith("PUB_R1_") &&
      !public_key.startsWith("PUB_WA_") &&
      !public_key.startsWith("EOS")
    )
      throw new RangeError(
        "Public keys must be either K1, R1, WA or legacy keys."
      );

    return public_key;
  },
  async serialize(key) {
    if (key.startsWith("EOS")) {
      const public_key = base58_to_binary(key.replace(/^[A-Z]+/gmu, "")).slice(
        0,
        -4
      );

      const hash = await ripemd160(Uint8Array.from([...public_key, 75, 49]));
      const checksum = hash.slice(0, 4);
      return (
        "PUB_K1_" +
        binary_to_base58(new Uint8Array([...public_key, ...checksum]))
      );
    }
    return key;
  }
});

export default public_key_type;
