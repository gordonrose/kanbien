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
      "/design-system/templates/launcher",
      "/design-system/templates/form",
      "/design-system/canonicals",
      "/design-system/canonicals/launcher",
      "/design-system/canonicals/top-nav",
      "/design-system/canonicals/sub-nav",
      "/design-system/canonicals/context-nav",
      "/design-system/canonicals/context-nav-drawer",
      "/design-system/canonicals/page-shell-banner",
      "/design-system/canonical-renderings/top-nav/TRP-001",
      "/design-system/components/top-nav",
      "/design-system/components/sub-nav",
      "/design-system/components/context-nav",
      "/design-system/components/page-shell-banner",
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
    expect(response.text).toContain("accessibility-button");
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
    expect(response.text).toContain("/design-system/canonicals/launcher");
    expect(response.text).toContain("/design-system/canonicals/top-nav");
    expect(response.text).toContain("/design-system/canonicals/context-nav");
    expect(response.text).toContain("/design-system/canonicals/context-nav-drawer");
    expect(response.text).toContain("/design-system/canonicals/page-shell-banner");
    expect(response.text).toContain("/design-system/canonicals/time-picker");
  });

  it("serves the page-shell-banner canonical launcher page with dedicated render links", async () => {
    const response = await request(createApp()).get("/design-system/canonicals/page-shell-banner").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("Page-Shell Banner Canonicals");
    expect(response.text).toContain(">Patterns<");
    expect(response.text).toContain(">Canonicals<");
    expect(response.text).toContain(">Page-Shell Banner<");
    expect(response.text).toContain("/design-system/components/page-shell-banner?ref=PSBR-001&theme=normal&dir=ltr&zoom=0");
    expect(response.text).not.toContain("/design-system/templates/page-shell?ref=PSBR-");
  });

  it("serves the generated canonical-renderings family launcher page shell", async () => {
    const response = await request(createApp())
      .get("/design-system/canonical-renderings/page-shell-banner")
      .set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain('data-canonical-renderings-surface="family"');
    expect(response.text).toContain("Canonical Family");
    expect(response.text).toContain("Available Canonical Renderings");
    expect(response.text).toContain("/design-system/canonical-renderings");
  });

  it("serves the launcher canonical page with named launcher template refs", async () => {
    const response = await request(createApp()).get("/design-system/canonicals/launcher").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("Launcher Canonicals");
    expect(response.text).toContain(">Pages<");
    expect(response.text).toContain(">Canonicals<");
    expect(response.text).toContain(">Launcher<");
    expect(response.text).toContain("/design-system/templates/launcher?ref=LTR-BASE-5&theme=normal&dir=ltr&zoom=0");
    expect(response.text).toContain("/design-system/templates/launcher?ref=LTR-WIDE-8&theme=normal&dir=ltr&zoom=0");
    expect(response.text).toContain("/design-system/templates/launcher?ref=RTL-BASE-5&theme=normal&dir=rtl&zoom=0");
    expect(response.text).toContain("/design-system/templates/launcher?ref=ZO-100-WIDE-8&theme=normal&dir=ltr&zoom=-100");
  });

  it("serves the dedicated page-shell-banner canonical render page", async () => {
    const response = await request(createApp())
      .get("/design-system/components/page-shell-banner?ref=PSBR-001&theme=normal&dir=ltr&zoom=0")
      .set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("Canonical Render");
    expect(response.text).toContain("page-shell-banner-canonical-match-list");
    expect(response.text).toContain("page-shell-banner-preview-frame");
    expect(response.text).toContain("href=\"/design-system/canonicals/page-shell-banner\"");
    expect(response.text).toContain("data-page-shell-banner-surface=\"canonical\"");
  });

  it("serves the generated top-nav canonical rendering route", async () => {
    const response = await request(createApp())
      .get("/design-system/canonical-renderings/top-nav/TRP-001")
      .set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("top-nav-canonical-match-list");
    expect(response.text).toContain("top-nav-preview-frame");
    expect(response.text).toContain("data-top-nav-surface=\"canonical\"");
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

  it("serves the time-picker canonical launcher page for child seam states", async () => {
    const response = await request(createApp()).get("/design-system/canonicals/time-picker").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("Time Picker Canonicals");
    expect(response.text).toContain("breadcrumb-list");
    expect(response.text).toContain(">Canonicals<");
    expect(response.text).toContain(">Time Picker<");
    expect(response.text).toContain("context-nav");
    expect(response.text).toContain(">Canonicals<");
    expect(response.text).toContain("TPR-002");
    expect(response.text).toContain("canonical-launcher-button-priority");
    expect(response.text).toContain("/design-system/components/time-picker?ref=TPR-006&width=390&state=mobile-open&theme=normal&dir=ltr&zoom=0");
  });

  it("serves the date-picker canonical launcher page with dedicated child render links", async () => {
    const response = await request(createApp()).get("/design-system/canonicals/date-picker").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("Date Picker Canonicals");
    expect(response.text).toContain("breadcrumb-list");
    expect(response.text).toContain("href=\"/design-system/components\">Home<");
    expect(response.text).toContain(">Canonicals<");
    expect(response.text).toContain(">Date Picker<");
    expect(response.text).toContain("context-nav");
    expect(response.text).toContain("DTPR-004");
    expect(response.text).toContain("canonical-launcher-button-priority");
    expect(response.text).toContain("/design-system/components/date-picker?ref=DTPR-007&width=430&state=range-mobile-open&theme=normal&dir=ltr&zoom=0");
    expect(response.text).not.toContain("/design-system/templates/form?ref=DTPR-");
  });

  it("serves the dedicated date-picker canonical render page", async () => {
    const response = await request(createApp())
      .get("/design-system/components/date-picker?ref=DTPR-001&width=520&state=single-open&theme=normal&dir=ltr&zoom=0")
      .set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("Canonical Render");
    expect(response.text).toContain("date-picker-canonical-match-list");
    expect(response.text).toContain("date-picker-preview-frame");
    expect(response.text).toContain("Date Picker Hosted Field");
    expect(response.text).toContain("href=\"/design-system/canonicals/date-picker\"");
    expect(response.text).toContain("data-date-picker-surface=\"canonical\"");
  });

  it("serves the form template host page instead of leaked source text", async () => {
    const response = await request(createApp()).get("/design-system/templates/form").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("Kanbien Design System - Form Template");
    expect(response.text).toContain("id=\"form-page-canvas-title\"");
    expect(response.text).toContain("class=\"form-page-shell\"");
    expect(response.text).toContain("Create workspace campaign");
    expect(response.text).toContain("/design-system/assets/styles.css");
    expect(response.text).not.toContain("src/frontend/designSystem/assets/formTemplate.css:71:.form-page-section");
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
    expect(response.text).toContain("/design-system/patterns/context-nav");
    expect(response.text).toContain("/design-system/patterns/sub-nav-row");
    expectShellTrio(response.text);
    expect(response.text).toContain("Design-system section navigation");
    expect(response.text).toContain(">Patterns<");
    expect(response.text).toContain(">Canonicals<");
  });

  it("serves the brochure page pattern preview route", async () => {
    const response = await request(createApp()).get("/design-system/patterns/brochure-page").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("data-brochure-preview");
    expect(response.text).toContain("brochure-display-settings-drawer");
    expect(response.text).toContain("data-brochure-density");
    expect(response.text).toContain("data-brochure-media-balance");
    expect(response.text).toContain("data-brochure-mosaic-copy");
    expect(response.text).toContain("data-brochure-color=\"background\"");
    expect(response.text).toContain("data-brochure-color=\"font\"");
    expect(response.text).toContain("data-brochure-font-family");
    expect(response.text).toContain("data-brochure-font-weight");
    expect(response.text).toContain("data-brochure-font-size");
    expect(response.text).not.toContain("INTERNAL_ERROR");
  });

  it("serves the launcher template detail page", async () => {
    const response = await request(createApp()).get("/design-system/templates/launcher").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("Kanbien Design System - Launcher Template");
    expect(response.text).toContain(">Pages<");
    expect(response.text).toContain(">Launcher<");
    expect(response.text).toContain("/design-system/canonicals");
    expect(response.text).toContain("/design-system/canonicals/top-nav");
    expect(response.text).toContain("/design-system/canonicals/list-detail-panel");
    expect(response.text).toContain("canonical-launcher-page");
    expect(response.text).toContain("accessibility-button");
    expect(response.text).toContain("accessibility-drawer");
    expect(response.text).toContain("Display Settings");
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
