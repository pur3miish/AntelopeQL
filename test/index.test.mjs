import TestDirector from 'test-director'
import serialize_transactions from './serialize_transaction.test.mjs'
import smartql from './smartql.test.mjs'

const tests = new TestDirector()
serialize_transactions(tests)
// smartql(tests)
tests.run()
