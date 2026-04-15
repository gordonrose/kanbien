import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app";

describe("design system route", () => {
  it("serves the public design-system page with the top-navigation primitive", async () => {
    const response = await request(createApp()).get("/design-system").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Logo Placeholder");
    expect(response.text).toContain("primary-nav-overflow-button");
    expect(response.text).toContain("profile-menu-button");
    expect(response.text).toContain("mobile-nav-button");
    expect(response.text).toContain("breadcrumb-collapse-button");
    expect(response.text).toContain("design-system-search");
    expect(response.text).toContain("context-nav");
    expect(response.text).toContain("filter-panel-button");
    expect(response.text).toContain("filter-panel");
    expect(response.text).toContain("filter-options-panel");
    expect(response.text).toContain("filter-options-search");
    expect(response.text).toContain("accessibility-drawer");
    expect(response.text).toContain("Design System");
    expect(response.text).toContain("/design-system/assets/styles.css");
  });

  it("serves the dedicated top-nav component preview page", async () => {
    const response = await request(createApp()).get("/design-system/components/top-nav").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("State Driver");
    expect(response.text).toContain("top-nav-preview-width");
    expect(response.text).toContain("data-preview-fixture=\"long-labels\"");
    expect(response.text).toContain("data-preview-open-state=\"profile\"");
    expect(response.text).toContain("Signed-Off Top Nav Candidate");
    expect(response.text).toContain("top-nav-preview-frame");
  });

  it("serves the dedicated top-nav component preview page with query-driven state URLs", async () => {
    const response = await request(createApp())
      .get("/design-system/components/top-nav?width=880&fixture=long-labels&open=overflow&theme=dark&dir=rtl&zoom=100&accent=%237c3aed")
      .set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("top-nav-preview-frame");
    expect(response.text).toContain("data-preview-open-state=\"overflow\"");
  });

  it("serves the canonical launcher index page", async () => {
    const response = await request(createApp()).get("/design-system/canonicals").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Design-System Canonicals");
    expect(response.text).toContain("Available Canonical Sets");
    expect(response.text).toContain("/design-system/canonicals/top-nav");
  });

  it("serves the top-nav canonical launcher page for signed-off states", async () => {
    const response = await request(createApp()).get("/design-system/canonicals/top-nav").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Top Nav Canonicals");
    expect(response.text).toContain("Priority Review States");
    expect(response.text).toContain("TRP-001");
    expect(response.text).toContain("/design-system/components/top-nav?width=1120&fixture=standard&open=closed");
  });
});
