import express from "express";
import { describe, expect, it } from "vitest";
import { createRootAccessRouter } from "../../../src/features/rootAccess/transport/router";
import { createApp } from "../../../src/app";
import { postJson, getJson, putJson } from "../../harness/http";

describe("rootAccess transport baseline", () => {
  function createFeatureTestApp() {
    const app = express();
    app.use(express.json());
    app.use(createRootAccessRouter());
    return app;
  }

  it("validates POST /root-users request body", async () => {
    const app = createFeatureTestApp();

    const response = await postJson(app, "/root-users", {
      email: "root@example.com",
      password: "StrongPassword123!",
      firstName: "Root",
      lastName: "User",
      sshPublicKeys: [],
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_REQUEST",
      message: "Invalid createRootUser request",
    });
  });

  it("validates GET /root-users query identifiers", async () => {
    const app = createFeatureTestApp();

    const response = await getJson(app, "/root-users");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_REQUEST",
      message: "Invalid getRootUserProfile query",
    });
  });

  it("validates PUT /root-users request shape", async () => {
    const app = createFeatureTestApp();

    const response = await putJson(app, "/root-users", {
      rootUserId: "user-1",
      updates: {},
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_REQUEST",
      message: "At least one profile update field is required",
    });
  });

  it("validates POST /root-auth/begin request shape", async () => {
    const app = createFeatureTestApp();

    const response = await postJson(app, "/root-auth/begin", {
      email: "root@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_REQUEST",
      message: "Invalid beginRootAuthentication request",
    });
  });

  it("validates POST /root-auth/complete request shape", async () => {
    const app = createFeatureTestApp();

    const response = await postJson(app, "/root-auth/complete", {
      challengeId: "challenge-1",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_REQUEST",
      message: "Invalid completeRootAuthentication request",
    });
  });
});

describe("rootAccess integration", () => {
  it("mounts rootAccess routes through the platform v1 registry", async () => {
    const app = createApp();

    const response = await getJson(app, "/v1/root-users");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_REQUEST",
      message: "Invalid getRootUserProfile query",
    });
  });

  it("mounts authentication routes through the platform v1 registry", async () => {
    const app = createApp();

    const response = await postJson(app, "/v1/root-auth/begin", {
      email: "root@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_REQUEST",
      message: "Invalid beginRootAuthentication request",
    });
  });
});