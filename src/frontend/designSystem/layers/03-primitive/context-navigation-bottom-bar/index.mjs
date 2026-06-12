import { resolveTokenSpec } from "../../02-token/token-spec-resolver.mjs";

const primitiveName = "context-navigation-bottom-bar";
const allowedModes = new Set(["default", "proof-static"]);
const contextNavigationFrameTokenSpec = resolveTokenSpec({
  systemKey: "default",
  tokenType: "context-navigation-frame",
});

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
  const contextNavigationFrame = findVariant(
    contextNavigationFrameTokenSpec,
    (variant) => variant.id === "context-navigation-frame-default",
    "context-navigation-bottom-bar requires the signed context-navigation-frame token.",
  );

  return { contextNavigationFrame };
}

export const contextNavigationBottomBarPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/context-navigation-bottom-bar/ContextNavigationBottomBar-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["context-navigation-frame"],
  requiredPrimitives: [],
  allowedModes: Array.from(allowedModes),
  consumerRules: [
    "Consumers must use this primitive for the governed mobile context-navigation bottom-bar frame.",
    "Consumers must not recreate fixed-bottom placement, page reserve, drawer offset, or scroll-boundary behavior locally.",
    "Consumers must not treat supplied slot content as governed destination item anatomy, More-menu behavior, or app navigation wiring.",
  ],
};

export function contextNavigationBottomBarPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `context-navigation-bottom-bar-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Context navigation";
  const mode = options.mode ?? "default";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(mode, "mode");

  if (!allowedModes.has(mode)) {
    throw new RangeError(`context-navigation-bottom-bar does not support mode "${mode}".`);
  }

  const tokens = tokenDependenciesFor();
  const frame = tokens.contextNavigationFrame;

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    mode,
    tokenDependencies: {
      contextNavigationFrame: {
        tokenName: frame.tokenName,
        variantId: frame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/context-navigation-frame/systems/default.mjs#contextNavigationFrameTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-context-navigation-bottom-bar",
      "data-context-navigation-bottom-bar": "",
      "data-context-navigation-bottom-bar-theme": theme,
      "data-context-navigation-bottom-bar-mode": mode,
      "aria-label": label,
    },
    styleVars: {
      "--primitive-context-nav-bottom-bar-block-offset": frame.mobileBarBlockOffset,
      "--primitive-context-nav-bottom-bar-inset-inline-start": frame.mobileBarInsetInlineStart,
      "--primitive-context-nav-bottom-bar-inset-inline-end": frame.mobileBarInsetInlineEnd,
      "--primitive-context-nav-bottom-bar-columns": frame.mobileBarColumns,
      "--primitive-context-nav-bottom-bar-padding-block-start": frame.mobileBarPaddingBlockStart,
      "--primitive-context-nav-bottom-bar-padding-inline": frame.mobileBarPaddingInline,
      "--primitive-context-nav-bottom-bar-padding-block-end": frame.mobileBarPaddingBlockEnd,
      "--primitive-context-nav-bottom-bar-page-reserve": frame.mobilePageBottomReserve,
      "--primitive-context-nav-bottom-bar-drawer-offset": frame.mobileDrawerBottomOffset,
      "--primitive-context-nav-bottom-bar-surface": frame.surfaceValue,
      "--primitive-context-nav-bottom-bar-border": frame.borderValue,
      "--primitive-context-nav-bottom-bar-shadow": frame.shadowValue,
    },
    behavior: {
      viewportPinning: frame.mobileViewportPinningBehavior,
      scrollBoundary: frame.mobileScrollBoundaryBehavior,
    },
    consumerRestrictions: contextNavigationBottomBarPrimitiveContract.consumerRules,
  };
}

export function renderContextNavigationBottomBarPrimitive(options = {}) {
  const spec = contextNavigationBottomBarPrimitive(options);
  const slotHtml = options.slotHtml ?? "";
  const extraAttributes = options.extraAttributes ?? {};
  const attributes = {
    ...spec.attributes,
    ...extraAttributes,
    "data-context-navigation-bottom-bar-style": cssVarStyle(spec.styleVars),
  };

  return `<nav ${toAttributeString(attributes)}>${slotHtml}</nav>`;
}

export function attachContextNavigationBottomBarPrimitiveController(root = document) {
  for (const bar of root.querySelectorAll("[data-context-navigation-bottom-bar]")) {
    if (!(bar instanceof HTMLElement) || bar.dataset.contextNavigationBottomBarController === "attached") {
      continue;
    }

    bar.dataset.contextNavigationBottomBarController = "attached";
    const styleDeclaration = bar.getAttribute("data-context-navigation-bottom-bar-style");
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
        bar.style.setProperty(property, value);
      }
    }
  }
}
