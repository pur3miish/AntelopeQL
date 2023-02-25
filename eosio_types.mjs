import { GraphQLString } from "graphql/index.mjs";

import asset from "./eosio_types/asset_type.mjs";
import block_timestamp_type from "./eosio_types/block_timestamp_type.mjs";
import bool from "./eosio_types/boolean_type.mjs";
import bytes from "./eosio_types/bytes_type.mjs";
import extended_asset from "./eosio_types/extended_asset_type.mjs";
import generate_checksum from "./eosio_types/generate_checksum_type.mjs";
import generate_float_type from "./eosio_types/generate_float_type.mjs";
import generate_int_type from "./eosio_types/generate_int_type.mjs";
import generate_uint_type from "./eosio_types/generate_uint_type.mjs";
import name from "./eosio_types/name_type.mjs";
import public_key from "./eosio_types/public_key_type.mjs";
import signature from "./eosio_types/signature_type.mjs";
import symbol_code from "./eosio_types/symbol_code_type.mjs";
import symbol from "./eosio_types/symbol_type.mjs";
import time_point_sec from "./eosio_types/time_point_sec_type.mjs";
import time_point from "./eosio_types/time_point_type.mjs";
import varint32 from "./eosio_types/varint32_type.mjs";
import varuint32 from "./eosio_types/varuint32_type.mjs";

/**
 * An object containing EOSIO native types.
 */
const eosio_types = {
  asset,
  block_timestamp_type,
  bool,
  bytes,
  checksum160: generate_checksum(20),
  checksum256: generate_checksum(32),
  checksum512: generate_checksum(64),
  extended_asset,
  float32: generate_float_type(32),
  float64: generate_float_type(64),
  float128: generate_float_type(128),
  int8: generate_int_type(8),
  int16: generate_int_type(16),
  int32: generate_int_type(32),
  int64: generate_int_type(64),
  int128: generate_int_type(128),
  name,
  public_key,
  signature,
  string: GraphQLString,
  symbol,
  symbol_code,
  time_point,
  time_point_sec,
  uint8: generate_uint_type(8),
  uint16: generate_uint_type(16),
  uint32: generate_uint_type(32),
  uint64: generate_uint_type(64),
  uint128: generate_uint_type(128),
  varint32,
  varuint32
};

export default eosio_types;
