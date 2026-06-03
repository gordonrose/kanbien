import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/brochure.mjs";
import { listMarkerStyleTokenSpec } from "../../02-token/list-marker-style/systems/brochure.mjs";
import { spacingScaleTokenSpec } from "../../02-token/spacing-scale/systems/brochure.mjs";
import { supportingTextStyleTokenSpec } from "../../02-token/supporting-text-style/systems/brochure.mjs";
import { surfaceFrameTokenSpec } from "../../02-token/surface-frame/systems/brochure.mjs";
import { typographyScaleTokenSpec } from "../../02-token/typography-scale/systems/brochure.mjs";
import {
  attachBrochureTextLinkActionPrimitive,
  renderBrochureTextLinkActionPrimitive,
} from "../../03-primitive/brochure-text-link-action/index.mjs";

const patternName = "brochure-evidence-section";
const supportedSystems = new Map([
  [
    "brochure",
    {
      labelTextStyleTokenSpec,
      listMarkerStyleTokenSpec,
      spacingScaleTokenSpec,
      supportingTextStyleTokenSpec,
      surfaceFrameTokenSpec,
      typographyScaleTokenSpec,
    },
  ],
]);

const defaultItems = [
  {
    label: "Design-system artifacts",
    body: "record behavior, tokens, primitives, patterns, and adoption boundaries.",
  },
  {
    label: "Canonical renderings",
    body: "make approved UI states visible in the browser.",
  },
  {
    label: "Visual proof",
    body: "verifies responsive, theme, and interaction behavior.",
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
    throw new RangeError(`brochure-evidence-section has no system proof for "${systemKey}".`);
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

function normalizeItems(items) {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array.");
  }
  if (items.length < 1) {
    throw new RangeError("brochure-evidence-section requires at least one evidence item.");
  }
  return items.map((item, index) => {
    const label = item?.label ?? "";
    const body = item?.body ?? "";
    assertString(label, `items[${index}].label`);
    assertString(body, `items[${index}].body`);
    return { label, body };
  });
}

function normalizeAction(action) {
  if (action === null || action === undefined) {
    return null;
  }
  const label = action?.label ?? "";
  const href = action?.href ?? "";
  assertString(label, "action.label");
  assertString(href, "action.href");
  return { label, href };
}

function tokenDependenciesFor({ systemKey }) {
  const proof = getSystemProof(systemKey);
  const surface = findVariant(
    proof.surfaceFrameTokenSpec,
    (variant) => variant.id === "surface-frame-panel",
    "brochure-evidence-section requires a signed panel surface token.",
  );
  const sectionPadding = findVariant(
    proof.spacingScaleTokenSpec,
    (variant) => variant.id === "spacing-section-padding",
    "brochure-evidence-section requires a signed section padding spacing token.",
  );
  const contentGap = findVariant(
    proof.spacingScaleTokenSpec,
    (variant) => variant.id === "spacing-content-gap",
    "brochure-evidence-section requires a signed content gap spacing token.",
  );
  const compactGap = findVariant(
    proof.spacingScaleTokenSpec,
    (variant) => variant.id === "spacing-compact-gap",
    "brochure-evidence-section requires a signed compact gap spacing token.",
  );
  const eyebrowText = findVariant(
    proof.typographyScaleTokenSpec,
    (variant) => variant.id === "typography-eyebrow",
    "brochure-evidence-section requires a signed eyebrow typography token.",
  );
  const headingText = findVariant(
    proof.typographyScaleTokenSpec,
    (variant) => variant.id === "typography-section-heading",
    "brochure-evidence-section requires a signed section heading typography token.",
  );
  const supportingText = findVariant(
    proof.supportingTextStyleTokenSpec,
    (variant) => variant.role === "supporting text",
    "brochure-evidence-section requires a signed supporting-text-style token.",
  );
  const labelText = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "brochure-evidence-section requires a signed label-text-style token.",
  );
  const marker = findVariant(
    proof.listMarkerStyleTokenSpec,
    (variant) => variant.id === "list-marker-bullet",
    "brochure-evidence-section requires a signed bullet marker token.",
  );

  return { compactGap, contentGap, eyebrowText, headingText, labelText, marker, sectionPadding, supportingText, surface };
}

export const brochureEvidenceSectionPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/brochure-evidence-section/BrochureEvidenceSection-Contract.md",
  supportedSystems: ["brochure"],
  requiredPrimitives: ["brochure-text-link-action when action slot is used"],
  directTokenDependencies: [
    "surface-frame",
    "spacing-scale",
    "typography-scale",
    "supporting-text-style",
    "label-text-style",
    "list-marker-style",
  ],
  consumerRules: [
    "Consumers must use this pattern for governed brochure evidence sections.",
    "Consumers must not recreate the section surface, marker, spacing, or text treatment locally.",
    "Consumers must not add links, buttons, component props, app wrappers, or app adoption through this pattern.",
  ],
};

export function brochureEvidenceSectionPattern(options = {}) {
  const systemKey = options.systemKey ?? "brochure";
  const id = options.id ?? `brochure-evidence-section-${Math.random().toString(36).slice(2, 10)}`;
  const eyebrow = options.eyebrow ?? "Evidence";
  const heading = options.heading ?? "Evidence in the repo";
  const intro =
    options.intro ??
    "The public evidence is the shape of the governed front-end harness: design-system behavior rules, token and primitive work, pattern contracts, canonical renderings, app adoption checks, visual evidence, and issue reconciliation notes.";
  const items = normalizeItems(options.items ?? defaultItems);
  const action = normalizeAction(options.action);

  assertString(id, "id");
  assertString(eyebrow, "eyebrow");
  assertString(heading, "heading");
  assertString(intro, "intro");

  const tokens = tokenDependenciesFor({ systemKey });
  const headingId = `${id}-heading`;

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    id,
    headingId,
    eyebrow,
    heading,
    intro,
    items,
    action,
    tokenDependencies: {
      brochureTextLinkAction: action
        ? {
            primitiveName: "brochure-text-link-action",
            runtimeSeam:
              "src/frontend/designSystem/layers/03-primitive/brochure-text-link-action/index.mjs#brochureTextLinkActionPrimitive",
          }
        : null,
      surfaceFrame: {
        tokenName: tokens.surface.tokenName,
        variantId: tokens.surface.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/surface-frame/systems/brochure.mjs#surfaceFrameTokenSpec",
      },
      spacing: [tokens.sectionPadding, tokens.contentGap, tokens.compactGap].map((variant) => ({
        tokenName: variant.tokenName,
        variantId: variant.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/spacing-scale/systems/brochure.mjs#spacingScaleTokenSpec",
      })),
      typographyScale: [tokens.eyebrowText, tokens.headingText].map((variant) => ({
        tokenName: variant.tokenName,
        variantId: variant.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/typography-scale/systems/brochure.mjs#typographyScaleTokenSpec",
      })),
      supportingTextStyle: {
        tokenName: tokens.supportingText.tokenName,
        variantId: tokens.supportingText.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/supporting-text-style/systems/brochure.mjs#supportingTextStyleTokenSpec",
      },
      labelTextStyle: {
        tokenName: tokens.labelText.tokenName,
        variantId: tokens.labelText.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/brochure.mjs#labelTextStyleTokenSpec",
      },
      listMarkerStyle: {
        tokenName: tokens.marker.tokenName,
        variantId: tokens.marker.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/list-marker-style/systems/brochure.mjs#listMarkerStyleTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-brochure-evidence-section",
      "data-brochure-evidence-section": "",
      "aria-labelledby": headingId,
    },
    styleVars: {
      "--pattern-brochure-evidence-background": tokens.surface.backgroundValue,
      "--pattern-brochure-evidence-foreground": tokens.surface.foregroundValue,
      "--pattern-brochure-evidence-border": tokens.surface.borderValue,
      "--pattern-brochure-evidence-border-width": tokens.surface.borderWidthValue,
      "--pattern-brochure-evidence-radius": tokens.surface.radiusValue,
      "--pattern-brochure-evidence-shadow": tokens.surface.shadowValue,
      "--pattern-brochure-evidence-padding": tokens.sectionPadding.lengthValue,
      "--pattern-brochure-evidence-content-gap": tokens.contentGap.lengthValue,
      "--pattern-brochure-evidence-compact-gap": tokens.compactGap.lengthValue,
      "--pattern-brochure-evidence-eyebrow-font-family": tokens.eyebrowText.fontFamilyValue,
      "--pattern-brochure-evidence-eyebrow-font-size": tokens.eyebrowText.fontSizeValue,
      "--pattern-brochure-evidence-eyebrow-font-weight": tokens.eyebrowText.fontWeightValue,
      "--pattern-brochure-evidence-eyebrow-line-height": tokens.eyebrowText.lineHeightValue,
      "--pattern-brochure-evidence-eyebrow-letter-spacing": tokens.eyebrowText.letterSpacingValue,
      "--pattern-brochure-evidence-eyebrow-text-transform": tokens.eyebrowText.textTransform,
      "--pattern-brochure-evidence-heading-font-family": tokens.headingText.fontFamilyValue,
      "--pattern-brochure-evidence-heading-font-size": tokens.headingText.fontSizeValue,
      "--pattern-brochure-evidence-heading-font-weight": tokens.headingText.fontWeightValue,
      "--pattern-brochure-evidence-heading-line-height": tokens.headingText.lineHeightValue,
      "--pattern-brochure-evidence-heading-letter-spacing": tokens.headingText.letterSpacingValue,
      "--pattern-brochure-evidence-heading-text-transform": tokens.headingText.textTransform,
      "--pattern-brochure-evidence-body-font-family": tokens.supportingText.fontFamilyValue,
      "--pattern-brochure-evidence-body-font-size": tokens.supportingText.fontSizeValue,
      "--pattern-brochure-evidence-body-font-weight": tokens.supportingText.fontWeightValue,
      "--pattern-brochure-evidence-body-line-height": tokens.supportingText.lineHeightValue,
      "--pattern-brochure-evidence-body-letter-spacing": tokens.supportingText.letterSpacingValue,
      "--pattern-brochure-evidence-body-text-transform": tokens.supportingText.textTransform,
      "--pattern-brochure-evidence-label-font-family": tokens.labelText.fontFamilyValue,
      "--pattern-brochure-evidence-label-font-size": tokens.labelText.fontSizeValue,
      "--pattern-brochure-evidence-label-font-weight": tokens.labelText.fontWeightValue,
      "--pattern-brochure-evidence-label-line-height": tokens.labelText.lineHeightValue,
      "--pattern-brochure-evidence-label-letter-spacing": tokens.labelText.letterSpacingValue,
      "--pattern-brochure-evidence-label-text-transform": tokens.labelText.textTransform,
      "--pattern-brochure-evidence-marker-inline-size": tokens.marker.inlineSizeValue,
      "--pattern-brochure-evidence-marker-block-size": tokens.marker.blockSizeValue,
      "--pattern-brochure-evidence-marker-radius": tokens.marker.radiusValue,
      "--pattern-brochure-evidence-marker-background": tokens.marker.backgroundValue,
      "--pattern-brochure-evidence-marker-border": tokens.marker.borderValue,
    },
    consumerRestrictions: brochureEvidenceSectionPatternContract.consumerRules,
  };
}

export function renderBrochureEvidenceSectionPattern(options = {}) {
  const spec = brochureEvidenceSectionPattern(options);
  const attributes = {
    ...spec.attributes,
    "data-brochure-evidence-section-style": cssVarStyle(spec.styleVars),
  };

  return `
    <section ${toAttributeString(attributes)}>
      <p class="ds-brochure-evidence-eyebrow">${escapeHtml(spec.eyebrow)}</p>
      <h2 class="ds-brochure-evidence-heading" id="${escapeHtml(spec.headingId)}">${escapeHtml(spec.heading)}</h2>
      <p class="ds-brochure-evidence-intro">${escapeHtml(spec.intro)}</p>
      <ul class="ds-brochure-evidence-list">
        ${spec.items
          .map(
            (item) => `
              <li class="ds-brochure-evidence-item">
                <span class="ds-brochure-evidence-marker" aria-hidden="true"></span>
                <span class="ds-brochure-evidence-item-text">
                  <strong class="ds-brochure-evidence-item-label">${escapeHtml(item.label)}:</strong>
                  <span class="ds-brochure-evidence-item-body">${escapeHtml(item.body)}</span>
                </span>
              </li>
            `,
          )
          .join("")}
      </ul>
      ${
        spec.action
          ? renderBrochureTextLinkActionPrimitive({
              id: `${spec.id}-action`,
              href: spec.action.href,
              label: spec.action.label,
            })
          : ""
      }
    </section>
  `;
}

export function attachBrochureEvidenceSectionPattern(root = document) {
  for (const section of root.querySelectorAll("[data-brochure-evidence-section]")) {
    if (!(section instanceof HTMLElement) || section.dataset.brochureEvidenceSectionController === "attached") {
      continue;
    }

    section.dataset.brochureEvidenceSectionController = "attached";
    const styleDeclaration = section.getAttribute("data-brochure-evidence-section-style");
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
        section.style.setProperty(property, value);
      }
    }
  }

  attachBrochureTextLinkActionPrimitive(root);
}
