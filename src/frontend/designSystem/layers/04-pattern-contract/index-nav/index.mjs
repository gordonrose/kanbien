import {
  attachIndexNavPanelPatternController,
  renderIndexNavPanelPattern,
} from "../index-nav-panel/index.mjs";
import { indexNavPanelFrameTokenSpec } from "../../02-token/index-nav-panel-frame/systems/default.mjs";

const patternName = "index-nav";

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

function findVariant(tokenSpec, predicate, missingMessage) {
  const variant = tokenSpec.variants.find(predicate);
  if (!variant) {
    throw new RangeError(missingMessage);
  }
  return variant;
}

function normalizePanel(panel, fieldName) {
  if (!panel || typeof panel !== "object") {
    throw new TypeError(`${fieldName} must be an object.`);
  }
  assertString(panel.title ?? "", `${fieldName}.title`);
  return {
    title: panel.title,
    ariaLabel: panel.ariaLabel ?? panel.title,
    currentValue: panel.currentValue ?? null,
    items: Array.isArray(panel.items) ? panel.items : [],
    emptyMessage: panel.emptyMessage ?? "No index items available.",
    showHeader: panel.showHeader !== false,
    showAddAction: panel.showAddAction !== false,
    resizable: panel.resizable === true,
    addLabel: panel.addLabel ?? "Add",
  };
}

export const indexNavPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/index-nav/IndexNav-Contract.md",
  supportedSystems: ["default"],
  requiredPatterns: ["index-nav-panel"],
  directTokenDependencies: ["index-nav-panel-frame"],
  consumerRules: [
    "Consumers must use this pattern for governed primary and optional secondary index navigation.",
    "Consumers must not recreate panel layout, add action, scrolling, or list behavior locally.",
    "Consumers must not treat this pattern as an entity-page template, route, component seam, or app adoption seam.",
  ],
};

export function indexNavPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `index-nav-${Math.random().toString(36).slice(2, 10)}`;
  const primary = normalizePanel(options.primary ?? {}, "primary");
  const secondary = options.secondary ? normalizePanel(options.secondary, "secondary") : null;
  const doubleWidth = options.doubleWidth === true || secondary !== null;
  const mobileMode = options.mobileMode ?? "page-scroll";
  const panelFrame = findVariant(
    indexNavPanelFrameTokenSpec,
    (variant) => variant.id === "index-nav-panel-frame-default",
    "index-nav requires a signed index-nav-panel-frame token for panel gap.",
  );

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(mobileMode, "mobileMode");

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    primary,
    secondary,
    doubleWidth,
    mobileMode,
    attributes: {
      id,
      class: "ds-index-nav",
      "data-index-nav": "",
      "data-index-nav-theme": theme,
      "data-index-nav-double-width": doubleWidth ? "true" : "false",
      "data-index-nav-mobile-mode": mobileMode,
      "data-index-nav-mobile-breakpoint": panelFrame.mobileBreakpointValue,
    },
    styleVars: {
      "--pattern-index-nav-gap": panelFrame.gapValue,
    },
    consumerRestrictions: indexNavPatternContract.consumerRules,
  };
}

export function renderIndexNavPattern(options = {}) {
  const spec = indexNavPattern(options);
  const attributes = {
    ...spec.attributes,
    "data-index-nav-style": cssVarStyle(spec.styleVars),
  };
  return `
    <section ${toAttributeString(attributes)}>
      ${renderIndexNavPanelPattern({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: `${spec.id}-primary`,
        title: spec.primary.title,
        ariaLabel: spec.primary.ariaLabel,
        currentValue: spec.primary.currentValue,
        widthMode: spec.doubleWidth && !spec.secondary ? "double" : "standard",
        mobileMode: spec.mobileMode,
        items: spec.primary.items,
        emptyMessage: spec.primary.emptyMessage,
        showHeader: spec.primary.showHeader,
        showAddAction: spec.primary.showAddAction,
        resizable: spec.primary.resizable,
        addLabel: spec.primary.addLabel,
      })}
      ${
        spec.secondary
          ? renderIndexNavPanelPattern({
              systemKey: spec.systemKey,
              theme: spec.theme,
              id: `${spec.id}-secondary`,
              title: spec.secondary.title,
              ariaLabel: spec.secondary.ariaLabel,
              currentValue: spec.secondary.currentValue,
              widthMode: "standard",
              mobileMode: spec.mobileMode,
              items: spec.secondary.items,
              emptyMessage: spec.secondary.emptyMessage,
              showHeader: spec.secondary.showHeader,
              showAddAction: spec.secondary.showAddAction,
              resizable: spec.secondary.resizable,
              addLabel: spec.secondary.addLabel,
            })
          : ""
      }
    </section>
  `;
}

export function attachIndexNavPatternController(root = document) {
  const updateViewportPosture = (nav) => {
    const breakpoint = nav.getAttribute("data-index-nav-mobile-breakpoint");
    const breakpointPx = toPixels(breakpoint, nav.ownerDocument);
    const viewportWidth = nav.ownerDocument?.defaultView?.innerWidth ?? 0;
    nav.dataset.indexNavViewport = breakpointPx > 0 && viewportWidth <= breakpointPx ? "mobile" : "desktop";
  };

  for (const nav of root.querySelectorAll("[data-index-nav]")) {
    if (!(nav instanceof HTMLElement) || nav.dataset.indexNavController === "attached") {
      continue;
    }
    nav.dataset.indexNavController = "attached";
    const styleDeclaration = nav.getAttribute("data-index-nav-style");
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
  attachIndexNavPanelPatternController(root);
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
