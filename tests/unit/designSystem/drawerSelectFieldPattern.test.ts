import { describe, expect, it } from "vitest";

import {
  drawerSelectFieldPattern,
  drawerSelectFieldPatternContract,
  renderDrawerSelectFieldPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/drawer-select-field/index.mjs";

const options = [
  { value: "record-page", label: "Record management page", supportingText: "A standard page template." },
  { value: "list-centric", label: "Record management list centric", supportingText: "A list-centric template." },
  { value: "workflow", label: "Workflow routing and operational handoff posture", supportingText: "Long option." },
];

describe("drawer-select-field pattern", () => {
  it("composes field-row primitive with drawer-select pattern", () => {
    const spec = drawerSelectFieldPattern({
      id: "drawer-field-test",
      label: "Page template",
      mode: "multi",
      open: true,
      committedValues: ["record-page"],
      pendingValues: ["record-page", "workflow"],
      options,
    });

    expect(spec).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "drawer-select-field",
      primitives: {
        fieldRow: { primitiveName: "field-row-control" },
      },
      patterns: {
        drawer: { patternName: "drawer-select" },
      },
    });
    expect(drawerSelectFieldPatternContract.requiredPrimitives).toEqual(["field-row-control"]);
    expect(drawerSelectFieldPatternContract.requiredPatterns).toEqual(["drawer-select"]);
    expect(drawerSelectFieldPatternContract.directTokenDependencies).toEqual([]);
  });

  it("renders field label, helper text, and drawer trigger", () => {
    const html = renderDrawerSelectFieldPattern({
      id: "drawer-field-test",
      label: "Page template",
      helperText: "Choose page templates.",
      mode: "multi",
      committedValues: ["record-page", "list-centric"],
      options,
    });

    expect(html).toContain('data-field-row-control=""');
    expect(html).toContain("Choose page templates.");
    expect(html).toContain('data-drawer-select=""');
    expect(html).toContain("2 selected");
    expect(html).not.toContain('data-simple-dropdown-control=""');
  });

  it("maps disabled and error field states without inventing drawer validation", () => {
    const disabled = renderDrawerSelectFieldPattern({
      id: "drawer-field-disabled",
      label: "Page template",
      state: "disabled",
      open: true,
      committedValues: ["record-page"],
      options,
    });

    expect(disabled).toContain('data-field-row-control-slot-disabled="true"');
    expect(disabled).toContain('data-drawer-select-open="false"');
    expect(disabled).toContain('data-count-card-control-mode="static"');

    const error = renderDrawerSelectFieldPattern({
      id: "drawer-field-error",
      label: "Page template",
      state: "error",
      errorText: "Review the drawer selection.",
      committedValues: ["record-page"],
      options,
    });

    expect(error).toContain('data-field-row-control-message="error"');
    expect(error).toContain("Review the drawer selection.");
    expect(error).toContain('data-drawer-select=""');
  });

  it("preserves drawer-select page-shell overlay through the field wrapper", () => {
    const html = renderDrawerSelectFieldPattern({
      id: "drawer-field-mobile",
      label: "Page template",
      mode: "single",
      open: true,
      viewport: "mobile",
      origin: "left",
      theme: "dark",
      committedValue: "record-page",
      pendingValues: ["workflow"],
      options,
    });

    expect(html).toContain('data-drawer-select-field-viewport="mobile"');
    expect(html).toContain('data-drawer-select-overlay="page-shell"');
    expect(html).toContain("--pattern-drawer-overlay-position: fixed");
    expect(html).toContain('data-panel-stack-viewport="mobile"');
  });
});
