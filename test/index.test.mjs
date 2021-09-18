import TestDirector from 'test-director'
// import ast from './ast.test.js'
// import build_schema from './build_schema.test.js'
// import eosio_types from './eosio_types.test.mjs'
// import serialize from './serialize.test.mjs'
// import smartql from './smartql.test.mjs'
// import transaction_serialize from './transaction_serialize.test.mjs'

const tests = new TestDirector()

// transaction_serialize(tests)
// serialize(tests)
// eosio_types(tests)
// ast(tests)
// smartql(tests)
// build_schema(tests)
tests.run()
