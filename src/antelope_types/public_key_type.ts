import { binary_to_base58, base58_to_binary } from "base58-js";
import { GraphQLError, GraphQLScalarType } from "graphql";
import ripemd160 from "ripemd160-js/ripemd160.js";

export const public_key_type = new GraphQLScalarType({
  name: "public_key",

  async parseValue(value: unknown): Promise<string> {
    if (value === "") return "";
    if (typeof value !== "string") {
      throw new GraphQLError("Public key must be a string");
    }

    if (
      !value.startsWith("PUB_K1_") &&
      !value.startsWith("PUB_R1_") &&
      !value.startsWith("PUB_WA_") &&
      !value.startsWith("EOS")
    ) {
      throw new GraphQLError(
        "Public keys must be either K1, R1, WA or legacy keys."
      );
    }

    return value;
  },

  async serialize(key: unknown): Promise<string> {
    if (typeof key !== "string") {
      throw new GraphQLError("Public key must be a string");
    }

    if (key.startsWith("EOS")) {
      // Remove prefix letters (like EOS) before decoding
      const keyWithoutPrefix = key.replace(/^[A-Z]+/gmu, "");
      const public_key = base58_to_binary(keyWithoutPrefix).slice(0, -4);

      const hash = await ripemd160(Uint8Array.from([...public_key, 75, 49]));
      const checksum = hash.slice(0, 4) as Uint8Array;

      return (
        "PUB_K1_" +
        binary_to_base58(new Uint8Array([...public_key, ...checksum]))
      );
    }

    return key;
  }
});
