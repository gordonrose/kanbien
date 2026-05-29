import { describe, expect, it } from "vitest";

import {
  normalizeReadinessStatusState,
  readinessStatusControlPrimitive,
  readinessStatusControlPrimitiveContract,
  renderReadinessStatusControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/readiness-status-control/index.mjs";

describe("readiness-status-control primitive seam", () => {
  it("normalizes unknown state input without inventing a label", () => {
    expect(normalizeReadinessStatusState("ready")).toBe("ready");
    expect(normalizeReadinessStatusState("not-a-real-state")).toBe("unknown");
  });

  it("resolves signed label text tokens and status semantics", () => {
    const status = readinessStatusControlPrimitive({
      id: "readiness-status-test",
      state: "needs-review",
    });

    expect(status).toMatchObject({
      primitiveName: "readiness-status-control",
      state: "needs-review",
      text: "Needs review",
      tokenDependencies: {
        labelTextStyle: {
          tokenName: "--label-text-style-short-default",
          variantId: "label-text-style-short-default",
        },
      },
      attributes: {
        role: "status",
        "aria-live": "polite",
        "aria-label": "Status: Needs review",
      },
    });
    expect(status.styleVars["--primitive-readiness-status-font-weight"]).toBe("700");
  });

  it("renders visible text-backed status markup", () => {
    const html = renderReadinessStatusControlPrimitive({
      id: "readiness-status-render",
      state: "blocked",
    });

    expect(html).toContain('data-readiness-status-control=""');
    expect(html).toContain('data-readiness-status-state="blocked"');
    expect(html).toContain('role="status"');
    expect(html).toContain("Blocked");
    expect(html).not.toContain("badge");
  });

  it("declares text-only consumer boundaries", () => {
    expect(readinessStatusControlPrimitiveContract).toMatchObject({
      primitiveName: "readiness-status-control",
      requiredTokens: ["label-text-style"],
      requiredPrimitives: [],
      allowedStates: ["ready", "needs-review", "blocked", "unknown"],
    });
  });
});
