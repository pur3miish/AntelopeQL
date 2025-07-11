import { GraphQLError, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import key_type from "../antelope_types/key_type.js";
import public_key_type from "../antelope_types/public_key_type.js";
const producer_authority_type = new GraphQLObjectType({
    name: "block_producer_authority",
    fields: {
        threshold: {
            type: GraphQLInt
        },
        keys: {
            type: new GraphQLList(key_type)
        }
    }
});
const producers = new GraphQLObjectType({
    name: "blockchain_block_producers",
    fields: {
        owner: {
            type: GraphQLString
        },
        total_votes: {
            type: GraphQLString
        },
        producer_key: {
            type: public_key_type
        },
        is_active: {
            type: GraphQLString
        },
        url: {
            type: GraphQLString
        },
        unpaid_blocks: {
            type: GraphQLString
        },
        last_claim_time: {
            type: GraphQLString
        },
        location: {
            type: GraphQLString
        },
        producer_authority: {
            type: producer_authority_type,
            resolve(data) {
                // Extract second element in tuple
                return data.producer_authority[1];
            }
        }
    }
});
const producers_type = new GraphQLObjectType({
    name: "antelope_producers",
    fields: {
        total_producer_vote_weight: {
            type: GraphQLString
        },
        more: {
            type: GraphQLString,
            description: "the next block producer in the list"
        },
        rows: {
            type: new GraphQLList(producers)
        }
    }
});
const get_producers = {
    description: "Return info about block producers.",
    type: producers_type,
    args: {
        limit: {
            description: "total number of producers to retrieve",
            type: GraphQLString,
            defaultValue: "10"
        },
        lower_bound: {
            type: GraphQLString
        }
    },
    async resolve(root, args, getContext, info) {
        const { network: { fetch, rpc_url, ...fetchOptions } } = getContext(root, args, info);
        const uri = `${rpc_url}/v1/chain/get_producers`;
        const req = await fetch(uri, {
            method: "POST",
            body: JSON.stringify({ ...args, json: true }),
            ...fetchOptions
        });
        const data = await req.json();
        if (data.error)
            throw new GraphQLError(data.message || "Unknown error", {
                extensions: data
            });
        return data;
    }
};
export default get_producers;
//# sourceMappingURL=get_producers.js.map