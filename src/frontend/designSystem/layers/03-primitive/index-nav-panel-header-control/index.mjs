import {
  attachIconButtonControlPrimitiveController,
  renderIconButtonControlPrimitive,
} from "../icon-button-control/index.mjs";
import {
  attachTruncatingLabelPrimitiveController,
  renderTruncatingLabelPrimitive,
} from "../truncating-label/index.mjs";
import { indexNavPanelFrameTokenSpec } from "../../02-token/index-nav-panel-frame/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";

const primitiveName = "index-nav-panel-header-control";

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
    indexNavPanelFrameTokenSpec,
    (variant) => variant.id === "index-nav-panel-header-default",
    "index-nav-panel-header-control requires the signed index-nav panel header frame token.",
  );
  const labelTextStyle = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "index-nav-panel-header-control requires a signed label-text-style token.",
  );

  return { headerFrame, labelTextStyle };
}

function normalizeActions(actions, fieldName) {
  if (!Array.isArray(actions)) {
    throw new TypeError(`${fieldName} must be an array.`);
  }
  return actions.map((action, index) => {
    const label = action?.label ?? "";
    const value = action?.value ?? label;
    const icon = action?.icon ?? "plus";
    const visibility = action?.visibility ?? "always";
    assertString(label, `${fieldName}[${index}].label`);
    assertString(value, `${fieldName}[${index}].value`);
    assertString(icon, `${fieldName}[${index}].icon`);
    assertString(visibility, `${fieldName}[${index}].visibility`);
    if (!["always", "mobile"].includes(visibility)) {
      throw new RangeError(`${fieldName}[${index}].visibility does not support "${visibility}".`);
    }
    return { label, value, icon, visibility };
  });
}

export const indexNavPanelHeaderControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/index-nav-panel-header-control/IndexNavPanelHeaderControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["index-nav-panel-frame", "label-text-style"],
  requiredPrimitives: ["icon-button-control", "truncating-label"],
  supportedActionVisibility: ["always", "mobile"],
  consumerRules: [
    "Consumers must use this primitive for governed index-navigation panel headers.",
    "Consumers must not locally recreate header height, sticky position, title truncation, tooltip disclosure, or action alignment.",
    "Consumers must not replace the signed header frame token values with local CSS literals.",
  ],
};

export function indexNavPanelHeaderControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `index-nav-panel-header-control-${Math.random().toString(36).slice(2, 10)}`;
  const title = options.title ?? "";
  const showAddAction = options.showAddAction !== false;
  const addLabel = options.addLabel ?? "Add";
  const actionIcon = options.actionIcon ?? "plus";
  const actions = normalizeActions(
    options.actions ??
      (showAddAction
        ? [
            {
              label: addLabel,
              value: `${id}-add`,
              icon: actionIcon,
              visibility: "always",
            },
          ]
        : []),
    "actions",
  );

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(title, "title");
  assertString(addLabel, "addLabel");
  assertString(actionIcon, "actionIcon");

  const tokens = tokenDependenciesFor();

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    title,
    showAddAction,
    addLabel,
    actionIcon,
    actions,
    tokenDependencies: {
      headerFrame: {
        tokenName: tokens.headerFrame.tokenName,
        variantId: tokens.headerFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs#indexNavPanelFrameTokenSpec",
      },
      labelTextStyle: {
        tokenName: tokens.labelTextStyle.tokenName,
        variantId: tokens.labelTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-index-nav-panel-header-control",
      "data-index-nav-panel-header-control": "",
      "data-index-nav-panel-header-control-theme": theme,
    },
    styleVars: {
      "--primitive-index-nav-panel-header-block-size": tokens.headerFrame.blockSize,
      "--primitive-index-nav-panel-header-min-block-size": tokens.headerFrame.minBlockSize,
      "--primitive-index-nav-panel-header-max-block-size": tokens.headerFrame.maxBlockSizeValue,
      "--primitive-index-nav-panel-header-sticky-top": tokens.headerFrame.stickyInsetBlockStart,
      "--primitive-index-nav-panel-header-gap": tokens.headerFrame.gapValue,
      "--primitive-index-nav-panel-header-background": tokens.headerFrame.backgroundValue,
      "--primitive-index-nav-panel-header-foreground": tokens.headerFrame.foregroundValue,
      "--primitive-index-nav-panel-header-separator": tokens.headerFrame.borderValue,
      "--primitive-index-nav-panel-header-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-index-nav-panel-header-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-index-nav-panel-header-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-index-nav-panel-header-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-index-nav-panel-header-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-index-nav-panel-header-label-text-transform": tokens.labelTextStyle.textTransform,
    },
    consumerRestrictions: indexNavPanelHeaderControlPrimitiveContract.consumerRules,
  };
}

export function renderIndexNavPanelHeaderControlPrimitive(options = {}) {
  const spec = indexNavPanelHeaderControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-index-nav-panel-header-control-style": cssVarStyle(spec.styleVars),
  };

  return `
    <header ${toAttributeString(attributes)}>
      <h3 class="ds-index-nav-panel-header-control-title">
        ${renderTruncatingLabelPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-title`,
          text: spec.title,
        })}
      </h3>
      <div class="ds-index-nav-panel-header-control-actions" data-index-nav-panel-header-actions>
        ${spec.actions
          .map(
            (action, index) => `
              <span
                class="ds-index-nav-panel-header-control-action"
                data-index-nav-panel-header-action-visibility="${escapeHtml(action.visibility)}"
              >
                ${renderIconButtonControlPrimitive({
                  systemKey: spec.systemKey,
                  theme: spec.theme,
                  id: `${spec.id}-action-${index}`,
                  label: action.label,
                  value: action.value,
                  icon: action.icon,
                  frameIntent: "quiet",
                })}
              </span>
            `,
          )
          .join("")}
      </div>
    </header>
  `;
}

export function attachIndexNavPanelHeaderControlPrimitiveController(root = document) {
  for (const header of root.querySelectorAll("[data-index-nav-panel-header-control]")) {
    if (!(header instanceof HTMLElement) || header.dataset.indexNavPanelHeaderControlController === "attached") {
      continue;
    }

    header.dataset.indexNavPanelHeaderControlController = "attached";
    const styleDeclaration = header.getAttribute("data-index-nav-panel-header-control-style");
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
