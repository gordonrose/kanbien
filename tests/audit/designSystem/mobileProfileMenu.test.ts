import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("design system mobile profile menu", () => {
  it("supports an expandable profile subnav inside the mobile navigation", () => {
    const markup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/index.html"),
      "utf8",
    );
    const script = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/app.mjs"),
      "utf8",
    );

    expect(markup).toContain('id="mobile-profile-button"');
    expect(markup).toContain('id="mobile-profile-menu"');
    expect(markup).toContain("mobile-subnav-link");
    expect(script).toContain("function setMobileProfileOpen(open)");
    expect(script).toContain("isMobileProfileOpen()");
  });
});
