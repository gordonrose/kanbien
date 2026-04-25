import express, { type NextFunction, type Request, type Response } from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../../src/app";
import { createDesignSystemRouter } from "../../src/frontend/designSystem/router";
import { createRootAdminShellRouter } from "../../src/frontend/rootAdminShell/router";

function installSafeErrorMiddleware(app: express.Express): void {
  app.use(
    (
      error: unknown,
      _request: Request,
      response: Response,
      _next: NextFunction,
    ) => {
      console.error("Unhandled application error", error);
      response.status(500).json({
        code: "INTERNAL_ERROR",
        message: "Something went wrong while processing the request.",
      });
    },
  );
}

describe("Express 4 runtime characterization", () => {
  it("pins the private Express 4 app stack order for the global middleware and root route mounts", () => {
    const app = createApp() as unknown as {
      _router?: {
        stack: Array<{
          name: string;
          route?: { path: string };
          regexp: RegExp;
        }>;
      };
    };

    const stack = app._router?.stack ?? [];
    const layers = stack.map((layer) => ({
      name: layer.name,
      path: layer.route?.path ?? null,
      regexp: String(layer.regexp),
    }));

    expect(layers).toEqual([
      expect.objectContaining({ name: "query" }),
      expect.objectContaining({ name: "expressInit" }),
      expect.objectContaining({ name: "helmetMiddleware" }),
      expect.objectContaining({ name: "jsonParser" }),
      expect.objectContaining({
        name: "router",
        regexp: "/^\\/design-system\\/?(?=\\/|$)/i",
      }),
      expect.objectContaining({
        name: "router",
        regexp: "/^\\/root-admin\\/?(?=\\/|$)/i",
      }),
      expect.objectContaining({
        name: "router",
        regexp: "/^\\/v1\\/?(?=\\/|$)/i",
      }),
      expect.objectContaining({ name: "<anonymous>" }),
    ]);
  });

  it("pins the private Express 4 router internals currently used by smoke tests", () => {
    const rootAdminRouter = createRootAdminShellRouter() as unknown as {
      stack: Array<{ name: string; route?: { path: string; methods: Record<string, boolean> }; regexp: RegExp }>;
    };
    const designSystemRouter = createDesignSystemRouter() as unknown as {
      stack: Array<{ name: string; route?: { path: string; methods: Record<string, boolean> }; regexp: RegExp }>;
    };

    expect(rootAdminRouter.stack.map((layer) => ({
      name: layer.name,
      path: layer.route?.path ?? null,
      methods: layer.route?.methods ?? null,
      regexp: String(layer.regexp),
    }))).toEqual([
      expect.objectContaining({
        name: "bound dispatch",
        path: "/helper/download/root-auth-signer-helper.mjs",
        methods: { get: true },
      }),
      expect.objectContaining({
        name: "bound dispatch",
        path: "/helper/download/start-root-auth-signer-helper.ps1",
        methods: { get: true },
      }),
      expect.objectContaining({
        name: "serveStatic",
        regexp: "/^\\/assets\\/?(?=\\/|$)/i",
      }),
      expect.objectContaining({
        name: "bound dispatch",
        path: "*",
        methods: { get: true },
        regexp: "/^(.*)\\/?$/i",
      }),
    ]);

    expect(designSystemRouter.stack.map((layer) => ({
      name: layer.name,
      path: layer.route?.path ?? null,
      methods: layer.route?.methods ?? null,
      regexp: String(layer.regexp),
    }))).toEqual([
      expect.objectContaining({
        name: "serveStatic",
        regexp: "/^\\/assets\\/?(?=\\/|$)/i",
      }),
      expect.objectContaining({
        name: "bound dispatch",
        path: "*",
        methods: { get: true },
        regexp: "/^(.*)\\/?$/i",
      }),
    ]);
  });

  it("routes root app requests through design-system, root-admin, and v1 mounts in the current order", async () => {
    const app = createApp();

    const designSystem = await request(app)
      .get("/design-system")
      .set("host", "admin.example.test");
    const rootAdmin = await request(app)
      .get("/root-admin")
      .set("host", "admin.example.test");

    expect(designSystem.status).toBe(200);
    expect(designSystem.text).toContain("Design System");
    expect(designSystem.text).toContain("/design-system/assets/styles.css");

    expect(rootAdmin.status).toBe(200);
    expect(rootAdmin.text).toContain("Root Admin Shell POC");
    expect(rootAdmin.text).toContain("/root-admin/assets/app.mjs");
  });

  it("keeps root-admin shell fallback behavior distinct from design-system 404 behavior", async () => {
    const app = createApp();

    const rootAdminUnknown = await request(app)
      .get("/root-admin/path-backed/fallback-check")
      .set("host", "admin.example.test");
    const designSystemUnknownCanonical = await request(app)
      .get("/design-system/canonical-renderings/unregistered-family/CXR-001")
      .set("host", "admin.example.test");

    expect(rootAdminUnknown.status).toBe(200);
    expect(rootAdminUnknown.text).toContain("Root Admin Shell POC");

    expect(designSystemUnknownCanonical.status).toBe(404);
    expect(designSystemUnknownCanonical.text).toBe("Design-system route not found");
    expect(designSystemUnknownCanonical.text).not.toContain("Design-System Route Families");
  });

  it("serves mounted static assets and pins the current missing-asset error shape", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const app = createApp();

    try {
      const rootAdminAsset = await request(app)
        .get("/root-admin/assets/app.mjs")
        .set("host", "admin.example.test");
      const designSystemAsset = await request(app)
        .get("/design-system/assets/styles.css")
        .set("host", "admin.example.test");
      const missingRootAdminAsset = await request(app)
        .get("/root-admin/assets/missing-express4-characterization.mjs")
        .set("host", "admin.example.test");
      const missingDesignSystemAsset = await request(app)
        .get("/design-system/assets/missing-express4-characterization.css")
        .set("host", "admin.example.test");

      expect(rootAdminAsset.status).toBe(200);
      expect(rootAdminAsset.text).toContain("root-admin");
      expect(designSystemAsset.status).toBe(200);
      expect(designSystemAsset.text).toContain("design-system");

      expect(missingRootAdminAsset.status).toBe(500);
      expect(missingRootAdminAsset.body).toEqual({
        code: "INTERNAL_ERROR",
        message: "Something went wrong while processing the request.",
      });
      expect(missingDesignSystemAsset.status).toBe(500);
      expect(missingDesignSystemAsset.body).toEqual({
        code: "INTERNAL_ERROR",
        message: "Something went wrong while processing the request.",
      });
    } finally {
      consoleError.mockRestore();
    }
  });

  it("pins Express 4 JSON body parsing for valid JSON, malformed JSON, empty JSON bodies, and no-parser routes", async () => {
    const parsedApp = express();
    parsedApp.use(express.json());
    parsedApp.post("/echo", (request, response) => {
      response.json({
        body: request.body,
        hasOwnBody: Object.prototype.hasOwnProperty.call(request, "body"),
      });
    });

    const noParserApp = express();
    noParserApp.post("/echo", (request, response) => {
      response.json({
        body: request.body,
        hasOwnBody: Object.prototype.hasOwnProperty.call(request, "body"),
      });
    });

    const validJson = await request(parsedApp)
      .post("/echo")
      .send({ alpha: 1, nested: { beta: true } });
    const malformedJson = await request(parsedApp)
      .post("/echo")
      .set("content-type", "application/json")
      .send("{\"alpha\":");
    const emptyJson = await request(parsedApp)
      .post("/echo")
      .set("content-type", "application/json")
      .send("");
    const noParser = await request(noParserApp)
      .post("/echo")
      .set("content-type", "application/json")
      .send("{\"alpha\":1}");

    expect(validJson.status).toBe(200);
    expect(validJson.body).toEqual({
      body: { alpha: 1, nested: { beta: true } },
      hasOwnBody: true,
    });
    expect(malformedJson.status).toBe(400);
    expect(malformedJson.headers["content-type"]).toContain("text/html");
    expect(malformedJson.text).toContain("SyntaxError");
    expect(emptyJson.status).toBe(200);
    expect(emptyJson.body).toEqual({ body: {}, hasOwnBody: true });
    expect(noParser.status).toBe(200);
    expect(noParser.body).toEqual({ hasOwnBody: false });
  });

  it("pins malformed JSON reaching the app-level safe error middleware as the current global shape", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      const response = await request(createApp())
        .post("/root-admin")
        .set("host", "admin.example.test")
        .set("content-type", "application/json")
        .send("{\"alpha\":");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: "INTERNAL_ERROR",
        message: "Something went wrong while processing the request.",
      });
    } finally {
      consoleError.mockRestore();
    }
  });

  it("pins Express 4 default extended query parsing for repeated and bracketed keys", async () => {
    const app = express();
    app.get("/query", (request, response) => {
      response.json(request.query);
    });

    const response = await request(app).get(
      "/query?tag=alpha&tag=beta&filter[name]=Ada&filter[roles][]=admin&filter[roles][]=owner&literal.key=value",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      tag: ["alpha", "beta"],
      filter: {
        name: "Ada",
        roles: ["admin", "owner"],
      },
      "literal.key": "value",
    });
  });

  it("pins the safe 500 JSON shape for thrown and forwarded rejected route errors", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const app = express();

    app.get("/throws", () => {
      throw new Error("sensitive thrown detail");
    });
    app.get("/rejects", async (_request, _response, next) => {
      try {
        await Promise.reject(new Error("sensitive rejected detail"));
      } catch (error) {
        next(error);
      }
    });
    installSafeErrorMiddleware(app);

    try {
      const thrown = await request(app).get("/throws");
      const rejected = await request(app).get("/rejects");

      for (const response of [thrown, rejected]) {
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
          code: "INTERNAL_ERROR",
          message: "Something went wrong while processing the request.",
        });
        expect(JSON.stringify(response.body)).not.toContain("sensitive");
      }
    } finally {
      consoleError.mockRestore();
    }
  });
});
