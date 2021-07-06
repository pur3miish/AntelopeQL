'use strict'

const serialize_name = require('./name.js')
const serialize_varuint32 = require('./varuint32.js')

/**
 * Serializes EOS permission.
 * @param {object} arg Argument.
 * @param {string} arg.actor Name of the account to authorize the transaction.
 * @param {string} arg.permission Name of the permission.
 * @returns {string} Hex string for the serialized persmission.
 */
function permission({ actor, permission }) {
  return serialize_name(actor) + serialize_name(permission)
}

/**
 * @kind typedef
 * @name authorization
 * @prop {string} actor the EOS account performing the mutation
 * @prop {string} permission the EOS account permission
 * @ignore
 */

/**
 * Serializes EOSIO actions to a WASM hex string for mutating the state of a smart contract.
 * @name actions
 * @kind function
 * @param {Objext} arg Argument.
 * @param {string} arg.account The account name of the smart contract.
 * @param {string} arg.action The name of the action on the contract to interact with.
 * @param {Array<Authorization>} arg.authorization List of authorizations.
 * @param {string} arg.data The hex string data to push to the contract.
 * @returns {sting} A hex string of the actions to
 * @ignore
 */
function action({ account, action, authorization, data }) {
  return (
    serialize_name(account) +
    serialize_name(action) +
    serialize_varuint32(authorization.length) +
    authorization.reduce((acc, auth) => (acc += permission(auth)), '') +
    serialize_varuint32(data.length / 2) +
    data
  )
}

/**
 * Serializes EOSIO actions (transaction) into WASM hex string.
 * @name actions
 * @kind function
 * @param {Array<object>} actions List of EOSIO actions.
 * @returns {string} Hex string of action.
 * @ignore
 */
function actions(actions) {
  return actions.reduce(
    (acc, i) => (acc += action(i)),
    serialize_varuint32(actions.length).toString().padStart(2, '0')
  )
}

module.exports = actions
