import { describe, expect, it } from "vitest";

import {
  brochurePipelineStepSelectorPrimitive,
  brochurePipelineStepSelectorPrimitiveContract,
  renderBrochurePipelineStepSelectorPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/brochure-pipeline-step-selector/index.mjs";

const steps = [
  { id: "ui-need", number: "01", label: "UI need", panelId: "pipeline-panel-ui-need" },
  { id: "design-system-proof", number: "02", label: "Design-system proof", panelId: "pipeline-panel-design-system-proof" },
  { id: "seam", number: "03", label: "Seam", panelId: "pipeline-panel-seam" },
];

describe("brochure pipeline step selector primitive", () => {
  it("records signed brochure token dependencies", () => {
    const spec = brochurePipelineStepSelectorPrimitive({
      id: "pipeline-selector-proof",
      label: "Public pipeline",
      steps,
    });

    expect(spec.primitiveName).toBe("brochure-pipeline-step-selector");
    expect(spec.systemKey).toBe("brochure");
    expect(spec.activeStepId).toBe("ui-need");
    expect(spec.eventName).toBe("brochure-pipeline-step-selector:change");
    expect(spec.tokenDependencies.inactiveFrame.variantId).toBe("pipeline-showcase-step-selector-inactive");
    expect(spec.tokenDependencies.activeFrame.variantId).toBe("pipeline-showcase-step-selector-active");
    expect(spec.tokenDependencies.dropdownFrame.variantId).toBe("pipeline-showcase-mobile-dropdown-selector");
    expect(spec.tokenDependencies.activeFrame.runtimeSeam).toContain(
      "pipeline-showcase-frame/systems/brochure.mjs#pipelineShowcaseFrameTokenSpec",
    );
    expect(spec.tokenDependencies.focusRing.variantId).toBe("focus-ring-visible-original");
    expect(spec.tokenDependencies.labelTextStyle.variantId).toBe("label-text-style-short-default");
    expect(spec.tokenDependencies.minimumTargetSize.variantId).toBe("target-size-interactive-all");
    expect(brochurePipelineStepSelectorPrimitiveContract.requiredTokens).toEqual([
      "pipeline-showcase-frame",
      "focus-ring",
      "label-text-style",
      "minimum-target-size",
    ]);
  });

  it("renders desktop tablist and mobile custom listbox selectors from one active state", () => {
    const html = renderBrochurePipelineStepSelectorPrimitive({
      id: "pipeline-selector-proof",
      label: "Public pipeline",
      steps,
      activeStepId: "design-system-proof",
    });

    expect(html).toContain('data-brochure-pipeline-step-selector=""');
    expect(html).toContain('data-brochure-pipeline-step-selector-select');
    expect(html).toContain('data-brochure-pipeline-step-selector-select-trigger');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('role="listbox"');
    expect(html).toContain('role="option"');
    expect(html).toContain('data-brochure-pipeline-step-selector-select-option');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('aria-label="Public pipeline"');
    expect(html).toContain('role="tab"');
    expect(html).toContain('aria-controls="pipeline-panel-design-system-proof"');
    expect(html).toContain('data-brochure-pipeline-step-id="design-system-proof"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('value="design-system-proof"');
    expect(html).toContain("02 Design-system proof");
    expect(html).toContain("--primitive-brochure-pipeline-active-border-width: 0.125rem");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<option");
    expect(html).not.toContain("public-site-showcase");
  });

  it("escapes step label, panel, and selector text", () => {
    const html = renderBrochurePipelineStepSelectorPrimitive({
      id: "pipeline-selector-proof",
      label: "Pipeline <proof>",
      steps: [{ id: "one", number: "01", label: "Step <one>", panelId: "panel-<one>" }],
    });

    expect(html).toContain("Pipeline &lt;proof&gt;");
    expect(html).toContain("Step &lt;one&gt;");
    expect(html).toContain('aria-controls="panel-&lt;one&gt;"');
  });

  it("rejects empty values, missing steps, unsupported systems, and unknown active steps", () => {
    expect(() => brochurePipelineStepSelectorPrimitive({ steps: [] })).toThrow("steps must be a non-empty array");
    expect(() => brochurePipelineStepSelectorPrimitive({ steps: [{ id: "one", label: "", number: "01" }] })).toThrow(
      "steps[0].label must be a non-empty string",
    );
    expect(() => brochurePipelineStepSelectorPrimitive({ steps, activeStepId: "missing" })).toThrow(
      'activeStepId "missing" does not match a provided step.',
    );
    expect(() => brochurePipelineStepSelectorPrimitive({ systemKey: "default", steps })).toThrow(
      'brochure-pipeline-step-selector has no system proof for "default"',
    );
  });

  it("exposes controller hooks without rendering panels", () => {
    const html = renderBrochurePipelineStepSelectorPrimitive({
      id: "pipeline-selector-proof",
      label: "Public pipeline",
      steps,
    });

    expect(html).toContain('data-brochure-pipeline-step-selector-active-step-id="ui-need"');
    expect(html).toContain('data-brochure-pipeline-step-selector-style=');
    expect(html).not.toContain('role="tabpanel"');
    expect(html).not.toContain("public-site-showcase-panel");
  });

  it("exposes custom dropdown controller hooks instead of native select behavior", () => {
    const html = renderBrochurePipelineStepSelectorPrimitive({
      id: "pipeline-selector-proof",
      label: "Public pipeline",
      steps,
    });

    expect(html).toContain('data-brochure-pipeline-step-selector-select-value');
    expect(html).toContain('data-brochure-pipeline-step-selector-select-menu');
    expect(html).toContain('data-brochure-pipeline-step-selector-select-listbox');
    expect(html).toContain('data-brochure-pipeline-step-selector-select-label');
  });
});
