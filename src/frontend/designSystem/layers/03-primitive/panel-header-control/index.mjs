import {
  attachIconButtonControlPrimitiveController,
  renderIconButtonControlPrimitive,
} from "../icon-button-control/index.mjs";
import {
  attachTruncatingLabelPrimitiveController,
  renderTruncatingLabelPrimitive,
} from "../truncating-label/index.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { panelHeaderFrameTokenSpec } from "../../02-token/panel-header-frame/systems/default.mjs";

const primitiveName = "panel-header-control";

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

function tokenDependenciesFor() {
  const headerFrame = findVariant(
    panelHeaderFrameTokenSpec,
    (variant) => variant.id === "panel-header-frame-default",
    "panel-header-control requires the signed generic panel header frame token.",
  );
  const labelTextStyle = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "panel-header-control requires a signed label-text-style token.",
  );

  return { headerFrame, labelTextStyle };
}

export const panelHeaderControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/panel-header-control/PanelHeaderControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["panel-header-frame", "label-text-style"],
  requiredPrimitives: ["icon-button-control", "truncating-label"],
  consumerRules: [
    "Consumers must use this primitive for governed generic panel headers.",
    "Consumers must not locally recreate header height, sticky position, title truncation, tooltip disclosure, separator, or action alignment.",
    "Consumers must not replace signed panel-header-frame token values with local CSS literals.",
  ],
};

export function panelHeaderControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `panel-header-control-${Math.random().toString(36).slice(2, 10)}`;
  const title = options.title ?? "";
  const showAction = options.showAction !== false;
  const actionLabel = options.actionLabel ?? "Action";
  const actionIcon = options.actionIcon ?? "plus";
  const sticky = options.sticky !== false;

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(title, "title");
  assertString(actionLabel, "actionLabel");
  assertString(actionIcon, "actionIcon");

  const tokens = tokenDependenciesFor();

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    title,
    showAction,
    actionLabel,
    actionIcon,
    sticky,
    tokenDependencies: {
      headerFrame: {
        tokenName: tokens.headerFrame.tokenName,
        variantId: tokens.headerFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/panel-header-frame/systems/default.mjs#panelHeaderFrameTokenSpec",
      },
      labelTextStyle: {
        tokenName: tokens.labelTextStyle.tokenName,
        variantId: tokens.labelTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-panel-header-control",
      "data-panel-header-control": "",
      "data-panel-header-control-theme": theme,
      "data-panel-header-control-sticky": sticky ? "true" : "false",
    },
    styleVars: {
      "--primitive-panel-header-block-size": tokens.headerFrame.blockSize,
      "--primitive-panel-header-min-block-size": tokens.headerFrame.minBlockSize,
      "--primitive-panel-header-max-block-size": tokens.headerFrame.maxBlockSizeValue,
      "--primitive-panel-header-sticky-top": tokens.headerFrame.stickyInsetBlockStart,
      "--primitive-panel-header-gap": tokens.headerFrame.gapValue,
      "--primitive-panel-header-background": tokens.headerFrame.backgroundValue,
      "--primitive-panel-header-foreground": tokens.headerFrame.foregroundValue,
      "--primitive-panel-header-separator": tokens.headerFrame.borderValue,
      "--primitive-panel-header-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-panel-header-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-panel-header-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-panel-header-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-panel-header-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-panel-header-label-text-transform": tokens.labelTextStyle.textTransform,
    },
    consumerRestrictions: panelHeaderControlPrimitiveContract.consumerRules,
  };
}

export function renderPanelHeaderControlPrimitive(options = {}) {
  const spec = panelHeaderControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-panel-header-control-style": cssVarStyle(spec.styleVars),
  };

  return `
    <header ${toAttributeString(attributes)}>
      <h3 class="ds-panel-header-control-title">
        ${renderTruncatingLabelPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-title`,
          text: spec.title,
        })}
      </h3>
      ${
        spec.showAction
          ? renderIconButtonControlPrimitive({
              systemKey: spec.systemKey,
              theme: spec.theme,
              id: `${spec.id}-action`,
              label: spec.actionLabel,
              value: `${spec.id}-action`,
              icon: spec.actionIcon,
              frameIntent: "quiet",
            })
          : ""
      }
    </header>
  `;
}

export function attachPanelHeaderControlPrimitiveController(root = document) {
  for (const header of root.querySelectorAll("[data-panel-header-control]")) {
    if (!(header instanceof HTMLElement) || header.dataset.panelHeaderControlController === "attached") {
      continue;
    }

    header.dataset.panelHeaderControlController = "attached";
    const styleDeclaration = header.getAttribute("data-panel-header-control-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) {
          continue;
        }
        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (property && value) {
          header.style.setProperty(property, value);
        }
      }
    }
  }

  attachIconButtonControlPrimitiveController(root);
  attachTruncatingLabelPrimitiveController(root);
}
