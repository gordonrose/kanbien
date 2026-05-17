import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("design system search shell enter hint", () => {
  it("shows an in-field enter hint without giving up the bounded search-shell layout", () => {
    const markup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/index.html"),
      "utf8",
    );
    const previewMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/components/top-nav.html"),
      "utf8",
    );
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/styles.css"),
      "utf8",
    );

    expect(markup).toContain('class="search-shell-field"');
    expect(markup).toContain('class="search-submit-hint"');
    expect(markup).toContain("Press");
    expect(markup).toContain("Enter");
    expect(previewMarkup).toContain('class="search-shell-field"');
    expect(styles).toContain(".search-shell-field {");
    expect(styles).toContain("padding: 0.7rem 8rem 0.7rem 0.85rem;");
    expect(styles).toContain(".search-submit-hint {");
    expect(styles).toContain(".search-submit-hint-key {");
    expect(styles).toContain(".search-shell:focus-within .search-submit-hint {");
    expect(styles).toContain(".search-submit-hint {\n    display: none;");
  });
});
