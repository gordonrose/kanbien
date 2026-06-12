import {
  attachContextNavigationBottomBarPrimitiveController,
  renderContextNavigationBottomBarPrimitive,
} from "../../03-primitive/context-navigation-bottom-bar/index.mjs";
import { renderContextNavigationItemControlPrimitive } from "../../03-primitive/context-navigation-item-control/index.mjs";
import {
  attachContextNavigationOverflowMenuPrimitiveController,
  renderContextNavigationOverflowMenuPrimitive,
} from "../../03-primitive/context-navigation-overflow-menu/index.mjs";
import { contextNavigationFrameTokenSpec } from "../../02-token/context-navigation-frame/systems/default.mjs";

const patternName = "context-navigation";
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

function normalizeItem(item, index, zoneName) {
  if (!item || typeof item !== "object") {
    throw new TypeError(`${zoneName}[${index}] must be an object.`);
  }
  assertString(item.label ?? "", `${zoneName}[${index}].label`);
  const kind = item.kind ?? "destination";
  const state = item.state ?? "resting";
  const value = item.value ?? item.label;
  const id = item.id ?? `${zoneName}-${index}-${String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const href = item.href ?? `#${id}`;

  return {
    id,
    label: item.label,
    icon: item.icon ?? "context-list",
    kind,
    state,
    value,
    href,
  };
}

function normalizeItems(items, zoneName) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map((item, index) => normalizeItem(item, index, zoneName));
}

function renderItem(item, idPrefix, systemKey, theme) {
  return renderContextNavigationItemControlPrimitive({
    systemKey,
    theme,
    id: `${idPrefix}-${item.id}`,
    label: item.label,
    icon: item.icon,
    kind: item.kind,
    state: item.state,
    value: item.value,
    href: item.href,
  });
}

function renderItemList(items, idPrefix, systemKey, theme) {
  return items.map((item) => renderItem(item, idPrefix, systemKey, theme)).join("");
}

function getItemKey(item) {
  return item?.value ?? item?.href ?? item?.id ?? item?.label ?? null;
}

function partitionContextNavigationItems(items, {
  viewportMode,
  currentItemKey = null,
  maxVisibleItems = 4,
  reservedMobileSlots = 0,
  mobileLaneCapacity = 5,
} = {}) {
  const normalizedItems = Array.isArray(items) ? items : [];
  const isMobile = viewportMode === "mobile";
  const effectiveMaxVisibleItems = isMobile
    ? Math.max(1, Math.min(maxVisibleItems, mobileLaneCapacity - 1 - Math.max(0, reservedMobileSlots)))
    : maxVisibleItems;

  if (!isMobile || normalizedItems.length <= effectiveMaxVisibleItems) {
    return {
      visibleItems: normalizedItems,
      overflowItems: [],
    };
  }

  const currentIndex = normalizedItems.findIndex((item) => getItemKey(item) === currentItemKey);
  const initialVisibleItems = normalizedItems.slice(0, effectiveMaxVisibleItems);

  if (currentIndex < 0 || currentIndex < effectiveMaxVisibleItems) {
    return {
      visibleItems: initialVisibleItems,
      overflowItems: normalizedItems.slice(effectiveMaxVisibleItems),
    };
  }

  const currentItem = normalizedItems[currentIndex];
  const visibleItems = [
    ...normalizedItems.slice(0, Math.max(0, effectiveMaxVisibleItems - 1)),
    currentItem,
  ];
  const visibleKeys = new Set(visibleItems.map((item) => getItemKey(item)));

  return {
    visibleItems,
    overflowItems: normalizedItems.filter((item) => !visibleKeys.has(getItemKey(item))),
  };
}

export const contextNavigationPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/context-navigation/ContextNavigation-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: [
    "context-navigation-item-control",
    "context-navigation-bottom-bar",
    "context-navigation-overflow-menu",
  ],
  directTokenDependencies: ["context-navigation-frame"],
  consumerRules: [
    "Consumers must use this pattern for governed context-navigation rail and mobile bottom-bar composition.",
    "Consumers must not recreate rail sizing, primary scroll zone, utility anchoring, mobile bottom-bar composition, overflow handling, or item semantics locally.",
    "Consumers must not treat this pattern as a routed app shell, component seam, drawer implementation, or app adoption seam.",
  ],
};

export function contextNavigationPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `context-navigation-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Context navigation";
  const viewportMode = options.viewportMode ?? "responsive";
  const mode = options.mode ?? "default";
  const primaryItems = normalizeItems(options.primaryItems ?? [], "primaryItems");
  const utilityItems = normalizeItems(options.utilityItems ?? [], "utilityItems");
  const mobileItems = normalizeItems(options.mobileItems ?? [...primaryItems, ...utilityItems], "mobileItems");
  const frame = findVariant(
    contextNavigationFrameTokenSpec,
    (variant) => variant.id === "context-navigation-frame-default",
    "context-navigation requires a signed context-navigation-frame token.",
  );

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(viewportMode, "viewportMode");
  assertString(mode, "mode");
  if (!allowedViewportModes.has(viewportMode)) {
    throw new RangeError(`context-navigation does not support viewportMode "${viewportMode}".`);
  }
  if (!allowedProofModes.has(mode)) {
    throw new RangeError(`context-navigation does not support mode "${mode}".`);
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
    primaryItems,
    utilityItems,
    mobileItems,
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
      class: "ds-context-navigation",
      "data-context-navigation": "",
      "data-context-navigation-theme": theme,
      "data-context-navigation-mode": mode,
      "data-context-navigation-viewport-mode": viewportMode,
      "data-context-navigation-mobile-breakpoint": frame.mobileBreakpoint,
    },
    styleVars: {
      "--pattern-context-navigation-rail-inline-size": frame.desktopRailInlineSize,
      "--pattern-context-navigation-rail-top-offset": frame.desktopRailTopOffset,
      "--pattern-context-navigation-rail-bottom-offset": frame.desktopRailBottomOffset,
      "--pattern-context-navigation-rail-gap": frame.desktopRailGapValue,
      "--pattern-context-navigation-rail-padding-block": frame.desktopRailPaddingBlockValue,
      "--pattern-context-navigation-rail-padding-inline": frame.desktopRailPaddingInlineValue,
      "--pattern-context-navigation-surface": frame.surfaceValue,
      "--pattern-context-navigation-border": frame.borderValue,
    },
    behavior: {
      primaryScroll: frame.desktopPrimaryScrollBehavior,
      utilityAnchor: frame.utilityZoneAnchorBehavior,
      mobilePinning: frame.mobileViewportPinningBehavior,
    },
    consumerRestrictions: contextNavigationPatternContract.consumerRules,
  };
}

export function renderContextNavigationPattern(options = {}) {
  const spec = contextNavigationPattern(options);
  const attributes = {
    ...spec.attributes,
    "data-context-navigation-style": cssVarStyle(spec.styleVars),
  };
  const itemIdPrefix = `${spec.id}-item`;
  const bottomMode = spec.mode === "proof-contained" ? "proof-static" : "default";
  const currentItem = spec.mobileItems.find((item) => item.state === "current");
  const { visibleItems: directMobileItems, overflowItems } = partitionContextNavigationItems(spec.mobileItems, {
    viewportMode: spec.viewportMode,
    currentItemKey: currentItem ? getItemKey(currentItem) : null,
    maxVisibleItems: 4,
  });
  const mobileSlotHtml = `
    ${renderItemList(directMobileItems, `${itemIdPrefix}-mobile`, spec.systemKey, spec.theme)}
    ${
      overflowItems.length
        ? renderContextNavigationOverflowMenuPrimitive({
            systemKey: spec.systemKey,
            theme: spec.theme,
            id: `${spec.id}-overflow-menu`,
            mode: "mobile",
            items: overflowItems,
          })
        : ""
    }
  `;
  const bottomBar = renderContextNavigationBottomBarPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: `${spec.id}-bottom-bar`,
    label: spec.label,
    mode: bottomMode,
    slotHtml: mobileSlotHtml,
    extraAttributes: {
      "data-context-navigation-region": "mobile-bottom-bar",
    },
  });

  return `
    <section ${toAttributeString(attributes)}>
      <nav class="ds-context-navigation-rail" data-context-navigation-region="desktop-rail" aria-label="${escapeHtml(spec.label)}">
        <div class="ds-context-navigation-primary" data-context-navigation-region="primary">
          ${renderItemList(spec.primaryItems, `${itemIdPrefix}-primary`, spec.systemKey, spec.theme)}
        </div>
        <div class="ds-context-navigation-utility" data-context-navigation-region="utility">
          ${renderItemList(spec.utilityItems, `${itemIdPrefix}-utility`, spec.systemKey, spec.theme)}
        </div>
      </nav>
      ${bottomBar}
    </section>
  `;
}

export function attachContextNavigationPatternController(root = document) {
  const updateViewportPosture = (nav) => {
    const mode = nav.getAttribute("data-context-navigation-viewport-mode");
    if (mode === "desktop" || mode === "mobile") {
      nav.dataset.contextNavigationViewport = mode;
      return;
    }
    const breakpoint = nav.getAttribute("data-context-navigation-mobile-breakpoint");
    const breakpointPx = toPixels(breakpoint, nav.ownerDocument);
    const viewportWidth = nav.ownerDocument?.defaultView?.innerWidth ?? 0;
    nav.dataset.contextNavigationViewport = breakpointPx > 0 && viewportWidth <= breakpointPx ? "mobile" : "desktop";
  };

  for (const nav of root.querySelectorAll("[data-context-navigation]")) {
    if (!(nav instanceof HTMLElement) || nav.dataset.contextNavigationController === "attached") {
      continue;
    }
    nav.dataset.contextNavigationController = "attached";
    const styleDeclaration = nav.getAttribute("data-context-navigation-style");
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

  attachContextNavigationBottomBarPrimitiveController(root);
  attachContextNavigationOverflowMenuPrimitiveController(root);
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
