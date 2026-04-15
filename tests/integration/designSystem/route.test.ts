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
});
