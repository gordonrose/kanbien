import { describe, expect, it } from "vitest";

import { topNavigationFrameTokenContract } from "../../../src/frontend/designSystem/layers/02-token/top-navigation-frame/contract.mjs";
import {
  tokenDefinitionV1,
  topNavigationFrameTokenSpec,
} from "../../../src/frontend/designSystem/layers/02-token/top-navigation-frame/systems/default.mjs";

describe("top-navigation-frame token seam", () => {
  it("exposes top-navigation frame roles without old design-system variables", () => {
    expect(topNavigationFrameTokenContract).toMatchObject({
      contractId: "tokens.top-navigation-frame",
      tokenType: "top-navigation-frame",
      status: "review-ready",
    });

    expect(tokenDefinitionV1.status).toBe("review-ready");
    expect(tokenDefinitionV1.codeSeam.allowedConsumers).toEqual(["03-primitive", "04-pattern-contract"]);

    const roles = new Set(topNavigationFrameTokenSpec.variants.map((variant: { frameRole: string }) => variant.frameRole));
    expect(roles).toEqual(
      new Set([
        "top navigation chrome",
        "top navigation destination",
        "top navigation current destination",
        "top navigation trigger",
        "top navigation open trigger",
        "top navigation menu panel",
      ]),
    );

    const serialized = JSON.stringify(
      topNavigationFrameTokenSpec.variants.map(
        (variant: { tokenName: string; sourceTokenName: string; backgroundValue: string; borderValue: string }) => ({
          tokenName: variant.tokenName,
          sourceTokenName: variant.sourceTokenName,
          backgroundValue: variant.backgroundValue,
          borderValue: variant.borderValue,
        }),
      ),
    );
    expect(serialized).not.toContain("--surface-1");
    expect(serialized).not.toContain("--surface-2");
    expect(serialized).not.toContain("--ink");
    expect(serialized).not.toContain("--line");
    expect(serialized).not.toContain("--accent");
    expect(serialized).not.toContain("--shadow-");
    expect(serialized).not.toContain("--radius-");
  });

  it("carries required dependency and accessibility boundaries into later layers", () => {
    const dependencyIds = tokenDefinitionV1.dependencies.map((dependency: { contractId: string }) => dependency.contractId);

    expect(dependencyIds).toContain("tokens.background-color");
    expect(dependencyIds).toContain("tokens.primary-tinted-background");
    expect(dependencyIds).toContain("tokens.primary-tinted-foreground");
    expect(dependencyIds).toContain("tokens.focus-ring");
    expect(dependencyIds).toContain("tokens.minimum-target-size");

    const currentVariant = topNavigationFrameTokenSpec.variants.find(
      (variant: { id: string }) => variant.id === "top-navigation-frame-destination-current-original",
    );
    const destinationVariant = topNavigationFrameTokenSpec.variants.find(
      (variant: { id: string }) => variant.id === "top-navigation-frame-destination-original",
    );
    const triggerVariant = topNavigationFrameTokenSpec.variants.find(
      (variant: { id: string }) => variant.id === "top-navigation-frame-trigger-original",
    );

    expect(topNavigationFrameTokenContract.valueFields).toContain("minInlineSize");
    expect(destinationVariant?.minInlineSize).toBe("7rem");
    expect(triggerVariant?.minInlineSize).toBe("7rem");
    expect(currentVariant?.accessibility).toContain("aria-current or equivalent semantics");
    expect(topNavigationFrameTokenSpec.consumerRestrictions.join(" ")).toContain("Current-destination values");
    expect(topNavigationFrameTokenSpec.consumerRestrictions.join(" ")).toContain("Open-trigger values");
    expect(topNavigationFrameTokenSpec.requiredEvidence.join(" ")).toContain("TRP top-nav reference states");
  });
});
