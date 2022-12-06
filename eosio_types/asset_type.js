'use strict'

const { GraphQLScalarType } = require('graphql')

const asset_type = new GraphQLScalarType({
  description: `
\`Asset type\`

---

An \`asset\` type describes a blockchain asset and includes a quantity and a symbol section.


- The quantity must include decimal precision (with a maximum precision of 18)
- Symbol must be an uppercase string of 7 or less characters from [A-Z]

***example*** - \`1.0010 EOS\`

- Quantity is 1.0010
- Symbol is EOS

`,
  name: 'asset',
  parseValue(asset_string) {
    if (asset_string == '') return ''

    return asset_string
  }
})

module.exports = asset_type
