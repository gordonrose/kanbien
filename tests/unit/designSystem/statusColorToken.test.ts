import { describe, expect, it } from "vitest";

import {
  statusColorTokenSpec,
  statusColorTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/status-color/systems/default.mjs";

type StatusColorVariant = {
  id: string;
};

describe("status-color token seam", () => {
  it("exposes warning status colour variants across themes", () => {
    expect(statusColorTokenSpec).toMatchObject({
      contractId: "tokens.status-color",
      systemKey: "default",
      tokenType: "status-color",
    });

    expect(statusColorTokenVariants).toHaveLength(3);
    expect(statusColorTokenVariants.map((variant: StatusColorVariant) => variant.id)).toEqual([
      "status-color-warning-original",
      "status-color-warning-dark",
      "status-color-warning-desert",
    ]);
  });

  it("keeps warning reusable without approving unrelated statuses", () => {
    expect(statusColorTokenSpec.consumerRestrictions.join(" ")).toContain("approves warning only");
    expect(statusColorTokenSpec.consumerRestrictions.join(" ")).toContain("non-colour meaning");
  });

  it("exposes a proof-only dependency diagnostic for warning source and host surface", () => {
    expect(statusColorTokenSpec.diagnostic).toMatchObject({
      kind: "dependency-hex-override",
      defaultHex: "#8a4b08",
      validStatus: "Temporary preview only. Signed status-colour token values remain unchanged.",
    });

    expect(statusColorTokenSpec.diagnostic.surfaceOptions.map((option: { label: string }) => option.label)).toEqual([
      "original surface",
      "dark surface",
      "desert surface",
    ]);
    expect(statusColorTokenSpec.diagnostic.previews.map((preview: { role: string }) => preview.role)).toEqual([
      "source",
      "status-background",
      "status-foreground",
      "status-border",
      "status-subtle",
      "status-strong",
    ]);
  });
});
