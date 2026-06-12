import { describe, expect, it } from "vitest";

import {
  renderTopNavigationTriggerControlPrimitive,
  topNavigationTriggerControlPrimitive,
  topNavigationTriggerControlPrimitiveContract,
} from "../../../src/frontend/designSystem/layers/03-primitive/top-navigation-trigger-control/index.mjs";

describe("top-navigation-trigger-control primitive seam", () => {
  it("resolves signed token and primitive dependencies for a closed overflow trigger", () => {
    const trigger = topNavigationTriggerControlPrimitive({
      id: "top-navigation-more",
      label: "More",
      controls: "top-navigation-overflow-panel",
    });

    expect(trigger).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "top-navigation-trigger-control",
      tokenDependencies: {
        topNavigationFrame: {
          tokenName: "--top-navigation-frame-trigger-original",
        },
        labelTextStyle: {
          tokenName: "--label-text-style-short-default",
        },
        focusRing: {
          tokenName: "--focus-ring-visible-original",
        },
        minimumTargetSize: {
          tokenName: "--target-size-interactive-min",
        },
        truncatingLabel: {
          primitiveName: "truncating-label",
        },
      },
      semantics: {
        element: "button",
        accessibleName: "More",
        expanded: 'aria-expanded="false"',
      },
    });
    expect(trigger.styleVars["--primitive-top-navigation-trigger-min-inline-size"]).toBe("7rem");
  });

  it("renders an opened native button with expanded semantics", () => {
    const html = renderTopNavigationTriggerControlPrimitive({
      id: "top-navigation-profile",
      label: "Profile",
      kind: "profile",
      controls: "top-navigation-profile-panel",
      expanded: true,
    });

    expect(html).toContain("<button");
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Profile"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-controls="top-navigation-profile-panel"');
    expect(html).toContain('data-top-navigation-trigger-control=""');
    expect(html).toContain('data-truncating-label=""');
    expect(html).not.toContain("tabindex=");
    expect(topNavigationTriggerControlPrimitiveContract).toMatchObject({
      primitiveName: "top-navigation-trigger-control",
      eventName: "top-navigation-trigger-control:request-toggle",
    });
  });

  it("rejects unsupported trigger kinds instead of silently inventing behavior", () => {
    expect(() =>
      topNavigationTriggerControlPrimitive({
        id: "top-navigation-destination",
        label: "Destination",
        kind: "destination",
        controls: "top-navigation-panel",
      }),
    ).toThrow('top-navigation-trigger-control does not support kind "destination"');
  });
});
