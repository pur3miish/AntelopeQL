import { TestDirector } from 'test-director'
import transaction_serialize from './transaction_serialize.test.mjs'
import wasm from './wasm.test.mjs'

const tests = new TestDirector()
transaction_serialize(tests)
wasm(tests)
tests.run()
