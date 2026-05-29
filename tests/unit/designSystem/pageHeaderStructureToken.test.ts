import { describe, expect, it } from "vitest";

import {
  pageHeaderStructureTokenSpec,
  pageHeaderStructureTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/page-header-structure/systems/default.mjs";

describe("page-header-structure token seam", () => {
  it("exposes governed page header region map values", () => {
    expect(pageHeaderStructureTokenSpec).toMatchObject({
      contractId: "tokens.page-header-structure",
      systemKey: "default",
      tokenType: "page-header-structure",
    });

    expect(pageHeaderStructureTokenVariants).toHaveLength(1);
    expect(
      pageHeaderStructureTokenVariants.find(
        (variant: { id: string }) => variant.id === "page-header-structure-default",
      ),
    ).toMatchObject({
      tokenName: "--page-header-structure",
      layoutRole: "page header structure",
      visibleColumnCount: "24",
      gapValue: "0.5rem",
      tokenValue: "1, 2, 3-5, 6-8, 9-19, 20, 21, 22, 23, 24",
      sourceTokenName: "shared foundation header",
    });

    expect(pageHeaderStructureTokenVariants[0].regions).toContain("context-title (9-19)");
    expect(pageHeaderStructureTokenVariants[0].regions).toContain("action-5 (24-24)");
    expect(pageHeaderStructureTokenSpec.consumerRestrictions).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Consumers must import this token seam"),
      ]),
    );
    expect(pageHeaderStructureTokenSpec.requiredEvidence).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Rendered proof must show dependency identity"),
      ]),
    );
  });
});
