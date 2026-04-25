import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";
import { v1Router } from "../../src/routes/v1";

describe("platform app smoke test", () => {
  it("creates an app with the v1 router mounted", () => {
    const app = createApp();
    const expressApp = app as any;
    const appStack = expressApp.router?.stack ?? expressApp._router?.stack ?? [];
    const mountedRouter = appStack.find((layer: any) => layer.name === "router");

    expect(typeof app).toBe("function");
    expect(typeof expressApp.handle).toBe("function");
    expect(mountedRouter).toBeDefined();
  });

  it("registers the health route on the v1 router", () => {
    const healthRouteLayer = (v1Router as any).stack.find(
      (layer: any) => layer.route?.path === "/health" && layer.route?.methods?.get,
    );

    expect(healthRouteLayer).toBeDefined();
  });

  it("TC-PLATFORM-SEC-UNIT-001 applies the shared helmet baseline, enables a least-privilege CSP, and disables x-powered-by", async () => {
    const app = createApp();
    const expressApp = app as any;
    const response = await request(app)
      .get("/root-admin")
      .set("host", "admin.example.test");

    expect(expressApp.enabled("x-powered-by")).toBe(false);
    expect(response.status).toBe(200);
    expect(response.headers["x-powered-by"]).toBeUndefined();
    expect(response.headers["x-dns-prefetch-control"]).toBe("off");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(response.headers["content-security-policy"]).toContain("default-src 'self'");
    expect(response.headers["content-security-policy"]).toContain(
      "connect-src 'self' http://127.0.0.1:8787",
    );
  });
});
