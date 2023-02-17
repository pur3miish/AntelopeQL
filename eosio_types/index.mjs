import { GraphQLString } from "graphql";

import asset from "./asset_type.mjs";
import block_timestamp_type from "./block_timestamp_type.mjs";
import bool from "./boolean_type.mjs";
import bytes from "./bytes_type.mjs";
import extended_asset from "./extended_asset_type.mjs";
import generate_checksum from "./generate_checksum_type.mjs";
import generate_float_type from "./generate_float_type.mjs";
import generate_int_type from "./generate_int_type.mjs";
import generate_uint_type from "./generate_uint_type.mjs";
import name from "./name_type.mjs";
import public_key from "./public_key_type.mjs";
import signature from "./signature_type.mjs";
import symbol_code from "./symbol_code_type.mjs";
import symbol from "./symbol_type.mjs";
import time_point_sec from "./time_point_sec_type.mjs";
import time_point from "./time_point_type.mjs";
import varint32 from "./varint32_type.mjs";
import varuint32 from "./varuint32_type.mjs";

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
