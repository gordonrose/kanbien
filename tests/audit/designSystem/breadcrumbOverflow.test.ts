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
    expect(markup).toContain('id="breadcrumb-collapsed-item"');
    expect(markup).toContain('id="breadcrumb-compact-button"');
    expect(markup).toContain('id="breadcrumb-compact-menu"');
    expect(script).toContain("const availableWidth = breadcrumbContainer?.clientWidth ?? breadcrumbList.clientWidth;");
    expect(script).toContain("setBreadcrumbItemHidden(breadcrumbPageMinusOneItem, true);");
    expect(script).toContain("setBreadcrumbItemHidden(breadcrumbCollapsedItem, true);");
    expect(script).toContain("breadcrumbList.classList.add(\"hidden\");");
    expect(script).toContain("breadcrumbCompact?.classList.remove(\"hidden\");");
    expect(script).toContain("function setBreadcrumbCompactMenuOpen(open)");
    expect(script).toContain("updateBreadcrumbOverflow();");
    expect(script).toContain("headerObserver.observe(breadcrumbNav);");
    expect(styles).toContain(".breadcrumb-nav {\n  grid-column: 1;\n  min-width: 0;\n  overflow: visible;");
    expect(styles).toContain(".breadcrumb-list {\n  display: flex;");
    expect(styles).toContain("overflow: visible;");
    expect(styles).toContain("white-space: nowrap;");
    expect(styles).toContain(".breadcrumb-compact-button {");
  });
});
