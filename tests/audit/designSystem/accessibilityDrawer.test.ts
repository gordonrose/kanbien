import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("design system accessibility drawer", () => {
  it("defines an accessibility control surface that applies theme, magnification, accent, direction, and sibling filter panels", () => {
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

    expect(markup).toContain('id="accessibility-button"');
    expect(markup).toContain('id="accessibility-drawer"');
    expect(markup).toContain('id="filter-panel"');
    expect(markup).toContain('data-filter-target="status"');
    expect(markup).toContain('id="filter-options-list"');
    expect(markup).toContain("data-theme-option");
    expect(markup).toContain("data-magnification-option");
    expect(markup).toContain("data-accent=");
    expect(markup).toContain("color-swatch-fill-svg");
    expect(markup).toContain("data-direction-option");
    expect(markup).toContain("chip-row-single-line");
    expect(markup).toContain("Access");
    expect(script).toContain("function applyTheme(theme)");
    expect(script).toContain("function applyMagnification(value)");
    expect(script).toContain("function applyAccent(hex)");
    expect(script).toContain("function applyDirection(direction)");
    expect(script).toContain("function updateBreadcrumbOverflow()");
    expect(script).toContain("function setFilterPanelOpen(open)");
    expect(script).toContain("function renderFilterOptions(category, query = \"\")");
    expect(styles).toContain("html[data-theme=\"dark\"]");
    expect(styles).toContain("html[data-theme=\"desert\"]");
    expect(styles).toContain("--ui-scale");
    expect(styles).toContain("input {\n  font: inherit;\n}");
    expect(styles).toContain("html[dir=\"rtl\"] .context-nav");
    expect(styles).toContain("html[dir=\"rtl\"] .top-nav {\n  direction: rtl;");
    expect(styles).toContain("html[dir=\"rtl\"] .sub-nav {\n  direction: rtl;");
    expect(styles).toContain("html[dir=\"rtl\"] .brand-lockup {\n  grid-column: auto;");
    expect(styles).toContain("flex-direction: row-reverse;");
    expect(styles).toContain("html[dir=\"rtl\"] .search-shell {\n  grid-column: auto;");
    expect(styles).toContain(".sub-nav {\n  position: relative;\n  z-index: 4;\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 40rem) minmax(0, 1fr);");
    expect(styles).toContain(".search-shell {\n  grid-column: 2;");
    expect(styles).toContain("max-width: 40rem;");
    expect(styles).toContain(".color-swatch-fill-svg");
    expect(styles).toContain(".color-swatch");
    expect(styles).toContain(".side-panel {");
    expect(styles).toContain(".filter-menu-item,");
  });
});
