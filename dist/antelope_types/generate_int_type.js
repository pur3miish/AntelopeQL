import { GraphQLScalarType } from "graphql";
/**
 * Generates a GraphQL scalar signed integer type of size `bits`.
 * @param bits Size of the integer in bits.
 * @returns GraphQLScalarType representing the signed integer type.
 */
function generate_int_type(bits) {
    const bitsBigInt = BigInt(bits);
    const max = 2n ** (bitsBigInt - 1n) - 1n;
    const min = -(2n ** (bitsBigInt - 1n));
    return new GraphQLScalarType({
        name: `int${bits}`,
        description: `\`Integer t${bits} type\`

Signed integer range is between ${min} - ${max}`,
        parseValue(value) {
            if (value == "")
                return "";
            if (typeof value !== "string" &&
                typeof value !== "number" &&
                typeof value !== "bigint") {
                throw new TypeError("Value must be a string, number, or bigint");
            }
            // Convert value to BigInt safely
            let intVal;
            try {
                intVal = BigInt(value);
            }
            catch {
                throw new TypeError("Value cannot be converted to BigInt");
            }
            if (intVal > max || intVal < min) {
                throw new RangeError(`Integer range is outside int${bits}.`);
            }
            return intVal.toString();
        }
    });
}
export default generate_int_type;
//# sourceMappingURL=generate_int_type.js.map