import { describe, expect, it } from "vitest";
import { text } from "node:stream/consumers";

import { createPlaceholderDelivery } from "../../../src/features/organizationBrandingReferences/domain/service";
import {
  defaultLogoAltText,
  initialsForOrganizationName,
  toLogoPlaceholder,
} from "../../../src/features/organizationBrandingReferences/domain/presenters";

describe("organization branding references public logo delivery", () => {
  it("derives deterministic accessible defaults from the organization name", () => {
    expect(defaultLogoAltText("  Acme North Office  ")).toBe("Acme North Office logo");
    expect(initialsForOrganizationName("Acme North Office")).toBe("AN");
    expect(initialsForOrganizationName("Single")).toBe("S");
  });

  it("returns a governed placeholder descriptor when no primary logo is linked", () => {
    expect(
      toLogoPlaceholder({
        organizationId: "22222222-2222-4222-8222-222222222222",
        organizationName: "Acme North Office",
      }),
    ).toEqual({
      organizationId: "22222222-2222-4222-8222-222222222222",
      logoType: "primary",
      placeholder: true,
      publicUrl: "/v1/public/organizations/22222222-2222-4222-8222-222222222222/logos/primary",
      initials: "AN",
      altText: "Acme North Office logo",
    });
  });

  it("streams generated placeholders with public cache headers and no storage authority", async () => {
    const delivery = createPlaceholderDelivery({
      organizationId: "22222222-2222-4222-8222-222222222222",
      organizationName: "Acme North Office",
    });

    expect(delivery.status).toBe("placeholder");
    expect(delivery.headers["Content-Type"]).toBe("image/svg+xml; charset=utf-8");
    expect(delivery.headers["Cache-Control"]).toBe("public, max-age=300, stale-while-revalidate=86400");
    expect(delivery.headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(Object.keys(delivery.headers).some((name) => name.toLowerCase().includes("storage"))).toBe(false);
    expect(delivery.stream).toBeDefined();
    await expect(text(delivery.stream!)).resolves.toContain(">AN<");
  });
});
