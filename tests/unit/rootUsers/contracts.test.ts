import { describe, expect, it } from "vitest";
import {
  createRootUserBodySchema,
  getRootUserByEmailQuerySchema,
  listActiveRootUsersQuerySchema,
  listDeletedRootUsersQuerySchema,
  listRootUsersQuerySchema,
  updateRootUserBodySchema,
} from "../../../src/features/rootUsers/contract/schemas";

describe("rootUsers contract schemas", () => {
  it("normalizes create and exact-email lookup inputs", () => {
    const createInput = createRootUserBodySchema.parse({
      email: "  PERSON@Example.COM ",
      firstName: "  Ada ",
      lastName: "  Lovelace ",
    });
    const lookupInput = getRootUserByEmailQuerySchema.parse({
      email: "  PERSON@Example.COM ",
    });

    expect(createInput).toEqual({
      email: "person@example.com",
      firstName: "Ada",
      lastName: "Lovelace",
    });
    expect(lookupInput).toEqual({
      email: "person@example.com",
    });
  });

  it("applies list-query defaults and coercions", () => {
    expect(listRootUsersQuerySchema.parse({})).toEqual({
      page: 1,
      pageSize: 25,
      orderBy: "updatedAt",
      orderDirection: "desc",
    });

    expect(
      listActiveRootUsersQuerySchema.parse({
        page: "2",
        pageSize: "10",
        orderBy: "email",
        orderDirection: "asc",
        firstNamePrefix: "  ada ",
      }),
    ).toEqual({
      page: 2,
      pageSize: 10,
      orderBy: "email",
      orderDirection: "asc",
      firstNamePrefix: "ada",
    });

    expect(
      listDeletedRootUsersQuerySchema.parse({
        excludeAnonymized: "true",
      }),
    ).toEqual({
      page: 1,
      pageSize: 25,
      orderBy: "updatedAt",
      orderDirection: "desc",
      excludeAnonymized: true,
    });
  });

  it("rejects invalid update payloads and normalizes valid ones", () => {
    expect(() => updateRootUserBodySchema.parse({})).toThrow(
      "At least one field must be supplied.",
    );

    expect(
      updateRootUserBodySchema.parse({
        email: "  PERSON@Example.COM ",
        firstName: "  Ada ",
        lastName: "  Lovelace ",
        status: "inactive",
      }),
    ).toEqual({
      email: "person@example.com",
      firstName: "Ada",
      lastName: "Lovelace",
      status: "inactive",
    });
  });

  it("rejects client-supplied system-managed or unexpected fields explicitly", () => {
    const createResult = createRootUserBodySchema.safeParse({
      email: "person@example.com",
      rootUserId: "11111111-1111-4111-8111-111111111111",
    });
    expect(createResult.success).toBe(false);
    if (!createResult.success) {
      expect(createResult.error.issues[0]).toMatchObject({
        code: "unrecognized_keys",
        keys: ["rootUserId"],
      });
    }

    const updateResult = updateRootUserBodySchema.safeParse({
      firstName: "Ada",
      updatedAt: "2026-03-29T00:00:00.000Z",
    });
    expect(updateResult.success).toBe(false);
    if (!updateResult.success) {
      expect(updateResult.error.issues[0]).toMatchObject({
        code: "unrecognized_keys",
        keys: ["updatedAt"],
      });
    }
  });
});
