import { describe, expect, it } from "vitest";

import { focusRingTokenSpec } from "../../../src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs";

describe("focus-ring token seam", () => {
  it("exposes a signed containment inset for scroll and panel hosts", () => {
    expect(focusRingTokenSpec.variantFields).toContainEqual(["containmentInsetValue", "Containment inset"]);

    for (const variant of focusRingTokenSpec.variants) {
      expect(variant.containmentInsetValue).toBe("0.25rem");
      expect(variant.offsetValue).toBe("0.125rem");
      expect(variant.layoutImpact).toContain("no layout shift");
    }
  });
});
