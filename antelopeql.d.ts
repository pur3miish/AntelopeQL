// antelopeql.d.ts

export function AntelopeQL(
  params: AntelopeQLParams
): Promise<{ data: any; errors: any[] }>;

export interface AntelopeQLParams {
  query: string;
  variableValues?: Record<string, any>;
  operationName?: string;
  signTransaction?: boolean;
  contracts?: string[];
  ABIs?: ABI[];
  rpc_url?: URL | string;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export interface Types {
  new_type_name: string;
  type: string;
}

export interface Field {
  name: string;
  type: string;
}

export interface Struct {
  name: string;
  base: string;
  fields: Field[];
}

export interface Action {
  name: string;
  type: string;
  ricardian_contract?: string;
}

export interface Table {
  name: string;
  index_type: string;
  type: string;
}

export interface ABI {
  types: Types[];
  structs: Struct[];
  actions: Action[];
  tables: Table[];
}
