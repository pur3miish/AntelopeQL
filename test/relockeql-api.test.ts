import { strictEqual } from "assert";

import { RelockeQL as RootRelockeQL } from "../src/index.js";
import { RelockeQL as ModuleRelockeQL } from "../src/relockeql.js";

describe("RelockeQL public API", () => {
  it("exports RelockeQL from the root package and module path", () => {
    strictEqual(RootRelockeQL, ModuleRelockeQL);
  });
});
