import {
  attachTopNavigationBrandControlPrimitiveController,
  renderTopNavigationBrandControlPrimitive,
} from "../../03-primitive/top-navigation-brand-control/index.mjs";
import {
  attachTopNavigationLinkControlPrimitiveController,
  renderTopNavigationLinkControlPrimitive,
} from "../../03-primitive/top-navigation-link-control/index.mjs";
import {
  attachTopNavigationTriggerControlPrimitiveController,
  renderTopNavigationTriggerControlPrimitive,
} from "../../03-primitive/top-navigation-trigger-control/index.mjs";
import { standardPageShellFrameTokenSpec } from "../../02-token/standard-page-shell-frame/systems/default.mjs";
import { topNavigationFrameTokenSpec } from "../../02-token/top-navigation-frame/systems/default.mjs";

const patternName = "top-navigation";
const allowedModes = new Set(["auto", "desktop", "overflow", "mobile"]);
const allowedOpenSurfaces = new Set(["none", "overflow", "profile", "mobile"]);
const allowedDirections = new Set(["ltr", "rtl"]);

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

function normalizeDestination(destination, index, currentValue) {
  if (!destination || typeof destination !== "object") {
    throw new TypeError(`destinations[${index}] must be an object.`);
  }
  assertString(destination.label ?? "", `destinations[${index}].label`);
  assertString(destination.href ?? "", `destinations[${index}].href`);
  const value = destination.value ?? destination.href;
  return {
    id: destination.id ?? `destination-${index}`,
    label: destination.label,
    href: destination.href,
    value,
    current: destination.current === true || value === currentValue,
  };
}

export const topNavigationPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/top-navigation/TopNavigation-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: [
    "top-navigation-brand-control",
    "top-navigation-link-control",
    "top-navigation-trigger-control",
  ],
  directTokenDependencies: ["top-navigation-frame", "standard-page-shell-frame"],
  consumerRules: [
    "Consumers must use this pattern for governed top-navigation chrome composition.",
    "Consumers must not recreate brand, destination, trigger, menu, overflow, or mobile top-navigation markup locally.",
    "Consumers must not use this pattern for component props, route authorization, profile data loading, app adoption, or app-local CSS.",
  ],
};

export function topNavigationPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `top-navigation-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Primary";
  const mode = options.mode ?? "desktop";
  const openSurface = options.openSurface ?? "none";
  const direction = options.direction ?? "ltr";
  const brand = options.brand ?? { label: "Kanbien", mark: "K", href: "#" };
  const currentValue = options.currentValue ?? null;
  const destinations = Array.isArray(options.destinations)
    ? options.destinations.map((destination, index) => normalizeDestination(destination, index, currentValue))
    : [];
  const profileLinks = Array.isArray(options.profileLinks)
    ? options.profileLinks.map((destination, index) => normalizeDestination(destination, index, null))
    : [];

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(mode, "mode");
  assertString(openSurface, "openSurface");
  assertString(direction, "direction");
  if (systemKey !== "default") {
    throw new RangeError(`top-navigation has no system proof for "${systemKey}".`);
  }
  if (!allowedModes.has(mode)) {
    throw new RangeError(`top-navigation does not support mode "${mode}".`);
  }
  if (!allowedOpenSurfaces.has(openSurface)) {
    throw new RangeError(`top-navigation does not support openSurface "${openSurface}".`);
  }
  if (!allowedDirections.has(direction)) {
    throw new RangeError(`top-navigation does not support direction "${direction}".`);
  }

  const chrome = findVariant(
    topNavigationFrameTokenSpec,
    (variant) => variant.frameRole === "top navigation chrome" && variant.themeMapping === theme,
    `top-navigation requires a signed chrome frame token for ${theme}.`,
  );
  const menuPanel = findVariant(
    topNavigationFrameTokenSpec,
    (variant) => variant.frameRole === "top navigation menu panel" && variant.themeMapping === theme,
    `top-navigation requires a signed menu panel frame token for ${theme}.`,
  );
  const shellFrame = findVariant(
    standardPageShellFrameTokenSpec,
    (variant) => variant.id === "standard-page-shell-frame-default",
    "top-navigation requires the signed standard-page-shell-frame token for mobile breakpoint.",
  );

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    label,
    mode,
    openSurface,
    direction,
    brand,
    destinations,
    profileLinks,
    tokenDependencies: {
      topNavigationFrame: {
        tokenName: chrome.tokenName,
        variantId: chrome.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/top-navigation-frame/systems/default.mjs#topNavigationFrameTokenSpec",
      },
      topNavigationMenuFrame: {
        tokenName: menuPanel.tokenName,
        variantId: menuPanel.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/top-navigation-frame/systems/default.mjs#topNavigationFrameTokenSpec",
      },
      standardPageShellFrame: {
        tokenName: shellFrame.tokenName,
        variantId: shellFrame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs#standardPageShellFrameTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-top-navigation",
      "data-top-navigation": "",
      "data-top-navigation-theme": theme,
      "data-top-navigation-mode": mode,
      "data-top-navigation-resolved-mode": mode === "auto" ? "desktop" : mode,
      "data-top-navigation-open-surface": openSurface,
      dir: direction,
      "data-top-navigation-mobile-breakpoint": shellFrame.mobileBreakpoint,
    },
    styleVars: {
      "--pattern-top-navigation-background": chrome.backgroundValue,
      "--pattern-top-navigation-foreground": chrome.foregroundValue,
      "--pattern-top-navigation-border": chrome.borderValue,
      "--pattern-top-navigation-padding-block": chrome.paddingBlockValue,
      "--pattern-top-navigation-padding-inline": chrome.paddingInlineValue,
      "--pattern-top-navigation-gap": chrome.gapValue,
      "--pattern-top-navigation-min-block-size": chrome.minBlockSize,
      "--pattern-top-navigation-z-index": chrome.zIndexValue === "uses standard-page-shell-frame topNavLayer" ? shellFrame.topNavLayer : chrome.zIndexValue,
      "--pattern-top-navigation-menu-background": menuPanel.backgroundValue,
      "--pattern-top-navigation-menu-foreground": menuPanel.foregroundValue,
      "--pattern-top-navigation-menu-border": menuPanel.borderValue,
      "--pattern-top-navigation-menu-radius": menuPanel.radiusValue,
      "--pattern-top-navigation-menu-padding-block": menuPanel.paddingBlockValue,
      "--pattern-top-navigation-menu-padding-inline": menuPanel.paddingInlineValue,
      "--pattern-top-navigation-menu-gap": menuPanel.gapValue,
      "--pattern-top-navigation-menu-min-inline-size": menuPanel.minInlineSize,
      "--pattern-top-navigation-menu-shadow": menuPanel.shadowValue,
      "--pattern-top-navigation-mobile-breakpoint": shellFrame.mobileBreakpoint,
    },
    behavior: {
      desktopVisibleDestinationRule: "all destinations visible",
      overflowVisibleDestinationRule: "first two destinations plus More trigger",
      mobileRule: "brand plus one mobile trigger; destinations and profile links move into mobile surface",
      responsiveRule: "auto mode resolves to desktop, overflow, or mobile from the rendered inline size",
      dismissalRule: "outside click and Escape close open surfaces and restore focus to the trigger",
    },
    consumerRestrictions: topNavigationPatternContract.consumerRules,
  };
}

function renderLinks({ spec, destinations, kind = "destination", slot = null }) {
  return destinations
    .map((destination) => {
      const link = renderTopNavigationLinkControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: `${spec.id}-${kind}-${destination.id}`,
        label: destination.label,
        href: destination.href,
        kind: kind === "destination" ? "destination" : "menu-link",
        current: destination.current,
      });
      if (!slot) {
        return link;
      }
      const slotAttributes = {
        class: "ds-top-navigation-item-slot",
        "data-top-navigation-item-slot": slot,
        "data-top-navigation-item-id": destination.id,
      };
      return `<span ${toAttributeString(slotAttributes)}>${link}</span>`;
    })
    .join("");
}

export function renderTopNavigationPattern(options = {}) {
  const spec = topNavigationPattern(options);
  const attributes = {
    ...spec.attributes,
    "data-top-navigation-style": cssVarStyle(spec.styleVars),
  };
  const resolvedMode = spec.mode === "auto" ? "desktop" : spec.mode;
  const overflowDestinations = spec.destinations.slice(2);
  const visibleDestinations = resolvedMode === "overflow" ? spec.destinations.slice(0, 2) : spec.destinations;
  const renderedDestinations = spec.mode === "auto" ? spec.destinations : visibleDestinations;
  const showOverflowTrigger = spec.mode === "auto" || resolvedMode === "overflow";
  const showDesktopNav = spec.mode === "auto" || resolvedMode !== "mobile";
  const showMobileTrigger = spec.mode === "auto" || resolvedMode === "mobile";

  return `
    <header ${toAttributeString(attributes)}>
      ${renderTopNavigationBrandControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: `${spec.id}-brand`,
        label: spec.brand.label,
        mark: spec.brand.mark,
        href: spec.brand.href,
      })}
      <nav class="ds-top-navigation-primary" data-top-navigation-region="primary" aria-label="${escapeHtml(spec.label)}" ${
        showDesktopNav ? "" : "hidden"
      }>
        ${renderLinks({ spec, destinations: renderedDestinations, slot: "primary" })}
        ${
          showOverflowTrigger
            ? renderTopNavigationTriggerControlPrimitive({
                systemKey: spec.systemKey,
                theme: spec.theme,
                id: `${spec.id}-overflow-trigger`,
                label: "More",
                kind: "overflow",
                controls: `${spec.id}-overflow-menu`,
                expanded: spec.openSurface === "overflow",
              })
            : ""
        }
      </nav>
      <div class="ds-top-navigation-utility" data-top-navigation-region="utility" ${showDesktopNav ? "" : "hidden"}>
        ${renderTopNavigationTriggerControlPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-profile-trigger`,
          label: spec.brand.profileLabel ?? "Profile",
          kind: "profile",
          controls: `${spec.id}-profile-menu`,
          expanded: spec.openSurface === "profile",
        })}
      </div>
      <div class="ds-top-navigation-mobile-entry" data-top-navigation-region="mobile-entry" ${showMobileTrigger ? "" : "hidden"}>
        ${renderTopNavigationTriggerControlPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-mobile-trigger`,
          label: "Menu",
          kind: "mobile",
          controls: `${spec.id}-mobile-menu`,
          expanded: spec.openSurface === "mobile",
        })}
      </div>
      <div id="${escapeHtml(spec.id)}-overflow-menu" class="ds-top-navigation-menu" data-top-navigation-surface="overflow" data-top-navigation-surface-owner="overflow" ${
        spec.openSurface === "overflow" ? "" : "hidden"
      }>
        ${renderLinks({
          spec,
          destinations: spec.mode === "auto" ? spec.destinations : overflowDestinations,
          kind: "overflow",
          slot: "overflow",
        })}
      </div>
      <div id="${escapeHtml(spec.id)}-profile-menu" class="ds-top-navigation-menu" data-top-navigation-surface="profile" data-top-navigation-surface-owner="profile" ${
        spec.openSurface === "profile" ? "" : "hidden"
      }>
        ${renderLinks({ spec, destinations: spec.profileLinks, kind: "profile" })}
      </div>
      <div id="${escapeHtml(spec.id)}-mobile-menu" class="ds-top-navigation-menu ds-top-navigation-menu--mobile" data-top-navigation-surface="mobile" data-top-navigation-surface-owner="mobile" ${
        spec.openSurface === "mobile" ? "" : "hidden"
      }>
        ${renderLinks({ spec, destinations: spec.destinations, kind: "mobile" })}
        ${renderLinks({ spec, destinations: spec.profileLinks, kind: "mobile-profile" })}
      </div>
    </header>
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

function closeSurfaces(nav, restoreFocus = null) {
  nav.dataset.topNavigationOpenSurface = "none";
  for (const surface of nav.querySelectorAll("[data-top-navigation-surface]")) {
    surface.hidden = true;
  }
  for (const trigger of nav.querySelectorAll("[data-top-navigation-trigger-control]")) {
    trigger.setAttribute("aria-expanded", "false");
    trigger.dataset.topNavigationTriggerControlExpanded = "false";
  }
  if (restoreFocus instanceof HTMLElement) {
    restoreFocus.focus();
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

function isHidden(element) {
  return element instanceof HTMLElement && (element.hidden || element.offsetParent === null);
}

function regionsOverlap(first, second) {
  if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement) || isHidden(first) || isHidden(second)) {
    return false;
  }
  const firstBox = first.getBoundingClientRect();
  const secondBox = second.getBoundingClientRect();
  const inlineOverlap = firstBox.left < secondBox.right - 1 && firstBox.right > secondBox.left + 1;
  const blockOverlap = firstBox.top < secondBox.bottom - 1 && firstBox.bottom > secondBox.top + 1;
  return inlineOverlap && blockOverlap;
}

function navFits(nav) {
  const primary = nav.querySelector("[data-top-navigation-region='primary']");
  const utility = nav.querySelector("[data-top-navigation-region='utility']");
  const mobileEntry = nav.querySelector("[data-top-navigation-region='mobile-entry']");
  if (primary instanceof HTMLElement && !isHidden(primary)) {
    const primaryBox = primary.getBoundingClientRect();
    for (const child of Array.from(primary.children)) {
      if (!(child instanceof HTMLElement) || isHidden(child)) {
        continue;
      }
      const childBox = child.getBoundingClientRect();
      if (childBox.left < primaryBox.left - 1 || childBox.right > primaryBox.right + 1) {
        return false;
      }
      if (regionsOverlap(child, utility) || regionsOverlap(child, mobileEntry)) {
        return false;
      }
    }
  }
  return (
    nav.scrollWidth <= nav.clientWidth + 1 &&
    !regionsOverlap(primary, utility) &&
    !regionsOverlap(primary, mobileEntry) &&
    !regionsOverlap(utility, mobileEntry)
  );
}

function setAutoLayout(nav, resolvedMode, visiblePrimaryCount) {
  const primary = nav.querySelector("[data-top-navigation-region='primary']");
  const utility = nav.querySelector("[data-top-navigation-region='utility']");
  const mobileEntry = nav.querySelector("[data-top-navigation-region='mobile-entry']");
  const overflowTrigger = nav.querySelector("[data-top-navigation-trigger-control-kind='overflow']");
  const primaryItems = Array.from(nav.querySelectorAll("[data-top-navigation-item-slot='primary']"));
  const overflowItems = Array.from(nav.querySelectorAll("[data-top-navigation-item-slot='overflow']"));

  nav.dataset.topNavigationResolvedMode = resolvedMode;
  if (primary instanceof HTMLElement) {
    primary.hidden = resolvedMode === "mobile";
  }
  if (utility instanceof HTMLElement) {
    utility.hidden = resolvedMode === "mobile";
  }
  if (mobileEntry instanceof HTMLElement) {
    mobileEntry.hidden = resolvedMode !== "mobile";
  }
  if (overflowTrigger instanceof HTMLElement) {
    overflowTrigger.hidden = resolvedMode !== "overflow";
  }

  primaryItems.forEach((item, index) => {
    if (item instanceof HTMLElement) {
      item.hidden = resolvedMode === "mobile" || index >= visiblePrimaryCount;
    }
  });
  overflowItems.forEach((item, index) => {
    if (item instanceof HTMLElement) {
      item.hidden = resolvedMode !== "overflow" || index < visiblePrimaryCount;
    }
  });
}

function resolveAutoMode(nav) {
  const mode = nav.getAttribute("data-top-navigation-mode");
  if (mode !== "auto") {
    nav.dataset.topNavigationResolvedMode = mode ?? "desktop";
    return;
  }

  const primaryItems = Array.from(nav.querySelectorAll("[data-top-navigation-item-slot='primary']"));
  const destinationCount = primaryItems.length;
  const inlineSize = nav.getBoundingClientRect().width;
  const mobileBreakpoint = toPixels(nav.getAttribute("data-top-navigation-mobile-breakpoint"), nav.ownerDocument);
  if (mobileBreakpoint > 0 && inlineSize <= mobileBreakpoint) {
    setAutoLayout(nav, "mobile", 0);
    return;
  }

  for (let visibleCount = destinationCount; visibleCount >= 2; visibleCount -= 1) {
    setAutoLayout(nav, visibleCount === destinationCount ? "desktop" : "overflow", visibleCount);
    if (navFits(nav)) {
      return;
    }
  }

  setAutoLayout(nav, "mobile", 0);
}

function positionSurface(nav, trigger, surface) {
  if (!(trigger instanceof HTMLElement) || !(surface instanceof HTMLElement)) {
    return;
  }
  const owner = surface.dataset.topNavigationSurfaceOwner;
  const navBox = nav.getBoundingClientRect();
  if (owner === "mobile") {
    const viewportWidth = nav.ownerDocument.defaultView?.innerWidth ?? navBox.width;
    surface.style.setProperty("--pattern-top-navigation-menu-left", `${-navBox.left}px`);
    surface.style.setProperty("--pattern-top-navigation-menu-inline-end", "auto");
    surface.style.setProperty("--pattern-top-navigation-menu-width", `${viewportWidth}px`);
    surface.style.setProperty("--pattern-top-navigation-menu-transform", "none");
    return;
  }
  const triggerBox = trigger.getBoundingClientRect();
  const surfaceBox = surface.getBoundingClientRect();
  const inlineStart = triggerBox.right - navBox.left - (surfaceBox.width || 192);
  const inlineEnd = navBox.right - triggerBox.right;
  if (nav.getAttribute("dir") === "rtl") {
    surface.style.setProperty("--pattern-top-navigation-menu-inline-start", `${Math.max(0, triggerBox.left - navBox.left)}px`);
    surface.style.setProperty("--pattern-top-navigation-menu-inline-end", "auto");
  } else {
    surface.style.setProperty("--pattern-top-navigation-menu-inline-start", `${Math.max(0, inlineStart)}px`);
    surface.style.setProperty("--pattern-top-navigation-menu-inline-end", `${Math.max(0, inlineEnd)}px`);
  }
}

function syncOpenSurface(nav, nextOpen, restoreFocus = null) {
  closeSurfaces(nav, restoreFocus);
  nav.dataset.topNavigationOpenSurface = nextOpen ?? "none";
  if (!nextOpen || nextOpen === "none") {
    return;
  }
  const trigger = nav.querySelector(`[data-top-navigation-trigger-control-kind="${nextOpen}"]`);
  const surface = nav.querySelector(`[data-top-navigation-surface="${nextOpen}"]`);
  if (surface instanceof HTMLElement && trigger instanceof HTMLButtonElement) {
    if (trigger.hidden || trigger.offsetParent === null) {
      nav.dataset.topNavigationOpenSurface = "none";
      return;
    }
    surface.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    trigger.dataset.topNavigationTriggerControlExpanded = "true";
    positionSurface(nav, trigger, surface);
  }
}

export function attachTopNavigationPatternController(root = document) {
  attachTopNavigationBrandControlPrimitiveController(root);
  attachTopNavigationLinkControlPrimitiveController(root);
  attachTopNavigationTriggerControlPrimitiveController(root);

  for (const nav of root.querySelectorAll("[data-top-navigation]")) {
    if (!(nav instanceof HTMLElement) || nav.dataset.topNavigationController === "attached") {
      continue;
    }
    nav.dataset.topNavigationController = "attached";
    applyDeclaredStyles(nav, "data-top-navigation-style");
    resolveAutoMode(nav);
    nav.ownerDocument.defaultView?.requestAnimationFrame(() => {
      resolveAutoMode(nav);
      syncOpenSurface(nav, nav.dataset.topNavigationOpenSurface ?? "none");
    });
    if ("ResizeObserver" in nav.ownerDocument.defaultView) {
      const observer = new nav.ownerDocument.defaultView.ResizeObserver(() => {
        resolveAutoMode(nav);
        syncOpenSurface(nav, nav.dataset.topNavigationOpenSurface ?? "none");
      });
      observer.observe(nav);
    } else {
      nav.ownerDocument.defaultView?.addEventListener("resize", () => {
        resolveAutoMode(nav);
        syncOpenSurface(nav, nav.dataset.topNavigationOpenSurface ?? "none");
      });
    }
    syncOpenSurface(nav, nav.dataset.topNavigationOpenSurface ?? "none");

    nav.addEventListener("top-navigation-trigger-control:request-toggle", (event) => {
      const trigger = event.target instanceof HTMLButtonElement ? event.target : null;
      if (!trigger) {
        return;
      }
      const kind = trigger.dataset.topNavigationTriggerControlKind;
      const nextOpen = nav.dataset.topNavigationOpenSurface === kind ? "none" : kind;
      syncOpenSurface(nav, nextOpen ?? "none");
    });

    nav.ownerDocument.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) {
        closeSurfaces(nav);
      }
    });
    nav.ownerDocument.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.dataset.topNavigationOpenSurface !== "none") {
        const openKind = nav.dataset.topNavigationOpenSurface;
        const trigger = nav.querySelector(`[data-top-navigation-trigger-control-kind="${openKind}"]`);
        closeSurfaces(nav, trigger);
      }
    });
  }

}
