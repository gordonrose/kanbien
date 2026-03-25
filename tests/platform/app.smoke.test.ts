import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app";
import { v1Router } from "../../src/routes/v1";

describe("platform app smoke test", () => {
  it("creates an app with the v1 router mounted", () => {
    const app = createApp();
    const expressApp = app as any;
    const appStack = expressApp._router?.stack ?? [];
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
});
