import { describe, expect, it } from "vitest";

import { linkDecorationTokenContract } from "../../../src/frontend/designSystem/layers/02-token/link-decoration/contract.mjs";
import { linkDecorationTokenSpec } from "../../../src/frontend/designSystem/layers/02-token/link-decoration/systems/brochure.mjs";
import { linkTextStyleTokenContract } from "../../../src/frontend/designSystem/layers/02-token/link-text-style/contract.mjs";
import { linkTextStyleTokenSpec } from "../../../src/frontend/designSystem/layers/02-token/link-text-style/systems/brochure.mjs";
import { tooltipSurfaceTokenSpec } from "../../../src/frontend/designSystem/layers/02-token/tooltip-surface/systems/brochure.mjs";
import { tooltipTextStyleTokenSpec } from "../../../src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/brochure.mjs";

describe("brochure link tokens", () => {
  it("defines a standalone link text style seam for brochure", () => {
    expect(linkTextStyleTokenContract.contractId).toBe("tokens.link-text-style");
    expect(linkTextStyleTokenSpec.systemKey).toBe("brochure");
    expect(linkTextStyleTokenSpec.variants).toHaveLength(1);

    const [variant] = linkTextStyleTokenSpec.variants;
    expect(variant.id).toBe("link-text-style-standalone");
    expect(variant.fontWeightValue).toBe("600");
    expect(variant.foregroundValue).toBe("#174d54");
    expect(variant.hoverForegroundValue).toBe("#1f6f78");
    expect(variant.layoutContext).toContain("standalone public brochure");
  });

  it("defines a standalone link decoration seam that preserves non-color meaning", () => {
    expect(linkDecorationTokenContract.contractId).toBe("tokens.link-decoration");
    expect(linkDecorationTokenSpec.systemKey).toBe("brochure");
    expect(linkDecorationTokenSpec.variants).toHaveLength(1);

    const [variant] = linkDecorationTokenSpec.variants;
    expect(variant.id).toBe("link-decoration-standalone");
    expect(variant.textDecorationLineValue).toBe("underline");
    expect(variant.textDecorationThicknessValue).toBe("0.08em");
    expect(variant.textUnderlineOffsetValue).toBe("0.22em");
    expect(variant.colorIndependentMeaningRule).toContain("not color-only");
  });

  it("defines brochure tooltip tokens for truncated link disclosure", () => {
    expect(tooltipSurfaceTokenSpec.systemKey).toBe("brochure");
    expect(tooltipTextStyleTokenSpec.systemKey).toBe("brochure");

    const [surface] = tooltipSurfaceTokenSpec.variants;
    const [text] = tooltipTextStyleTokenSpec.variants;

    expect(surface.id).toBe("tooltip-surface-brochure-original");
    expect(surface.role).toBe("text overflow disclosure surface");
    expect(surface.backgroundValue).toBe("#123f46");
    expect(surface.foregroundValue).toBe("#fffdf8");
    expect(text.id).toBe("tooltip-text-style-brochure");
    expect(text.role).toBe("tooltip disclosure text");
    expect(text.overflowReadiness).toContain("brochure tooltip-surface");
  });
});
