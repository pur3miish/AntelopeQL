import TestDirector from 'test-director'
import smartql from './smartql.test.mjs'

const tests = new TestDirector()

smartql(tests)
tests.run()
