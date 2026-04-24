import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app";
import {
  createDesignSystemRouter,
  generatedCanonicalRenderRouteRegistry,
} from "../../../src/frontend/designSystem/router";

function createSubject() {
  const app = express();
  app.use("/design-system", createDesignSystemRouter());
  return app;
}

describe("design-system canonical render routing", () => {
  it("exposes the seeded generated families through the public canonical launcher API", async () => {
    const response = await request(createApp()).get(
      "/v1/design-system-canonicals/public/families",
    );

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ familyKey: "choice-group" }),
        expect.objectContaining({ familyKey: "date-picker" }),
        expect.objectContaining({ familyKey: "display-settings" }),
        expect.objectContaining({ familyKey: "drawer-select" }),
        expect.objectContaining({ familyKey: "form-template" }),
        expect.objectContaining({ familyKey: "icon-grid" }),
        expect.objectContaining({ familyKey: "list-record-card" }),
        expect.objectContaining({ familyKey: "list-detail-panel" }),
        expect.objectContaining({ familyKey: "list-detail-split-layout" }),
      ]),
    );
  });

  it("requires every persisted generated canonical family to have an approved render route registry entry", async () => {
    const response = await request(createApp()).get(
      "/v1/design-system-canonicals/public/families",
    );

    expect(response.status).toBe(200);

    const unregisteredFamilies = response.body.items
      .map((item: { familyKey: string }) => item.familyKey)
      .filter((familyKey: string) => !(familyKey in generatedCanonicalRenderRouteRegistry));

    expect(unregisteredFamilies).toEqual([]);
  });

  it("keeps generated launcher publication coupled to approved render-page registration", async () => {
    const response = await request(createApp()).get(
      "/v1/design-system-canonicals/public/families",
    );

    expect(response.status).toBe(200);

    for (const family of response.body.items as Array<{ familyKey: string; generatedLauncherRoutePath: string }>) {
      expect(family.generatedLauncherRoutePath).toBe(
        `/design-system/canonical-renderings/${family.familyKey}`,
      );
      expect(
        family.familyKey in generatedCanonicalRenderRouteRegistry,
        `${family.familyKey} has a generated launcher card without an approved render page registry entry`,
      ).toBe(true);
    }
  });

  it("requires every registered generated render surface to resolve to its approved template signature", async () => {
    for (const [familyKey, routeDefinition] of Object.entries(generatedCanonicalRenderRouteRegistry)) {
      const response = await request(createSubject()).get(
        `/design-system/canonical-renderings/${familyKey}/HARNESS-001`,
      );

      expect(response.status, familyKey).toBe(200);
      expect(response.text, familyKey).toContain(routeDefinition.surfaceSignature);
      expect(response.text, familyKey).not.toContain("Design-System Route Families");
    }
  });

  it("serves the dedicated choice-group render page instead of the overview shell", async () => {
    const response = await request(createSubject()).get(
      "/design-system/canonical-renderings/choice-group/CGR-003",
    );

    expect(response.status).toBe(200);
    expect(response.text).toContain('id="choice-group-preview-shell"');
    expect(response.text).toContain('id="choice-group-canonical-current"');
    expect(response.text).not.toContain("Design-System Route Families");
  });

  it("serves the dedicated date-picker render page instead of the overview shell", async () => {
    const response = await request(createSubject()).get(
      "/design-system/canonical-renderings/date-picker/DTPR-001",
    );

    expect(response.status).toBe(200);
    expect(response.text).toContain('id="date-picker-preview-shell"');
    expect(response.text).toContain('id="date-picker-canonical-current"');
    expect(response.text).not.toContain("Design-System Route Families");
  });

  it("serves the dedicated drawer-select render page instead of the overview shell", async () => {
    const response = await request(createSubject()).get(
      "/design-system/canonical-renderings/drawer-select/DSR-002",
    );

    expect(response.status).toBe(200);
    expect(response.text).toContain('id="drawer-select-preview-shell"');
    expect(response.text).toContain('id="drawer-select-canonical-current"');
    expect(response.text).not.toContain("Design-System Route Families");
  });

  it("serves the display-settings render through the approved context-nav surface", async () => {
    const response = await request(createSubject()).get(
      "/design-system/canonical-renderings/display-settings/DSR-001",
    );

    expect(response.status).toBe(200);
    expect(response.text).toContain('id="context-nav-preview-shell"');
    expect(response.text).toContain('id="context-nav-canonical-current"');
    expect(response.text).not.toContain("Design-System Route Families");
  });

  it("serves the form-template render through the approved template surface", async () => {
    const response = await request(createSubject()).get(
      "/design-system/canonical-renderings/form-template/FTR-001",
    );

    expect(response.status).toBe(200);
    expect(response.text).toContain('class="form-page-shell');
    expect(response.text).not.toContain("Design-System Route Families");
  });

  it("serves the dedicated icon-grid render page instead of the overview shell", async () => {
    const response = await request(createSubject()).get(
      "/design-system/canonical-renderings/icon-grid/IGR-002",
    );

    expect(response.status).toBe(200);
    expect(response.text).toContain('id="icon-grid-preview-shell"');
    expect(response.text).toContain('id="icon-grid-canonical-current"');
    expect(response.text).not.toContain("Design-System Route Families");
  });

  it("serves the dedicated list-record-card render page instead of the overview shell", async () => {
    const response = await request(createSubject()).get(
      "/design-system/canonical-renderings/list-record-card/LRC-001",
    );

    expect(response.status).toBe(200);
    expect(response.text).toContain('id="list-record-card-preview-shell"');
    expect(response.text).toContain('id="list-record-card-canonical-current"');
    expect(response.text).not.toContain("Design-System Route Families");
  });

  it("serves the dedicated list-detail-panel render page instead of the overview shell", async () => {
    const response = await request(createSubject()).get(
      "/design-system/canonical-renderings/list-detail-panel/LDP-001",
    );

    expect(response.status).toBe(200);
    expect(response.text).toContain('id="list-detail-panel-preview-shell"');
    expect(response.text).toContain('id="list-detail-panel-canonical-current"');
    expect(response.text).not.toContain("Design-System Route Families");
  });

  it("serves the dedicated list-detail-split-layout render page instead of the overview shell", async () => {
    const response = await request(createSubject()).get(
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-002",
    );

    expect(response.status).toBe(200);
    expect(response.text).toContain('id="list-detail-split-layout-preview-shell"');
    expect(response.text).toContain('id="list-detail-split-layout-canonical-current"');
    expect(response.text).not.toContain("Design-System Route Families");
  });

  it("keeps family launcher routes on the shared family launcher shell", async () => {
    const response = await request(createSubject()).get(
      "/design-system/canonical-renderings/choice-group",
    );

    expect(response.status).toBe(200);
    expect(response.text).toContain('id="canonical-renderings-family-title"');
    expect(response.text).not.toContain('id="choice-group-preview-shell"');
  });

  it("does not allow unregistered generated canonical render routes to fall back to the overview page", async () => {
    const response = await request(createSubject()).get(
      "/design-system/canonical-renderings/unregistered-family/UCR-001",
    );

    expect(response.status).toBe(404);
    expect(response.text).not.toContain("Design-System Route Families");
  });
});
