import { describe, expect, it } from "vitest";

import {
  renderVisualProofDiagramPattern,
  visualProofDiagramPattern,
  visualProofDiagramPatternContract,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/visual-proof-diagram/index.mjs";

type TokenDependency = { tokenName: string };

describe("visual-proof-diagram pattern seam", () => {
  it("composes the visual-proof-surface primitive with signed brochure tokens", () => {
    const diagram = visualProofDiagramPattern({
      id: "proof-diagram",
      stages: [
        { eyebrow: "01", title: "Need", body: "A real interface need starts the proof trail." },
        { eyebrow: "02", title: "Proof", body: "Rendered checks keep visual drift visible." },
      ],
    });

    expect(diagram).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "visual-proof-diagram",
      systemKey: "brochure",
      surface: {
        primitiveName: "visual-proof-surface",
        semantics: {
          ariaHidden: true,
          interactive: false,
        },
      },
      tokenDependencies: {
        labelTextStyle: {
          tokenName: "--label-text-style-short-default",
        },
        supportingTextStyle: {
          tokenName: "--supporting-text-style-default",
        },
      },
    });
    expect(diagram.tokenDependencies.spacing.map((token: TokenDependency) => token.tokenName)).toEqual([
      "--spacing-section-padding",
      "--spacing-content-gap",
      "--spacing-compact-gap",
    ]);
    expect(diagram.tokenDependencies.visualProofOrnament.map((token: TokenDependency) => token.tokenName)).toEqual([
      "--visual-proof-chip",
      "--visual-proof-connector-line",
      "--visual-proof-accent-bar",
      "--visual-proof-marker",
    ]);
  });

  it("renders ordered text-bearing stages while keeping ornament decorative", () => {
    const html = renderVisualProofDiagramPattern({
      id: "proof-diagram",
      ariaLabel: "Pipeline proof",
      stages: [
        { eyebrow: "01", title: "Need", body: "A real interface need starts the proof trail." },
        { eyebrow: "02", title: "Proof", body: "Rendered checks keep visual drift visible." },
      ],
    });

    expect(html).toContain('aria-label="Pipeline proof"');
    expect(html).toContain("<ol");
    expect(html).toContain("<li");
    expect(html).toContain("Need");
    expect(html).toContain("Rendered checks keep visual drift visible.");
    expect(html).toContain('data-visual-proof-surface=""');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('class="ds-visual-proof-diagram-connector" aria-hidden="true"');
    expect(html).not.toContain("<button");
  });

  it("rejects incomplete stage data and unsupported systems", () => {
    expect(() => visualProofDiagramPattern({ systemKey: "default" })).toThrow(
      'visual-proof-diagram has no system proof for "default".',
    );
    expect(() => visualProofDiagramPattern({ stages: [{ eyebrow: "01", title: "Only", body: "One" }] })).toThrow(
      "visual-proof-diagram requires at least two stages.",
    );
    expect(() =>
      visualProofDiagramPattern({
        stages: [
          { eyebrow: "01", title: "Need", body: "A real interface need starts the proof trail." },
          { eyebrow: "02", title: "", body: "Missing title should fail." },
        ],
      }),
    ).toThrow("stages[1].title must be a non-empty string.");
  });

  it("documents the pattern boundary", () => {
    expect(visualProofDiagramPatternContract).toMatchObject({
      schema: "kanbien.designSystem.patternContract.v1",
      patternName: "visual-proof-diagram",
      status: "review-ready",
      requiredPrimitives: ["visual-proof-surface"],
      directTokenDependencies: ["label-text-style", "spacing-scale", "supporting-text-style", "visual-proof-ornament"],
    });
    expect(visualProofDiagramPatternContract.consumerRules).toContain(
      "Consumers must not treat this pattern as a component seam, demo fixture, canonical scenario, workflow engine, or app adoption seam.",
    );
  });
});
