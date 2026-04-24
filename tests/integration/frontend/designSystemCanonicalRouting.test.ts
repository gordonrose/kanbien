import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app";
import { createDesignSystemRouter } from "../../../src/frontend/designSystem/router";

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
        expect.objectContaining({ familyKey: "drawer-select" }),
        expect.objectContaining({ familyKey: "list-record-card" }),
        expect.objectContaining({ familyKey: "list-detail-panel" }),
        expect.objectContaining({ familyKey: "list-detail-split-layout" }),
      ]),
    );
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
});
