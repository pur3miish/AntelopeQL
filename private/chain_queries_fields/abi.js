'use strict'

const {
  GraphQLError,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const fetch = require('isomorphic-fetch')
const name_type = require('../eosio_types/name_type')

const variants_type = new GraphQLObjectType({
  name: 'variants_type',
  fields: () => ({
    name: {
      type: GraphQLString
    },
    types: {
      type: new GraphQLList(GraphQLString)
    }
  })
})

const ricardian_clauses_type = new GraphQLObjectType({
  name: 'ricardian_clauses_type',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    body: {
      type: GraphQLString
    }
  })
})

const tables_type = new GraphQLObjectType({
  name: 'tables_type',
  fields: () => ({
    name: {
      type: GraphQLString
    },
    index_type: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    key_names: {
      type: new GraphQLList(GraphQLString)
    },
    key_types: {
      type: new GraphQLList(GraphQLString)
    }
  })
})

const actions_type = new GraphQLObjectType({
  name: 'actions_type',
  fields: () => ({
    name: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    ricardian_contract: {
      type: GraphQLString
    }
  })
})

const types_type = new GraphQLObjectType({
  name: 'types_type',
  fields: () => ({
    new_type_name: {
      type: GraphQLString
    },
    type: {
      desciption: 'Native and blockchain types.',
      type: GraphQLString
    }
  })
})

const field_type = new GraphQLObjectType({
  name: 'field_type',
  fields: () => ({
    name: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    }
  })
})
const struct_type = new GraphQLObjectType({
  name: 'struct_type',
  fields: () => ({
    name: {
      type: GraphQLString
    },
    base: {
      type: GraphQLString
    },
    fields: {
      type: new GraphQLList(field_type)
    }
  })
})

const abi_type = new GraphQLObjectType({
  name: 'abi_type',
  description:
    'The Application Binary Interface (ABI) is a JSON-based description on how to convert user actions between their JSON and Binary representations.',
  fields: () => ({
    actions: {
      type: new GraphQLList(actions_type)
    },
    ricardian_clauses: {
      description:
        'Ricardian clauses describe the intended outcome of a particular actions. It may also be utilized to establish terms between the sender and the contract.',
      type: new GraphQLList(ricardian_clauses_type)
    },
    structs: {
      type: new GraphQLList(struct_type)
    },
    types: {
      type: new GraphQLList(types_type)
    },
    tables: {
      type: new GraphQLList(tables_type)
    },
    variants: {
      type: new GraphQLList(variants_type)
    },
    version: {
      type: GraphQLString
    }
  })
})

const abi = {
  description:
    'Retrieve an application binary interface (ABI) for a given smart contract.',
  type: abi_type,
  args: {
    account_name: {
      description: 'Name of the account that holds the smart contract.',
      type: new GraphQLNonNull(name_type)
    }
  },
  async resolve(_, { account_name }, { rpc_url }) {
    const req = await fetch(rpc_url + '/v1/chain/get_abi', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ account_name })
    })

    const { abi, error } = await req.json()
    if (error && error.details) {
      if (
        error.details[0].message.startsWith('unknown key (eosio::chain::name):')
      )
        throw new GraphQLError(`Account “${account_name}” does not exist.`)
      throw new GraphQLError(JSON.stringify(error))
    }

    if (abi) return abi

    throw new GraphQLError('No Smart contract found.')
  }
}

module.exports = abi
