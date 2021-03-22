import { rejects, strictEqual, throws } from 'assert'
import serialise_asset from '../private/wasm/serialize/asset.js'
import block_time_stamp from '../private/wasm/serialize/block_time_stamp.js'
import bool from '../private/wasm/serialize/bool.js'
import bytes from '../private/wasm/serialize/bytes.js'
import checksum from '../private/wasm/serialize/checksum.js'
import extended_asset from '../private/wasm/serialize/extended_asset.js'
import float128 from '../private/wasm/serialize/float128.js'
import float32 from '../private/wasm/serialize/float32.js'
import float64 from '../private/wasm/serialize/float64.js'
import integer from '../private/wasm/serialize/int.js'
import name from '../private/wasm/serialize/name.js'
import public_key from '../private/wasm/serialize/public_key.js'
import signature from '../private/wasm/serialize/signature.js'
import string from '../private/wasm/serialize/string.js'
import symbol from '../private/wasm/serialize/symbol.js'
import symbol_code from '../private/wasm/serialize/symbol_code.js'
import time_point from '../private/wasm/serialize/time_point.js'
import time_point_sec from '../private/wasm/serialize/time_point_sec.js'
import unsigned_integer from '../private/wasm/serialize/uint.js'
import varint32 from '../private/wasm/serialize/varint32.js'
import varuint32 from '../private/wasm/serialize/varuint32.js'

export default tests => {
  // These values are generated from cleos.
  tests.add('asset serialisation', () => {
    strictEqual(
      serialise_asset('1.012345678901234560 EOS'),
      '804bcf0408930c0e12454f5300000000',
      'Expected equality 1.'
    )
    strictEqual(
      serialise_asset('10.12345678901234560 EOS'),
      '804bcf0408930c0e11454f5300000000',
      'Expected equality 2.'
    )
    strictEqual(
      serialise_asset('10123400 EOS'),
      '88789a000000000000454f5300000000',
      'Expected equality 3.'
    )

    strictEqual(
      serialise_asset('1 SYS'),
      '01000000000000000053595300000000',
      'Expected equality 4.'
    )
    strictEqual(
      serialise_asset('1 SYS'),
      '01000000000000000053595300000000',
      'Expected equality 5.'
    )
    strictEqual(
      serialise_asset('100.9999 EOS'),
      '4f690f000000000004454f5300000000',
      'Expected equality 6.'
    )

    strictEqual(
      serialise_asset('1 ABCDEFG'),
      '01000000000000000041424344454647',
      'Expected equality 7.'
    )
    strictEqual(
      serialise_asset('2.3 HIJKLMN'),
      '17000000000000000148494a4b4c4d4e',
      'Expected equality 8.'
    )
    strictEqual(
      serialise_asset('4.56 OPQRSTU'),
      'c801000000000000024f505152535455',
      'Expected equality 9.'
    )
    strictEqual(
      serialise_asset('7.890 VWXWZ'),
      'd21e00000000000003565758575a0000',
      'Expected equality 10.'
    )
    throws(
      () => serialise_asset('1.1012345678901234560 EOS'),
      'Expected throws large integer overflow/max precision.'
    )

    throws(() => serialise_asset('1'), 'EXPECTED THROW MISSING SYMBOL.')

    throws(
      () => serialise_asset('1 LARGERTHAN7'),
      'EXPECTED THROW >7 SYMBOL CHARS'
    )
  })
  tests.add('symbol serialisation', () => {
    strictEqual(symbol('4,VWXWZ'), '04565758575a0000', 'Expected equality 1.')
    strictEqual(symbol('10,A'), '0a41000000000000', 'Expected equality 2.')
    strictEqual(symbol('18,A'), '1241000000000000', 'Expected equality 3.')
    strictEqual(symbol('0,A'), '0041000000000000', 'Expected equality 4.')
    strictEqual(
      symbol('10,ABCDEFG'),
      '0a41424344454647',
      'Expected equality 5.'
    )

    throws(() => symbol('qwe'), 'Expected throw 1 - precision max.')
    throws(() => symbol('19,A'), 'Expected throw 1 - precision max.')
    throws(
      () => symbol('5,ABCDEFGH'),
      'Expected throw 2 - Max length symbol string.'
    )
  })
  tests.add('integer serilisation', () => {
    strictEqual(integer(127, 1), '7f')
    strictEqual(integer(0, 1), '00')
    strictEqual(integer(-1, 1), 'ff')
    strictEqual(integer(-128, 1), '80')
    throws(() => integer(-129, 1))
    throws(() => integer(128, 1))
    strictEqual(unsigned_integer(0xffff, 2), 'ffff')
    throws(() => unsigned_integer(-1, 1))
    throws(() => unsigned_integer(257, 1))
  })
  tests.add('name serialisation', () => {
    strictEqual(name('eosio'), '0000000000ea3055', 'expected equality 0')
    strictEqual(name(''), '0000000000000000', 'expected equality 1')

    strictEqual(name('eosio.token'), '00a6823403ea3055')
    strictEqual(name('rattusmcguee'), 'a0946648629db3b9')
    strictEqual(name('4343kekistan'), '304dc60e2a38c820')
    strictEqual(name('a12345.ghisjj'), 'ffb06b0c14324430')
    throws(
      () => name('abc123sd..wez'),
      'Expected throw - 13 character must be [a-j1-5.]'
    )
    throws(() => name('abc123sdW'), 'Expected throw - uppercase')
    throws(() => name('abc123s8W'), 'Expected throw - number > 5')
  })
  tests.add('public key serialisation', async () => {
    strictEqual(
      await public_key('EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'),
      '0002c0ded2bc1f1305fb0faac5e6c03ee3a1924234985427b6167ca569d13df435cf',
      'Expected output 1'
    )
    strictEqual(
      await public_key('EOS6hMLF2sPrxhu9SK4dJ9LaZimfzgfmP7uX1ahUPJUcUpS4p2G39'),
      '0002ee19f0d3ca1c117ce6e066d57fbb3b1bab6db917d60fc22d501d97857e01ef14',
      'Expected output 1'
    )

    rejects(
      async () =>
        public_key('6hMLF2sPrxhu9SK4dJ9LaZimfzgfmP7uX1ahUPJUcUpS4p2G39'),
      'Missing prefix'
    )
    rejects(
      async () =>
        public_key('EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5KK'),
      'Invalid checksum'
    )
  })
  tests.add('varint32 serialisation', () => {
    strictEqual(varuint32(512), '8004', 'Expected output 1')
    strictEqual(varuint32(15), '0f', 'Expected output 2')
    strictEqual(varuint32(255), 'ff01', 'Expected output 3')
    strictEqual(varuint32(512), '8004', 'Expected output 4')
    strictEqual(varuint32(1024), '8008', 'Expected output 5')
    strictEqual(varuint32(2055), '8710', 'Expected output 6')
  })
  tests.add('varuint32 serialisation', () => {
    strictEqual(varint32(-127), 'fd01')
    strictEqual(varint32(-256), 'ff03')
    strictEqual(varint32(256), '8004')
    strictEqual(varint32(127), 'fe01')
    strictEqual(varint32(429496729), 'b2e6cc9903')
  })
  tests.add('boolean serialisation', () => {
    strictEqual(bool(1), '01')
    strictEqual(bool(true), '01')
    strictEqual(bool('true'), '01')
    strictEqual(bool(0), '00')
    strictEqual(bool(false), '00')
  })
  tests.add('symbol code serialisation', () => {
    strictEqual(symbol_code('EOS'), '454f530000000000')
    strictEqual(symbol_code('KEK'), '4b454b0000000000')
    strictEqual(symbol_code('ABCDEFG'), '4142434445464700')
    strictEqual(symbol_code('HIJKLMN'), '48494a4b4c4d4e00')
    strictEqual(symbol_code('OPQRSTU'), '4f50515253545500')
    strictEqual(symbol_code('UVWXYZ'), '55565758595a0000')
    strictEqual(symbol_code('Q'), '5100000000000000')
    throws(() => symbol_code('AAAAAAAA'))
    throws(() => symbol_code('4'))
    throws(() => symbol_code('a'))
  })
  tests.add('String serialisation', () => {
    strictEqual(
      string('The quick brown fox jumps over the lazy dog.'),
      '2c54686520717569636b2062726f776e20666f78206a756d7073206f76657220746865206c617a7920646f672e'
    )
    strictEqual(string(''), '00')
  })
  tests.add('float serialisation', () => {
    strictEqual(float32(1.25), '0000a03f')
    strictEqual(float32(55.25123), '42015d42')
    strictEqual(float32(214748364), 'cdcc4c4d')
    strictEqual(float32(2147483648), '0000004f')
    strictEqual(float32(0.00000000000000001), 'aa773823')
    strictEqual(float32(0.0000000000000000999999999), '9595e624')
    strictEqual(float64(1111111.1111111), 'edc6711c47f43041')
    strictEqual(
      float128('ff01203040506070890ffaa000000122'),
      'ff01203040506070890ffaa000000122'
    )
    throws(() => strictEqual(float128(10.8)))
    throws(() => strictEqual(float128('apple')))
  })
  tests.add('Time point serialisation', () => {
    strictEqual(time_point('2021-03-01T11:15:49.170'), '50db73bd77bc0500')
    strictEqual(time_point('1970-01-01T00:00:00.000'), '0000000000000000')
    strictEqual(time_point('2000-01-01T11:15:49.170'), '501b23ac0a5d0300')
    throws(() => time_point('ASDAS'))
    strictEqual(time_point_sec('2000-01-01T11:15:49.170'), 'e5e16d38')
    strictEqual(time_point_sec('1970-01-01T00:00:00.000'), '00000000')
    strictEqual(time_point_sec('2021-03-01T11:15:49.170'), 'e5cc3c60')
    strictEqual(block_time_stamp('2021-03-01T11:15:49.170'), 'ca129f4f')
    strictEqual(block_time_stamp('2021-03-01T12:26:42.147'), '04349f4f')
  })
  tests.add('Checksum serialisation', () => {
    strictEqual(checksum('ff', 20), 'ff00000000000000000000000000000000000000')
    strictEqual(
      checksum('ff1f', 20),
      'ff1f000000000000000000000000000000000000'
    )
    strictEqual(checksum('f', 20), '0f00000000000000000000000000000000000000')
    strictEqual(
      checksum('f5f4f3e1a0', 32),
      'f5f4f3e1a0000000000000000000000000000000000000000000000000000000'
    )
    strictEqual(
      checksum('f', 32),
      '0f00000000000000000000000000000000000000000000000000000000000000'
    )

    strictEqual(
      checksum('f5f4f3e1a0', 64),
      'f5f4f3e1a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    )
    throws(() =>
      strictEqual(checksum('ff1f0000000000000000000000000000000000009', 20))
    )
    throws(() => strictEqual(checksum('INVALID CHECKSUM', 20)))
  })
  tests.add('Signature serialisation', async () => {
    strictEqual(
      await signature(
        'SIG_K1_K4jhCs4S3hVfXNhX4t6QSSGgdYTYNk6LhKTphcYoLH6EYatq3zvU38CNEj7VDtMmHWq24KhmR6CLBqyT5tFiFmXndthr7X'
      ),
      '001f4878b56b046993bc2936bfa0b2625d1da2aac56af84af4546124551d20c7153c1a6dd493be595f1fa143161a04f109170050bf66b882415be72115c0a6fa8d58',
      'Expected equality 1.'
    )
    rejects(async () => signature('NOT A VALID SIG'), 'Expected reject 1.')
    rejects(
      async () =>
        signature(
          'SIG_K1_K4jhCs4S3hVfXNhX4t6QSSGgdYTYNk6LhKTphcYoLH6EYatq3zvU38CNEj7VDtMmHWq24KhmR6CLBqyT5tFiFmXndthDDD'
        ),
      'Expected reject 2.'
    )
  })
  tests.add('Bytes serialisation', () => {
    strictEqual(bytes('AAFF'), '04aaff')
    throws(() => bytes('AAFFGK'))
  })
  tests.add('Extended asset', () => {
    strictEqual(
      extended_asset('1.0000 EOS@eosio.token'),
      '102700000000000004454f530000000000a6823403ea3055'
    )
    strictEqual(
      extended_asset('40 KEKS@lexluthor'),
      '2800000000000000004b454b530000000000b8b4651dbb8a'
    )
    throws(() => extended_asset('40 KEKS'))
  })
}
