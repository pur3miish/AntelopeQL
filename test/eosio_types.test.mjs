import { deepStrictEqual, ok, rejects, strictEqual, throws } from 'assert'
import asset_type from '../public/eosio_types/asset_type.js'
import block_time_stamp from '../public/eosio_types/block_timestamp_type.js'
import bool from '../public/eosio_types/boolean_type.js'
import bytes from '../public/eosio_types/bytes_type.js'
import extended_asset from '../public/eosio_types/extended_asset_type.js'
import generate_checksum from '../public/eosio_types/generate_checksum_type.js'
import generate_float_type from '../public/eosio_types/generate_float_type.js'
import generate_int_type from '../public/eosio_types/generate_int_type.js'
import generate_uint_type from '../public/eosio_types/generate_uint_type.js'
import name from '../public/eosio_types/name_type.js'
import public_key from '../public/eosio_types/public_key_type.js'
import signature from '../public/eosio_types/signature_type.js'
import symbol_code from '../public/eosio_types/symbol_code_type.js'
import symbol from '../public/eosio_types/symbol_type.js'
import time_point_sec from '../public/eosio_types/time_point_sec_type.js'
import time_point from '../public/eosio_types/time_point_type.js'
import varint32 from '../public/eosio_types/varint32_type.js'
import varuint32 from '../public/eosio_types/varuint32_type.js'

export default tests => {
  tests.add('EOSIO types - validating parse values', async () => {
    deepStrictEqual(varint32.parseValue(''), '')
    deepStrictEqual(varuint32.parseValue(''), '')
    strictEqual(time_point.parseValue('1616667468'), '1616667468')
    strictEqual(time_point_sec.parseValue('1616667453647'), '1616667453647')

    deepStrictEqual(symbol.parseValue('3,EOS'), '3,EOS')
    deepStrictEqual(symbol_code.parseValue('EOS'), 'EOS')
    deepStrictEqual(
      signature.parseValue(
        'SIG_K1_K4jhCs4S3hVfXNhX4t6QSSGgdYTYNk6LhKTphcYoLH6EYatq3zvU38CNEj7VDtMmHWq24KhmR6CLBqyT5tFiFmXndthr7X'
      ),
      'SIG_K1_K4jhCs4S3hVfXNhX4t6QSSGgdYTYNk6LhKTphcYoLH6EYatq3zvU38CNEj7VDtMmHWq24KhmR6CLBqyT5tFiFmXndthr7X'
    )
    ok(signature.parseValue('') == '')

    throws(() =>
      signature.parseValue(
        'NOT_SIG_K4jhCs4S3hVfXNhX4t6QSSGgdYTYNk6LhKTphcYoLH6EYatq3zvU38CNEj7VDtMmHWq24KhmR6CLBqyT5tFiFmXndthr4x'
      )
    )
    throws(() => signature.parseValue(1848))

    ok(asset_type.parseValue('') == '')
    strictEqual(asset_type.parseValue('1.000 EOS'), '1.000 EOS')
    deepStrictEqual(block_time_stamp.parseValue(''), '')
    throws(() => block_time_stamp.parseValue('not a time'))
    deepStrictEqual(
      block_time_stamp.parseValue('2021-03-01T12:26:42.147'),
      '2021-03-01T12:26:42.147'
    )
    deepStrictEqual(bool.parseValue(true), true)
    ok(bytes.parseValue('ff') == '02ff')
    throws(() => bytes.parseValue('kl'))
    ok(bytes.parseValue('') == '')
    deepStrictEqual(
      extended_asset.parseValue('1.000 EOS@eosio'),
      '1.000 EOS@eosio'
    )
    deepStrictEqual(
      generate_checksum(20).parseValue(
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
      ),
      'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
    )
    ok(generate_float_type(32).parseValue('1.0'), '1.0')
    deepStrictEqual(generate_int_type(8).parseValue(127), '127')
    deepStrictEqual(generate_int_type(8).parseValue(-128), '-128')
    throws(() => generate_int_type(8).parseValue(-129))
    throws(() => generate_int_type(8).parseValue(128))
    ok(generate_int_type(8).parseValue('') == '')
    deepStrictEqual(generate_uint_type(8).parseValue(0), '0')
    deepStrictEqual(generate_uint_type(8).parseValue(255), '255')
    deepStrictEqual(generate_uint_type(16).parseValue(0xffff), '65535')
    throws(() => generate_uint_type(16).parseValue(0x10000))
    throws(() => generate_uint_type(8).parseValue(-1))
    ok(generate_uint_type(8).parseValue('') == '')
    deepStrictEqual(name.parseValue('eosio'), 'eosio')
    deepStrictEqual(name.parseValue(''), '')
    throws(() => name.parseValue('NOT A NAME'))
    deepStrictEqual(
      'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV',
      await public_key.parseValue(
        'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
      )
    )
    deepStrictEqual('', await public_key.parseValue(''))

    rejects(
      () =>
        public_key.parseValue(
          'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW533'
        ),
      'expected invalid checksum'
    )

    rejects(
      () =>
        public_key.parseValue(
          'NOT_EOS_6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW533'
        ),
      'Expected invalid prefix'
    )
  })
}
