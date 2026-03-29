import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { updateRootUserBodySchema } from "../../../src/features/rootUsers/contract/schemas";

describe("rootUsers schemas", () => {
  it("TC-ROOT-USERS-EDGE-001 rejects update requests with no supplied fields", () => {
    expect(() => updateRootUserBodySchema.parse({})).toThrow(ZodError);
  });
});
