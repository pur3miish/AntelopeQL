import { GraphQLScalarType, GraphQLObjectType, GraphQLString } from "graphql";

import asset from "./antelope_types/asset_type.js";
import block_timestamp_type from "./antelope_types/block_timestamp_type.js";
import bool from "./antelope_types/boolean_type.js";
import bytes from "./antelope_types/bytes_type.js";
import extended_asset from "./antelope_types/extended_asset_type.js";
import generate_checksum from "./antelope_types/generate_checksum_type.js";
import generate_float_type from "./antelope_types/generate_float_type.js";
import generate_int_type from "./antelope_types/generate_int_type.js";
import generate_uint_type from "./antelope_types/generate_uint_type.js";
import name from "./antelope_types/name_type.js";
import public_key from "./antelope_types/public_key_type.js";
import signature from "./antelope_types/signature_type.js";
import symbol_code from "./antelope_types/symbol_code_type.js";
import symbol from "./antelope_types/symbol_type.js";
import time_point_sec from "./antelope_types/time_point_sec_type.js";
import time_point from "./antelope_types/time_point_type.js";
import varint32 from "./antelope_types/varint32_type.js";
import varuint32 from "./antelope_types/varuint32_type.js";

type GraphQLTypeAny =
  | GraphQLScalarType
  | GraphQLObjectType
  | typeof GraphQLString
  | any;

/**
 * An object containing EOSIO native GraphQL types.
 */
const eosio_types: Record<string, GraphQLTypeAny> = {
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
