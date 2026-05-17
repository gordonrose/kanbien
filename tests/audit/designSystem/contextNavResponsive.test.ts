import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("design system context nav responsiveness", () => {
  it("uses a right-side icon rail on desktop and a bottom nav with labels plus a kebab overflow on tablet/mobile", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/styles.css"),
      "utf8",
    );
    const shellMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/index.html"),
      "utf8",
    );
    const markup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/components/context-nav.html"),
      "utf8",
    );
    const script = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/app.mjs"),
      "utf8",
    );

    expect(markup).toContain('class="context-nav"');
    expect(shellMarkup).toContain('id="primary-nav-overflow-button"');
    expect(markup).toContain('href="/design-system" aria-current="page">Overview</a>');
    expect(markup).toContain("context-nav-label");
    expect(markup).toContain('id="context-nav-more-button"');
    expect(markup).toContain('id="context-nav-more-menu"');
    expect(markup).toContain('id="filter-panel-button"');
    expect(script).toContain('id="context-nav-more-filter"');
    expect(markup).toContain('id="filter-options-panel"');
    expect(markup).toContain('id="filter-options-search"');
    expect(styles).toContain(".context-nav {\n  position: fixed;");
    expect(styles).toContain("top: var(--context-nav-top, 8rem);");
    expect(styles).toContain("left: 0;");
    expect(styles).toContain("bottom: 0;");
    expect(styles).toContain("display: flex;");
    expect(styles).toContain("flex-direction: column;");
    expect(styles).toContain(".top-nav {\n  position: relative;\n  z-index: 6;\n  width: 100%;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;");
    expect(styles).toContain(".brand-mark {\n  display: grid;\n  flex: 0 0 3rem;");
    expect(styles).toContain("aspect-ratio: 1 / 1;");
    expect(styles).toContain(".nav-link {\n  display: block;\n  flex: 0 0 auto;");
    expect(styles).toContain("white-space: nowrap;");
    expect(styles).toContain(".profile-button {\n  display: inline-flex;\n  flex: 0 0 auto;");
    expect(styles).toContain(".top-nav.force-mobile-nav .primary-nav {\n  display: none;");
    expect(styles).toContain(".primary-nav-overflow-menu {");
    expect(styles).toContain("@media (max-width: 61.25rem) {");
    expect(styles).toContain(".context-nav {\n    display: grid;");
    expect(styles).toContain("grid-template-columns: repeat(5, minmax(0, 1fr));");
    expect(styles).toContain("width: auto;");
    expect(styles).toContain(".context-nav-mobile-overflow-target {\n    display: none;");
    expect(styles).toContain(".context-nav-more {\n    display: block;");
    expect(styles).toContain(".context-nav-bottom-group {\n  display: flex;");
    expect(styles).toContain(".side-panel-secondary {");
    expect(styles).toContain(".context-nav-item::before");
    expect(styles).toContain(".context-nav-item::after");
    expect(styles).toContain("--tooltip-bg: rgba(22, 27, 38, 0.96);");
    expect(styles).toContain(".context-nav-label {\n    display: block;");
    expect(script).toContain("function updateContextNavOffset()");
    expect(script).toContain("function normalizePreviewState(rawState = {})");
    expect(script).toContain("function getTopNavPreviewStateFromUrl()");
    expect(script).toContain("function syncTopNavPreviewUrl()");
    expect(script).toContain("params.get(\"width\")");
    expect(script).toContain("params.get(\"fixture\")");
    expect(script).toContain("params.get(\"open\")");
    expect(script).toContain("params.get(\"theme\")");
    expect(script).toContain("params.get(\"dir\")");
    expect(script).toContain("params.get(\"zoom\")");
    expect(script).toContain("params.get(\"accent\")");
    expect(script).toContain("window.history.replaceState(null, \"\", nextUrl);");
    expect(script).toContain("function getVisiblePrimaryNavLinks()");
    expect(script).toContain("function primaryNavFits()");
    expect(script).toContain("function primaryNavOverlapsUtilities()");
    expect(script).toContain("function primaryNavOverflowOverlapsVisibleLinks()");
    expect(script).toContain("function updatePrimaryNavOverflow()");
    expect(script).toContain("function renderPrimaryNavOverflowMenu(links)");
    expect(script).toContain("while (");
    expect(script).toContain("getVisiblePrimaryNavLinks().length > 2");
    expect(script).toContain("horizontalRectsOverlap(link.getBoundingClientRect(), navUtilitiesRect)");
    expect(script).toContain("horizontalRectsOverlap(overflowRect, navUtilitiesRect)");
    expect(script).toContain("primaryNavFits()\n    && !primaryNavOverlapsUtilities()");
    expect(script).toContain("!primaryNavFits()\n      || primaryNavOverlapsUtilities()\n      || primaryNavOverflowOverlapsVisibleLinks()");
    expect(script).toContain("renderPrimaryNavOverflowMenu(primaryNavLinks.filter((link) => link.classList.contains(\"hidden\")))");
    expect(script).toContain("applyMagnification(button.dataset.magnificationOption ?? \"0\")");
    expect(script).toContain("updatePrimaryNavOverflow();");
    expect(script).toContain("applyTopNavPreviewOpenState(activeTopNavPreviewOpenState);");
    expect(script).toContain("function setContextNavMoreOpen(open)");
    expect(script).toContain("function setFilterPanelOpen(open)");
    expect(script).toContain("function setFilterOptionsPanelOpen(open)");
    expect(script).toContain("function renderFilterOptions(category, query = \"\")");
    expect(script).toContain("getBoundingClientRect().bottom");
  });
});
