import { describe, expect, it } from "vitest";

import {
  recordListFormPattern,
  recordListFormPatternContract,
  renderRecordListFormPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/record-list-form/index.mjs";

const items = [
  { itemId: "northstar", title: "Northstar Operations", subtitle: "Operations", meta: "Ready" },
  { itemId: "ledgerworks", title: "LedgerWorks Finance", subtitle: "Finance", meta: "Needs review" },
  { itemId: "archived", title: "Archived Placeholder", subtitle: "Unavailable", meta: "Disabled", disabled: true },
];

describe("record-list-form pattern seam", () => {
  it("composes record-list and entity-panel without direct token dependencies", () => {
    const pattern = recordListFormPattern({
      id: "record-list-form-test",
      ariaLabel: "Organization records",
      detailLabel: "Organization detail",
      selectedItemId: "northstar",
      primaryItems: [{ value: "identity", label: "Identity" }],
      primaryCurrent: "identity",
      showPrimaryIndex: true,
      secondaryItems: [{ value: "identity", label: "Identity" }],
      mobileActiveRegion: "primary-index",
      items,
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "record-list-form",
      selectedItemId: "northstar",
      childPatterns: {
        recordList: {
          patternName: "record-list",
        },
      },
    });
    expect(pattern.childPatterns.entityPanels).toHaveLength(2);
    expect(pattern.childPatterns.entityPanels[0].patternName).toBe("entity-panel");
    expect(pattern.childPatterns.entityPanels[0].showPrimaryIndex).toBe(true);
    expect(pattern.childPatterns.entityPanels[0].primaryCurrent).toBe("identity");
    expect(pattern.childPatterns.entityPanels[0].mobileActiveRegion).toBe("primary-index");
    expect(recordListFormPatternContract).toMatchObject({
      requiredPatterns: ["record-list", "entity-panel"],
      requiredPrimitives: [],
      directTokenDependencies: [],
    });
  });

  it("renders entity panels inside the record-list custom detail slot without a parent primary wrapper", () => {
    const html = renderRecordListFormPattern({
      id: "record-list-form-render",
      ariaLabel: "Organization records",
      detailLabel: "Organization detail",
      selectedItemId: "northstar",
      primaryItems: [{ value: "identity", label: "Identity" }],
      primaryCurrent: "identity",
      showPrimaryIndex: true,
      secondaryItems: [{ value: "identity", label: "Identity" }],
      entityBodyHtmlByItemId: {
        northstar: '<p data-northstar-body="">Northstar governed body</p>',
        ledgerworks: '<p data-ledgerworks-body="">LedgerWorks governed body</p>',
      },
      items,
    });

    expect(html).toContain('data-record-list-form-pattern=""');
    expect(html).toContain('data-record-list-pattern=""');
    expect(html).toContain('data-record-list-pattern-custom-detail="true"');
    expect(html).toContain('data-detail-slot-control=""');
    expect(html).toContain('data-entity-panel=""');
    expect(html).toContain('data-entity-panel-region="primary-index"');
    expect(html).not.toContain("ds-record-list-form-primary");
    expect(html).toContain('data-record-list-form-detail-item="northstar"');
    expect(html).toContain('data-record-list-form-detail-item="ledgerworks" hidden');
    expect(html).toContain("Northstar governed body");
    expect(html).toContain("LedgerWorks governed body");
  });

  it("guards invalid data before rendering downstream composition", () => {
    expect(() => recordListFormPattern({ items: "bad" })).toThrow("items must be an array.");
    expect(() => recordListFormPattern({ items: [{ itemId: "", title: "Missing id" }] })).toThrow(
      "items[0].itemId must be a non-empty string.",
    );
    expect(() =>
      recordListFormPattern({
        items: [
          { itemId: "same", title: "One" },
          { itemId: "same", title: "Two" },
        ],
      }),
    ).toThrow("itemId values must be unique.");
  });
});
