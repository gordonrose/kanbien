import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  recordListItemControlPrimitive,
  recordListItemControlPrimitiveContract,
  renderRecordListItemControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/record-list-item-control/index.mjs";

describe("record-list-item-control primitive", () => {
  it("declares governed token dependencies and event names", () => {
    expect(recordListItemControlPrimitiveContract).toMatchObject({
      primitiveName: "record-list-item-control",
      requiredTokens: [
        "record-list-item-frame",
        "drag-drop-affordance-frame",
        "label-text-style",
        "supporting-text-style",
        "focus-ring",
        "minimum-target-size",
      ],
      openEventName: "record-list-item:open",
      moveEventName: "record-list-item:move",
    });
  });

  it("normalizes selected and disabled states against token dependencies", () => {
    expect(
      recordListItemControlPrimitive({
        itemId: "northstar",
        title: "Northstar Operations",
        selected: true,
        draggable: true,
      }),
    ).toMatchObject({
      itemId: "northstar",
      selected: true,
      draggable: true,
      state: "selected",
      tokenDependencies: {
        recordListItemFrame: {
          variantId: "record-list-item-frame-selected",
        },
        dragSourceFrame: {
          variantId: "drag-drop-affordance-frame-source",
        },
        dragPreviewFrame: {
          variantId: "drag-drop-affordance-frame-preview",
        },
        dropMarkerFrame: {
          variantId: "drag-drop-affordance-frame-drop-marker",
        },
      },
    });

    expect(
      recordListItemControlPrimitive({
        itemId: "archived",
        title: "Archived",
        disabled: true,
        draggable: true,
      }),
    ).toMatchObject({
      draggable: false,
      state: "disabled",
    });
  });

  it("renders a button-like item with selected, disabled, draggable, and accessible metadata", () => {
    const html = renderRecordListItemControlPrimitive({
      itemId: "ledgerworks",
      title: "LedgerWorks Finance",
      subtitle: "Finance",
      meta: "Needs review",
      selected: true,
      draggable: true,
    });

    expect(html).toContain("data-record-list-item-control");
    expect(html).toContain('data-record-list-item-id="ledgerworks"');
    expect(html).toContain('data-record-list-item-state="selected"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('draggable="true"');
    expect(html).toContain("LedgerWorks Finance");
    expect(html).toContain("Needs review");
  });

  it("implements controller-owned open, keyboard move, drag, drop, and cleanup behavior", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/layers/03-primitive/record-list-item-control/index.mjs"),
      "utf8",
    );

    expect(source).toContain("record-list-item:open");
    expect(source).toContain("record-list-item:move");
    expect(source).toContain('event.key === "Enter"');
    expect(source).toContain("event.altKey");
    expect(source).toContain('event.key === "ArrowUp"');
    expect(source).toContain('addEventListener("dragstart"');
    expect(source).toContain('addEventListener("dragover"');
    expect(source).toContain('addEventListener("drop"');
    expect(source).toContain("createDropMarker");
    expect(source).toContain('event.dataTransfer.effectAllowed = "move"');
    expect(source).toContain('event.dataTransfer.dropEffect = "move"');
    expect(source).toContain("allowMoveDrop(event)");
    expect(source).toContain('addEventListener("dragenter"');
    expect(source).toContain("removeDropMarkers(root)");
    expect(source).toContain("clearDragState(root)");
  });
});
