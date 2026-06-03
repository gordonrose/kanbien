import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  recordListComponent,
  recordListComponentContract,
  renderRecordListComponent,
} from "../../../src/frontend/designSystem/layers/05-component-seam/record-list/index.mjs";

const items = [
  { itemId: "northstar", title: "Northstar Operations", subtitle: "Operations", meta: "Ready" },
  { itemId: "ledgerworks", title: "LedgerWorks Finance", subtitle: "Finance", meta: "Needs review" },
];

describe("record-list component seam", () => {
  it("declares the Layer 5 receptor and upstream pattern boundary", () => {
    expect(recordListComponentContract).toMatchObject({
      schema: "kanbien.designSystem.componentContract.v1",
      componentName: "record-list-component",
      status: "review-ready",
      upstreamPattern: {
        patternName: "record-list",
        contractPath: "docs/design-system/04-pattern-contract/shared/record-list/RecordList-Contract.md",
      },
    });
    expect(recordListComponentContract.receptors).toContain("items");
    expect(recordListComponentContract.receptors).toContain("detailContentHtml");
    expect(recordListComponentContract.receptors).toContain("allowReorder");
  });

  it("normalizes component receptors into the governed record-list pattern", () => {
    const component = recordListComponent({
      id: "record-list-component-test",
      listLabel: "Organization records",
      detailLabel: "Organization detail",
      selectedItemId: "northstar",
      initialDetailRatio: "1:5",
      items,
    });

    expect(component).toMatchObject({
      schema: "kanbien.designSystem.componentSpec.v1",
      componentName: "record-list-component",
      id: "record-list-component-test",
      patternSpec: {
        patternName: "record-list",
        ariaLabel: "Organization records",
        detailLabel: "Organization detail",
        ratio: "1:5",
        openItemId: "northstar",
      },
    });
  });

  it("renders through the governed pattern and preserves accessible detail feedback", () => {
    const html = renderRecordListComponent({
      id: "record-list-component-render",
      listLabel: "Organization records",
      detailLabel: "Organization detail",
      selectedItemId: "northstar",
      detailContentHtml: '<section data-governed-detail-content><h3>Governed detail</h3></section>',
      items,
    });

    expect(html).toContain('data-record-list-component=""');
    expect(html).toContain('data-record-list-pattern=""');
    expect(html).toContain('data-record-list-item-control');
    expect(html).toContain('data-detail-slot-control=""');
    expect(html).toContain('data-resize-handle-control=""');
    expect(html).toContain('data-record-list-pattern-live-region');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-label="Organization records"');
    expect(html).toContain('data-governed-detail-content');
    expect(html).not.toContain("record-management-filter-trigger");
  });

  it("maps non-reorder application state into the governed pattern", () => {
    const component = recordListComponent({
      listLabel: "Root users",
      detailLabel: "Root user detail",
      allowReorder: false,
      items,
    });
    const html = renderRecordListComponent({
      listLabel: "Root users",
      detailLabel: "Root user detail",
      allowReorder: false,
      items,
    });

    expect(component.patternSpec.allowReorder).toBe(false);
    expect(html).toContain('data-record-list-pattern-reorder="disabled"');
    expect(html).not.toContain('draggable="true"');
    expect(html).not.toContain('aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"');
  });

  it("requires accessibility labels at the component boundary", () => {
    expect(() => recordListComponent({ detailLabel: "Detail", items })).toThrow("listLabel must be a non-empty string.");
    expect(() => recordListComponent({ listLabel: "Records", items })).toThrow("detailLabel must be a non-empty string.");
  });

  it("translates pattern events into component-level events without primitive listeners", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/layers/05-component-seam/record-list/index.mjs"),
      "utf8",
    );

    expect(source).toContain("attachRecordListPatternController(root)");
    expect(source).toContain("record-list-component:open");
    expect(source).toContain("record-list-component:close");
    expect(source).toContain("record-list-component:reorder");
    expect(source).toContain("record-list-component:resize-detail");
    expect(source).not.toContain("record-list-item:open");
    expect(source).not.toContain("record-list-item:move");
  });
});
