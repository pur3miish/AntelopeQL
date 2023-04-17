import { GraphQLError } from "graphql";

export default async function get_abis(
  contracts = [],
  { fetch, rpc_url, fetchOptions = {} }
) {
  if (!contracts.length) [];

  const uri = `${rpc_url}/v1/chain/get_abi`;

  const abi_req = contracts.map((account_name) =>
    fetch(uri, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({ account_name, json: true })
    }).then((req) => req.json())
  );

  const ABIs = await Promise.all(abi_req);

  let errors = [];
  ABIs.forEach(({ error, abi, account_name }, i) => {
    if (error) {
      try {
        if (error.details[0]?.message.startsWith("unknown key ("))
          errors.push({ message: `No account found for “${contracts[i]}”` });
      } catch (err) {
        throw new GraphQLError(ABIs[i].message, { extensions: ABIs[i] });
      }
    }
    if (!abi)
      errors.push({ message: `No contract found for “${account_name}”` });
  });

  if (errors.length)
    throw new GraphQLError("Invalid Antelope smart contracts provided.", {
      extensions: errors
    });

  return ABIs;
}
