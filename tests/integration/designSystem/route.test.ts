import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app";

function expectShellTrio(html: string) {
  expect(html).toContain("class=\"top-nav");
  expect(html).toContain("class=\"sub-nav");
  expect(html).toContain("class=\"context-nav");
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
    expect(response.text).not.toContain("font-main-extra-large");
    expect(response.text).toContain("entity-drawers");
    expect(response.text).toContain("list-page-structure");
    expect(response.text).toContain("list-page-record-structure");
    expect(response.text).toContain("entity-page-structure");
    expect(response.text).toContain("/design-system/tokens/background");
    expect(response.text).toContain("/design-system/tokens/colours");
    expect(response.text).toContain("/design-system/tokens/list-page-structure");
    expect(response.text).toContain("/design-system/tokens/entity-page-structure");
    expect(response.text).toContain("colours");
    expect(response.text).toContain(">Canonical Renderings<");
    expect(response.text).toContain(">Canonicals<");
  });

  it("requires the CSS/JS source drawer on governed token detail pages", async () => {
    const routes = [
      "/design-system/tokens/background",
      "/design-system/tokens/colours",
      "/design-system/tokens/paragraph",
      "/design-system/tokens/list-page-structure",
      "/design-system/tokens/entity-page-structure",
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
    expect(response.text).toContain("Main Extra Large");
    expect(response.text).toContain("Main Minor");
    expect(response.text).toContain("<code>1rem</code>");
    expect(response.text).toContain("<code>1.25rem</code>");
    expect(response.text).toContain("<code>1.5rem</code>");
    expect(response.text).toContain("<code>0.75rem</code>");
    expect(response.text).toContain("<code>1.2</code>");
    expect(response.text).toContain("<code>600</code>");
    expect(response.text).toContain("<code>800</code>");
    expect(response.text).toContain("<code>uppercase</code>");
    expect(response.text).toContain("computed as 1.2em");
    expect(response.text).toContain("var(--paragraph-main-ink)");
    expect(response.text).toContain("var(--paragraph-label-ink)");
    expect(response.text).toContain("var(--colour-text-20)");
    expect(response.text).toContain("var(--colour-primary-100)");
    expect(response.text).toContain("var(--colour-dark-100)");
    expect(response.text).toContain("var(--colour-desert-100)");
    expect(response.text).toContain('aria-label="Main theme previews"');
    expect(response.text).toContain('aria-label="Main Large theme previews"');
    expect(response.text).toContain('aria-label="Main Extra Large theme previews"');
    expect(response.text).toContain('aria-label="Main Minor theme previews"');
    expect(response.text).toContain('aria-label="Label theme previews"');
    expect(response.text).toContain('data-theme-scope="dark"');
    expect(response.text).toContain('data-theme-scope="desert"');
    expect(response.text).toContain("paragraph.mainExtraLarge");
    expect(response.text).toContain(">Canonical Renderings<");
    expect(response.text).toContain(">Canonicals<");

    expect(singularAlias.status).toBe(200);
    expect(singularAlias.text).toContain("Paragraph Token");
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
    expect(response.text).toContain('data-entity-page-structure-canvas');
    expect(response.text).toContain('data-entity-page-structure-resize-handle');
    expect(response.text).toContain('aria-label="Navigation index columns"');
    expect(response.text).toContain('aria-label="Record panel columns"');
    expect(response.text).toContain('aria-label="Record panel header columns"');
    expect(response.text).toContain('aria-label="Record panel body columns"');
    expect(response.text).toContain('aria-label="Panel index columns"');
    expect(response.text).toContain('aria-label="Panel content columns"');
    expect(response.text).toContain('data-entity-page-structure-panel-resize-handle');
    expect(response.text).not.toContain('data-list-page-structure-subheader');
    expect(response.text).not.toContain("Secondary Header Columns");
    expectCssJsSourceDrawer(response.text);
  });

  it("serves the shared foundation structure controller seam", async () => {
    const response = await request(createApp()).get("/design-system/assets/foundationStructure.mjs").set("host", "admin.example.test");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/javascript/);
    expect(response.text).toContain("createStructureHeaderController");
    expect(response.text).toContain("createEntityPageStructureController");
    expect(response.text).toContain("data-structure-header-toggle");
    expect(response.text).toContain("structureVisible");
    expect(response.text).toContain("entityPageStructureIndexSize");
    expect(response.text).toContain("entityPageStructurePanelIndexSize");
    expect(response.text).toContain("entityPageStructureMobileLayer");
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
    expect(response.text).not.toContain(">Display<");
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
