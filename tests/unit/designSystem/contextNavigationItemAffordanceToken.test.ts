import { describe, expect, it } from "vitest";

import {
  contextNavigationItemAffordanceTokenSpec,
  contextNavigationItemAffordanceTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/context-navigation-item-affordance/systems/default.mjs";

describe("context-navigation-item-affordance token seam", () => {
  it("exposes governed context navigation item state affordance values", () => {
    expect(contextNavigationItemAffordanceTokenSpec).toMatchObject({
      contractId: "tokens.context-navigation-item-affordance",
      systemKey: "default",
      tokenType: "context-navigation-item-affordance",
    });

    expect(contextNavigationItemAffordanceTokenVariants).toHaveLength(1);
    expect(contextNavigationItemAffordanceTokenVariants[0]).toMatchObject({
      id: "context-navigation-item-affordance-default",
      tokenName: "--context-navigation-item-affordance",
      itemRole: "context navigation item affordance",
      desktopInlineSize: "2.75rem",
      desktopBlockSize: "2.75rem",
      mobilePaddingBlockValue: "0.55rem",
      mobilePaddingInlineValue: "0.35rem",
      restingBackgroundValue: "var(--surface-1)",
      hoverBackgroundValue: "var(--surface-1)",
      currentBackgroundValue: "var(--accent-soft)",
      currentForegroundValue: "var(--accent-text)",
      disabledOpacityValue: "0.58",
    });
  });

  it("keeps current affordance paired with programmatic current semantics", () => {
    expect(contextNavigationItemAffordanceTokenSpec.consumerRestrictions).toContain(
      "Current visual affordance must be paired with programmatic current semantics.",
    );
    expect(contextNavigationItemAffordanceTokenSpec.requiredEvidence).toContain(
      "Primitive proof must show current destination items expose programmatic current semantics.",
    );
  });
});
