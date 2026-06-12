import { bodyRegionFrameTokenSpec } from "../../02-token/body-region-frame/systems/default.mjs";
import {
  attachScrollRegionControlPrimitiveController,
  renderScrollRegionControlPrimitive,
} from "../scroll-region-control/index.mjs";

const primitiveName = "body-region-control";
const allowedStates = new Set(["default", "empty", "loading", "read-only", "editable", "error", "blocked-foundation"]);

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

function bodyRegionFrameIdForTheme(theme) {
  return theme === "original" ? "body-region-frame-default" : `body-region-frame-default-${theme}`;
}

function tokenDependenciesFor(theme) {
  const bodyRegionFrame = findVariant(
    bodyRegionFrameTokenSpec,
    (variant) => variant.id === bodyRegionFrameIdForTheme(theme),
    `body-region-control requires the signed ${theme} body-region-frame token.`,
  );

  return { bodyRegionFrame };
}

export const bodyRegionControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/body-region-control/BodyRegionControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["body-region-frame"],
  requiredPrimitives: ["scroll-region-control"],
  allowedStates: Array.from(allowedStates),
  consumerRules: [
    "Consumers must use this primitive for governed body/content region hosts.",
    "Consumers must not recreate body-region frame, state attributes, or scroll composition locally.",
    "Consumers must not treat supplied proof content as governed field, builder, selector, accordion, validation, or product-data behavior.",
  ],
};

export function bodyRegionControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `body-region-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Body region";
  const state = options.state ?? "default";
  const mobileMode = options.mobileMode ?? "page-scroll";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(state, "state");
  assertString(mobileMode, "mobileMode");

  if (!allowedStates.has(state)) {
    throw new RangeError(`body-region-control does not support state "${state}".`);
  }

  if (!["page-scroll", "internal-scroll"].includes(mobileMode)) {
    throw new RangeError(`body-region-control does not support mobileMode "${mobileMode}".`);
  }

  const tokens = tokenDependenciesFor(theme);

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    state,
    mobileMode,
    tokenDependencies: {
      bodyRegionFrame: {
        tokenName: tokens.bodyRegionFrame.tokenName,
        variantId: tokens.bodyRegionFrame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/body-region-frame/systems/default.mjs#bodyRegionFrameTokenSpec",
      },
      scrollRegionControl: {
        primitiveName: "scroll-region-control",
        runtimeSeam: "src/frontend/designSystem/layers/03-primitive/scroll-region-control/index.mjs#scrollRegionControlPrimitive",
      },
    },
    attributes: {
      id,
      class: "ds-body-region-control",
      "data-body-region-control": "",
      "data-body-region-control-theme": theme,
      "data-body-region-control-state": state,
      "aria-label": label,
      "aria-busy": state === "loading" ? "true" : null,
    },
    styleVars: {
      "--primitive-body-region-background": tokens.bodyRegionFrame.backgroundValue,
      "--primitive-body-region-foreground": tokens.bodyRegionFrame.foregroundValue,
      "--primitive-body-region-border": tokens.bodyRegionFrame.borderValue,
      "--primitive-body-region-radius": tokens.bodyRegionFrame.radiusValue,
      "--primitive-body-region-padding-block": tokens.bodyRegionFrame.paddingBlockValue,
      "--primitive-body-region-padding-inline": tokens.bodyRegionFrame.paddingInlineValue,
      "--primitive-body-region-gap": tokens.bodyRegionFrame.gapValue,
      "--primitive-body-region-section-gap": tokens.bodyRegionFrame.sectionGapValue,
      "--primitive-body-region-min-inline-size": tokens.bodyRegionFrame.minInlineSize,
      "--primitive-body-region-max-inline-size": tokens.bodyRegionFrame.maxInlineSize,
      "--primitive-body-region-min-block-size": tokens.bodyRegionFrame.minBlockSize,
      "--primitive-body-region-max-block-size": tokens.bodyRegionFrame.desktopMaxBlockSize,
      "--primitive-body-region-state-spacing": tokens.bodyRegionFrame.stateSpacingValue,
    },
    consumerRestrictions: bodyRegionControlPrimitiveContract.consumerRules,
  };
}

export function renderBodyRegionControlPrimitive(options = {}) {
  const spec = bodyRegionControlPrimitive(options);
  const contentHtml = options.contentHtml ?? "";
  const attributes = {
    ...spec.attributes,
    "data-body-region-control-style": cssVarStyle(spec.styleVars),
  };

  return `
    <section ${toAttributeString(attributes)}>
      ${renderScrollRegionControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: `${spec.id}-scroll`,
        mobileMode: spec.mobileMode,
        maxBlockSize: spec.styleVars["--primitive-body-region-max-block-size"],
        extraAttributes: {
          "data-body-region-control-scroll": "",
        },
        contentHtml,
      })}
    </section>
  `;
}

export function attachBodyRegionControlPrimitiveController(root = document) {
  for (const region of root.querySelectorAll("[data-body-region-control]")) {
    if (!(region instanceof HTMLElement) || region.dataset.bodyRegionControlController === "attached") {
      continue;
    }

    region.dataset.bodyRegionControlController = "attached";
    const styleDeclaration = region.getAttribute("data-body-region-control-style");
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
        region.style.setProperty(property, value);
      }
    }
  }

  attachScrollRegionControlPrimitiveController(root);
}
