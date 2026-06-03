import { accordionFrameTokenSpec } from "../../02-token/accordion-frame/systems/default.mjs";
import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { supportingTextStyleTokenSpec } from "../../02-token/supporting-text-style/systems/default.mjs";
import { resolveDefaultGlyphPath } from "../../../systems/default/glyphs/registry.mjs";
import { renderTruncatingLabelPrimitive } from "../truncating-label/index.mjs";

const primitiveName = "accordion-section-control";
const eventName = "accordion-section-control:toggle";
const allowedStates = new Set(["default", "disabled"]);
const allowedTones = new Set(["neutral", "tinted"]);

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
    .map(([key, value]) => (value === true ? key : `${key}="${escapeHtml(value)}"`))
    .join(" ");
}

function cssVarStyle(styleValues) {
  return Object.entries(styleValues)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
}

function findVariant(tokenSpec, predicate, missingMessage) {
  const variant = tokenSpec.variants.find(predicate);
  if (!variant) {
    throw new RangeError(missingMessage);
  }
  return variant;
}

function tokenDependenciesFor({ theme, tone }) {
  const accordionFrame = findVariant(
    accordionFrameTokenSpec,
    (variant) => variant.id === (tone === "tinted" ? `accordion-frame-tinted-${theme}` : `accordion-frame-${theme}`),
    `accordion-section-control requires the signed accordion-frame token for ${theme}/${tone}.`,
  );
  const labelText = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.id === "label-text-style-short-default",
    "accordion-section-control requires the signed label-text-style token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `accordion-section-control requires the signed focus-ring token for ${theme}.`,
  );
  const minimumTarget = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.id === "target-size-interactive-all",
    "accordion-section-control requires the signed minimum-target-size token.",
  );
  const supportingText = findVariant(
    supportingTextStyleTokenSpec,
    (variant) => variant.role === "supporting text",
    "accordion-section-control requires the signed supporting-text-style token.",
  );

  return { accordionFrame, focusRing, labelText, minimumTarget, supportingText };
}

function glyphPathFor(systemKey) {
  if (systemKey !== "default") {
    throw new RangeError(`accordion-section-control has no glyph registry for "${systemKey}".`);
  }
  return resolveDefaultGlyphPath("chevron-down");
}

function normalizeHeadingLevel(value) {
  const parsed = Number(value ?? 3);
  if (!Number.isInteger(parsed) || parsed < 2 || parsed > 6) {
    throw new RangeError("accordion-section-control headingLevel must be an integer from 2 through 6.");
  }
  return parsed;
}

export const accordionSectionControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/accordion-section-control/AccordionSectionControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  supportedTones: Array.from(allowedTones),
  supportedStates: Array.from(allowedStates),
  requiredTokens: ["accordion-frame", "label-text-style", "supporting-text-style", "focus-ring", "minimum-target-size"],
  requiredPrimitives: ["truncating-label"],
  requiredSystemRegistries: ["glyph-registry"],
  eventName,
  consumerRules: [
    "Consumers must use this primitive for one governed accordion disclosure section.",
    "Consumers must not recreate header button semantics, aria-expanded wiring, content-region ownership, truncation disclosure, or controller behavior locally.",
    "Consumers must not use this primitive as a grouped accordion pattern, workflow builder, field validation surface, or app adoption seam.",
  ],
};

export function accordionSectionControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const tone = options.tone ?? "neutral";
  const id = options.id ?? `accordion-section-${Math.random().toString(36).slice(2, 10)}`;
  const title = options.title ?? "Accordion section";
  const supportingText = options.supportingText ?? "";
  const state = options.state ?? "default";
  const expanded = Boolean(options.expanded);
  const containsError = Boolean(options.containsError);
  const headingLevel = normalizeHeadingLevel(options.headingLevel);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(tone, "tone");
  assertString(id, "id");
  assertString(title, "title");
  assertString(state, "state");
  if (systemKey !== "default") {
    throw new RangeError(`accordion-section-control has no system proof for "${systemKey}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`accordion-section-control does not support state "${state}".`);
  }
  if (!allowedTones.has(tone)) {
    throw new RangeError(`accordion-section-control does not support tone "${tone}".`);
  }

  const tokens = tokenDependenciesFor({ theme, tone });
  const buttonId = `${id}-button`;
  const labelId = `${id}-label`;
  const supportingId = `${id}-supporting`;
  const panelId = `${id}-panel`;
  const iconPath = glyphPathFor(systemKey);

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    tone,
    id,
    title,
    supportingText,
    state,
    expanded,
    containsError,
    headingLevel,
    ids: { buttonId, labelId, supportingId, panelId },
    eventName,
    systemDependencies: {
      glyphRegistry: {
        systemKey,
        semanticGlyphName: "chevron-down",
        runtimeSeam: "src/frontend/designSystem/systems/default/glyphs/registry.mjs#defaultGlyphRegistry",
      },
    },
    tokenDependencies: {
      accordionFrame: {
        tokenName: tokens.accordionFrame.tokenName,
        variantId: tokens.accordionFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/accordion-frame/systems/default.mjs#accordionFrameTokenSpec",
      },
      labelTextStyle: {
        tokenName: tokens.labelText.tokenName,
        variantId: tokens.labelText.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
      },
      supportingTextStyle: {
        tokenName: tokens.supportingText.tokenName,
        variantId: tokens.supportingText.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/supporting-text-style/systems/default.mjs#supportingTextStyleTokenSpec",
      },
      focusRing: {
        tokenName: tokens.focusRing.tokenName,
        variantId: tokens.focusRing.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec",
      },
      minimumTargetSize: {
        tokenName: tokens.minimumTarget.tokenName,
        variantId: tokens.minimumTarget.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-accordion-section-control",
      "data-accordion-section-control": "",
      "data-accordion-section-control-theme": theme,
      "data-accordion-section-control-tone": tone,
      "data-accordion-section-control-state": state,
      "data-accordion-section-control-expanded": expanded ? "true" : "false",
      "data-accordion-section-control-contains-error": containsError ? "true" : "false",
    },
    buttonAttributes: {
      id: buttonId,
      class: "ds-accordion-section-control-button",
      type: "button",
      disabled: state === "disabled" ? true : null,
      "aria-label": title,
      "aria-describedby": supportingText ? supportingId : null,
      "aria-expanded": expanded ? "true" : "false",
      "aria-controls": panelId,
      "data-accordion-section-control-button": "",
    },
    panelAttributes: {
      id: panelId,
      class: "ds-accordion-section-control-panel",
      role: "region",
      "aria-labelledby": buttonId,
      "data-accordion-section-control-panel": "",
      hidden: expanded ? null : true,
    },
    iconPath,
    styleVars: {
      "--primitive-accordion-header-background": tokens.accordionFrame.headerBackgroundValue,
      "--primitive-accordion-header-foreground": tokens.accordionFrame.headerForegroundValue,
      "--primitive-accordion-content-background": tokens.accordionFrame.contentBackgroundValue,
      "--primitive-accordion-content-foreground": tokens.accordionFrame.contentForegroundValue,
      "--primitive-accordion-border": tokens.accordionFrame.borderValue,
      "--primitive-accordion-separator": tokens.accordionFrame.separatorValue,
      "--primitive-accordion-radius": tokens.accordionFrame.radiusValue,
      "--primitive-accordion-header-min-block-size": tokens.accordionFrame.headerMinBlockSize,
      "--primitive-accordion-header-padding-block": tokens.accordionFrame.headerPaddingBlockValue,
      "--primitive-accordion-header-padding-inline": tokens.accordionFrame.headerPaddingInlineValue,
      "--primitive-accordion-content-padding-block": tokens.accordionFrame.contentPaddingBlockValue,
      "--primitive-accordion-content-padding-inline": tokens.accordionFrame.contentPaddingInlineValue,
      "--primitive-accordion-gap": tokens.accordionFrame.gapValue,
      "--primitive-accordion-indicator-inline-size": tokens.accordionFrame.indicatorInlineSize,
      "--primitive-accordion-indicator-block-size": tokens.accordionFrame.indicatorBlockSize,
      "--primitive-accordion-motion-duration": tokens.accordionFrame.motionDurationValue,
      "--primitive-accordion-motion-easing": tokens.accordionFrame.motionEasingValue,
      "--primitive-accordion-label-font-family": tokens.labelText.fontFamilyValue,
      "--primitive-accordion-label-font-size": tokens.labelText.fontSizeValue,
      "--primitive-accordion-label-font-weight": tokens.labelText.fontWeightValue,
      "--primitive-accordion-label-line-height": tokens.labelText.lineHeightValue,
      "--primitive-accordion-label-letter-spacing": tokens.labelText.letterSpacingValue,
      "--primitive-accordion-supporting-font-family": tokens.supportingText.fontFamilyValue,
      "--primitive-accordion-supporting-font-size": tokens.supportingText.fontSizeValue,
      "--primitive-accordion-supporting-font-weight": tokens.supportingText.fontWeightValue,
      "--primitive-accordion-supporting-line-height": tokens.supportingText.lineHeightValue,
      "--primitive-accordion-supporting-letter-spacing": tokens.supportingText.letterSpacingValue,
      "--primitive-accordion-supporting-text-transform": tokens.supportingText.textTransform,
      "--primitive-accordion-focus-ring": tokens.focusRing.ringValue,
      "--primitive-accordion-focus-offset": tokens.focusRing.offsetValue,
      "--primitive-accordion-target-min-width": tokens.minimumTarget.minimumWidth,
      "--primitive-accordion-target-min-height": tokens.minimumTarget.minimumHeight,
    },
    consumerRestrictions: accordionSectionControlPrimitiveContract.consumerRules,
  };
}

export function renderAccordionSectionControlPrimitive(options = {}) {
  const spec = accordionSectionControlPrimitive(options);
  const contentHtml = options.contentHtml ?? "";
  const HeadingTag = `h${spec.headingLevel}`;
  const attributes = {
    ...spec.attributes,
    "data-accordion-section-control-style": cssVarStyle(spec.styleVars),
  };

  return `
    <section ${toAttributeString(attributes)}>
      <${HeadingTag} class="ds-accordion-section-control-heading">
        <button ${toAttributeString(spec.buttonAttributes)}>
          <span class="ds-accordion-section-control-text">
            ${renderTruncatingLabelPrimitive({
              systemKey: spec.systemKey,
              theme: spec.theme,
              focusable: false,
              id: spec.ids.labelId,
              text: spec.title,
            })}
            ${
              spec.supportingText
                ? `<span id="${escapeHtml(spec.ids.supportingId)}" class="ds-accordion-section-control-supporting">
                    ${renderTruncatingLabelPrimitive({
                      systemKey: spec.systemKey,
                      theme: spec.theme,
                      textStyle: "supporting",
                      focusable: false,
                      id: `${spec.ids.supportingId}-label`,
                      text: spec.supportingText,
                    })}
                  </span>`
                : ""
            }
          </span>
          <svg class="ds-accordion-section-control-indicator" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="${escapeHtml(spec.iconPath)}" />
          </svg>
        </button>
      </${HeadingTag}>
      <div ${toAttributeString(spec.panelAttributes)}>
        ${contentHtml}
      </div>
    </section>
  `;
}

function applyStyleDeclaration(element) {
  const styleDeclaration = element.getAttribute("data-accordion-section-control-style");
  if (!styleDeclaration) {
    return;
  }

  for (const declaration of styleDeclaration.split(";")) {
    const separatorIndex = declaration.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }
    const property = declaration.slice(0, separatorIndex).trim();
    const value = declaration.slice(separatorIndex + 1).trim();
    if (property && value) {
      element.style.setProperty(property, value);
    }
  }
}

function setExpanded(section, button, panel, expanded) {
  section.dataset.accordionSectionControlExpanded = expanded ? "true" : "false";
  button.setAttribute("aria-expanded", expanded ? "true" : "false");
  if (expanded) {
    panel.removeAttribute("hidden");
  } else {
    if (panel.contains(document.activeElement)) {
      button.focus();
    }
    panel.setAttribute("hidden", "");
  }
}

export function attachAccordionSectionControlPrimitiveController(root = document) {
  for (const section of root.querySelectorAll("[data-accordion-section-control]")) {
    if (!(section instanceof HTMLElement) || section.dataset.accordionSectionControlController === "attached") {
      continue;
    }

    section.dataset.accordionSectionControlController = "attached";
    applyStyleDeclaration(section);

    const button = section.querySelector("[data-accordion-section-control-button]");
    const panel = section.querySelector("[data-accordion-section-control-panel]");
    if (!(button instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      continue;
    }

    button.addEventListener("click", () => {
      if (button.disabled) {
        return;
      }
      const expanded = button.getAttribute("aria-expanded") !== "true";
      setExpanded(section, button, panel, expanded);
      section.dispatchEvent(
        new CustomEvent(eventName, {
          bubbles: true,
          detail: {
            id: section.id,
            expanded,
          },
        }),
      );
    });
  }
}
