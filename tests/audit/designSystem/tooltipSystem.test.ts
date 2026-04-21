import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("design system tooltip system", () => {
  it("uses the shared tokenized tooltip treatment instead of browser-default title tooltips on governed preview surfaces", () => {
    const markup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/components/top-nav.html"),
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

    expect(markup).toContain('class="tooltip-anchor"');
    expect(markup).toContain('data-tooltip="Overview"');
    expect(markup).toContain('data-tooltip="Profile"');
    expect(markup).not.toContain('title="Overview"');
    expect(markup).not.toContain('title="Profile"');
    expect(script).toContain("node.dataset.tooltip = value;");
    expect(script).toContain("node.removeAttribute(\"title\");");
    expect(styles).toContain("--tooltip-bg: rgba(22, 27, 38, 0.96);");
    expect(styles).toContain("--tooltip-fg: #f8faff;");
    expect(styles).toContain("--tooltip-shadow:");
    expect(styles).toContain(".tooltip-anchor[data-tooltip]::before");
    expect(styles).toContain(".tooltip-anchor[data-tooltip]::after");
    expect(styles).toContain("border-top: var(--tooltip-arrow-size) solid var(--tooltip-bg);");
  });
});
