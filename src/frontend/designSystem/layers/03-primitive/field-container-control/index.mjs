import { fieldContainerFrameTokenSpec } from "../../02-token/field-container-frame/systems/default.mjs";

const primitiveName = "field-container-control";

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

const supportedThemes = new Set(["original", "dark", "desert"]);

function tokenDependenciesFor(theme) {
  const fieldContainerFrame = findVariant(
    fieldContainerFrameTokenSpec,
    (variant) => variant.id === `field-container-frame-${theme}`,
    `field-container-control requires the signed ${theme} field-container-frame token.`,
  );

  return { fieldContainerFrame };
}

export const fieldContainerControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/field-container-control/FieldContainerControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["field-container-frame"],
  requiredPrimitives: [],
  consumerRules: [
    "Consumers must use this primitive for governed outer field containers instead of local form-field cards or wrappers.",
    "Consumers must provide governed child content; this primitive must not invent native input, selector, toggle, radio, validation, or form submission behavior.",
    "Consumers must not override field-container surface, padding, border, radius, or sizing with local CSS values.",
  ],
};

export function fieldContainerControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `field-container-control-${Math.random().toString(36).slice(2, 10)}`;

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");

  if (systemKey !== "default") {
    throw new RangeError(`field-container-control has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`field-container-control does not support theme "${theme}".`);
  }

  const tokens = tokenDependenciesFor(theme);

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    tokenDependencies: {
      fieldContainerFrame: {
        tokenName: tokens.fieldContainerFrame.tokenName,
        variantId: tokens.fieldContainerFrame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/field-container-frame/systems/default.mjs#fieldContainerFrameTokenSpec",
      },
    },
    styleVars: {
      "--primitive-field-container-background": tokens.fieldContainerFrame.backgroundValue,
      "--primitive-field-container-foreground": tokens.fieldContainerFrame.foregroundValue,
      "--primitive-field-container-border": tokens.fieldContainerFrame.borderValue,
      "--primitive-field-container-radius": tokens.fieldContainerFrame.radiusValue,
      "--primitive-field-container-padding-block": tokens.fieldContainerFrame.paddingBlockValue,
      "--primitive-field-container-padding-inline": tokens.fieldContainerFrame.paddingInlineValue,
      "--primitive-field-container-min-block-size": tokens.fieldContainerFrame.minBlockSize,
      "--primitive-field-container-min-inline-size": tokens.fieldContainerFrame.minInlineSize,
      "--primitive-field-container-max-inline-size": tokens.fieldContainerFrame.maxInlineSize,
    },
    consumerRestrictions: fieldContainerControlPrimitiveContract.consumerRules,
  };
}

export function renderFieldContainerControlPrimitive(options = {}) {
  const spec = fieldContainerControlPrimitive(options);
  const childHtml = options.childHtml ?? "";
  const slotMode = childHtml.trim() ? "provided" : "empty";

  return `
    <section
      id="${escapeHtml(spec.id)}"
      class="ds-field-container-control"
      data-field-container-control
      data-field-container-control-theme="${escapeHtml(spec.theme)}"
      data-field-container-control-slot="${escapeHtml(slotMode)}"
      data-field-container-control-style="${escapeHtml(cssVarStyle(spec.styleVars))}"
    >
      ${childHtml}
    </section>
  `;
}

export function attachFieldContainerControlPrimitiveController(root = document) {
  for (const container of root.querySelectorAll("[data-field-container-control]")) {
    if (!(container instanceof HTMLElement) || container.dataset.fieldContainerControlController === "attached") {
      continue;
    }

    container.dataset.fieldContainerControlController = "attached";
    const styleDeclaration = container.getAttribute("data-field-container-control-style");
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
        container.style.setProperty(property, value);
      }
    }
  }
}
