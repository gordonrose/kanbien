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
      requiredPatterns: ["header-menu-simple-select"],
      requiredPrimitives: ["icon-button-control", "readiness-status-control", "truncating-label"],
      directTokenDependencies: ["page-header-structure"],
    });
    expect(header).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "entity-page-header",
      showRegionBoundaries: false,
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
      { id: "primary-filter", startColumn: 2, endColumn: 6, width: 4 },
      { id: "secondary-filter", startColumn: 6, endColumn: 10, width: 4 },
      { id: "context-title", startColumn: 10, endColumn: 20, width: 10 },
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
      startColumn: 11,
      endColumn: 23,
      width: 12,
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
    expect(html).toContain("data-entity-page-header-container");
    expect(html).toContain('data-entity-page-header-region-boundaries="false"');
    expect(html).toContain('data-entity-page-header-slot="context-title"');
    expect(html).toContain("data-readiness-status-control");
    expect(html).toContain('data-readiness-status-state="needs-review"');
    expect(html).toContain("data-header-menu-simple-select");
    expect(html).toContain("data-menu-simple-select-control");
    expect(html).toContain('data-menu-simple-select-trigger-variant="text"');
    expect(html).toContain('data-menu-simple-select-trigger-variant="icon"');
    expect(html).toContain('data-menu-simple-select-trigger-icon="filter"');
    expect(html).toContain('data-menu-simple-select-trigger-icon="sort"');
    expect(html).toContain("data-entity-page-header-tools-trigger");
    expect(html).toContain("data-entity-page-header-tools-menu");
    expect(html).toContain('aria-label="Header tools"');
    expect(html).toContain('role="dialog"');
    expect(html).toContain("ds-entity-page-header-tools-menu-header");
    expect(html).toContain("data-entity-page-header-tools-close");
    expect(html).toContain("data-truncating-label");
    expect(html).toContain("data-icon-button-control");
    expect(html.match(/data-header-menu-simple-select /g)).toHaveLength(8);
    expect(html.match(/data-icon-button-control=""/g)).toHaveLength(4);
    expect(html).toContain('aria-label="Add record"');
    expect(html).toContain('aria-label="Open actions"');
    expect(html).toContain("data-entity-page-header-tools-action");
    expect(html).toContain(">Add record</span>");
    expect(html).toContain(">Open actions</span>");
    expect(html).toContain('aria-label="Close header tools"');
    expect(html).toContain('data-entity-page-header-columns="11-22"');
    expect(html).toContain('data-entity-page-header-column-start="11"');
    expect(html).toContain('data-entity-page-header-column-end="23"');
    expect(html).not.toContain("Layer group");
    expect(html).not.toContain("Filter group");
    expect(html).not.toContain("grid-column:");

    const diagnosticHtml = renderEntityPageHeaderPattern({
      id: "entity-page-header-boundary-test",
      showRegionBoundaries: true,
    });
    expect(diagnosticHtml).toContain('data-entity-page-header-region-boundaries="true"');
  });

  it("applies slot placement through the controller instead of inline styles", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/layers/04-pattern-contract/entity-page-header/index.mjs"),
      "utf8",
    );

    expect(source).toContain("data-entity-page-header-column-start");
    expect(source).toContain("data-entity-page-header-column-end");
    expect(source).toContain("renderHeaderMenuSimpleSelectPattern");
    expect(source).toContain("attachHeaderMenuSimpleSelectPatternController");
    expect(source).toContain("function gridColumnBoundary");
    expect(source).toContain("var(--token-page-header-tail-${column})");
    expect(source).toContain("slot.style.gridColumn = `${gridColumnBoundary(startColumn)} / ${gridColumnBoundary(endColumn)}`;");
    expect(source).not.toContain('style="${gridStyle(slot)}"');
    expect(source).not.toContain("function gridStyle");
  });

  it("uses the continuous-strip structure instead of separated region cards", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/systems/default/assets/styles.css"),
      "utf8",
    );
    const headerRule = styles.match(/\.ds-entity-page-header\s*\{[^}]+\}/)?.[0] ?? "";
    const boundaryFrameRule = styles.match(
      /\.ds-entity-page-header\[data-entity-page-header-region-boundaries="true"\]\s*\{[^}]+\}/,
    )?.[0] ?? "";
    const containerRule = styles.match(/\.ds-entity-page-header-container\s*\{[^}]+\}/)?.[0] ?? "";
    const childRule = styles.match(/\.ds-entity-page-header-slot,\n\.ds-entity-page-header-context,\n\.ds-entity-page-header-filter-slot,\n\.ds-entity-page-header-tools-slot\s*\{[^}]+\}/)?.[0] ?? "";
    const boundaryRule = styles.match(
      /\.ds-entity-page-header\[data-entity-page-header-region-boundaries="true"\] > \.ds-entity-page-header-slot,\n\.ds-entity-page-header\[data-entity-page-header-region-boundaries="true"\] > \.ds-entity-page-header-context,\n\.ds-entity-page-header\[data-entity-page-header-region-boundaries="true"\] > \.ds-entity-page-header-filter-slot,\n\.ds-entity-page-header\[data-entity-page-header-region-boundaries="true"\] > \.ds-entity-page-header-tools-slot\s*\{[^}]+\}/,
    )?.[0] ?? "";
    const filterRule = styles.match(/\.ds-entity-page-header-filter-slot\s*\{[^}]+\}/)?.[0] ?? "";
    const proofHostRule = styles.match(/\.entity-page-header-proof-host\s*\{[^}]+\}/)?.[0] ?? "";

    expect(containerRule).toContain("container-name: token-foundation-header;");
    expect(containerRule).toContain("padding: 0.75rem;");
    expect(containerRule).toContain("background: var(--paper);");
    expect(headerRule).toContain("grid-template-columns: repeat(var(--token-header-visible-columns, var(--pattern-entity-page-header-columns, 24)), minmax(0, 1fr));");
    expect(headerRule).toContain("background: transparent;");
    expect(headerRule).toContain("overflow: visible;");
    expect(headerRule).not.toContain("border:");
    expect(headerRule).not.toContain("border-radius:");
    expect(boundaryFrameRule).toContain("border: 0.0625rem solid var(--line);");
    expect(boundaryFrameRule).toContain("border-radius: var(--radius-sm);");
    expect(childRule).not.toContain("border-inline-start:");
    expect(boundaryRule).toContain("border-inline-start: 0.0625rem solid var(--line);");
    expect(filterRule).not.toContain("border:");
    expect(filterRule).not.toContain("border-radius:");
    expect(proofHostRule).toContain("container-name: token-foundation-header;");
    expect(styles).toContain("@container token-foundation-header (max-width: 50rem)");
    expect(styles).toContain(".ds-entity-page-header > .ds-entity-page-header-tools-slot {\n    display: grid;");
    expect(styles).toContain(".ds-entity-page-header > .ds-entity-page-header-context {\n    display: flex;");
    expect(styles).toContain(".ds-entity-page-header-tools-action {\n  display: flex;");
    expect(styles).toContain("block-size: 100dvh;");
  });

  it("keeps the context title region to one rendered line", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/systems/default/assets/styles.css"),
      "utf8",
    );
    const contextRule = styles.match(/\.ds-entity-page-header-context\s*\{[^}]+\}/)?.[0] ?? "";
    const statusRules = [...styles.matchAll(/\.ds-entity-page-header-context \.ds-readiness-status-control\s*\{[^}]+\}/g)].map(
      (match) => match[0],
    );
    const statusRule = statusRules.find((rule) => rule.includes("text-overflow: ellipsis;")) ?? "";

    expect(contextRule).toContain("display: flex;");
    expect(contextRule).toContain("align-items: center;");
    expect(contextRule).toContain("overflow: hidden;");
    expect(contextRule).not.toContain("background:");
    expect(statusRule).toContain("flex: 0 1 auto;");
    expect(statusRule).toContain("text-overflow: ellipsis;");
    expect(statusRule).toContain("white-space: nowrap;");
    expect(statusRule).not.toContain("grid-row:");
  });
});
