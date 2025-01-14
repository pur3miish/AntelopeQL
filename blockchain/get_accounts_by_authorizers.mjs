import legacy_from_public_key from "antelope-ecc/keys/legacy_from_public_key.js";
import public_key_from_wif from "antelope-ecc/keys/public_key_from_wif.js";
import {
  GraphQLError,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

import name_type from "../eosio_types/name_type.mjs";
import public_key_type from "../eosio_types/public_key_type.mjs";
import authorizing_account_type from "../graphql_object_types/authorizing_account_type.mjs";

const authorized_accounts_type = new GraphQLObjectType({
  name: "authorized_accounts_type",
  fields: () => ({
    account_name: {
      type: name_type
    },
    permission_name: {
      type: name_type
    },
    authorizing_key: {
      type: public_key_type
    },
    authorizing_account: {
      type: authorizing_account_type
    },
    weight: {
      type: GraphQLString
    },
    threshold: {
      type: GraphQLString
    }
  })
});

const accounts_by_authorizers_type = new GraphQLObjectType({
  name: "accounts_by_authorizers",
  description:
    "Fetch permissions authorities that are, in part or whole, satisfiable.",
  fields: () => ({
    accounts: {
      type: new GraphQLList(authorized_accounts_type)
    }
  })
});

const accounts_by_authorizers = {
  type: accounts_by_authorizers_type,
  args: {
    accounts: {
      type: new GraphQLList(new GraphQLNonNull(name_type))
    },
    keys: {
      type: new GraphQLList(new GraphQLNonNull(public_key_type))
    }
  },
  async resolve(root, { accounts = [], keys = [] }, getContext, info) {
    const {
      network: { fetch, rpc_url, symbol = "EOS", ...fetchOptions }
    } = getContext(root, { accounts, keys }, info);

    const uri = `${rpc_url}/v1/chain/get_accounts_by_authorizers`;

    const awaited_keys = await Promise.all(keys);

    const data = await fetch(uri, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({
        keys: await Promise.all(
          awaited_keys.map((x) =>
            x.startsWith("PUB_K1")
              ? legacy_from_public_key(public_key_from_wif(x), symbol)
              : x
          )
        ),
        accounts,
        json: true
      })
    }).then((req) => req.json());

    if (data.error) throw new GraphQLError(data.message, { extensions: data });
    return data;
  }
};

export default accounts_by_authorizers;
