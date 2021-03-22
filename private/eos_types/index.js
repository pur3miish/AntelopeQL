'use strict'
const { GraphQLString } = require('graphql')
const asset = require('./asset.js')
const block_timestamp_type = require('./block_timestamp_type.js')
const bool = require('./boolean.js')
const bytes = require('./bytes')
const extended_asset = require('./extended_asset')
const generate_checksum = require('./generate_checksum.js')
const generate_float_type = require('./generate_float_type.js')
const generate_int_type = require('./generate_int_type.js')
const generate_uint_type = require('./generate_uint_type.js')
const name = require('./name.js')
const public_key = require('./public_key.js')
const signature = require('./signature.js')
const symbol = require('./symbol')
const symbol_code = require('./symbol_code')
const time_point = require('./time_point.js')
const time_point_sec = require('./time_point_sec.js')
const varint32 = require('./varint32')
const varuint32 = require('./varuint32')

/**
 * An object containing EOS native types.
 */
const eos_types = {
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
}

module.exports = eos_types
