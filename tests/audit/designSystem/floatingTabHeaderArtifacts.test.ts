import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("design system floating tab header artifacts", () => {
  it("keeps the promoted component route, exploration route, and governance artifacts wired", () => {
    const componentMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/components/floating-tab-header.html"),
      "utf8",
    );
    const explorationMarkup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/exploration/floating-tab-header/index.html"),
      "utf8",
    );
    const componentIndex = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/components/index.html"),
      "utf8",
    );
    const behaviorLock = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/behavior-locks/floating-tab-header-behavior-lock.md"),
      "utf8",
    );
    const referencePack = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/reference-packs/floating-tab-header-reference-pack.md"),
      "utf8",
    );
    const script = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/floatingTabHeaderDemo.mjs"),
      "utf8",
    );
    const canonicalScript = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/floatingTabHeaderCanonical.mjs"),
      "utf8",
    );
    const seam = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/floatingTabHeader.mjs"),
      "utf8",
    );

    expect(componentIndex).toContain("/design-system/components/floating-tab-header");
    expect(componentIndex).toContain("FloatingTabHeader");
    expect(componentMarkup).toContain("Floating Tab Header");
    expect(componentMarkup).toContain("Canonical Render");
    expect(componentMarkup).toContain('href="/design-system/exploration/floating-tab-header"');
    expect(componentMarkup).toContain('href="/design-system/canonical-renderings/floating-tab-header"');
    expect(componentMarkup).toContain('id="floating-tab-workspace"');
    expect(componentMarkup).toContain('data-floating-tab-seam-mount="true"');
    expect(componentMarkup).not.toContain('class="floating-tab-card');
    expect(componentMarkup).toContain("/design-system/assets/floatingTabHeaderCanonical.mjs");
    expect(explorationMarkup).toContain("Provisional Demo");
    expect(explorationMarkup).toContain('data-floating-tab-seam-mount="true"');
    expect(behaviorLock).toContain("FTH-001");
    expect(behaviorLock).toContain("FTH-013");
    expect(referencePack).toContain("FTH-001");
    expect(referencePack).toContain("FTH-R-024");
    expect(referencePack).toContain("/design-system/canonical-renderings/floating-tab-header/FTH-R-024");
    expect(script).toContain("./floatingTabHeader.mjs");
    expect(script).toContain("renderFloatingTabHeader");
    expect(script).toContain("mountFloatingTabHeader");
    expect(canonicalScript).toContain("floatingTabHeaderCanonicalStates");
    expect(canonicalScript).toContain("/design-system/canonical-renderings/floating-tab-header/${refId}");
    expect(canonicalScript).toContain("FTH-R-024");
    expect(canonicalScript).toContain("displayRoot: previewFrame");
    expect(seam).toContain("export function renderFloatingTabHeader");
    expect(seam).toContain("export function mountFloatingTabHeader");
    expect(seam).toContain("function applyInitialStateFromUrl()");
    expect(seam).toContain("initialParams");
    expect(seam).toContain("categorySwitch");
    expect(seam).toContain("floatingTabOverflowLeftCount");
    expect(seam).toContain("floatingTabOverflowRightCount");
  });
});
