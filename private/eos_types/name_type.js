'use strict'

const { GraphQLScalarType } = require('graphql')

const name_type = new GraphQLScalarType({
  description: `\`Name type\`

Names are unique identifiers on the blockchain.

---

  ### name rules

  - Combination of lowercase characters
  - Can include numbers 1 - 5 and period “.” character
  - Must start with a-z (lowercase) letter
  - Must NOT end with a period “.”
  - Must NOT be longer than 12 characters

  `,
  name: 'name',
  parseValue: _name => {
    if (_name == '') return _name
    if (!_name.match(/^[1-5a-z.]{0,11}[1-5a-z]{1}$/gmu))
      throw new Error('Invalid name type')

    return _name
  }
})

module.exports = name_type
