import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("design system header layering", () => {
  it("keeps the top-nav profile menu above the secondary breadcrumb and search row", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/styles.css"),
      "utf8",
    );

    expect(styles).toContain(".top-nav {\n  position: relative;\n  z-index: 6;");
    expect(styles).toContain(".sub-nav {\n  position: relative;\n  z-index: 4;");
    expect(styles).toContain(".profile-menu");
    expect(styles).toContain(".breadcrumb-collapse-menu");
  });
});
