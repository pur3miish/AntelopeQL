import TestDirector from "test-director/TestDirector.mjs";

import eosio_types_test from "./eosio_types.test.mjs";
import no_query_abiTest from "./no_query_abi.test.mjs";
import query_tests from "./query.test.mjs";
import serialize_abiTest from "./serialize_abi.test.mjs";
import serialize_transactions from "./serialize_transaction.test.mjs";
import test_eosio_abi from "./test.eosio.abi.mjs";

const tests = new TestDirector();

serialize_transactions(tests);
eosio_types_test(tests);
query_tests(tests);
no_query_abiTest(tests);
serialize_abiTest(tests);
test_eosio_abi(tests);

tests.run();
