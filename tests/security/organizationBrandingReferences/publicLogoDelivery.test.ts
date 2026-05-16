import express from "express";
import { Readable } from "node:stream";
import { describe, expect, it, vi } from "vitest";

import { createPublicOrganizationBrandingReferencesRouter } from "../../../src/features/organizationBrandingReferences/transport/router";
import type { OrganizationBrandingReferencesService } from "../../../src/features/organizationBrandingReferences";
import { invokeJson, invokeText } from "../../harness/http";

describe("organization branding references public delivery authorization", () => {
  it("TC-ORG-S012-SEC-001 serves the public logo URL without requiring a tenant or root session", async () => {
    const service = {
      readPublicPrimaryLogo: vi.fn(async () => ({
        status: "placeholder" as const,
        stream: Readable.from(["<svg>AN</svg>"]),
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
          "X-Content-Type-Options": "nosniff",
        },
      })),
    } as unknown as OrganizationBrandingReferencesService;
    const app = express();
    app.use("/v1/public", createPublicOrganizationBrandingReferencesRouter(service));

    const response = await invokeText(app, {
      method: "GET",
      path: "/v1/public/organizations/22222222-2222-4222-8222-222222222222/logos/primary",
    });

    expect(response.status).toBe(200);
    expect(response.body).toBe("<svg>AN</svg>");
    expect(response.headers["content-type"]).toBe("image/svg+xml; charset=utf-8");
    expect(service.readPublicPrimaryLogo).toHaveBeenCalledWith("22222222-2222-4222-8222-222222222222");
  });

  it("TC-ORG-S012-SEC-002 rejects unsupported logo types instead of falling through to storage", async () => {
    const service = {
      readPublicPrimaryLogo: vi.fn(),
    } as unknown as OrganizationBrandingReferencesService;
    const app = express();
    app.use("/v1/public", createPublicOrganizationBrandingReferencesRouter(service));

    const response = await invokeJson<{ code: string }>(app, {
      method: "GET",
      path: "/v1/public/organizations/22222222-2222-4222-8222-222222222222/logos/secondary",
    });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("ORGANIZATION_LOGO_INVALID");
    expect(service.readPublicPrimaryLogo).not.toHaveBeenCalled();
  });
});
