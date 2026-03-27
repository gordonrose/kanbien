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

  it("TC-PLATFORM-SEC-UNIT-001 applies the shared helmet baseline, enables a least-privilege CSP, and disables x-powered-by", async () => {
    const app = createApp();
    const expressApp = app as any;
    const appStack = expressApp._router?.stack ?? [];
    const helmetLayer = appStack.find((layer: any) => layer.name === "helmetMiddleware");
    const headers = new Map<string, string>();

    expect(expressApp.enabled("x-powered-by")).toBe(false);
    expect(helmetLayer).toBeDefined();

    await new Promise<void>((resolve, reject) => {
      const request = {
        method: "GET",
        url: "/not-found",
        headers: {},
        secure: false,
      };
      const response = {
        setHeader(name: string, value: string) {
          headers.set(name.toLowerCase(), value);
        },
        removeHeader(name: string) {
          headers.delete(name.toLowerCase());
        },
        getHeader(name: string) {
          return headers.get(name.toLowerCase());
        },
      };

      helmetLayer.handle(request, response, (error?: unknown) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    expect(headers.get("x-dns-prefetch-control")).toBe("off");
    expect(headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(headers.get("content-security-policy")).toContain("default-src 'self'");
    expect(headers.get("content-security-policy")).toContain(
      "connect-src 'self' http://127.0.0.1:8787",
    );
  });
});
