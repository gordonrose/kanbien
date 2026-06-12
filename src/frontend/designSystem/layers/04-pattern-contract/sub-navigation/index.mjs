import {
  attachBreadcrumbTrailControlPrimitiveController,
  renderBreadcrumbTrailControlPrimitive,
} from "../../03-primitive/breadcrumb-trail-control/index.mjs";
import {
  attachSearchShellControlPrimitiveController,
  renderSearchShellControlPrimitive,
} from "../../03-primitive/search-shell-control/index.mjs";
import { resolveTokenSpec } from "../../02-token/token-spec-resolver.mjs";

const patternName = "sub-navigation";
const allowedModes = new Set(["auto", "desktop", "compressed", "compact", "mobile"]);
const allowedDirections = new Set(["ltr", "rtl"]);
const allowedSearchStates = new Set(["empty", "active", "filled", "disabled", "error"]);

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

function normalizeBreadcrumbItem(item, index) {
  if (!item || typeof item !== "object") {
    throw new TypeError(`breadcrumbs[${index}] must be an object.`);
  }
  assertString(item.label ?? "", `breadcrumbs[${index}].label`);
  return {
    id: item.id ?? `breadcrumb-${index}`,
    label: item.label,
    href: item.href ?? "#",
    current: item.current === true,
  };
}

function resolvedModeFor(mode) {
  return mode === "auto" ? "desktop" : mode;
}

function breadcrumbModeFor(resolvedMode) {
  if (resolvedMode === "mobile") {
    return "mobile-hidden";
  }
  if (resolvedMode === "compact") {
    return "compact";
  }
  if (resolvedMode === "compressed") {
    return "reduced-middle";
  }
  return "full";
}

function searchModeFor(resolvedMode) {
  if (resolvedMode === "mobile") {
    return "mobile";
  }
  if (resolvedMode === "compact") {
    return "compressed";
  }
  return "desktop";
}

export const subNavigationPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/sub-navigation/SubNavigation-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["breadcrumb-trail-control", "search-shell-control"],
  directTokenDependencies: ["standard-page-shell-frame"],
  consumerRules: [
    "Consumers must use this pattern for governed secondary navigation row composition.",
    "Consumers must not recreate breadcrumb, search, collapse, mobile fallback, or row-width negotiation markup locally.",
    "Consumers must not add search results, breadcrumb route generation, component props, app adoption, or app-local CSS.",
  ],
};

export function subNavigationPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `sub-navigation-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Secondary";
  const mode = options.mode ?? "desktop";
  const direction = options.direction ?? "ltr";
  const searchState = options.searchState ?? (options.searchValue ? "filled" : "empty");
  const searchLabel = options.searchLabel ?? "Search";
  const searchPlaceholder = options.searchPlaceholder ?? "Search";
  const searchName = options.searchName ?? "q";
  const searchValue = options.searchValue ?? "";
  const searchHint = options.searchHint ?? "Enter";
  const breadcrumbs = Array.isArray(options.breadcrumbs)
    ? options.breadcrumbs.map(normalizeBreadcrumbItem)
    : [];

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(mode, "mode");
  assertString(direction, "direction");
  assertString(searchState, "searchState");
  if (!allowedModes.has(mode)) {
    throw new RangeError(`sub-navigation does not support mode "${mode}".`);
  }
  if (!allowedDirections.has(direction)) {
    throw new RangeError(`sub-navigation does not support direction "${direction}".`);
  }
  if (!allowedSearchStates.has(searchState)) {
    throw new RangeError(`sub-navigation does not support searchState "${searchState}".`);
  }

  const shellFrame = findVariant(
    resolveTokenSpec({ systemKey, tokenType: "standard-page-shell-frame" }),
    (variant) => variant.id === "standard-page-shell-frame-default",
    "sub-navigation requires the signed standard-page-shell-frame token.",
  );
  const resolvedMode = resolvedModeFor(mode);

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    label,
    mode,
    resolvedMode,
    direction,
    searchState,
    searchLabel,
    searchPlaceholder,
    searchName,
    searchValue,
    searchHint,
    breadcrumbs,
    tokenDependencies: {
      standardPageShellFrame: {
        tokenName: shellFrame.tokenName,
        variantId: shellFrame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs#standardPageShellFrameTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-sub-navigation",
      "data-sub-navigation": "",
      "data-sub-navigation-theme": theme,
      "data-theme-scope": theme === "original" ? null : theme,
      "data-sub-navigation-mode": mode,
      "data-sub-navigation-resolved-mode": resolvedMode,
      "data-sub-navigation-mobile-breakpoint": shellFrame.mobileBreakpoint,
      dir: direction,
      "aria-label": label,
    },
    styleVars: {
      "--pattern-sub-navigation-z-index": shellFrame.subNavLayer,
      "--pattern-sub-navigation-padding-block": shellFrame.subNavPaddingBlockValue,
      "--pattern-sub-navigation-padding-inline": shellFrame.subNavPaddingInlineValue,
      "--pattern-sub-navigation-gap": shellFrame.subNavGapValue,
      "--pattern-sub-navigation-search-max-inline-size": shellFrame.subNavSearchMaxInlineSize,
      "--pattern-sub-navigation-background": shellFrame.surfaceSubNav,
      "--pattern-sub-navigation-border": shellFrame.borderValue,
      "--pattern-sub-navigation-mobile-breakpoint": shellFrame.mobileBreakpoint,
    },
    behavior: {
      desktopRule: "breadcrumb and bounded centered search are visible",
      compressedRule: "breadcrumb reduces through the approved hidden-path reveal before search leaves the row",
      compactRule: "breadcrumb becomes a compact reveal while search stays bounded",
      mobileRule: "breadcrumb is absent and search fills the available row width",
      responsiveRule: "auto mode resolves desktop, compressed, compact, or mobile from rendered inline size",
    },
    consumerRestrictions: subNavigationPatternContract.consumerRules,
  };
}

function renderSlot(spec, resolvedMode) {
  const hidden = spec.mode === "auto" ? resolvedMode !== "desktop" : resolvedMode !== spec.resolvedMode;
  return `
    <div class="ds-sub-navigation-slot" data-sub-navigation-slot="${escapeHtml(resolvedMode)}" ${hidden ? "hidden" : ""}>
      <div class="ds-sub-navigation-breadcrumb-region" data-sub-navigation-region="breadcrumb">
        ${renderBreadcrumbTrailControlPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-breadcrumb-${resolvedMode}`,
          label: "Page breadcrumb",
          mode: breadcrumbModeFor(resolvedMode),
          direction: spec.direction,
          items: spec.breadcrumbs,
        })}
      </div>
      <div class="ds-sub-navigation-search-region" data-sub-navigation-region="search">
        ${renderSearchShellControlPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-search-${resolvedMode}`,
          label: spec.searchLabel,
          name: spec.searchName,
          placeholder: spec.searchPlaceholder,
          value: spec.searchValue,
          state: spec.searchState,
          mode: searchModeFor(resolvedMode),
          hint: spec.searchHint,
        })}
      </div>
    </div>
  `;
}

export function renderSubNavigationPattern(options = {}) {
  const spec = subNavigationPattern(options);
  const attributes = {
    ...spec.attributes,
    "data-sub-navigation-style": cssVarStyle(spec.styleVars),
  };
  const modesToRender = spec.mode === "auto" ? ["desktop", "compressed", "compact", "mobile"] : [spec.resolvedMode];

  return `
    <nav ${toAttributeString(attributes)}>
      ${modesToRender.map((resolvedMode) => renderSlot(spec, resolvedMode)).join("")}
    </nav>
  `;
}

function applyDeclaredStyles(element, attributeName) {
  const styleDeclaration = element.getAttribute(attributeName);
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

function toPixels(value, ownerDocument = document) {
  const text = String(value ?? "").trim();
  if (text.endsWith("rem")) {
    const rem = Number.parseFloat(text);
    const root = ownerDocument.documentElement;
    const fontSize = Number.parseFloat(ownerDocument.defaultView?.getComputedStyle(root).fontSize ?? "16");
    return Number.isFinite(rem) ? rem * (Number.isFinite(fontSize) ? fontSize : 16) : 0;
  }
  if (text.endsWith("px")) {
    const px = Number.parseFloat(text);
    return Number.isFinite(px) ? px : 0;
  }
  return 0;
}

function resolveAutoMode(nav) {
  if (nav.getAttribute("data-sub-navigation-mode") !== "auto") {
    return;
  }
  const inlineSize = nav.getBoundingClientRect().width;
  const mobileBreakpoint = toPixels(nav.getAttribute("data-sub-navigation-mobile-breakpoint"), nav.ownerDocument);
  let nextMode = "desktop";
  if (mobileBreakpoint > 0 && inlineSize <= mobileBreakpoint) {
    nextMode = "mobile";
  } else if (inlineSize <= 760) {
    nextMode = "compact";
  } else if (inlineSize <= 960) {
    nextMode = "compressed";
  }
  setVisibleSlot(nav, nextMode);
  if (nextMode === "desktop" && breadcrumbSlotHasPressure(nav, "desktop")) {
    nextMode = "compressed";
    setVisibleSlot(nav, nextMode);
  }
  if (nextMode === "compressed" && breadcrumbSlotHasPressure(nav, "compressed")) {
    nextMode = "compact";
  }
  nav.dataset.subNavigationResolvedMode = nextMode;
  setVisibleSlot(nav, nextMode);
}

function setVisibleSlot(nav, mode) {
  for (const slot of nav.querySelectorAll("[data-sub-navigation-slot]")) {
    if (slot instanceof HTMLElement) {
      slot.hidden = slot.dataset.subNavigationSlot !== mode;
    }
  }
}

function breadcrumbSlotHasPressure(nav, mode) {
  const slot = nav.querySelector(`[data-sub-navigation-slot="${CSS.escape(mode)}"]`);
  if (!(slot instanceof HTMLElement)) {
    return false;
  }
  const breadcrumbRegion = slot.querySelector("[data-sub-navigation-region='breadcrumb']");
  const breadcrumb = slot.querySelector("[data-breadcrumb-trail-control]");
  if (!(breadcrumbRegion instanceof HTMLElement) || !(breadcrumb instanceof HTMLElement)) {
    return false;
  }
  const list = breadcrumb.querySelector(".ds-breadcrumb-trail-control-list");
  if (list instanceof HTMLElement && list.scrollWidth > breadcrumbRegion.clientWidth + 1) {
    return true;
  }
  const visibleControls = Array.from(breadcrumb.querySelectorAll(".ds-breadcrumb-trail-control-button")).filter(
    (control) => control instanceof HTMLElement && control.offsetParent !== null,
  );
  if (visibleControls.length <= 2) {
    return false;
  }
  return Array.from(breadcrumb.querySelectorAll("[data-truncating-label]")).some((label) => {
    if (!(label instanceof HTMLElement) || label.offsetParent === null) {
      return false;
    }
    if (label.closest("[aria-current='page']")) {
      return false;
    }
    const text = label.querySelector("[data-truncating-label-text]");
    if (!(text instanceof HTMLElement)) {
      return false;
    }
    const visibleWidth = text.clientWidth;
    const requiredWidth = text.scrollWidth;
    if (requiredWidth <= visibleWidth + 1) {
      return false;
    }
    return visibleWidth / requiredWidth < 0.8;
  });
}

export function attachSubNavigationPatternController(root = document) {
  attachBreadcrumbTrailControlPrimitiveController(root);
  attachSearchShellControlPrimitiveController(root);

  for (const nav of root.querySelectorAll("[data-sub-navigation]")) {
    if (!(nav instanceof HTMLElement) || nav.dataset.subNavigationController === "attached") {
      continue;
    }
    nav.dataset.subNavigationController = "attached";
    applyDeclaredStyles(nav, "data-sub-navigation-style");
    resolveAutoMode(nav);
    nav.ownerDocument.defaultView?.requestAnimationFrame(() => resolveAutoMode(nav));
    if ("ResizeObserver" in nav.ownerDocument.defaultView) {
      const observer = new nav.ownerDocument.defaultView.ResizeObserver(() => resolveAutoMode(nav));
      observer.observe(nav);
    } else {
      nav.ownerDocument.defaultView?.addEventListener("resize", () => resolveAutoMode(nav));
    }
  }
}
