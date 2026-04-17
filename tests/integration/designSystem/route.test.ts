import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app";

function expectShellTrio(html: string) {
  expect(html).toContain("class=\"top-nav");
  expect(html).toContain("class=\"sub-nav");
  expect(html).toContain("class=\"context-nav");
}

function expectSingleItemContextNav(html: string, label: string) {
  const contextNavMatch = html.match(/<nav class="context-nav"[\s\S]*?<\/nav>/);
  expect(contextNavMatch).not.toBeNull();
  const contextNavHtml = contextNavMatch?.[0] ?? "";
  const itemCount = (contextNavHtml.match(/class="context-nav-item/g) ?? []).length;

  expect(itemCount).toBe(1);
  expect(contextNavHtml).toContain(`>${label}<`);
}

describe("design system route", () => {
  it("renders the governed shell trio on every public design-system page", async () => {
    const routes = [
      "/design-system",
      "/design-system/components",
      "/design-system/patterns",
      "/design-system/canonicals",
      "/design-system/canonicals/top-nav",
      "/design-system/canonicals/sub-nav",
      "/design-system/canonicals/context-nav",
      "/design-system/canonicals/context-nav-drawer",
      "/design-system/components/top-nav",
      "/design-system/components/sub-nav",
      "/design-system/components/context-nav",
      "/design-system/exploration/top-nav",
      "/design-system/exploration/sub-nav",
      "/design-system/exploration/context-nav",
    ];

    for (const route of routes) {
      const response = await request(createApp()).get(route).set("host", "admin.example.test");

      expect(response.status).toBe(200);
      expectShellTrio(response.text);
    }
  });

  it("serves the public design-system page with the top-navigation primitive", async () => {
    const response = await request(createApp()).get("/design-system").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
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
    expect(response.text).toContain("Canonical Render");
    expect(response.text).toContain("top-nav-preview-width");
    expect(response.text).toContain("Top-Nav Canonical State");
    expect(response.text).toContain("top-nav-canonical-match-list");
    expect(response.text).toContain("top-nav-preview-frame");
  });

  it("serves the dedicated top-nav component preview page with query-driven state URLs", async () => {
    const response = await request(createApp())
      .get("/design-system/components/top-nav?width=880&fixture=long-labels&open=overflow&theme=dark&dir=rtl&zoom=100&accent=%237c3aed")
      .set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("top-nav-preview-frame");
    expect(response.text).toContain("top-nav-canonical-match-list");
    expect(response.text).toContain("Canonical state loading from the URL.");
  });

  it("serves the top-nav exploration page", async () => {
    const response = await request(createApp()).get("/design-system/exploration/top-nav").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Top Nav Exploration");
    expect(response.text).toContain(">Explore<");
    expect(response.text).toContain(">Canonicals<");
    expect(response.text).toContain("State Driver");
    expect(response.text).toContain("top-nav-preview-frame");
  });

  it("serves the canonical launcher index page", async () => {
    const response = await request(createApp()).get("/design-system/canonicals").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Design-System Canonicals");
    expect(response.text).toContain("Available Canonical Sets");
    expect(response.text).toContain("/design-system/canonicals/top-nav");
    expect(response.text).toContain("/design-system/canonicals/context-nav");
    expect(response.text).toContain("/design-system/canonicals/context-nav-drawer");
  });

  it("serves the top-nav canonical launcher page for signed-off states", async () => {
    const response = await request(createApp()).get("/design-system/canonicals/top-nav").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("Top Nav Canonicals");
    expect(response.text).toContain("breadcrumb-list");
    expect(response.text).toContain(">Canonicals<");
    expect(response.text).toContain(">Top Nav<");
    expect(response.text).toContain("context-nav");
    expect(response.text).toContain(">Explore<");
    expect(response.text).toContain(">Canonicals<");
    expect(response.text).not.toContain(">Display<");
    expect(response.text).not.toContain(">Catalog<");
    expect(response.text).not.toContain(">Filters<");
    expect(response.text).not.toContain(">Access<");
    expect(response.text).toContain("All Canonical Reference States");
    expect(response.text).toContain("canonical-launcher-button-priority");
    expect(response.text).toContain("TRP-001");
    expect(response.text).toContain("/design-system/components/top-nav?width=1120&fixture=standard&open=closed");
  });

  it("serves the public design-system components index page", async () => {
    const response = await request(createApp()).get("/design-system/components").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("primary-nav-overflow-button");
    expect(response.text).toContain("breadcrumb-list");
    expect(response.text).toContain(">Components<");
    expect(response.text).not.toContain(">Catalog<");
    expect(response.text).not.toContain("Component and pattern navigation");
    expect(response.text).toContain("Reusable Component Artifacts");
    expect(response.text).not.toContain("Governed Pattern Families");
    expect(response.text).toContain("/design-system/patterns");
    expectShellTrio(response.text);
    expect(response.text).toContain("Design-system section navigation");
    expectSingleItemContextNav(response.text, "Components");
  });

  it("serves the public design-system patterns index page", async () => {
    const response = await request(createApp()).get("/design-system/patterns").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Governed Pattern Families");
    expect(response.text).toContain("primary-nav-overflow-button");
    expect(response.text).toContain("breadcrumb-list");
    expect(response.text).toContain(">Patterns<");
    expect(response.text).toContain("/design-system/canonicals/context-nav");
    expect(response.text).toContain("/design-system/canonicals/sub-nav#breadcrumb-family");
    expectShellTrio(response.text);
    expect(response.text).toContain("Design-system section navigation");
    expect(response.text).toContain(">Patterns<");
    expect(response.text).toContain(">Canonicals<");
  });

  it("serves the context-nav exploration page", async () => {
    const response = await request(createApp()).get("/design-system/exploration/context-nav").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Context Nav Exploration");
    expect(response.text).toContain("context-nav-preview-width");
    expect(response.text).toContain("context-nav-preview-height");
    expect(response.text).toContain("data-context-nav-stack=\"tall\"");
    expect(response.text).toContain("data-context-nav-open=\"more\"");
    expect(response.text).not.toContain("data-context-nav-open=\"top-overflow\"");
    expect(response.text).toContain("context-nav-preview-frame");
  });

  it("serves the context-nav canonical renderer and launcher pages", async () => {
    const canonical = await request(createApp())
      .get("/design-system/components/context-nav?width=1120&height=620&stack=tall&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-002")
      .set("host", "admin.example.test");
    const launcher = await request(createApp()).get("/design-system/canonicals/context-nav").set("host", "admin.example.test");

    expect(canonical.status).toBe(200);
    expect(canonical.text).toContain("Context-Nav Canonical State");
    expect(canonical.text).toContain("context-nav-canonical-match-list");
    expect(canonical.text).toContain("context-nav-preview-frame");
    expect(canonical.text).toContain("Context nav framing row");
    expect(canonical.text).toContain("Search sections");
    expect(canonical.text).toContain("breadcrumb-list");
    expect(canonical.text).toContain(">Patterns<");
    expect(canonical.text).toContain(">Context Nav<");
    expect(canonical.text).not.toContain(">Accessibility Pilot<");

    expect(launcher.status).toBe(200);
    expectShellTrio(launcher.text);
    expect(launcher.text).toContain("Context Nav Canonicals");
    expect(launcher.text).toContain("breadcrumb-list");
    expect(launcher.text).toContain(">Patterns<");
    expect(launcher.text).toContain(">Context Nav<");
    expect(launcher.text).toContain("context-nav");
    expect(launcher.text).toContain(">Explore<");
    expect(launcher.text).toContain(">Canonicals<");
    expect(launcher.text).not.toContain(">Display<");
    expect(launcher.text).not.toContain(">Catalog<");
    expect(launcher.text).not.toContain(">Filters<");
    expect(launcher.text).not.toContain(">Access<");
    expect(launcher.text).toContain("CNR-002");
    expect(launcher.text).toContain("/design-system/components/context-nav?width=1120&height=620&stack=tall");
  });

  it("frames sub-nav and context-nav canonical launchers under patterns", async () => {
    const subNav = await request(createApp()).get("/design-system/canonicals/sub-nav").set("host", "admin.example.test");
    const contextNav = await request(createApp()).get("/design-system/canonicals/context-nav").set("host", "admin.example.test");

    expect(subNav.status).toBe(200);
    expect(subNav.text).toContain("href=\"/design-system/patterns\"");
    expect(subNav.text).toContain(">Patterns<");
    expect(subNav.text).toContain(">Sub Nav<");
    expect(subNav.text).not.toContain("href=\"/design-system/canonicals\">Canonicals<");

    expect(contextNav.status).toBe(200);
    expect(contextNav.text).toContain("href=\"/design-system/patterns\"");
    expect(contextNav.text).toContain(">Patterns<");
    expect(contextNav.text).toContain(">Context Nav<");
    expect(contextNav.text).not.toContain("href=\"/design-system/canonicals\">Canonicals<");
  });
});
