import {
  GraphQLError,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

import name_type from "../eosio_types/name_type.mjs";

const variants_type = new GraphQLObjectType({
  name: "abi_variant_type",
  fields: () => ({
    name: {
      type: GraphQLString
    },
    types: {
      type: new GraphQLList(GraphQLString)
    }
  })
});

const ricardian_clauses_type = new GraphQLObjectType({
  name: "abi_richardian_clauses",
  fields: () => ({
    id: {
      type: GraphQLString
    },
    body: {
      type: GraphQLString
    }
  })
});

const tables_type = new GraphQLObjectType({
  name: "abi_tables_type",
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
});

const actions_type = new GraphQLObjectType({
  name: "abi_actions_type",
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
});

const types_type = new GraphQLObjectType({
  name: "abi_types_type",
  fields: () => ({
    new_type_name: {
      type: GraphQLString
    },
    type: {
      desciption: "Native and blockchain types.",
      type: GraphQLString
    }
  })
});

const field_type = new GraphQLObjectType({
  name: "abi_field_type",
  fields: () => ({
    name: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    }
  })
});

const struct_type = new GraphQLObjectType({
  name: "abi_struct_type",
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
});

const abi_type = new GraphQLObjectType({
  name: "abi_type",
  description:
    "The Application Binary Interface (ABI) is a JSON-based description on how to convert user actions between their JSON and Binary representations.",
  fields: () => ({
    actions: {
      type: new GraphQLList(actions_type)
    },
    ricardian_clauses: {
      description:
        "Ricardian clauses describe the intended outcome of a particular actions. It may also be utilized to establish terms between the sender and the contract.",
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
});

const get_abi = {
  description: "Retrieve an application binary interface (ABI).",
  type: abi_type,
  args: {
    account_name: {
      description: "Account name of the smart contract holder.",
      type: new GraphQLNonNull(name_type)
    }
  },
  async resolve(root, { account_name }, getContext, info) {
    const {
      network: { fetch, rpc_url, ...fetchOptions }
    } = getContext(root, { account_name }, info);

    const uri = `${rpc_url}/v1/chain/get_abi`;
    const req = await fetch(uri, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({
        account_name,
        json: true
      })
    });
    const data = await req.json();

    if (data.error) throw new GraphQLError(data.message, { extensions: data });
    return data.abi;
  }
};

export default get_abi;
