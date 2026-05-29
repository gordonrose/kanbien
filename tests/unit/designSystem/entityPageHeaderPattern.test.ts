import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  entityPageHeaderPattern,
  entityPageHeaderPatternContract,
  renderEntityPageHeaderPattern,
  resolveEntityPageHeaderSlots,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/entity-page-header/index.mjs";

const fiveActions = [
  { label: "Add record", value: "add-record", icon: "plus" },
  { label: "Open actions", value: "open-actions", icon: "list" },
  { label: "Close selection", value: "close-selection", icon: "close" },
  { label: "Open list", value: "open-list", icon: "list" },
  { label: "Add related", value: "add-related", icon: "plus" },
];

describe("entity-page-header pattern seam", () => {
  it("declares the governed primitive and token dependencies", () => {
    const header = entityPageHeaderPattern({
      id: "entity-page-header-test",
      showSecondaryControl: true,
      showPrimaryFilter: true,
      showSecondaryFilter: true,
      actions: fiveActions,
    });

    expect(entityPageHeaderPatternContract).toMatchObject({
      patternName: "entity-page-header",
      requiredPrimitives: ["icon-button-control", "readiness-status-control", "truncating-label"],
      directTokenDependencies: ["page-header-structure"],
    });
    expect(header).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "entity-page-header",
      styleVars: {
        "--pattern-entity-page-header-columns": "24",
        "--pattern-entity-page-header-gap": "0",
      },
      tokenDependencies: {
        pageHeaderStructure: {
          tokenName: "--page-header-structure",
          variantId: "page-header-structure-default",
        },
      },
    });
  });

  it("compacts optional left slots and expands the context title", () => {
    const slots = resolveEntityPageHeaderSlots({
      visibleColumnCount: 24,
      showLeadingControl: true,
      showSecondaryControl: false,
      showPrimaryFilter: true,
      showSecondaryFilter: true,
      actions: fiveActions,
    });

    expect(slots).toEqual([
      { id: "leading-control", startColumn: 1, endColumn: 2, width: 1 },
      { id: "primary-filter", startColumn: 2, endColumn: 5, width: 3 },
      { id: "secondary-filter", startColumn: 5, endColumn: 8, width: 3 },
      { id: "context-title", startColumn: 8, endColumn: 20, width: 12 },
      { id: "action-1", startColumn: 20, endColumn: 21, width: 1, action: fiveActions[0] },
      { id: "action-2", startColumn: 21, endColumn: 22, width: 1, action: fiveActions[1] },
      { id: "action-3", startColumn: 22, endColumn: 23, width: 1, action: fiveActions[2] },
      { id: "action-4", startColumn: 23, endColumn: 24, width: 1, action: fiveActions[3] },
      { id: "action-5", startColumn: 24, endColumn: 25, width: 1, action: fiveActions[4] },
    ]);
  });

  it("keeps trailing actions right-aligned when there are fewer actions", () => {
    const slots = resolveEntityPageHeaderSlots({
      visibleColumnCount: 24,
      showLeadingControl: true,
      showSecondaryControl: true,
      showPrimaryFilter: true,
      showSecondaryFilter: true,
      actions: fiveActions.slice(0, 2),
    });

    expect(slots.find((slot) => slot.id === "context-title")).toMatchObject({
      startColumn: 9,
      endColumn: 23,
      width: 14,
    });
    expect(slots.find((slot) => slot.id === "action-1")).toMatchObject({
      startColumn: 23,
      endColumn: 24,
    });
    expect(slots.find((slot) => slot.id === "action-2")).toMatchObject({
      startColumn: 24,
      endColumn: 25,
    });
  });

  it("renders composed primitives and accessible action labels", () => {
    const html = renderEntityPageHeaderPattern({
      id: "entity-page-header-render-test",
      showSecondaryControl: true,
      showPrimaryFilter: true,
      showSecondaryFilter: true,
      readinessState: "needs-review",
      actions: fiveActions.slice(0, 2),
    });

    expect(html).toContain("data-entity-page-header");
    expect(html).toContain('data-entity-page-header-slot="context-title"');
    expect(html).toContain("data-readiness-status-control");
    expect(html).toContain('data-readiness-status-state="needs-review"');
    expect(html).toContain("data-truncating-label");
    expect(html).toContain("data-icon-button-control");
    expect(html.match(/data-icon-button-control=""/g)).toHaveLength(4);
    expect(html).toContain('aria-label="Add record"');
    expect(html).toContain('aria-label="Open actions"');
    expect(html).toContain('data-entity-page-header-columns="9-22"');
    expect(html).toContain('data-entity-page-header-column-start="9"');
    expect(html).toContain('data-entity-page-header-column-end="23"');
    expect(html).not.toContain("grid-column:");
  });

  it("applies slot placement through the controller instead of inline styles", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/layers/04-pattern-contract/entity-page-header/index.mjs"),
      "utf8",
    );

    expect(source).toContain("data-entity-page-header-column-start");
    expect(source).toContain("data-entity-page-header-column-end");
    expect(source).toContain("slot.style.gridColumn = `${startColumn} / ${endColumn}`;");
    expect(source).not.toContain('style="${gridStyle(slot)}"');
    expect(source).not.toContain("function gridStyle");
  });

  it("uses the continuous-strip structure instead of separated region cards", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/systems/default/assets/styles.css"),
      "utf8",
    );
    const headerRule = styles.match(/\.ds-entity-page-header\s*\{[^}]+\}/)?.[0] ?? "";
    const childRule = styles.match(/\.ds-entity-page-header-slot,\n\.ds-entity-page-header-context,\n\.ds-entity-page-header-filter-slot\s*\{[^}]+\}/)?.[0] ?? "";
    const filterRule = styles.match(/\.ds-entity-page-header-filter-slot\s*\{[^}]+\}/)?.[0] ?? "";

    expect(headerRule).toContain("gap: var(--pattern-entity-page-header-gap);");
    expect(headerRule).toContain("border: 0.0625rem solid var(--line);");
    expect(childRule).toContain("border-inline-start: 0.0625rem solid var(--line);");
    expect(filterRule).not.toContain("border:");
    expect(filterRule).not.toContain("border-radius:");
  });
});
