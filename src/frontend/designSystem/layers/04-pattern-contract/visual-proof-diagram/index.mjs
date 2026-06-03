import {
  attachVisualProofSurfacePrimitive,
  renderVisualProofSurfacePrimitive,
  visualProofSurfacePrimitive,
} from "../../03-primitive/visual-proof-surface/index.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/brochure.mjs";
import { spacingScaleTokenSpec } from "../../02-token/spacing-scale/systems/brochure.mjs";
import { supportingTextStyleTokenSpec } from "../../02-token/supporting-text-style/systems/brochure.mjs";
import { visualProofOrnamentTokenSpec } from "../../02-token/visual-proof-ornament/systems/brochure.mjs";

const patternName = "visual-proof-diagram";
const supportedSystems = new Map([
  [
    "brochure",
    {
      labelTextStyleTokenSpec,
      spacingScaleTokenSpec,
      supportingTextStyleTokenSpec,
      visualProofOrnamentTokenSpec,
    },
  ],
]);

const defaultStages = [
  {
    eyebrow: "01",
    title: "Need",
    body: "A real interface need starts the proof trail.",
  },
  {
    eyebrow: "02",
    title: "Artifact",
    body: "Governed tokens and primitives make the evidence reusable.",
  },
  {
    eyebrow: "03",
    title: "Proof",
    body: "Rendered checks keep visual drift visible before adoption.",
  },
];

function assertString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${fieldName} must be a non-empty string.`);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toAttributeString(attributes) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== null && value !== undefined && value !== false)
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(" ");
}

function cssVarStyle(styleValues) {
  return Object.entries(styleValues)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
}

function getSystemProof(systemKey) {
  assertString(systemKey, "systemKey");
  const proof = supportedSystems.get(systemKey);
  if (!proof) {
    throw new RangeError(`visual-proof-diagram has no system proof for "${systemKey}".`);
  }
  return proof;
}

function findVariant(tokenSpec, predicate, missingMessage) {
  const variant = tokenSpec.variants.find(predicate);
  if (!variant) {
    throw new RangeError(missingMessage);
  }
  return variant;
}

function normalizeStages(stages) {
  if (!Array.isArray(stages)) {
    throw new TypeError("stages must be an array.");
  }
  if (stages.length < 2) {
    throw new RangeError("visual-proof-diagram requires at least two stages.");
  }
  return stages.map((stage, index) => {
    const eyebrow = stage?.eyebrow ?? String(index + 1).padStart(2, "0");
    const title = stage?.title ?? "";
    const body = stage?.body ?? "";
    assertString(eyebrow, `stages[${index}].eyebrow`);
    assertString(title, `stages[${index}].title`);
    assertString(body, `stages[${index}].body`);
    return { eyebrow, title, body };
  });
}

function tokenDependenciesFor({ systemKey }) {
  const proof = getSystemProof(systemKey);
  const labelTextStyle = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "visual-proof-diagram requires a signed label-text-style token.",
  );
  const supportingTextStyle = findVariant(
    proof.supportingTextStyleTokenSpec,
    (variant) => variant.role === "supporting text",
    "visual-proof-diagram requires a signed supporting-text-style token.",
  );
  const contentGap = findVariant(
    proof.spacingScaleTokenSpec,
    (variant) => variant.id === "spacing-content-gap",
    "visual-proof-diagram requires a signed content gap spacing token.",
  );
  const compactGap = findVariant(
    proof.spacingScaleTokenSpec,
    (variant) => variant.id === "spacing-compact-gap",
    "visual-proof-diagram requires a signed compact gap spacing token.",
  );
  const sectionPadding = findVariant(
    proof.spacingScaleTokenSpec,
    (variant) => variant.id === "spacing-section-padding",
    "visual-proof-diagram requires a signed section padding spacing token.",
  );
  const ornamentVariants = {
    chip: findVariant(
      proof.visualProofOrnamentTokenSpec,
      (variant) => variant.id === "visual-proof-chip",
      "visual-proof-diagram requires a signed chip ornament token.",
    ),
    connector: findVariant(
      proof.visualProofOrnamentTokenSpec,
      (variant) => variant.id === "visual-proof-connector-line",
      "visual-proof-diagram requires a signed connector ornament token.",
    ),
    accent: findVariant(
      proof.visualProofOrnamentTokenSpec,
      (variant) => variant.id === "visual-proof-accent-bar",
      "visual-proof-diagram requires a signed accent ornament token.",
    ),
    marker: findVariant(
      proof.visualProofOrnamentTokenSpec,
      (variant) => variant.id === "visual-proof-marker",
      "visual-proof-diagram requires a signed marker ornament token.",
    ),
  };

  return { compactGap, contentGap, labelTextStyle, ornamentVariants, sectionPadding, supportingTextStyle };
}

export const visualProofDiagramPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/visual-proof-diagram/VisualProofDiagram-Contract.md",
  supportedSystems: ["brochure"],
  requiredPrimitives: ["visual-proof-surface"],
  directTokenDependencies: ["label-text-style", "spacing-scale", "supporting-text-style", "visual-proof-ornament"],
  consumerRules: [
    "Consumers must use this pattern for governed visual proof diagrams.",
    "Consumers must not recreate the proof surface primitive, stage text styles, connector treatment, or ornament values locally.",
    "Consumers must not treat this pattern as a component seam, demo fixture, canonical scenario, workflow engine, or app adoption seam.",
  ],
};

export function visualProofDiagramPattern(options = {}) {
  const systemKey = options.systemKey ?? "brochure";
  const id = options.id ?? `visual-proof-diagram-${Math.random().toString(36).slice(2, 10)}`;
  const ariaLabel = options.ariaLabel ?? "Visual proof diagram";
  const stages = normalizeStages(options.stages ?? defaultStages);

  assertString(id, "id");
  assertString(ariaLabel, "ariaLabel");

  const tokens = tokenDependenciesFor({ systemKey });
  const surface = visualProofSurfacePrimitive({ systemKey, id: `${id}-surface` });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    id,
    ariaLabel,
    stages,
    surface,
    tokenDependencies: {
      visualProofSurface: {
        primitiveName: surface.primitiveName,
        runtimeSeam: "src/frontend/designSystem/layers/03-primitive/visual-proof-surface/index.mjs#visualProofSurfacePrimitive",
      },
      labelTextStyle: {
        tokenName: tokens.labelTextStyle.tokenName,
        variantId: tokens.labelTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/brochure.mjs#labelTextStyleTokenSpec",
      },
      supportingTextStyle: {
        tokenName: tokens.supportingTextStyle.tokenName,
        variantId: tokens.supportingTextStyle.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/supporting-text-style/systems/brochure.mjs#supportingTextStyleTokenSpec",
      },
      spacing: [tokens.sectionPadding, tokens.contentGap, tokens.compactGap].map((variant) => ({
        tokenName: variant.tokenName,
        variantId: variant.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/spacing-scale/systems/brochure.mjs#spacingScaleTokenSpec",
      })),
      visualProofOrnament: Object.values(tokens.ornamentVariants).map((variant) => ({
        tokenName: variant.tokenName,
        variantId: variant.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/visual-proof-ornament/systems/brochure.mjs#visualProofOrnamentTokenSpec",
      })),
    },
    attributes: {
      id,
      class: "ds-visual-proof-diagram",
      "data-visual-proof-diagram": "",
      "aria-label": ariaLabel,
    },
    styleVars: {
      "--pattern-visual-proof-padding": tokens.sectionPadding.lengthValue,
      "--pattern-visual-proof-content-gap": tokens.contentGap.lengthValue,
      "--pattern-visual-proof-compact-gap": tokens.compactGap.lengthValue,
      "--pattern-visual-proof-chip-background": tokens.ornamentVariants.chip.chipBackgroundValue,
      "--pattern-visual-proof-chip-border": tokens.ornamentVariants.chip.chipBorderValue,
      "--pattern-visual-proof-chip-radius": tokens.ornamentVariants.chip.chipRadiusValue,
      "--pattern-visual-proof-chip-opacity": tokens.ornamentVariants.chip.chipOpacityValue,
      "--pattern-visual-proof-line-color": tokens.ornamentVariants.connector.lineColorValue,
      "--pattern-visual-proof-line-size": tokens.ornamentVariants.connector.lineSizeValue,
      "--pattern-visual-proof-accent-bar": tokens.ornamentVariants.accent.accentBarValue,
      "--pattern-visual-proof-marker-size": tokens.ornamentVariants.marker.markerSizeValue,
      "--pattern-visual-proof-marker-background": tokens.ornamentVariants.marker.markerBackgroundValue,
      "--pattern-visual-proof-marker-radius": tokens.ornamentVariants.marker.markerRadiusValue,
      "--pattern-visual-proof-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--pattern-visual-proof-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--pattern-visual-proof-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--pattern-visual-proof-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--pattern-visual-proof-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--pattern-visual-proof-label-text-transform": tokens.labelTextStyle.textTransform,
      "--pattern-visual-proof-supporting-font-family": tokens.supportingTextStyle.fontFamilyValue,
      "--pattern-visual-proof-supporting-font-size": tokens.supportingTextStyle.fontSizeValue,
      "--pattern-visual-proof-supporting-font-weight": tokens.supportingTextStyle.fontWeightValue,
      "--pattern-visual-proof-supporting-line-height": tokens.supportingTextStyle.lineHeightValue,
      "--pattern-visual-proof-supporting-letter-spacing": tokens.supportingTextStyle.letterSpacingValue,
      "--pattern-visual-proof-supporting-text-transform": tokens.supportingTextStyle.textTransform,
    },
    consumerRestrictions: visualProofDiagramPatternContract.consumerRules,
  };
}

export function renderVisualProofDiagramPattern(options = {}) {
  const spec = visualProofDiagramPattern(options);
  const attributes = {
    ...spec.attributes,
    "data-visual-proof-diagram-style": cssVarStyle(spec.styleVars),
  };

  return `
    <section ${toAttributeString(attributes)}>
      ${renderVisualProofSurfacePrimitive({ systemKey: spec.systemKey, id: spec.surface.id })}
      <span class="ds-visual-proof-diagram-accent" aria-hidden="true"></span>
      <ol class="ds-visual-proof-diagram-stages">
        ${spec.stages
          .map(
            (stage, index) => `
              <li class="ds-visual-proof-diagram-stage">
                <span class="ds-visual-proof-diagram-marker" aria-hidden="true"></span>
                <span class="ds-visual-proof-diagram-eyebrow">${escapeHtml(stage.eyebrow)}</span>
                <strong class="ds-visual-proof-diagram-title">${escapeHtml(stage.title)}</strong>
                <span class="ds-visual-proof-diagram-body">${escapeHtml(stage.body)}</span>
                ${index < spec.stages.length - 1 ? '<span class="ds-visual-proof-diagram-connector" aria-hidden="true"></span>' : ""}
              </li>
            `,
          )
          .join("")}
      </ol>
    </section>
  `;
}

export function attachVisualProofDiagramPattern(root = document) {
  for (const diagram of root.querySelectorAll("[data-visual-proof-diagram]")) {
    if (!(diagram instanceof HTMLElement) || diagram.dataset.visualProofDiagramController === "attached") {
      continue;
    }

    diagram.dataset.visualProofDiagramController = "attached";
    const styleDeclaration = diagram.getAttribute("data-visual-proof-diagram-style");
    if (!styleDeclaration) {
      continue;
    }

    for (const declaration of styleDeclaration.split(";")) {
      const separatorIndex = declaration.indexOf(":");
      if (separatorIndex === -1) {
        continue;
      }

      const property = declaration.slice(0, separatorIndex).trim();
      const value = declaration.slice(separatorIndex + 1).trim();
      if (property && value) {
        diagram.style.setProperty(property, value);
      }
    }
  }

  attachVisualProofSurfacePrimitive(root);
}
