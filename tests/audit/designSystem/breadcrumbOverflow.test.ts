import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("design system breadcrumb overflow", () => {
  it("prevents breadcrumb labels from wrapping, measures against the breadcrumb container, and falls back to a compact signpost menu when space stays too tight", () => {
    const markup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/index.html"),
      "utf8",
    );
    const script = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/app.mjs"),
      "utf8",
    );
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/styles.css"),
      "utf8",
    );

    expect(markup).toContain('id="breadcrumb-page-minus-one-item"');
    expect(markup).toContain('id="breadcrumb-home-link"');
    expect(markup).toContain('id="breadcrumb-collapsed-item"');
    expect(markup).toContain('id="breadcrumb-page-minus-one-link"');
    expect(markup).toContain('id="breadcrumb-compact-button"');
    expect(markup).toContain('id="breadcrumb-compact-menu"');
    expect(script).toContain("const designSystemBreadcrumbChains = new Map([");
    expect(script).toContain("const designSystemPrimaryNavItems = [");
    expect(script).toContain('{ href: "/design-system/canonical-renderings", label: "Canonical Renderings" }');
    expect(script).toContain('["/design-system/components/top-nav", [');
    expect(script).toContain('{ href: "/design-system/components", label: "Home" },');
    expect(script).toContain('["/design-system/canonicals/top-nav", [');
    expect(script).toContain('["/design-system/exploration/context-nav", [');
    expect(script).toContain('["/design-system/templates", [');
    expect(script).toContain('{ href: "/design-system/templates", label: "Home" },');
    expect(script).toContain("function resolveBreadcrumbChain(pathname)");
    expect(script).toContain("function buildBreadcrumbMarkup(chain)");
    expect(script).toContain("function normalizePrimaryNav(root = document)");
    expect(script).toContain("function resolvePrimaryNavHomeHref(pathname)");
    expect(script).toContain("const isSingleItem = chain.length === 1;");
    expect(script).toContain("const collapsedItems = chain.length >= 4 ? chain.slice(1, -2) : [];");
    expect(script).toContain("const pageMinusOne = chain.length >= 3 ? chain[chain.length - 2] : null;");
    expect(script).toContain('id="breadcrumb-current-label"');
    expect(script).toContain("normalizeDesignSystemShellBeforeBinding()");
    expect(script).not.toContain("Previous Page A");
    expect(script).not.toContain("Previous Page B");
    expect(script).not.toContain('href="/design-system/library"');
    expect(script).not.toContain('href="/design-system/components/navigation"');
    expect(script).toContain("function setBreadcrumbCompactMenuOpen(open)");
    expect(script).toContain("function syncOverflowTooltip(node)");
    expect(script).toContain("function ensureBreadcrumbLabel(node)");
    expect(script).toContain("label.className = \"breadcrumb-label\";");
    expect(script).toContain("function updateBreadcrumbOverflowTooltips()");
    expect(script).toContain("function setBreadcrumbButtonLabel(node, label)");
    expect(script).toContain("function isBreadcrumbNodeTruncated(node)");
    expect(script).toContain("function syncBreadcrumbCompactLayout(compact)");
    expect(script).toContain("function applyResponsiveBreadcrumbPriority({");
    expect(script).toContain("node.classList.add(\"tooltip-anchor\");");
    expect(script).toContain("const isHomeNode = node === breadcrumbHomeLink || node === subNavPreviewHomeLink;");
    expect(script).toContain("const isSubNavPreviewNode = Boolean(node.closest(\"#sub-nav-preview-shell\"));");
    expect(script).toContain("subNavSurfaceMode === \"canonical\"");
    expect(script).toContain("subNavPreviewShell?.dataset.renderStatus !== \"ready\"");
    expect(script.indexOf('subNavPreviewShell.dataset.renderStatus = "ready";')).toBeLessThan(
      script.indexOf("applyResponsiveBreadcrumbPriority({"),
    );
    expect(script).toContain("node.classList.toggle(\"breadcrumb-home-icon-only\", isTruncated);");
    expect(script).toContain("const labelNode = ensureBreadcrumbLabel(node);");
    expect(script).toContain("const forceCanonicalTooltip =");
    expect(script).toContain("subNavPreviewShell?.dataset.breadcrumbCanonicalMode === \"button-truncation\"");
    expect(script).toContain("const parentItem = node.closest(\"li\");");
    expect(script).toContain("measurementNode.scrollWidth > measurementNode.clientWidth + 1");
    expect(script).toContain("parentItem instanceof HTMLElement && parentItem.scrollWidth > parentItem.clientWidth + 1");
    expect(script).toContain("const availableWidth = container?.clientWidth ?? list.clientWidth;");
    expect(script).toContain("const allowPageMinusOne = Boolean(breadcrumbPageMinusOneLink?.textContent?.trim());");
    expect(script).toContain("const allowCollapsed = Boolean(breadcrumbCollapseMenu?.children.length);");
    expect(script).toContain("compact?.classList.add(\"hidden\");");
    expect(script).toContain("list.classList.remove(\"hidden\");");
    expect(script).toContain("updateBreadcrumbOverflow();");
    expect(script).toContain("updateBreadcrumbOverflowTooltips();");
    expect(script).toContain("breadcrumbPageMinusOneLink.dataset.shortLabel = preserveCanonicalBreadcrumbLabel");
    expect(script).toContain(": \"Previous\";");
    expect(script).toContain("setBreadcrumbButtonLabel(pageMinusOneLink, shortPageMinusOneLabel);");
    expect(script).toContain("setBreadcrumbItemHidden(collapsedItem, true);");
    expect(script).toContain("setBreadcrumbItemHidden(pageMinusOneItem, true);");
    expect(
      script.indexOf("setBreadcrumbItemHidden(pageMinusOneItem, true);"),
    ).toBeLessThan(script.indexOf("setBreadcrumbItemHidden(collapsedItem, true);"));
    expect(script).toContain("list.classList.add(\"hidden\");");
    expect(script).toContain("compact?.classList.remove(\"hidden\");");
    expect(script).toContain("headerObserver.observe(breadcrumbNav);");
    expect(styles).toContain(".breadcrumb-nav {\n  position: relative;\n  z-index: 5;\n  grid-column: 1;\n  min-width: 0;\n  overflow: visible;");
    expect(styles).toContain(".sub-nav.sub-nav-compact-layout {\n  grid-template-columns: auto minmax(0, 1fr);");
    expect(styles).toContain(".breadcrumb-list {\n  display: flex;");
    expect(styles).toContain("max-width: 100%;");
    expect(styles).toContain(".breadcrumb-list > li {\n  min-width: 0;\n  flex: 0 1 auto;");
    expect(styles).toContain(".breadcrumb-link,\n.breadcrumb-button,\n.breadcrumb-current {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;");
    expect(styles).toContain(".breadcrumb-label {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;");
    expect(styles).toContain(".sub-nav-preview-shell[data-breadcrumb-canonical-mode=\"button-truncation\"] #sub-nav-preview-page-minus-one-link,\n.sub-nav-preview-shell[data-breadcrumb-canonical-mode=\"button-truncation\"] #sub-nav-preview-current-label {\n  width: 11rem;\n  max-width: 11rem;\n}");
    expect(styles).toContain("html[dir=\"rtl\"] .sub-nav-preview-shell[data-breadcrumb-canonical-mode=\"button-truncation\"] #sub-nav-preview-page-minus-one-link,\nhtml[dir=\"rtl\"] .sub-nav-preview-shell[data-breadcrumb-canonical-mode=\"button-truncation\"] #sub-nav-preview-current-label {\n  width: 12rem;\n  max-width: 12rem;\n}");
    expect(styles).toContain("--tooltip-layer: 2147483000;");
    expect(styles).toContain(".shared-floating-tooltip {\n  position: fixed;\n  z-index: var(--tooltip-layer);");
    expect(styles).toContain(".breadcrumb-button.breadcrumb-home-icon-only {");
    expect(styles).toContain("background-image: url(\"data:image/svg+xml,");
    expect(styles).toContain(".tooltip-anchor[data-tooltip]::before,\n.tooltip-anchor[data-tooltip]::after,\n.context-nav-item[data-tooltip]::before,\n.context-nav-item[data-tooltip]::after {\n  content: \"\";\n  display: none;\n}");
    expect(script).toContain("function hideSharedTooltip()");
    expect(script).toContain("function positionSharedTooltip(target)");
    expect(script).toContain("const isBreadcrumbTooltip =");
    expect(script).toContain("const isContextNavTooltip = target.classList.contains(\"context-nav-item\");");
    expect(script).toContain("tooltip.dataset.placement = \"below\";");
    expect(script).toContain("tooltip.dataset.placement = direction === \"rtl\" ? \"left\" : \"right\";");
    expect(styles).toContain("html[dir=\"rtl\"] .breadcrumb-nav {\n  grid-column: auto;\n  grid-row: auto;\n  justify-self: stretch;\n  width: 100%;\n}");
    expect(styles).toContain("html[dir=\"rtl\"] .sub-nav.sub-nav-compact-layout {\n  grid-template-columns: auto minmax(0, 1fr);\n}");
    expect(styles).toContain("html[dir=\"rtl\"] .sub-nav.sub-nav-compact-layout .breadcrumb-nav {\n  grid-column: 1;\n  grid-row: 1;\n}");
    expect(styles).toContain("html[dir=\"rtl\"] .sub-nav.sub-nav-compact-layout .search-shell {\n  grid-column: 2;\n  grid-row: 1;\n}");
    expect(styles).toContain("html[dir=\"rtl\"] #breadcrumb-page-minus-one-item,\nhtml[dir=\"rtl\"] #sub-nav-preview-page-minus-one-item {\n  order: 5;\n}");
    expect(styles).toContain("html[dir=\"rtl\"] #breadcrumb-collapsed-item,\nhtml[dir=\"rtl\"] #sub-nav-preview-collapsed-item {\n  order: 3;\n}");
    expect(styles).toContain("html[dir=\"rtl\"] .breadcrumb-collapse-menu {\n  left: auto;\n  right: 0;\n  text-align: right;");
    expect(styles).toContain("html[dir=\"rtl\"] .breadcrumb-collapse-menu .menu-item {\n  text-align: right;\n}");
    expect(styles).toContain("html[dir=\"rtl\"] .breadcrumb-compact-icon svg {\n  transform: scaleX(-1);\n  transform-origin: center;\n}");
    expect(styles).toContain("overflow: visible;");
    expect(styles).toContain("white-space: nowrap;");
    expect(styles).toContain(".search-shell {\n  grid-column: 2;\n  position: relative;\n  z-index: 1;");
    expect(styles).toContain(".breadcrumb-compact-button {");
  });

  it("keeps representative static html breadcrumbs aligned with the governed hierarchy before hydration", () => {
    const script = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/app.mjs"),
      "utf8",
    );
    const overviewMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/index.html"),
      "utf8",
    );
    const templatesMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/templates/index.html"),
      "utf8",
    );
    const componentMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/components/top-nav.html"),
      "utf8",
    );
    const explorationMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/exploration/top-nav/index.html"),
      "utf8",
    );
    const canonicalMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/canonicals/top-nav/index.html"),
      "utf8",
    );

    expect(overviewMarkup).not.toContain("Previous Page A");
    expect(overviewMarkup).not.toContain("Previous Page B");
    expect(overviewMarkup).not.toContain("Page -1");
    expect(overviewMarkup).toContain('id="breadcrumb-current-label"');
    expect(overviewMarkup).toContain('id="breadcrumb-current-item" class="hidden"');
    expect(overviewMarkup).toContain(">Home</span>");
    expect(script).toContain('["/design-system/components", [');
    expect(script).toContain('["/design-system/patterns", [');
    expect(script).toContain('["/design-system/templates", [');

    expect(templatesMarkup).toContain('href="/design-system/templates">Home<');
    expect(templatesMarkup).not.toContain('href="/design-system/templates">Pages<');
    expect(templatesMarkup).toContain('id="breadcrumb-current-item" class="hidden"');

    expect(componentMarkup).toContain('href="/design-system/components">Home<');
    expect(componentMarkup).toContain('href="/design-system/canonicals/top-nav">Top Nav Canonicals<');

    expect(explorationMarkup).toContain('href="/design-system/components/top-nav">Top Nav<');
    expect(explorationMarkup).toContain(">Exploration<");

    expect(canonicalMarkup).toContain('href="/design-system/components">Home<');
    expect(canonicalMarkup).toContain('href="/design-system/components/top-nav">Top Nav<');
    expect(canonicalMarkup).toContain(">Canonicals<");
    expect(templatesMarkup).toContain('id="breadcrumb-collapsed-item" class="breadcrumb-collapsed hidden"');
    expect(templatesMarkup).toContain('id="breadcrumb-page-minus-one-item" class="hidden"');
  });
});
