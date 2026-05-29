import { describe, expect, it } from "vitest";

import {
  entityBodyPanelPattern,
  entityBodyPanelPatternContract,
  renderEntityBodyPanelPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/entity-body-panel/index.mjs";

describe("entity-body-panel pattern seam", () => {
  it("composes the governed body-region primitive", () => {
    const panel = entityBodyPanelPattern({
      id: "entity-body-panel-test",
      label: "Entity body content",
      state: "loading",
    });

    expect(panel).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "entity-body-panel",
      state: "loading",
      bodyContentAllowed: false,
      primitive: {
        primitiveName: "body-region-control",
        attributes: {
          "aria-busy": "true",
          "aria-label": "Entity body content",
        },
      },
    });
    expect(entityBodyPanelPatternContract).toMatchObject({
      requiredPrimitives: ["body-region-control"],
      directTokenDependencies: ["not-applicable; tokens consumed through primitive"],
    });
  });

  it("suppresses body children for empty, loading, and blocked states", () => {
    for (const state of ["empty", "loading", "blocked-foundation"]) {
      const html = renderEntityBodyPanelPattern({
        id: `entity-body-panel-${state}`,
        state,
        bodyHtml: "<p>Should not render</p>",
      });

      expect(html).toContain(`data-entity-body-panel-state="${state}"`);
      expect(html).not.toContain("Should not render");
      expect(html).toContain("data-body-region-control");
    }
  });

  it("allows supplied content only for content-hosting states", () => {
    const html = renderEntityBodyPanelPattern({
      id: "entity-body-panel-default",
      state: "default",
      bodyHtml: "<p>Governed child content</p>",
    });

    expect(html).toContain("Governed child content");
    expect(html).toContain("data-scroll-region-control");
  });

  it("guards unsupported body states", () => {
    expect(() =>
      entityBodyPanelPattern({
        id: "entity-body-panel-invalid",
        state: "selected",
      }),
    ).toThrow('entity-body-panel does not support state "selected".');
  });
});
