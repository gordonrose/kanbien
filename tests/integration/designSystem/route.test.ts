import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app";

const designSystemRoot = join(process.cwd(), "src/frontend/designSystem");

function walkHtmlFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walkHtmlFiles(path) : path.endsWith(".html") ? [path] : [];
  });
}

function routeForHtmlFile(path: string) {
  const relativePath = relative(designSystemRoot, path).replace(/\\/g, "/");
  if (relativePath === "index.html") {
    return "/design-system";
  }
  if (relativePath.endsWith("/index.html")) {
    return `/design-system/${relativePath.replace(/\/index\.html$/, "")}`;
  }
  return `/design-system/${relativePath.replace(/\.html$/, "")}`;
}

function expectShellTrio(html: string) {
  expect(html).toContain("class=\"top-nav");
  expect(html).toContain("class=\"sub-nav");
  expect(html).toContain("class=\"context-nav");
}

function expectGovernedBreadcrumb(html: string) {
  expect(html).toContain('class="breadcrumb-nav"');
  expect(html).toContain('class="breadcrumb-list"');
  expect(html).toMatch(/class="[^"]*\bbreadcrumb-button\b[^"]*\bbreadcrumb-current\b/);
  expect(html).toContain('aria-current="page"');
}

function expectElementClassTokens(html: string, id: string, tokens: readonly string[]) {
  const tag = html.match(new RegExp(`<[^>]*\\bid="${id}"[^>]*>`))?.[0] ?? "";
  expect(tag, id).not.toBe("");

  const className = tag.match(/\bclass="([^"]*)"/)?.[1] ?? "";
  for (const token of tokens) {
    expect(className, id).toMatch(new RegExp(`\\b${token}\\b`));
  }
}

function expectDisplaySettingsDrawer(html: string) {
  expect(html).toContain('id="accessibility-button"');
  expectElementClassTokens(html, "accessibility-button", ["context-nav-item", "context-nav-item-button"]);
  expect(html).toContain('aria-expanded="false"');
  expect(html).toContain('aria-controls="accessibility-drawer"');
  expect(html).toContain('id="accessibility-drawer"');
  expectElementClassTokens(html, "accessibility-drawer", ["side-panel", "accessibility-drawer", "hidden"]);
  expect(html).toContain('aria-hidden="true"');
  expect(html).toContain("Display Settings");
  expect(html).toContain('id="accessibility-close"');
  expect(html).toContain('data-theme-option="normal"');
  expect(html).toContain('data-theme-option="dark"');
  expect(html).toContain('data-theme-option="desert"');
  expect(html).toContain('data-magnification-option="100"');
  expect(html).toContain('data-direction-option="rtl"');
}

function expectCssJsSourceDrawer(html: string) {
  expect(html).toContain('id="source-drawer-button"');
  expect(html).toContain('aria-label="Open CSS and JavaScript source"');
  expect(html).toContain('aria-controls="source-drawer"');
  expect(html).toContain('id="source-drawer"');
  expect(html).toContain("CSS/JS Truth");
  expect(html).toContain('data-source-output="css"');
  expect(html).toContain('data-source-output="js"');
  expect(html).toContain('data-source-output="prompt"');
  expect(html).toContain('data-source-copy="css"');
}

function expectSingleItemContextNav(html: string, label: string) {
  const contextNavMatch = html.match(/<nav class="context-nav"[\s\S]*?<\/nav>/);
  expect(contextNavMatch).not.toBeNull();
  const contextNavHtml = contextNavMatch?.[0] ?? "";
  const mainMatch = contextNavHtml.match(/<div class="context-nav-main">([\s\S]*?)<\/div>/);
  const itemCount = (mainMatch?.[1].match(/class="context-nav-item/g) ?? []).length;

  expect(itemCount).toBe(1);
  expect(mainMatch?.[1] ?? "").toContain(`>${label}<`);
}

describe("design system route", () => {
  it("serves every design-system HTML page with breadcrumbs and a display settings drawer", async () => {
    const routes = [...new Set(walkHtmlFiles(designSystemRoot).map(routeForHtmlFile))].sort();

    for (const route of routes) {
      const response = await request(createApp()).get(route).set("host", "admin.example.test");

      expect(response.status, route).toBe(200);
      expectShellTrio(response.text);
      expectGovernedBreadcrumb(response.text);
      expectDisplaySettingsDrawer(response.text);
      expect(response.text).toContain("/design-system/assets/app.mjs");
    }
  });

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
      "/design-system/components/floating-tab-header",
      "/design-system/exploration/top-nav",
      "/design-system/exploration/sub-nav",
      "/design-system/exploration/context-nav",
      "/design-system/exploration/floating-tab-header",
    ];

    for (const route of routes) {
      const response = await request(createApp()).get(route).set("host", "admin.example.test");

      expect(response.status).toBe(200);
      expectShellTrio(response.text);
    }
  });

  it("serves the promoted floating tab header component surface", async () => {
    const response = await request(createApp())
      .get("/design-system/components/floating-tab-header?tabs=12&layout=vertical&attention=on&expandable=on&categorySwitch=on")
      .set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("Floating Tab Header");
    expect(response.text).toContain("id=\"floating-tab-workspace\"");
    expect(response.text).toContain("data-floating-tab-seam-mount=\"true\"");
    expect(response.text).not.toContain("class=\"floating-tab-card");
    expect(response.text).toContain("Canonical Render");
    expect(response.text).toContain("floating-tab-canonical-match-list");
    expect(response.text).toContain("floating-tab-preview-frame");
    expect(response.text).toContain("/design-system/assets/floatingTabHeaderCanonical.mjs");
  });

  it("serves the generated floating tab header canonical rendering route", async () => {
    const response = await request(createApp())
      .get("/design-system/canonical-renderings/floating-tab-header/FTH-R-001")
      .set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("data-floating-tab-header-surface=\"canonical\"");
    expect(response.text).toContain("id=\"floating-tab-preview-frame\"");
    expect(response.text).toContain("/design-system/assets/floatingTabHeaderCanonical.mjs");
  });

  it("serves the public design-system page with the top-navigation primitive", async () => {
    const response = await request(createApp()).get("/design-system").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("brand-lockup");
    expect(response.text).toContain("Kanbien Design System");
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
    expect(response.text).toContain("Legacy Design-System Canonicals");
    expect(response.text).toContain("Compatibility Canonical Sets");
    expect(response.text).toContain("Generated canonical-renderings are the durable source of truth");
    expect(response.text).toContain("Do not add new generated families here");
    expect(response.text).toContain("/design-system/canonicals/launcher");
    expect(response.text).toContain("/design-system/canonical-renderings/top-nav");
    expect(response.text).toContain("/design-system/canonicals/context-nav");
    expect(response.text).toContain("/design-system/canonicals/context-nav-drawer");
    expect(response.text).toContain("/design-system/canonical-renderings/page-shell-banner");
    expect(response.text).toContain("/design-system/canonical-renderings/time-picker");
  });

  it("serves the token-layer starter index page", async () => {
    const response = await request(createApp()).get("/design-system/tokens").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Token Layer");
    expect(response.text).toContain("Token Families To Build Out");
    expect(response.text).toContain("paragraph");
    expect(response.text).toContain("/design-system/tokens/paragraph");
    expect(response.text).toContain("header");
    expect(response.text).toContain("/design-system/tokens/header");
    expect(response.text).toContain("tooltip");
    expect(response.text).toContain("/design-system/tokens/tooltip");
    expect(response.text).toContain("dropdowns");
    expect(response.text).toContain("/design-system/tokens/dropdowns");
    expect(response.text).toContain("container");
    expect(response.text).toContain("/design-system/tokens/container");
    expect(response.text).toContain("container-section");
    expect(response.text).toContain("/design-system/tokens/container-section");
    expect(response.text).toContain("icon-button");
    expect(response.text).toContain("/design-system/tokens/icon-button");
    expect(response.text.indexOf(">Controls<")).toBeLessThan(response.text.indexOf(">Cards<"));
    expect(response.text.indexOf(">Cards<")).toBeLessThan(response.text.indexOf(">Page Structure<"));
    expect(response.text).toContain("index-cards");
    expect(response.text).toContain("Index Cards");
    expect(response.text).toContain("list-cards");
    expect(response.text).toContain("/design-system/tokens/index-card");
    expect(response.text).not.toContain("primary-list-cards");
    expect(response.text).not.toContain("/design-system/tokens/primary-list-card");
    expect(response.text).toContain(">List Card<");
    expect(response.text).toContain("/design-system/tokens/list-card");
    expect(response.text).toContain("count-cards");
    expect(response.text).toContain("button-cards");
    expect(response.text).toContain("/design-system/tokens/button-card");
    expect(response.text).toContain("select-cards");
    expect(response.text).not.toContain("tab-cards");
    expect(response.text).toContain("/design-system/tokens/count-card");
    expect(response.text).not.toContain("#token-header-1");
    expect(response.text).not.toContain("#token-header-6");
    expect(response.text).not.toContain("font-main-extra-large");
    expect(response.text).toContain("entity-drawers");
    expect(response.text).toContain("list-page-structure");
    expect(response.text).toContain("list-page-record-structure");
    expect(response.text).toContain("entity-page-structure");
    expect(response.text).toContain("nested-entity-record");
    expect(response.text).toContain("page-header");
    expect(response.text).toContain("search-panel");
    expect(response.text).toContain("/design-system/tokens/page-header");
    expect(response.text).toContain("/design-system/tokens/search-panel");
    expect(response.text).toContain("/design-system/tokens/background");
    expect(response.text).toContain("/design-system/tokens/container");
    expect(response.text).toContain("/design-system/tokens/colours");
    expect(response.text).toContain("/design-system/tokens/list-page-structure");
    expect(response.text).toContain("/design-system/tokens/list-page-record-structure");
    expect(response.text).toContain("/design-system/tokens/entity-page-structure");
    expect(response.text).toContain("/design-system/tokens/nested-entity-record");
    expect(response.text).toContain("colours");
    expect(response.text).toContain(">Canonical Renderings<");
    expect(response.text).toContain(">Canonicals<");
  });

  it("requires the CSS/JS source drawer on governed token detail pages", async () => {
    const routes = [
      "/design-system/tokens/background",
      "/design-system/tokens/container",
      "/design-system/tokens/container-section",
      "/design-system/tokens/icon-button",
      "/design-system/tokens/colours",
      "/design-system/tokens/paragraph",
      "/design-system/tokens/header",
      "/design-system/tokens/tooltip",
      "/design-system/tokens/list-page-structure",
      "/design-system/tokens/list-page-record-structure",
      "/design-system/tokens/entity-page-structure",
      "/design-system/tokens/nested-entity-record",
      "/design-system/tokens/page-header",
      "/design-system/tokens/search-panel",
      "/design-system/tokens/count-card",
      "/design-system/tokens/index-card",
      "/design-system/tokens/button-card",
      "/design-system/tokens/dropdowns",
      "/design-system/tokens/list-card",
    ];

    for (const route of routes) {
      const response = await request(createApp()).get(route).set("host", "admin.example.test");

      expect(response.status).toBe(200);
      expectCssJsSourceDrawer(response.text);
    }
  });

  it("serves the paragraph typography token page with relative sizing sections", async () => {
    const response = await request(createApp()).get("/design-system/tokens/paragraph").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/paragraph").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Paragraph Token");
    expect(response.text).toContain('aria-label="Paragraph token navigation"');
    expect(response.text).toContain('id="accessibility-button"');
    expect(response.text).toContain('aria-controls="accessibility-drawer"');
    expect(response.text).toContain('id="accessibility-drawer"');
    expectCssJsSourceDrawer(response.text);
    expect(response.text).toContain("Display Settings");
    expect(response.text).toContain('data-theme-option="dark"');
    expect(response.text).toContain('data-theme-option="desert"');
    expect(response.text).toContain('data-magnification-option="100"');
    expect(response.text).toContain('data-direction-option="rtl"');
    expect(response.text).toContain("data-token-paragraph-seam-mount");
    expect(response.text).toContain("/design-system/assets/tokenParagraph.mjs");
    expect(response.text).toContain(">Canonical Renderings<");
    expect(response.text).toContain(">Canonicals<");

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Paragraph Token");
  });

  it("serves the shared paragraph token model seam", async () => {
    const pageModule = await request(createApp()).get("/design-system/assets/tokenParagraph.mjs").set("host", "admin.example.test");
    const modelModule = await request(createApp()).get("/design-system/assets/tokenParagraphModel.mjs").set("host", "admin.example.test");

    expect(pageModule.status).toBe(200);
    expect(pageModule.type).toMatch(/javascript/);
    expect(pageModule.text).toContain("hydrateParagraphTokenPage");
    expect(pageModule.text).toContain("./tokenParagraphModel.mjs");

    expect(modelModule.status).toBe(200);
    expect(modelModule.type).toMatch(/javascript/);
    expect(modelModule.text).toContain("paragraphColourVariants");
    expect(modelModule.text).toContain("token-paragraph-colour-warning");
    expect(modelModule.text).toContain("token-paragraph-colour-success");
    expect(modelModule.text).toContain("token-paragraph-colour-error");
    expect(modelModule.text).not.toContain('token: "paragraph.warning"');
    expect(modelModule.text).not.toContain('token: "paragraph.success"');
    expect(modelModule.text).not.toContain('token: "paragraph.error"');
    expect(modelModule.text).toContain("renderParagraphTokenSections");
    expect(modelModule.text).toContain("hydrateParagraphTokenPage");
  });

  it("serves the header typography token page as one family with relative sizing sections", async () => {
    const response = await request(createApp()).get("/design-system/tokens/header").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/header").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Header Token");
    expect(response.text).toContain('aria-label="Header token navigation"');
    expect(response.text).toContain('id="accessibility-button"');
    expect(response.text).toContain('aria-controls="accessibility-drawer"');
    expect(response.text).toContain('id="accessibility-drawer"');
    expectCssJsSourceDrawer(response.text);
    expect(response.text).toContain("Display Settings");
    expect(response.text).toContain('data-theme-option="dark"');
    expect(response.text).toContain('data-theme-option="desert"');
    expect(response.text).toContain('data-magnification-option="100"');
    expect(response.text).toContain('data-direction-option="rtl"');
    expect(response.text).toContain("data-token-header-seam-mount");
    expect(response.text).toContain("/design-system/assets/tokenHeader.mjs");
    expect(response.text).toContain(">Canonical Renderings<");
    expect(response.text).toContain(">Canonicals<");

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Header Token");
  });

  it("serves the shared header token model seam", async () => {
    const pageModule = await request(createApp()).get("/design-system/assets/tokenHeader.mjs").set("host", "admin.example.test");
    const modelModule = await request(createApp()).get("/design-system/assets/tokenHeaderModel.mjs").set("host", "admin.example.test");

    expect(pageModule.status).toBe(200);
    expect(pageModule.type).toMatch(/javascript/);
    expect(pageModule.text).toContain("hydrateHeaderTokenPage");
    expect(pageModule.text).toContain("./tokenHeaderModel.mjs");

    expect(modelModule.status).toBe(200);
    expect(modelModule.type).toMatch(/javascript/);
    expect(modelModule.text).toContain("header.1");
    expect(modelModule.text).toContain("header.6");
    expect(modelModule.text).toContain("renderHeaderTokenSections");
    expect(modelModule.text).toContain("hydrateHeaderTokenPage");
  });

  it("serves the tooltip token page with shared overlay token cards", async () => {
    const response = await request(createApp()).get("/design-system/tokens/tooltip").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/tooltip").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Tooltip Token");
    expect(response.text).toContain('aria-label="Tooltip token navigation"');
    expect(response.text).toContain("--tooltip-bg");
    expect(response.text).toContain("--tooltip-fg");
    expect(response.text).toContain("--tooltip-shadow");
    expect(response.text).toContain("--tooltip-radius");
    expect(response.text).toContain("--tooltip-arrow-size");
    expect(response.text).toContain("--tooltip-layer");
    expect(response.text).toContain("--tooltip-max-width");
    expect(response.text).toContain("--tooltip-max-height");
    expect(response.text).toContain("typography: paragraph.mainMinor / .token-paragraph-main-minor");
    expect(response.text).toContain("token-tooltip-content-sample token-paragraph-preview token-paragraph-main-minor");
    expect(response.text).toContain('data-tooltip="Shared tooltip preview"');
    expect(response.text).toContain('aria-label="Long tooltip content preview"');
    expect(response.text).toContain('data-token-tooltip-placement="top"');
    expect(response.text).toContain('data-token-tooltip-placement="right"');
    expect(response.text).toContain('data-token-tooltip-placement="bottom"');
    expect(response.text).toContain('data-token-tooltip-placement="left"');
    expect(response.text).toContain('aria-label="Tooltip escape layer preview"');
    expect(response.text).toContain("Tooltip Escape Layer");
    expect(response.text).toContain("#shared-floating-tooltip");
    expectCssJsSourceDrawer(response.text);

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Tooltip Token");
  });

  it("serves the list page structure token starter with display-controlled layout", async () => {
    const response = await request(createApp()).get("/design-system/tokens/list-page-structure").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("List Page Structure");
    expect(response.text).toContain('aria-label="Twenty-four header columns"');
    expect(response.text).toContain('aria-label="Navigation space sub header"');
    expect(response.text).toContain('data-list-page-structure-canvas');
    expect(response.text).toContain('data-list-page-structure-layout-option="full"');
    expect(response.text).toContain('data-list-page-structure-layout-option="split"');
    expect(response.text).toContain('data-list-page-structure-resize-handle');
    expect(response.text).toContain('data-list-page-structure-header-toggle="first"');
    expect(response.text).toContain('data-list-page-structure-header-toggle="second"');
    expect(response.text).toContain('data-list-page-structure-secondary-columns-option="12"');
    expect(response.text).toContain('data-list-page-structure-secondary-columns-option="24"');
    expect(response.text).toContain('data-list-page-structure-mobile-layer-option="top"');
    expect(response.text).toContain('data-list-page-structure-mobile-layer-option="bottom"');
    expect(response.text).toContain('data-list-page-structure-secondary-columns="12"');
    expect(response.text).toContain('data-structure-content-option="extended"');
    expect(response.text).toContain('id="accessibility-drawer"');
    expectCssJsSourceDrawer(response.text);
    expect(response.text).toContain(">Canonical Renderings<");
    expect(response.text).toContain(">Canonicals<");
  });

  it("serves the shared ListPageStructure controller seam", async () => {
    const response = await request(createApp()).get("/design-system/assets/listPageStructure.mjs").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/javascript/);
    expect(response.text).toContain("createListPageStructureController");
    expect(response.text).toContain("listPageStructureDefaults");
    expect(response.text).toContain("data-list-page-structure-canvas");
    expect(response.text).toContain("listPageStructureMobileLayer");
  });

  it("serves the list page record structure token starter with a nested entity record in the split main region", async () => {
    const response = await request(createApp()).get("/design-system/tokens/list-page-record-structure").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("List Page Record Structure");
    expect(response.text).toContain('data-token-layer-surface="list-page-record-structure"');
    expect(response.text).toContain('data-list-page-structure-canvas');
    expect(response.text).toContain('data-list-page-structure-layout="split"');
    expect(response.text).toContain('data-list-page-structure-layout-option="split"');
    expect(response.text).toContain('data-list-page-structure-resize-handle');
    expect(response.text).toContain('data-nested-entity-record-structure-mount');
    expect(response.text).toContain('aria-label="Record structure column"');
    expect(response.text).toContain('data-list-page-structure-header-toggle="first"');
    expect(response.text).toContain('data-list-page-structure-header-toggle="second"');
    expect(response.text).toContain('data-list-page-structure-secondary-columns-option="24"');
    expect(response.text).toContain('data-entity-page-structure-mobile-layer-option="top"');
    expect(response.text).toContain('data-entity-page-structure-mobile-layer-option="bottom"');
    expect(response.text).toContain('data-structure-content-option="extended"');
    expectCssJsSourceDrawer(response.text);
  });

  it("serves the entity page structure token starter with shared header and background foundation", async () => {
    const response = await request(createApp()).get("/design-system/tokens/entity-page-structure").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Entity Page Structure");
    expect(response.text).toContain('data-token-layer-surface="entity-page-structure"');
    expect(response.text).toContain('aria-label="Twenty-four header columns"');
    expect(response.text).toContain('class="token-foundation-header token-entity-page-structure-header"');
    expect(response.text).toContain('data-structure-header="entity"');
    expect(response.text).toContain('data-structure-header-toggle="entity"');
    expect(response.text).toContain('data-entity-page-structure-mobile-layer-option="top"');
    expect(response.text).toContain('data-entity-page-structure-mobile-layer-option="bottom"');
    expect(response.text).toContain('data-structure-content-option="extended"');
    expect(response.text).toContain('data-entity-record-body-mount');
    expect(response.text).toContain('/design-system/assets/app.mjs');
    expect(response.text).not.toContain('data-list-page-structure-subheader');
    expect(response.text).not.toContain("Secondary Header Columns");
    expectCssJsSourceDrawer(response.text);
  });

  it("serves the nested entity record token starter with the shared entity page top header", async () => {
    const response = await request(createApp()).get("/design-system/tokens/nested-entity-record").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Nested Entity Record");
    expect(response.text).toContain('data-token-layer-surface="nested-entity-record"');
    expect(response.text).toContain('class="token-foundation-header token-entity-page-structure-header"');
    expect(response.text).toContain('data-structure-header="entity"');
    expect(response.text).toContain('aria-label="Twenty-four header columns"');
    expect(response.text).toContain('data-nested-entity-record-structure-mount');
    expect(response.text).toContain('/design-system/assets/app.mjs');
    expect(response.text).toContain('data-entity-page-structure-mobile-layer-option="top"');
    expect(response.text).toContain('data-entity-page-structure-mobile-layer-option="bottom"');
    expect(response.text).toContain('data-structure-content-option="extended"');
    expectCssJsSourceDrawer(response.text);
  });

  it("serves the shared entity record render seam", async () => {
    const response = await request(createApp()).get("/design-system/assets/entityRecordStructure.mjs").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/javascript/);
    expect(response.text).toContain("renderEntityRecordBody");
    expect(response.text).toContain("renderNestedEntityRecordStructure");
    expect(response.text).toContain("hydrateEntityRecordStructures");
    expect(response.text).toContain("data-entity-page-structure-canvas");
    expect(response.text).toContain("data-nested-entity-record-frame-shell");
    expect(response.text).toContain("data-nested-entity-record-bottom-resize-handle");
    expect(response.text).toContain("Resize nested entity record container height");
  });

  it("serves the shared foundation structure controller seam", async () => {
    const response = await request(createApp()).get("/design-system/assets/foundationStructure.mjs").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/javascript/);
    expect(response.text).toContain("createStructureHeaderController");
    expect(response.text).toContain("createStructureContentController");
    expect(response.text).toContain("createEntityPageStructureController");
    expect(response.text).toContain("createNestedEntityRecordController");
    expect(response.text).toContain("data-structure-header-toggle");
    expect(response.text).toContain("structureVisible");
    expect(response.text).toContain("entityPageStructureIndexSize");
    expect(response.text).toContain("entityPageStructurePanelIndexSize");
    expect(response.text).toContain("entityPageStructureMobileLayer");
    expect(response.text).toContain("nestedEntityRecordWidth");
    expect(response.text).toContain("nestedEntityRecordHeight");
    expect(response.text).toContain("structureScrollProbe");
  });

  it("serves the shared page background foundation seam", async () => {
    const response = await request(createApp()).get("/design-system/assets/pageBackground.mjs").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/javascript/);
    expect(response.text).toContain("createPageBackgroundController");
    expect(response.text).toContain("pageBackgroundGradientDefaults");
    expect(response.text).toContain("--token-background-foundation");
  });

  it("serves the background token starter page with the display drawer context-nav action", async () => {
    const response = await request(createApp()).get("/design-system/tokens/background").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/background").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain('aria-label="Background token navigation"');
    expect(response.text).toContain('id="accessibility-button"');
    expect(response.text).toContain('aria-controls="accessibility-drawer"');
    expect(response.text).toContain('id="accessibility-drawer"');
    expectCssJsSourceDrawer(response.text);
    expect(response.text).toContain("Display Settings");
    expect(response.text).toContain("Dark Colour Baseline");
    expect(response.text).toContain("Desert Colour Baseline");
    expect(response.text).toContain("Gradient Extent");
    expect(response.text).toContain('data-token-background-control="glowExtent"');
    expect(response.text).toContain('data-token-background-control="cornerExtent"');
    expect(response.text).toContain('data-token-background-control="washExtent"');
    expect(response.text).toContain('data-token-background-control="normalStrength"');
    expect(response.text).toContain('data-token-background-control="darkStrength"');
    expect(response.text).toContain('data-token-background-control="desertStrength"');
    expect(response.text).toContain('data-token-colour-baseline="dark"');
    expect(response.text).toContain('data-token-colour-baseline="desert"');
    expect(response.text).toContain("/design-system/assets/tokenBackground.mjs");
    expect(response.text).not.toContain("Foundation Token");
    expect(response.text).not.toContain("Application canvas");
    expect(response.text).toContain(">Canonical Renderings<");
    expect(response.text).toContain(">Canonicals<");

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain('aria-label="Background token navigation"');
  });

  it("serves the container token page with an opaque theme-aware card surface", async () => {
    const response = await request(createApp()).get("/design-system/tokens/container").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/container").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Container Token");
    expect(response.text).toContain('aria-label="Container token navigation"');
    expect(response.text).toContain('data-token-layer-surface="container"');
    expect(response.text).toContain("token-container-sample");
    expect(response.text).toContain("--token-container-background");
    expect(response.text).toContain('data-container-variant="success"');
    expect(response.text).toContain('data-container-variant="error"');
    expect(response.text).toContain('data-container-variant="warning"');
    expect(response.text).toContain("--colour-success-10");
    expect(response.text).toContain("--colour-error-10");
    expect(response.text).toContain("--colour-warning-10");
    expect(response.text).toContain("--colour-primary-30");
    expect(response.text).toContain('data-theme-scope="dark"');
    expect(response.text).toContain('data-theme-scope="desert"');
    expect(response.text).toContain('id="accessibility-button"');
    expect(response.text).toContain('id="accessibility-drawer"');
    expectCssJsSourceDrawer(response.text);

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Container Token");
  });

  it("serves the container section token page with four-sided square section borders", async () => {
    const response = await request(createApp()).get("/design-system/tokens/container-section").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/container-section").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Container Section Token");
    expect(response.text).toContain('aria-label="Container section token navigation"');
    expect(response.text).toContain('data-token-layer-surface="container-section"');
    expect(response.text).toContain("token-container-section-sample");
    expect(response.text).toContain("--token-container-section-background");
    expect(response.text).toContain("--colour-primary-30");
    expect(response.text).toContain("Four-sided square border");
    expect(response.text).toContain('data-container-variant="success"');
    expect(response.text).toContain('data-container-variant="error"');
    expect(response.text).toContain('data-container-variant="warning"');
    expect(response.text).toContain('data-theme-scope="dark"');
    expect(response.text).toContain('data-theme-scope="desert"');
    expectCssJsSourceDrawer(response.text);

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Container Section Token");
  });

  it("serves the page header token page with the Page Header grouping", async () => {
    const response = await request(createApp()).get("/design-system/tokens/page-header").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/page-header").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Page Header");
    expect(response.text).toContain('data-token-layer-surface="page-header"');
    expect(response.text).toContain("Page Header maps over the twenty-four list-structure header columns");
    expect(response.text).toContain("<span>01</span><span>02</span><span>03</span>");
    expect(response.text).toContain("<span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span>");
    expect(response.text).toContain("token-page-header-map");
    expect(response.text).toContain('data-page-header-span="1"');
    expect(response.text).toContain('data-page-header-span="2"');
    expect(response.text).toContain('data-page-header-span="3-5"');
    expect(response.text).toContain('data-page-header-span="6-8"');
    expect(response.text).toContain('data-page-header-span="9-19"');
    expect(response.text).toContain('data-page-header-span="20"');
    expect(response.text).toContain('data-page-header-span="24"');
    expect(response.text).toContain("token-list-page-structure-header");
    expect(response.text).toContain('data-list-page-structure-subheader');
    expect(response.text).toContain('data-list-page-structure-canvas');
    expect(response.text).not.toContain("canonical-launcher-page");
    expect(response.text).not.toContain("token-page-header-card");
    expectDisplaySettingsDrawer(response.text);
    expectCssJsSourceDrawer(response.text);

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Page Header");
  });

  it("serves the search panel token page with the fixed search row structure", async () => {
    const response = await request(createApp()).get("/design-system/tokens/search-panel").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/search-panel").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Search Panel");
    expect(response.text).toContain('data-token-layer-surface="search-panel"');
    expect(response.text).toContain('data-search-panel-structure-mount');
    expect(response.text).not.toContain('data-search-panel-query-section');
    expect(response.text).not.toContain('data-search-panel-query-slot');
    expect(response.text).not.toContain('data-filter-panel-structure-scroll-stack');
    expect(response.text).toContain("/design-system/tokens/filter-panel-structure");
    expectDisplaySettingsDrawer(response.text);
    expectCssJsSourceDrawer(response.text);

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Search Panel");
  });

  it("serves the search panel render seam from the shared panel structure module", async () => {
    const response = await request(createApp()).get("/design-system/assets/filterPanelStructure.mjs").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/javascript/);
    expect(response.text).toContain("renderSearchPanelStructure");
    expect(response.text).toContain("hydratePanelStructures");
    expect(response.text).toContain("data-search-panel-query-section");
    expect(response.text).toContain("data-search-panel-query-slot");
    expect(response.text).toContain("createFilterPanelStructureController");
  });

  it("serves the icon button token page with fluid centered theme variants", async () => {
    const response = await request(createApp()).get("/design-system/tokens/icon-button").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/icon-button").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Icon Button Token");
    expect(response.text).toContain('aria-label="Icon button token navigation"');
    expect(response.text).toContain('data-token-layer-surface="icon-button"');
    expect(response.text).toContain("token-icon-button-host-cell");
    expect(response.text).toContain("token-icon-button-control");
    expect(response.text).toContain("token-icon-button-size-min");
    expect(response.text).toContain("token-icon-button-size-max");
    expect(response.text).toContain('aria-label="Normal base icon button"');
    expect(response.text).toContain('data-tooltip="Normal base icon button"');
    expect(response.text).toContain('data-tooltip="Dark base icon button"');
    expect(response.text).toContain('data-tooltip="Desert base icon button"');
    expect(response.text).toContain('data-theme-scope="dark"');
    expect(response.text).toContain('data-theme-scope="desert"');
    expectCssJsSourceDrawer(response.text);

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Icon Button Token");
  });

  it("serves the count card token page with compatibility routes and the compact count-slot specimen", async () => {
    const response = await request(createApp()).get("/design-system/tokens/count-card").set("host", "admin.example.test");
    const pluralCompatibilityAlias = await request(createApp()).get("/design-system/tokens/filter-card").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/count-card").set("host", "admin.example.test");
    const singularCompatibilityAlias = await request(createApp()).get("/design-system/token/filter-card").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Count Card Token");
    expect(response.text).toContain('aria-label="Count card token navigation"');
    expect(response.text).toContain('data-token-layer-surface="filter-card"');
    expect(response.text).toContain("data-token-filter-card-mount");
    expect(response.text).toContain('data-token-filter-card-label="Org"');
    expect(response.text).toContain('data-token-filter-card-helper="Owning group"');
    expect(response.text).toContain('data-token-filter-card-count="0"');
    expect(response.text).toContain("Interaction and status states");
    expect(response.text).toContain('data-token-filter-card-state="hover"');
    expect(response.text).toContain('data-token-filter-card-state="selected"');
    expect(response.text).toContain('data-token-filter-card-state="disabled"');
    expect(response.text).toContain('data-token-filter-card-state="warning"');
    expect(response.text).toContain('data-token-filter-card-state="error"');
    expect(response.text).toContain("Overflowing text with tooltip support");
    expect(response.text).toContain("data-token-filter-card-rtl");
    expect(response.text).toContain('data-token-filter-card-zoom="-50"');
    expect(response.text).toContain('data-token-filter-card-zoom="100"');
    expect(response.text).toContain("data-token-filter-card-mobile");
    expect(response.text).toContain('data-token-filter-card-label-tooltip="Very long organization ownership group"');
    expect(response.text).toContain('data-token-filter-card-aria-label="Org count card with count zero"');
    expect(response.text).toContain('data-theme-scope="dark"');
    expect(response.text).toContain('data-theme-scope="desert"');
    expectCssJsSourceDrawer(response.text);

    expect(pluralCompatibilityAlias.status).toBe(200);
    expect(pluralCompatibilityAlias.text).toContain("Count Card Token");
    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Count Card Token");
    expect(singularCompatibilityAlias.status).toBe(200);
    expect(singularCompatibilityAlias.text).toContain("Count Card Token");
  });

  it("serves the shared count card render seam with filter-card compatibility aliases", async () => {
    const response = await request(createApp()).get("/design-system/assets/filterCard.mjs").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/javascript/);
    expect(response.text).toContain("renderCountCard");
    expect(response.text).toContain("hydrateCountCards");
    expect(response.text).toContain("renderFilterCard");
    expect(response.text).toContain("hydrateFilterCards");
    expect(response.text).toContain("token-filter-card-control");
    expect(response.text).toContain("supportedStates");
    expect(response.text).toContain("aria-pressed");
    expect(response.text).toContain("disabled aria-disabled");
    expect(response.text).toContain("token-header-preview token-header-six");
    expect(response.text).toContain("token-paragraph-preview token-paragraph-main-minor");
    expect(response.text).toContain("token-filter-card-count token-paragraph-preview token-paragraph-main");
  });

  it("serves the index card token page with secondary compatibility aliases", async () => {
    const response = await request(createApp()).get("/design-system/tokens/index-card").set("host", "admin.example.test");
    const pluralCompatibilityAlias = await request(createApp()).get("/design-system/tokens/secondary-list-card").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/index-card").set("host", "admin.example.test");
    const singularCompatibilityAlias = await request(createApp()).get("/design-system/token/secondary-list-card").set("host", "admin.example.test");
    const removedPrimary = await request(createApp()).get("/design-system/tokens/primary-list-card").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Index Card Token");
    expect(response.text).toContain('aria-label="Index card token navigation"');
    expect(response.text).toContain('data-token-layer-surface="index-card"');
    expect(response.text).toContain("data-token-index-card-mount");
    expect(response.text).toContain('data-token-index-card-label="Details"');
    expect(response.text).toContain('data-token-index-card-count="3 items"');
    expect(response.text).toContain("Interaction and status states");
    expect(response.text).toContain('data-token-index-card-state="hover"');
    expect(response.text).toContain('data-token-index-card-state="active"');
    expect(response.text).toContain('data-token-index-card-state="selected"');
    expect(response.text).toContain('data-token-index-card-state="disabled"');
    expect(response.text).toContain('data-token-index-card-state="warning"');
    expect(response.text).toContain('data-token-index-card-state="error"');
    expect(response.text).toContain("Overflowing text with tooltip support");
    expect(response.text).toContain("data-token-index-card-rtl");
    expect(response.text).toContain('data-token-index-card-zoom="-50"');
    expect(response.text).toContain('data-token-index-card-zoom="100"');
    expect(response.text).toContain("data-token-index-card-mobile");
    expect(response.text).toContain('data-token-index-card-label-tooltip="Historical details and supporting records"');
    expect(response.text).toContain('data-token-index-card-aria-label="Details index card with three items"');
    expect(response.text).toContain('data-theme-scope="dark"');
    expect(response.text).toContain('data-theme-scope="desert"');
    expect(response.text).not.toContain("Primary List Card Token");
    expectCssJsSourceDrawer(response.text);

    expect(pluralCompatibilityAlias.status).toBe(200);
    expect(pluralCompatibilityAlias.text).toContain("Index Card Token");
    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Index Card Token");
    expect(singularCompatibilityAlias.status).toBe(200);
    expect(singularCompatibilityAlias.text).toContain("Index Card Token");
    expect(removedPrimary.status).toBe(404);
  });

  it("serves the button card token page", async () => {
    const response = await request(createApp()).get("/design-system/tokens/button-card").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/button-card").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Button Card Token");
    expect(response.text).toContain('aria-label="Button card token navigation"');
    expect(response.text).toContain('data-token-layer-surface="button-card"');
    expect(response.text).toContain("data-token-button-card-mount");
    expect(response.text).toContain('data-token-button-card-label="Details"');
    expect(response.text).toContain('data-token-button-card-icon="details"');
    expect(response.text).toContain("Interaction and status states");
    expect(response.text).toContain('data-token-button-card-state="hover"');
    expect(response.text).toContain('data-token-button-card-state="active"');
    expect(response.text).toContain('data-token-button-card-state="selected"');
    expect(response.text).toContain('data-token-button-card-state="disabled"');
    expect(response.text).toContain('data-token-button-card-state="warning"');
    expect(response.text).toContain('data-token-button-card-state="error"');
    expect(response.text).toContain("Overflowing text with tooltip support");
    expect(response.text).toContain("data-token-button-card-rtl");
    expect(response.text).toContain('data-token-button-card-zoom="-50"');
    expect(response.text).toContain('data-token-button-card-zoom="100"');
    expect(response.text).toContain("data-token-button-card-mobile");
    expect(response.text).toContain('data-token-button-card-label-tooltip="Historical details and supporting records"');
    expect(response.text).toContain('data-token-button-card-aria-label="Details button card"');
    expect(response.text).toContain('data-theme-scope="dark"');
    expect(response.text).toContain('data-theme-scope="desert"');
    expectCssJsSourceDrawer(response.text);

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Button Card Token");
  });

  it("serves the dropdown token page with simple-select compatibility aliases", async () => {
    const response = await request(createApp()).get("/design-system/tokens/dropdowns").set("host", "admin.example.test");
    const pluralCompatibilityAlias = await request(createApp()).get("/design-system/tokens/simple-dropdown").set("host", "admin.example.test");
    const simpleSelectCompatibilityAlias = await request(createApp()).get("/design-system/tokens/simple-select").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/dropdowns").set("host", "admin.example.test");
    const singularCompatibilityAlias = await request(createApp()).get("/design-system/token/simple-dropdown").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Dropdowns Token");
    expect(response.text).toContain('aria-label="Dropdown token navigation"');
    expect(response.text).toContain('data-token-layer-surface="dropdowns"');
    expect(response.text).toContain("data-token-simple-dropdown");
    expect(response.text).toContain("data-token-simple-dropdown-open");
    expect(response.text).toContain("data-token-simple-dropdown-rtl");
    expect(response.text).toContain("token-simple-dropdown-trigger-label");
    expect(response.text).toContain("token-simple-dropdown-trigger-value");
    expect(response.text).toContain("Current");
    expect(response.text).toContain("Historical details and supporting records");
    expect(response.text).toContain('data-theme-scope="dark"');
    expect(response.text).toContain('data-theme-scope="desert"');
    expect(response.text).toContain('aria-haspopup="listbox"');
    expectCssJsSourceDrawer(response.text);

    expect(pluralCompatibilityAlias.status).toBe(200);
    expect(pluralCompatibilityAlias.text).toContain("Dropdowns Token");
    expect(simpleSelectCompatibilityAlias.status).toBe(200);
    expect(simpleSelectCompatibilityAlias.text).toContain("Dropdowns Token");
    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Dropdowns Token");
    expect(singularCompatibilityAlias.status).toBe(200);
    expect(singularCompatibilityAlias.text).toContain("Dropdowns Token");
  });

  it("serves the list card token page with canonical list-card routes", async () => {
    const response = await request(createApp()).get("/design-system/tokens/list-card").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/list-card").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("List Card Token");
    expect(response.text).toContain('aria-label="List card token navigation"');
    expect(response.text).toContain('data-token-layer-surface="list-card"');
    expect(response.text).toContain("data-token-list-card-mount");
    expect(response.text).toContain('data-token-list-card-title="Northstar Operations"');
    expect(response.text).toContain('data-token-list-card-subtitle="Operations"');
    expect(response.text).toContain('data-token-list-card-status="Ready"');
    expect(response.text).toContain("Interaction and status states");
    expect(response.text).toContain('data-token-list-card-state="hover"');
    expect(response.text).toContain('data-token-list-card-state="selected"');
    expect(response.text).toContain('data-token-list-card-state="disabled"');
    expect(response.text).toContain('data-token-list-card-state="warning"');
    expect(response.text).toContain('data-token-list-card-state="error"');
    expect(response.text).toContain("Overflowing text with tooltip support");
    expect(response.text).toContain("data-token-list-card-rtl");
    expect(response.text).toContain("data-token-list-card-mobile");
    expect(response.text).toContain('data-theme-scope="dark"');
    expect(response.text).toContain('data-theme-scope="desert"');
    expectCssJsSourceDrawer(response.text);

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("List Card Token");
  });

  it("serves the shared index card render seam with secondary compatibility exports", async () => {
    const response = await request(createApp()).get("/design-system/assets/indexCard.mjs").set("host", "admin.example.test");
    const compatibilityResponse = await request(createApp()).get("/design-system/assets/secondaryListCard.mjs").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/javascript/);
    expect(response.text).toContain("renderIndexCard");
    expect(response.text).toContain("hydrateIndexCards");
    expect(response.text).toContain("renderSecondaryListCard");
    expect(response.text).toContain("hydrateSecondaryListCards");
    expect(response.text).toContain("token-index-card-control");
    expect(response.text).toContain("supportedStates");
    expect(response.text).toContain("token-container-sample");
    expect(response.text).toContain("token-container-section-sample");
    expect(response.text).toContain("data-container-variant");
    expect(response.text).toContain("aria-pressed");
    expect(response.text).toContain("disabled aria-disabled");
    expect(response.text).toContain("token-header-preview token-header-six");
    expect(response.text).toContain("token-paragraph-preview token-paragraph-main-minor");

    expect(compatibilityResponse.status).toBe(200);
    expect(compatibilityResponse.text).toContain('from "./indexCard.mjs"');
  });

  it("serves the shared button card render seam", async () => {
    const response = await request(createApp()).get("/design-system/assets/buttonCard.mjs").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/javascript/);
    expect(response.text).toContain("renderButtonCard");
    expect(response.text).toContain("hydrateButtonCards");
    expect(response.text).toContain("token-button-card-control");
    expect(response.text).toContain("token-button-card-icon-circle");
    expect(response.text).toContain("supportedStates");
    expect(response.text).toContain("token-container-sample");
    expect(response.text).toContain("token-container-section-sample");
    expect(response.text).toContain("data-container-variant");
    expect(response.text).toContain("aria-pressed");
    expect(response.text).toContain("disabled aria-disabled");
    expect(response.text).toContain("token-paragraph-preview token-paragraph-label");
  });

  it("serves the shared list card render seam", async () => {
    const response = await request(createApp()).get("/design-system/assets/listCard.mjs").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/javascript/);
    expect(response.text).toContain("renderListCard");
    expect(response.text).toContain("hydrateListCards");
    expect(response.text).toContain("token-list-card-control");
    expect(response.text).toContain("data-token-list-card-state");
    expect(response.text).toContain("data-token-list-card-rtl");
    expect(response.text).toContain("disabled aria-disabled");
  });

  it("serves the colours token page with generated colour scale sections and display drawer controls", async () => {
    const response = await request(createApp()).get("/design-system/tokens/colours").set("host", "admin.example.test");
    const singularAlias = await request(createApp()).get("/design-system/token/colours").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Colours Token");
    expect(response.text).toContain('aria-label="Colours token navigation"');
    expect(response.text).toContain('id="accessibility-button"');
    expect(response.text).toContain('aria-controls="accessibility-drawer"');
    expect(response.text).toContain('id="accessibility-drawer"');
    expectCssJsSourceDrawer(response.text);
    expect(response.text).toContain('id="token-colour-primary-scale"');
    expect(response.text).toContain('id="token-colour-dark-scale"');
    expect(response.text).toContain('id="token-colour-text-scale"');
    expect(response.text).toContain('id="token-colour-error-scale"');
    expect(response.text).toContain('id="token-colour-warning-scale"');
    expect(response.text).toContain('id="token-colour-success-scale"');
    expect(response.text).toContain('id="token-colour-desert-scale"');
    expect(response.text).toContain("primary-tinted neutral ramp");
    expect(response.text).toContain("Text colours move from near-black to light grey");
    expect(response.text).toContain("Error colours use a red-tinted ramp");
    expect(response.text).toContain("Warning colours use an orange-tinted ramp");
    expect(response.text).toContain("Success colours use a green-tinted ramp");
    expect(response.text).toContain("Dark Colour Baseline");
    expect(response.text).toContain("Desert Colour Baseline");
    expect(response.text).toContain('data-token-colour-baseline="dark"');
    expect(response.text).toContain('data-token-colour-baseline="desert"');
    expect(response.text).toContain("/design-system/assets/tokenColours.mjs");

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Colours Token");
  });

  it("serves the page-shell-banner canonical launcher page with dedicated render links", async () => {
    const response = await request(createApp()).get("/design-system/canonicals/page-shell-banner").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("Page-Shell Banner Canonicals");
    expect(response.text).toContain(">Patterns<");
    expect(response.text).toContain(">Canonicals<");
    expect(response.text).toContain(">Page-Shell Banner<");
    expect(response.text).toContain("/design-system/canonical-renderings/page-shell-banner/PSBR-001");
    expect(response.text).not.toContain("/design-system/templates/page-shell?ref=PSBR-");
  });

  it("serves the Build work panel canonical launcher and generated render route", async () => {
    const launcher = await request(createApp()).get("/design-system/canonicals/build-work-panel").set("host", "admin.example.test");
    const render = await request(createApp())
      .get("/design-system/canonical-renderings/build-work-panel/BWP-R-002")
      .set("host", "admin.example.test");

    expect(launcher.status).toBe(200);
    expectShellTrio(launcher.text);
    expect(launcher.text).toContain("Build Work Panel Canonicals");
    expect(launcher.text).toContain("/design-system/canonical-renderings/build-work-panel/BWP-R-001");
    expect(launcher.text).toContain("/design-system/canonical-renderings/build-work-panel/BWP-R-020");

    expect(render.status).toBe(200);
    expectShellTrio(render.text);
    expect(render.text).toContain("data-build-work-panel-surface=\"canonical\"");
    expect(render.text).toContain("id=\"build-work-panel-preview-shell\"");
    expect(render.text).toContain("/design-system/assets/buildWorkPanelCanonical.mjs");
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
    expectDisplaySettingsDrawer(response.text);
    expect(response.text).not.toContain(">Catalog<");
    expect(response.text).not.toContain(">Filters<");
    expect(response.text).not.toContain(">Access<");
    expect(response.text).toContain("All Canonical Reference States");
    expect(response.text).toContain("canonical-launcher-button-priority");
    expect(response.text).toContain("TRP-001");
    expect(response.text).toContain("/design-system/canonical-renderings/top-nav/TRP-001");
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
    expect(response.text).toContain("/design-system/canonical-renderings/time-picker/TPR-006");
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
    expect(response.text).toContain("/design-system/canonical-renderings/date-picker/DTPR-007");
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
    expect(response.text).toContain("href=\"/design-system/canonical-renderings/date-picker\"");
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
    expect(response.text).toContain("/design-system/canonicals/top-nav");
    expect(response.text).toContain("/design-system/canonical-renderings/async-activity-drawer");
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
    expect(response.text).toContain("brochure-media-band");
    expect(response.text).toContain("brochure-mosaic-copy");
    expect(response.text).toContain("data-brochure-color=\"background\"");
    expect(response.text).toContain("data-brochure-color=\"font\"");
    expect(response.text).toContain("data-brochure-editable-toggle");
    expect(response.text).toContain("brochure-edit-drawer");
    expect(response.text).toContain("data-brochure-edit-target");
    expect(response.text).not.toContain("INTERNAL_ERROR");
  });

  it("serves the list page pattern demo route", async () => {
    const response = await request(createApp()).get("/design-system/patterns/listPagePattern").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expectShellTrio(response.text);
    expect(response.text).toContain("List Page Pattern");
    expect(response.text).toContain("data-list-page-pattern-demo");
    expect(response.text).toContain("list-page-pattern-header-grid");
    expect(response.text).toContain("data-page-header-span=\"3-5\"");
    expect(response.text).toContain("data-page-header-span=\"6-8\"");
    expect(response.text).toContain("data-form-select");
    expect(response.text).toContain("token-filter-panel-structure-panel");
    expect(response.text).toContain("token-container-section-fill");
    expect(response.text).toContain("data-token-filter-card-mount");
    expect(response.text).toContain("data-token-list-card-mount");
    expect(response.text).not.toContain("<span>01</span>");
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
    expectDisplaySettingsDrawer(launcher.text);
    expect(launcher.text).not.toContain(">Catalog<");
    expect(launcher.text).not.toContain(">Filters<");
    expect(launcher.text).not.toContain(">Access<");
    expect(launcher.text).toContain("CNR-002");
    expect(launcher.text).toContain("/design-system/components/context-nav?width=1120&height=620&stack=tall");
  });

  it("frames sub-nav and context-nav canonical launchers under their governed sections", async () => {
    const subNav = await request(createApp()).get("/design-system/canonicals/sub-nav").set("host", "admin.example.test");
    const contextNav = await request(createApp()).get("/design-system/canonicals/context-nav").set("host", "admin.example.test");

    expect(subNav.status).toBe(200);
    expect(subNav.text).toContain("href=\"/design-system/components\"");
    expect(subNav.text).toContain(">Components<");
    expect(subNav.text).toContain(">Sub Nav<");
    expect(subNav.text).not.toContain("href=\"/design-system/canonicals\">Canonicals<");

    expect(contextNav.status).toBe(200);
    expect(contextNav.text).toContain("href=\"/design-system/patterns\"");
    expect(contextNav.text).toContain(">Patterns<");
    expect(contextNav.text).toContain(">Context Nav<");
    expect(contextNav.text).not.toContain("href=\"/design-system/canonicals\">Canonicals<");
  });
});
