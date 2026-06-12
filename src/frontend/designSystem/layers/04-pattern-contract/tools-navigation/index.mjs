import {
  attachToolsNavigationItemControlPrimitiveController,
  renderToolsNavigationItemControlPrimitive,
} from "../../03-primitive/tools-navigation-item-control/index.mjs";
import { resolveTokenSpec } from "../../02-token/token-spec-resolver.mjs";

const patternName = "tools-navigation";
const allowedViewportModes = new Set(["responsive", "desktop", "mobile"]);
const allowedProofModes = new Set(["default", "proof-contained"]);

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

function normalizeItem(item, index) {
  if (!item || typeof item !== "object") {
    throw new TypeError(`items[${index}] must be an object.`);
  }
  assertString(item.label ?? "", `items[${index}].label`);
  return {
    id: item.id ?? `tool-${index}`,
    label: item.label,
    iconLabel: item.iconLabel ?? item.label.slice(0, 1).toUpperCase(),
    value: item.value ?? item.label,
    state: item.state ?? "resting",
  };
}

export const toolsNavigationPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/tools-navigation/ToolsNavigation-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["tools-navigation-item-control"],
  directTokenDependencies: ["tools-navigation-frame"],
  consumerRules: [
    "Consumers must use this pattern for governed desktop tools-navigation right-rail composition.",
    "Mobile tools-navigation is hidden in this pattern version; consumers must not invent mobile tool drawers, overflow, bottom bars, or floating launchers.",
    "Consumers must not use this pattern for context navigation, payload panel internals, component props, or app-local CSS.",
  ],
};

export function toolsNavigationPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `tools-navigation-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Tools navigation";
  const viewportMode = options.viewportMode ?? "responsive";
  const mode = options.mode ?? "default";
  const items = Array.isArray(options.items) ? options.items.map(normalizeItem) : [];
  const frame = findVariant(
    resolveTokenSpec({ systemKey, tokenType: "tools-navigation-frame" }),
    (variant) => variant.id === "tools-navigation-frame-default",
    "tools-navigation requires a signed tools-navigation-frame token.",
  );

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(viewportMode, "viewportMode");
  assertString(mode, "mode");
  if (!allowedViewportModes.has(viewportMode)) {
    throw new RangeError(`tools-navigation does not support viewportMode "${viewportMode}".`);
  }
  if (!allowedProofModes.has(mode)) {
    throw new RangeError(`tools-navigation does not support mode "${mode}".`);
  }

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    label,
    mode,
    viewportMode,
    items,
    tokenDependencies: {
      toolsNavigationFrame: {
        tokenName: frame.tokenName,
        variantId: frame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/tools-navigation-frame/systems/default.mjs#toolsNavigationFrameTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-tools-navigation",
      "data-tools-navigation": "",
      "data-tools-navigation-theme": theme,
      "data-tools-navigation-mode": mode,
      "data-tools-navigation-viewport-mode": viewportMode,
      "data-tools-navigation-mobile-breakpoint": frame.mobileBreakpoint,
    },
    styleVars: {
      "--pattern-tools-navigation-rail-inline-size": frame.desktopRailInlineSize,
      "--pattern-tools-navigation-rail-top-offset": frame.desktopRailTopOffset,
      "--pattern-tools-navigation-rail-bottom-offset": frame.desktopRailBottomOffset,
      "--pattern-tools-navigation-rail-gap": frame.desktopRailGapValue,
      "--pattern-tools-navigation-rail-padding-block": frame.desktopRailPaddingBlockValue,
      "--pattern-tools-navigation-rail-padding-inline": frame.desktopRailPaddingInlineValue,
      "--pattern-tools-navigation-surface": frame.surfaceValue,
      "--pattern-tools-navigation-border": frame.borderValue,
      "--pattern-tools-navigation-shadow": frame.shadowValue,
      "--pattern-tools-navigation-mobile-breakpoint": frame.mobileBreakpoint,
      "--pattern-tools-navigation-mobile-visibility": frame.mobileVisibility,
    },
    behavior: {
      desktopPositioning: frame.desktopPositioningModel,
      mobileVisibility: frame.mobileVisibility,
    },
    consumerRestrictions: toolsNavigationPatternContract.consumerRules,
  };
}

export function renderToolsNavigationPattern(options = {}) {
  const spec = toolsNavigationPattern(options);
  const attributes = {
    ...spec.attributes,
    "data-tools-navigation-style": cssVarStyle(spec.styleVars),
  };
  const items = spec.items
    .map((item) =>
      renderToolsNavigationItemControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: `${spec.id}-item-${item.id}`,
        label: item.label,
        iconLabel: item.iconLabel,
        value: item.value,
        state: item.state,
      }),
    )
    .join("");

  return `
    <section ${toAttributeString(attributes)}>
      <nav class="ds-tools-navigation-rail" data-tools-navigation-region="desktop-rail" aria-label="${escapeHtml(spec.label)}">
        ${items}
      </nav>
    </section>
  `;
}

export function attachToolsNavigationPatternController(root = document) {
  const updateViewportPosture = (nav) => {
    const mode = nav.getAttribute("data-tools-navigation-viewport-mode");
    if (mode === "desktop" || mode === "mobile") {
      nav.dataset.toolsNavigationViewport = mode;
      return;
    }
    const breakpoint = nav.getAttribute("data-tools-navigation-mobile-breakpoint");
    const breakpointPx = toPixels(breakpoint, nav.ownerDocument);
    const viewportWidth = nav.ownerDocument?.defaultView?.innerWidth ?? 0;
    nav.dataset.toolsNavigationViewport = breakpointPx > 0 && viewportWidth <= breakpointPx ? "mobile" : "desktop";
  };

  for (const nav of root.querySelectorAll("[data-tools-navigation]")) {
    if (!(nav instanceof HTMLElement) || nav.dataset.toolsNavigationController === "attached") {
      continue;
    }
    nav.dataset.toolsNavigationController = "attached";
    const styleDeclaration = nav.getAttribute("data-tools-navigation-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) {
          continue;
        }
        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (property && value) {
          nav.style.setProperty(property, value);
        }
      }
    }
    updateViewportPosture(nav);
    nav.ownerDocument?.defaultView?.addEventListener("resize", () => updateViewportPosture(nav));
  }

  attachToolsNavigationItemControlPrimitiveController(root);
}

function toPixels(value, ownerDocument = document) {
  const text = String(value ?? "").trim();
  if (text.endsWith("rem")) {
    const remValue = Number.parseFloat(text);
    if (!Number.isFinite(remValue)) {
      return 0;
    }
    const root = ownerDocument?.documentElement;
    const fontSize = root ? Number.parseFloat(ownerDocument.defaultView?.getComputedStyle(root).fontSize) : 16;
    return remValue * (Number.isFinite(fontSize) ? fontSize : 16);
  }
  if (text.endsWith("px")) {
    const pxValue = Number.parseFloat(text);
    return Number.isFinite(pxValue) ? pxValue : 0;
  }
  return 0;
}
