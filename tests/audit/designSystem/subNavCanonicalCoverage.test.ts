import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("design system sub-nav canonical coverage", () => {
  it("adds a deterministic sub-nav preview route and canonical launcher for row, breadcrumb, and search-shell states", () => {
    const previewMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/components/sub-nav.html"),
      "utf8",
    );
    const explorationMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/exploration/sub-nav/index.html"),
      "utf8",
    );
    const canonicalMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/canonicals/sub-nav/index.html"),
      "utf8",
    );
    const canonicalIndex = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/canonicals/index.html"),
      "utf8",
    );
    const script = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/app.mjs"),
      "utf8",
    );

    expect(previewMarkup).toContain('id="sub-nav-preview-frame"');
    expect(previewMarkup).toContain('id="sub-nav-preview-search-input"');
    expect(previewMarkup).toContain('id="sub-nav-preview-breadcrumb-list"');
    expect(previewMarkup).toContain('id="sub-nav-preview-breadcrumb-collapse-button"');
    expect(previewMarkup).toContain('id="sub-nav-preview-breadcrumb-collapse-menu"');
    expect(previewMarkup).toContain('data-sub-nav-surface="canonical"');
    expect(previewMarkup).toContain('data-render-status="settling"');
    expect(previewMarkup).toContain('data-canonical-state="pending"');
    expect(previewMarkup).toContain('id="sub-nav-canonical-match-list"');
    expect(previewMarkup).toContain('id="sub-nav-canonical-circumstances"');
    expect(previewMarkup).toContain('id="sub-nav-canonical-current"');
    expect(previewMarkup).toContain('id="sub-nav-canonical-prev"');
    expect(previewMarkup).toContain('id="sub-nav-canonical-next"');
    expect(explorationMarkup).toContain('data-sub-nav-surface="exploration"');
    expect(explorationMarkup).toContain('id="sub-nav-preview-controls-title"');
    expect(explorationMarkup).toContain('data-sub-nav-width-preset="1560"');
    expect(explorationMarkup).toContain('data-sub-nav-state="compact"');
    expect(explorationMarkup).toContain('data-sub-nav-search-state="active"');
    expect(explorationMarkup).toContain('data-sub-nav-locale="rtl"');
    expect(explorationMarkup).toContain('data-accent="#635bff"');
    expect(canonicalMarkup).toContain("/design-system/components/sub-nav?");
    expect(canonicalMarkup).toContain("/design-system/exploration/sub-nav");
    expect(canonicalMarkup).toContain("&ref=SNR-001");
    expect(canonicalMarkup).toContain("SNR-001");
    expect(canonicalMarkup).toContain("SNR-008");
    expect(canonicalMarkup).toContain("BCR-005");
    expect(canonicalMarkup).toContain("BCR-010");
    expect(canonicalMarkup).toContain("BCR-011");
    expect(canonicalMarkup).toContain("BCR-012");
    expect(canonicalMarkup).toContain("locale=long-latin-truncation");
    expect(canonicalMarkup).toContain("locale=rtl-long-truncation");
    expect(canonicalMarkup).toContain("SSR-010");
    expect(canonicalMarkup).toContain("SSR-012");
    expect(canonicalIndex).toContain('href="/design-system/canonicals/sub-nav"');
    expect(script).toContain("function normalizeSubNavPreviewState(rawState = {})");
    expect(script).toContain("function getSubNavPreviewStateFromUrl()");
    expect(script).toContain("function syncSubNavPreviewUrl(state)");
    expect(script).toContain("function applySubNavPreviewState(state)");
    expect(script).toContain("function getCurrentSubNavPreviewState(overrides = {})");
    expect(script).toContain('const subNavSurfaceMode = document.body.dataset.subNavSurface ?? "exploration";');
    expect(script).toContain("const subNavCanonicalReferenceStates = [");
    expect(script).toContain('const validSubNavLocales = new Set(["standard", "long-latin", "long-latin-truncation", "rtl", "rtl-long", "rtl-long-truncation", "cjk", "symbols"]);');
    expect(script).toContain('ref: "SNR-008"');
    expect(script).toContain('ref: "BCR-010"');
    expect(script).toContain('ref: "BCR-011"');
    expect(script).toContain('ref: "BCR-012"');
    expect(script).toContain('ref: "SSR-012"');
    expect(script).toContain('subNavPreviewShell.dataset.breadcrumbCanonicalMode =');
    expect(script).toContain("function getSubNavCanonicalReferenceByRef(ref)");
    expect(script).toContain("function getLegacySubNavCanonicalReference(params)");
    expect(script).toContain("function getSubNavCanonicalMatches(state)");
    expect(script).toContain("function getRequestedSubNavCanonicalRef()");
    expect(script).toContain("function buildSubNavCanonicalHref(reference, accent = subNavPreviewDefaults.accent)");
    expect(script).toContain("function syncCanonicalRenderUrl(reference, accent = subNavPreviewDefaults.accent)");
    expect(script).toContain("function updateSubNavCanonicalStepper(state, matches)");
    expect(script).toContain("--canonical-render-layout-width");
    expect(script).toContain("function getSharedTooltipElement()");
    expect(script).toContain("function positionSharedTooltip(target)");
    expect(script).toContain("function getTooltipTargetFromEvent(event)");
    expect(script).toContain("function wireSharedTooltipSystem()");
    expect(script).toContain("wireSharedTooltipSystem();");
    expect(script).toContain("function describeSubNavCanonicalCircumstances(state, matches)");
    expect(script).toContain("let subNavPreviewRenderPass = 0;");
    expect(script).toContain("function syncSubNavPreviewRowLayout(state)");
    expect(script).toContain("pageMinusOneShort");
    expect(script).toContain("applyResponsiveBreadcrumbPriority({");
    expect(script).toContain("if (renderPass !== subNavPreviewRenderPass)");
    expect(script).toContain('document.body.dataset.renderStatus = "ready";');
    expect(script).toContain('subNavPreviewShell.dataset.renderStatus = "ready";');
    expect(script).toContain("function setSubNavPreviewBreadcrumbMenuOpen(open)");
    expect(script).toContain("function setSubNavPreviewBreadcrumbCompactMenuOpen(open)");
    expect(script).toContain("subNavPreviewBreadcrumbCollapseButton?.addEventListener(\"click\"");
    expect(script).toContain('subNavPreviewShell.classList.toggle("sub-nav-preview-mobile", normalizedState.state === "mobile")');
    expect(script).toContain('subNavPreviewSearchInput.placeholder = locale.placeholder;');
  });
});
