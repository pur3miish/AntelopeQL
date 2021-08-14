import TestDirector from 'test-director'
import network from './network.test.mjs'
import wasm from './wasm.test.mjs'

const tests = new TestDirector()
// TODO need to add more tests for schema validation.
network(tests)
wasm(tests)
tests.run()
