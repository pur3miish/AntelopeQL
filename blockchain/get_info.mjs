import { GraphQLError, GraphQLObjectType, GraphQLString } from "graphql";

const info_type = new GraphQLObjectType({
  name: "info_type",
  description: "Returns various details about the EOS blockchain",
  fields: () => ({
    server_version: {
      type: GraphQLString,
      description: "Hash representing the last commit in the tagged release"
    },
    chain_id: {
      type: GraphQLString,
      description: "Hash representing the ID of the chain"
    },
    head_block_num: {
      type: GraphQLString,
      description: "Highest block number on the chain"
    },
    head_block_id: {
      type: GraphQLString,
      description: "Highest block ID on the chain"
    },
    head_block_time: {
      type: GraphQLString,
      description: "Highest block unix timestamp"
    },
    head_block_producer: {
      type: GraphQLString,
      description: "Producer that signed the highest block (head block)"
    },
    last_irreversible_block_num: {
      type: GraphQLString,
      description:
        "Highest block number on the chain that has been irreversibly applied to state"
    },
    last_irreversible_block_id: {
      type: GraphQLString,
      description:
        "Highest block ID on the chain that has been irreversibly applied to state"
    },
    virtual_block_cpu_limit: {
      type: GraphQLString,
      description:
        "CPU limit calculated after each block is produced, approximately 1000 times block_cpu_limit"
    },
    virtual_block_net_limit: {
      type: GraphQLString,
      description:
        "NET limit calculated after each block is produced, approximately 1000 times block_net_limit"
    },
    block_cpu_limit: {
      type: GraphQLString,
      description: "Actual maximum CPU limit"
    },
    block_net_limit: {
      type: GraphQLString,
      description: "Actual maximum NET limit"
    },
    server_version_string: {
      type: GraphQLString,
      description:
        "String representation of server version - Majorish-Minorish-Patchy - Warning - Not actually SEMVER!"
    },
    fork_db_head_block_num: {
      type: GraphQLString,
      description:
        "Sequential block number representing the best known head in the fork database tree"
    },
    fork_db_head_block_id: {
      type: GraphQLString,
      description:
        "Sequential block number representing the best known head in the fork database tree"
    }
  })
});

const info = {
  description: "Return info about the operational state of the blockchain.",
  type: info_type,
  args: {},
  async resolve(_, __, { network: { fetch, rpc_url, ...fetchOptions } }) {
    const uri = `${rpc_url}/v1/chain/get_info`;
    const req = await fetch(uri, {
      method: "POST",
      ...fetchOptions
    });

    const data = await req.json();

    if (data.error) throw new GraphQLError(data.message, { extensions: data });

    return data;
  }
};

export default info;
