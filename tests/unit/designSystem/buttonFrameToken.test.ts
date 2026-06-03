import { describe, expect, it } from "vitest";

import {
  buttonFrameTokenSpec,
  buttonFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/button-frame/systems/default.mjs";

type TokenVariantWithId = { id: string };

describe("button-frame token seam", () => {
  it("exposes governed icon and text action frame variants for each theme", () => {
    expect(buttonFrameTokenSpec).toMatchObject({
      contractId: "tokens.button-frame",
      systemKey: "default",
      tokenType: "button-frame",
    });

    expect(buttonFrameTokenVariants).toHaveLength(9);
    expect(buttonFrameTokenVariants.map((variant: TokenVariantWithId) => variant.id)).toEqual([
      "button-frame-icon-quiet-original",
      "button-frame-icon-subtle-original",
      "button-frame-text-action-original",
      "button-frame-icon-quiet-dark",
      "button-frame-icon-subtle-dark",
      "button-frame-text-action-dark",
      "button-frame-icon-quiet-desert",
      "button-frame-icon-subtle-desert",
      "button-frame-text-action-desert",
    ]);
    expect(buttonFrameTokenVariants[0]).toMatchObject({
      role: "icon button frame",
      intent: "quiet",
      backgroundValue: "#ffffff",
      radiusValue: "0.375rem",
      paddingBlockValue: "0",
      paddingInlineValue: "0",
      visualInsetValue: "0.25rem",
    });
    expect(buttonFrameTokenVariants[1]).toMatchObject({
      role: "icon button frame",
      intent: "subtle",
    });
    expect(buttonFrameTokenVariants[2]).toMatchObject({
      role: "text action button frame",
      intent: "subtle",
      paddingBlockValue: "0.35rem",
      paddingInlineValue: "0.55rem",
    });
  });

  it("makes dependency derivation and consumer limits explicit", () => {
    expect(buttonFrameTokenVariants[0]?.sourceTokenName).toContain("--primary-color-source-original");
    expect(buttonFrameTokenVariants[0]?.sourceTokenName).toContain("--label-text-style-short-default");
    expect(buttonFrameTokenVariants[0]?.formulaOrMapping).toContain("host surface directly");
    expect(buttonFrameTokenVariants[0]?.formulaOrMapping).toContain("host surface");
    expect(buttonFrameTokenVariants[1]?.formulaOrMapping).toContain("primary source 10%");
    expect(buttonFrameTokenVariants[0]).toMatchObject({
      hostSurfaceTokenName: "--background-surface-original",
      textStyleTokenName: "--label-text-style-short-default",
    });
    expect(buttonFrameTokenSpec.diagnostic).toMatchObject({
      kind: "dependency-hex-override",
      label: "Review Primary Source Dependency",
    });
    expect(buttonFrameTokenSpec.diagnostic?.surfaceOptions).toHaveLength(3);
    expect(buttonFrameTokenSpec.consumerRestrictions.join(" ")).toContain("native button behavior");
    expect(buttonFrameTokenSpec.consumerRestrictions.join(" ")).toContain("minimum-target-size");
  });
});
