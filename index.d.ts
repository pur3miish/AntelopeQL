type UInt16 = number;
type UInt64 = number; // This can be adjusted if you're dealing with a larger value (e.g., BigInt for 64-bit integers)
type Name = string; // The "name" type is a string in this context

// Type for the 'extensions_entry' struct
interface ExtensionsEntry {
  tag: UInt16;
  value: Uint8Array; // Representing 'bytes' as a Uint8Array (binary data)
}

// Type for the 'type_def' struct
interface TypeDef {
  new_type_name: string;
  type: string;
}

// Type for the 'field_def' struct
interface FieldDef {
  name: string;
  type: string;
}

// Type for the 'struct_def' struct
interface StructDef {
  name: string;
  base: string;
  fields: FieldDef[];
}

/**
 * A contract action is a description of what argument a contract function may take and its intended purpose.
 */
interface ActionDef {
  /**
   * Contract action name as defined in the smart contract.
   */
  name: Name;
  /**
   * The name of the implicit struct as described in the ABI.
   */
  type: string;
  /**
   * Describing the actions intended functionality
   */
  ricardian_contract?: string;
}

// Type for the 'table_def' struct
interface TableDef {
  name: Name;
  index_type: string;
  key_names: string[];
  key_types: string[];
  type: string;
}

// Type for the 'clause_pair' struct
interface ClausePair {
  id: string;
  body: string;
}

// Type for the 'error_message' struct
interface ErrorMessage {
  error_code: UInt64;
  error_msg: string;
}

// Type for the 'variant_def' struct
interface VariantDef {
  name: string;
  types: string[];
}

interface AbiDef {
  version: string;
  types: TypeDef[];
  structs: StructDef[];
  actions: ActionDef[];
  /**
   * Tables are user defined structures that hold data.
   */
  tables: TableDef[];
  ricardian_clauses: ClausePair[];
  error_messages: ErrorMessage[];
  abi_extensions: ExtensionsEntry[];
  variants: VariantDef[];
}

/*
 *The Application Binary Interface (ABI) is a JSON-based description on how to convert user actions between their JSON and Binary representations.
 */
export interface Abi {
  version: string;
  structs: (
    | ExtensionsEntry
    | TypeDef
    | FieldDef
    | StructDef
    | ActionDef
    | TableDef
    | ClausePair
    | ErrorMessage
    | VariantDef
    | AbiDef
  )[];
}
