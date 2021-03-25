import { TestDirector } from 'test-director'
import build_schema from './build_schema.test.js'
import eosio_types from './eosio_types.test.mjs'
import transaction_serialize from './transaction_serialize.test.mjs'
import wasm from './wasm.test.mjs'

const tests = new TestDirector()
transaction_serialize(tests)
eosio_types(tests)
wasm(tests)
build_schema(tests)
tests.run()
