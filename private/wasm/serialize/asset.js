'use strict'

/**
 * Serialises EOSIO asset type to WASM hex string.
 * @kind function
 * @name asset
 * @param {string} asset_string string to be serilaised.
 * @returns {string} Serialised hex string.
 * @ignore
 */
function asset(asset_string) {
  let amount =
    BigInt(asset_string.replace(/[^0-9]/gu, '')) & 0xffffffffffffffffn

  if (amount.toString().length > 19)
    throw new RangeError('Asset value is too large.')

  amount = amount.toString('16')
  const serialized_amount = amount
    .padStart(amount.length % 2 ? amount.length + 1 : amount.length, '0')
    .match(/.{1,2}/gu)
    .reverse()

  const precision = asset_string
    .replace(/^(\s*)?(-|\+)?(\s*)?\d*\.?|\W?\D*$/gu, '')
    .length.toString(16)
    .padStart(2, '0')

  const name = asset_string.replace(/[^A-Z]/gu, '')

  if (name.length > 7 || !name.length)
    throw new TypeError(
      'Asset symbol needs to be between 1 - 7 uppercase characters.'
    )

  return [
    ...serialized_amount,
    ...new Array(8 - serialized_amount.length).fill('00'),
    precision,
    ...name
      .match(/./gu)
      .map(i => i.charCodeAt(0).toString('16').padStart(2, '0')),
    ...new Array(7 - name.length).fill('00')
  ].reduce((acc, i) => (acc += i))
}

module.exports = asset
