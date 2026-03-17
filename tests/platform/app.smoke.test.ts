import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app";

describe("platform app smoke", () => {
  it("responds to GET /v1/health", async () => {
    const app = createApp();

    const response = await request(app).get("/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});