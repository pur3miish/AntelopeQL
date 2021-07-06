import TestDirector from 'test-director'
import wasm from './wasm.test.mjs'

const tests = new TestDirector()
// TODO need to add more tests for schema validation.
wasm(tests)
tests.run()
