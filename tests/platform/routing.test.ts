import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app";
import { getJson } from "../harness/http";

describe("platform routing", () => {
  it("mounts versioned routes under /v1", async () => {
    const app = createApp();

    const response = await getJson(app, "/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("returns 404 for unknown versioned routes", async () => {
    const app = createApp();

    const response = await getJson(app, "/v1/does-not-exist");

    expect(response.status).toBe(404);
  });
});
