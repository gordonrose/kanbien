import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  recordListPattern,
  recordListPatternContract,
  renderRecordListPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/record-list/index.mjs";

const items = [
  { itemId: "northstar", title: "Northstar Operations", subtitle: "Operations", meta: "Ready" },
  { itemId: "ledgerworks", title: "LedgerWorks Finance", subtitle: "Finance", meta: "Needs review" },
  { itemId: "archived", title: "Archived Placeholder", subtitle: "Unavailable", meta: "Disabled", disabled: true },
];

describe("record-list pattern seam", () => {
  it("composes governed row and detail-slot primitives", () => {
    const pattern = recordListPattern({
      id: "record-list-test",
      ariaLabel: "Organization records",
      detailLabel: "Organization detail",
      selectedItemId: "northstar",
      items,
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "record-list",
      openItemId: "northstar",
      ratio: "1:2",
      primitiveDependencies: ["record-list-item-control", "detail-slot-control", "resize-handle-control"],
    });
    expect(pattern.styleVars["--pattern-record-list-list-fr"]).toBe("1fr");
    expect(pattern.styleVars["--pattern-record-list-detail-fr"]).toBe("2fr");
    expect(pattern.styleVars["--pattern-record-list-detail-max-inline-size"]).toBe("80rem");
  });

  it("supports governed list-to-detail ratio variants", () => {
    const wideDrawer = recordListPattern({
      id: "record-list-ratio",
      ratio: "1:5",
      ariaLabel: "Organization records",
      detailLabel: "Organization detail",
      selectedItemId: "northstar",
      items,
    });

    expect(wideDrawer.ratioVariant).toMatchObject({
      listFr: "1fr",
      detailFr: "5fr",
      initialDetailInlineSize: "36rem",
    });
    expect(wideDrawer.styleVars["--pattern-record-list-detail-max-inline-size"]).toBe("80rem");
    expect(() => recordListPattern({ ratio: "2:1", items })).toThrow('record-list does not support ratio "2:1".');
  });

  it("renders rows through record-list-item-control and detail through detail-slot-control", () => {
    const html = renderRecordListPattern({
      id: "record-list-render",
      ariaLabel: "Organization records",
      detailLabel: "Organization detail",
      selectedItemId: "northstar",
      items,
    });

    expect(html).toContain('data-record-list-pattern=""');
    expect(html).toContain('role="list"');
    expect(html).toContain('role="listitem"');
    expect(html).toContain('data-record-list-item-control');
    expect(html).toContain('data-detail-slot-control=""');
    expect(html).toContain('data-resize-handle-control=""');
    expect(html).toContain('data-resize-handle-control-edge="inline-start"');
    expect(html).toContain('data-record-list-pattern-live-region');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-atomic="true"');
    expect(html).toContain('aria-label="Resize detail slot"');
    expect(html).toContain('aria-label="Close detail"');
    expect(html).not.toContain("record-management-filter-trigger");
  });

  it("can render without reorder affordances when the application disables reorder", () => {
    const pattern = recordListPattern({
      id: "record-list-no-reorder",
      ariaLabel: "Organization records",
      detailLabel: "Organization detail",
      allowReorder: false,
      items,
    });
    const html = renderRecordListPattern({
      id: "record-list-no-reorder",
      ariaLabel: "Organization records",
      detailLabel: "Organization detail",
      allowReorder: false,
      items,
    });

    expect(pattern.allowReorder).toBe(false);
    expect(pattern.attributes["data-record-list-pattern-reorder"]).toBe("disabled");
    expect(html).toContain('data-record-list-pattern-reorder="disabled"');
    expect(html).not.toContain('draggable="true"');
    expect(html).not.toContain('aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"');
    expect(html).not.toContain("Use Alt plus Arrow Up or Arrow Down to reorder.");
  });

  it("renders a governed empty state without fake row controls", () => {
    const pattern = recordListPattern({
      id: "record-list-empty",
      ariaLabel: "Organization records",
      items: [],
    });
    const html = renderRecordListPattern({
      id: "record-list-empty",
      ariaLabel: "Organization records",
      items: [],
    });

    expect(pattern.isEmpty).toBe(true);
    expect(pattern.attributes["data-record-list-pattern-state"]).toBe("empty");
    expect(html).toContain('data-record-list-pattern-empty');
    expect(html).not.toContain('data-record-list-item-control');
  });

  it("guards invalid data before downstream consumers can render it", () => {
    expect(() => recordListPattern({ items: "bad" })).toThrow("items must be an array.");
    expect(() => recordListPattern({ items: [{ itemId: "", title: "Missing id" }] })).toThrow(
      "items[0].itemId must be a non-empty string.",
    );
    expect(() => recordListPattern({ items: [{ itemId: "one", title: "" }] })).toThrow(
      "items[0].title must be a non-empty string.",
    );
    expect(() =>
      recordListPattern({
        items: [
          { itemId: "same", title: "One" },
          { itemId: "same", title: "Two" },
        ],
      }),
    ).toThrow("itemId values must be unique.");
  });

  it("documents the Layer 4 boundary", () => {
    expect(recordListPatternContract).toMatchObject({
      schema: "kanbien.designSystem.patternContract.v1",
      patternName: "record-list",
      status: "review-ready",
      requiredPrimitives: ["record-list-item-control", "detail-slot-control", "resize-handle-control"],
      directTokenDependencies: [],
    });
    expect(recordListPatternContract.consumerRules).toContain(
      "Consumers must not locally recreate row markup, drag handlers, keyboard move behavior, item disabled semantics, detail-slot aside markup, or close-button behavior.",
    );
  });

  it("owns only pattern-level open, close, and reorder events", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/layers/04-pattern-contract/record-list/index.mjs"),
      "utf8",
    );

    expect(source).toContain("record-list-item:open");
    expect(source).toContain("record-list-item:move");
    expect(source).toContain("attachedRecordListPatternRoots");
    expect(source).toContain('pattern.dataset.recordListPatternReorder !== "enabled"');
    expect(source).toContain("movedItem.focus({ preventScroll: true });");
    expect(source).toContain("announceMovement(pattern, source);");
    expect(source).toContain("movementAnnouncement");
    expect(source).toContain("detail-slot-control:close");
    expect(source).toContain("resize-handle-control:resize");
    expect(source).toContain("record-list:open");
    expect(source).toContain("record-list:close");
    expect(source).toContain("record-list:reorder");
    expect(source).toContain("record-list:resize-detail");
    expect(source).not.toContain('addEventListener("dragstart"');
  });

  it("caps manual drawer resizing at the approved 1:5 list-to-detail allocation", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/layers/04-pattern-contract/record-list/index.mjs"),
      "utf8",
    );

    expect(source).toContain("configureRecordListResizeBounds");
    expect(source).toContain("const maxDetailInlineSize = Math.max(minDetailInlineSize, (availableInlineSize * 5) / 6);");
    expect(source).toContain("resizeControl.dataset.resizeHandleControlMaxInlineSize = maxCssValue;");
    expect(source).toContain('pattern.style.setProperty("--pattern-record-list-detail-max-inline-size", maxCssValue);');
  });

  it("keeps mobile detail as an overlay instead of stacking it under the list", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/systems/default/assets/styles.css"),
      "utf8",
    );

    expect(styles).toContain(
      '.record-list-pattern-proof-host[data-record-list-pattern-proof-width="mobile"] .ds-record-list-pattern > .ds-detail-slot-control',
    );
    expect(styles).toContain("position: absolute;");
    expect(styles).toContain("position: fixed;");
    expect(styles).toContain('data-detail-slot-control-state="closed"]');
    expect(styles).toContain("display: none;");
  });

  it("contains pattern composition styles without local row truncation behavior", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/systems/default/assets/styles.css"),
      "utf8",
    );
    const patternRule = styles.match(/\.ds-record-list-pattern\s*\{[^}]+\}/)?.[0] ?? "";
    const detailRule = styles.match(/\.ds-detail-slot-control\s*\{[^}]+background:[^}]+\}/)?.[0] ?? "";

    expect(patternRule).toContain("grid-template-columns");
    expect(patternRule).toContain("var(--pattern-record-list-list-fr");
    expect(patternRule).toContain("var(--pattern-record-list-detail-fr");
    expect(patternRule).toContain("var(--primitive-detail-slot-gap");
    expect(detailRule).toContain("var(--primitive-detail-slot-background");
    expect(styles).toContain("var(--primitive-detail-slot-surface");
    expect(styles).toContain(".ds-record-list-pattern-live-region");
    expect(styles).toContain("clip-path: inset(50%);");
    expect(styles).not.toContain(".ds-record-list-pattern .ds-record-list-item-title");
  });
});
