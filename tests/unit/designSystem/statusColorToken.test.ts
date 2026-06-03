import { describe, expect, it } from "vitest";

import {
  statusColorTokenSpec,
  statusColorTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/status-color/systems/default.mjs";

describe("status-color token seam", () => {
  it("exposes warning status colour variants across themes", () => {
    expect(statusColorTokenSpec).toMatchObject({
      contractId: "tokens.status-color",
      systemKey: "default",
      tokenType: "status-color",
    });

    expect(statusColorTokenVariants).toHaveLength(3);
    expect(statusColorTokenVariants.map((variant) => variant.id)).toEqual([
      "status-color-warning-original",
      "status-color-warning-dark",
      "status-color-warning-desert",
    ]);
  });

  it("keeps warning reusable without approving unrelated statuses", () => {
    expect(statusColorTokenSpec.consumerRestrictions.join(" ")).toContain("approves warning only");
    expect(statusColorTokenSpec.consumerRestrictions.join(" ")).toContain("non-colour meaning");
  });
});
