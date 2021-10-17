'use strict'
const {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt
} = require('graphql')

const index_position_enum_type = new GraphQLEnumType({
  name: 'index_position_enum_type',
  values: {
    primary: { value: 'primary' },
    secondary: { value: 'secondary' },
    tertiary: { value: 'tertiary' },
    fourth: { value: 'fourth' },
    fifth: { value: 'fifth' },
    sixth: { value: 'sixth' },
    seventh: { value: 'seventh' },
    eighth: { value: 'eighth' },
    ninth: { value: 'ninth' },
    tenth: { value: 'tenth' }
  }
})

const key_type_enum_type = new GraphQLEnumType({
  name: 'key_type_enum',
  description: `Primary only supports i64. All others support i64, i128, i256, float64, float128, ripemd160, sha256.`,
  values: {
    name: { value: 'name', description: 'Indicates an account name.' },
    i64: { value: 'i64' },
    i128: { value: 'i128' },
    i256: { value: 'i256' },
    float64: { value: 'float64' },
    float128: { value: 'float128' },
    ripemd160: { value: 'ripemd160' },
    sha256: { value: 'sha256' }
  }
})
const encode_type_enum_type = new GraphQLEnumType({
  name: 'encode_type_enum',
  description: `
  \`dec\` for decimal encoding of (i[64|128|256] and float[64|128])
  \`hex\` for hexadecimal encoding of (i256, ripemd160, sha256).`,
  values: {
    dec: { value: 'dec' },
    hex: { value: 'hex' }
  }
})

const query_arg_fields = new GraphQLInputObjectType({
  name: 'arguments',
  fields: {
    scope: {
      type: GraphQLString,
      description: `The scope within the table to query data from.`,
      defaultValue: ''
    },
    index_position: {
      type: index_position_enum_type,
      description: 'Position of the index used.',
      defaultValue: 'primary'
    },
    key_type: {
      type: key_type_enum_type,
      description: 'The key type of `index_position`',
      defaultValue: 'name'
    },
    encode_type: {
      type: encode_type_enum_type,
      description: '`key_type` encoding',
      defaultValue: 'dec'
    },
    upper_bound: {
      type: GraphQLString,
      description:
        'Filters results to return the first element that is greater than provided value in set.'
    },
    lower_bound: {
      type: GraphQLString,
      description:
        'Filters results to return the first element that is not less than provided value in set.'
    },
    limit: {
      type: GraphQLInt,
      description: 'The maximum number of items to return'
    }
  }
})

module.exports = query_arg_fields
