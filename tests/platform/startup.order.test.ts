import { describe, expect, it } from "vitest";
import { getEnv } from "../../src/config/env";

describe("platform startup prerequisites", () => {
  it("resolves platform configuration deterministically", () => {
    process.env.PORT = "3000";

    const env = getEnv();

    expect(env).toEqual({ port: 3000 });
  });

  it("rejects invalid port configuration", () => {
    process.env.PORT = "not-a-number";

    expect(() => getEnv()).toThrow("Invalid PORT value: not-a-number");
  });
});
