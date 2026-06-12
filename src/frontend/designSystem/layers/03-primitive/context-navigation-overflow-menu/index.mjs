import { resolveTokenSpec } from "../../02-token/token-spec-resolver.mjs";
import {
  attachContextNavigationItemControlPrimitiveController,
  renderContextNavigationItemControlPrimitive,
} from "../context-navigation-item-control/index.mjs";

const primitiveName = "context-navigation-overflow-menu";
const supportedModes = new Set(["default", "mobile"]);
const contextNavigationOverflowMenuFrameTokenSpec = resolveTokenSpec({
  systemKey: "default",
  tokenType: "context-navigation-overflow-menu-frame",
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

function normalizeItem(item, index) {
  if (!item || typeof item !== "object") {
    throw new TypeError(`items[${index}] must be an object.`);
  }
  assertString(item.label ?? "", `items[${index}].label`);
  return {
    id: item.id ?? `overflow-item-${index}`,
    label: item.label,
    kind: item.kind ?? "destination",
    state: item.state ?? "resting",
    value: item.value ?? item.label,
    href: item.href ?? `#overflow-item-${index}`,
  };
}

export const contextNavigationOverflowMenuPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath:
    "docs/design-system/03-primitive/shared/context-navigation-overflow-menu/ContextNavigationOverflowMenu-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  supportedModes: Array.from(supportedModes),
  requiredTokens: ["context-navigation-overflow-menu-frame"],
  requiredPrimitives: ["context-navigation-item-control"],
  eventName: "context-navigation-overflow-menu:toggle",
  consumerRules: [
    "Consumers must use this primitive for context-navigation More menu overflow.",
    "Consumers must not drop overflow items when this primitive is available.",
    "Consumers must not use this primitive as a generic menu, drawer, select, tooltip, or app router.",
  ],
};

function renderOverflowMenuItem(item, index) {
  const itemId = item.id || `overflow-item-${index}`;
  const baseAttributes = {
    id: itemId,
    class: item.kind === "utility" ? "menu-item menu-item-button" : "menu-item",
    "data-context-navigation-overflow-menu-item": "",
    "data-context-navigation-overflow-menu-item-kind": item.kind,
    "data-context-navigation-overflow-menu-item-value": item.value,
    role: "menuitem",
    "aria-current": item.state === "current" ? "page" : null,
  };

  if (item.kind === "utility") {
    return `<button ${toAttributeString({ ...baseAttributes, type: "button" })}>${escapeHtml(item.label)}</button>`;
  }

  return `<a ${toAttributeString({ ...baseAttributes, href: item.href })}>${escapeHtml(item.label)}</a>`;
}

export function contextNavigationOverflowMenuPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `context-navigation-overflow-menu-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "More";
  const mode = options.mode ?? "default";
  const items = Array.isArray(options.items) ? options.items.map(normalizeItem) : [];
  const frame = findVariant(
    contextNavigationOverflowMenuFrameTokenSpec,
    (variant) => variant.id === "context-navigation-overflow-menu-frame-default",
    "context-navigation-overflow-menu requires a signed context-navigation-overflow-menu-frame token.",
  );

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(mode, "mode");
  if (!supportedModes.has(mode)) {
    throw new RangeError(`context-navigation-overflow-menu does not support mode "${mode}".`);
  }

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    mode,
    items,
    tokenDependencies: {
      overflowMenuFrame: {
        tokenName: frame.tokenName,
        variantId: frame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/context-navigation-overflow-menu-frame/systems/default.mjs#contextNavigationOverflowMenuFrameTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-context-navigation-overflow-menu",
      "data-context-navigation-overflow-menu": "",
      "data-context-navigation-overflow-menu-mode": mode,
      "data-context-navigation-overflow-menu-open": "false",
    },
    styleVars: {
      "--primitive-context-navigation-overflow-menu-min-inline-size": frame.minInlineSize,
      "--primitive-context-navigation-overflow-menu-padding": frame.paddingValue,
      "--primitive-context-navigation-overflow-menu-border": frame.borderValue,
      "--primitive-context-navigation-overflow-menu-radius": frame.radiusValue,
      "--primitive-context-navigation-overflow-menu-background": frame.backgroundValue,
      "--primitive-context-navigation-overflow-menu-shadow": frame.shadowValue,
      "--primitive-context-navigation-overflow-menu-z-index": frame.zIndexValue,
      "--primitive-context-navigation-overflow-menu-desktop-bottom-offset": frame.desktopBottomOffset,
      "--primitive-context-navigation-overflow-menu-desktop-inline-offset": frame.desktopInlineOffset,
      "--primitive-context-navigation-overflow-menu-mobile-bottom-offset": frame.mobileBottomOffset,
      "--primitive-context-navigation-overflow-menu-mobile-inline-inset": frame.mobileInlineInset,
    },
    behavior: {
      openClose: "More trigger toggles menu visibility with aria-expanded and hidden state.",
      keyboard: "Escape closes the menu and restores focus to the More trigger.",
      pointer: "Outside click closes the menu and restores closed state without activating items.",
    },
  };
}

export function renderContextNavigationOverflowMenuPrimitive(options = {}) {
  const spec = contextNavigationOverflowMenuPrimitive(options);
  const menuId = `${spec.id}-menu`;
  const triggerId = `${spec.id}-trigger`;
  const attributes = {
    ...spec.attributes,
    "data-context-navigation-overflow-menu-style": cssVarStyle(spec.styleVars),
  };
  const itemHtml = spec.items.map(renderOverflowMenuItem).join("");

  return `
    <div ${toAttributeString(attributes)}>
      ${renderContextNavigationItemControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: triggerId,
        label: spec.label,
        icon: "context-more",
        kind: "utility",
        state: "resting",
        value: "context-navigation-overflow-menu",
      }).replace(
        "data-context-navigation-item-control=\"\"",
        `data-context-navigation-item-control="" data-context-navigation-overflow-trigger="" aria-haspopup="menu" aria-expanded="false" aria-controls="${escapeHtml(menuId)}"`,
      )}
      <div class="ds-context-navigation-overflow-menu-panel" id="${escapeHtml(menuId)}" role="menu" hidden data-context-navigation-overflow-panel>
        ${itemHtml}
      </div>
    </div>
  `;
}

export function attachContextNavigationOverflowMenuPrimitiveController(root = document) {
  for (const menu of root.querySelectorAll("[data-context-navigation-overflow-menu]")) {
    if (!(menu instanceof HTMLElement) || menu.dataset.contextNavigationOverflowMenuController === "attached") {
      continue;
    }
    menu.dataset.contextNavigationOverflowMenuController = "attached";
    const styleDeclaration = menu.getAttribute("data-context-navigation-overflow-menu-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) {
          continue;
        }
        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (property && value) {
          menu.style.setProperty(property, value);
        }
      }
    }
  }

  root.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-context-navigation-overflow-trigger]");
    const openMenu = root.querySelector('[data-context-navigation-overflow-menu-open="true"]');

    if (trigger instanceof HTMLElement) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const menu = trigger.closest("[data-context-navigation-overflow-menu]");
      if (menu instanceof HTMLElement) {
        setMenuOpen(menu, menu.getAttribute("data-context-navigation-overflow-menu-open") !== "true", true);
      }
      return;
    }

    if (openMenu instanceof HTMLElement && !openMenu.contains(event.target)) {
      setMenuOpen(openMenu, false, false);
    }
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }
    const openMenu = root.querySelector('[data-context-navigation-overflow-menu-open="true"]');
    if (openMenu instanceof HTMLElement) {
      event.preventDefault();
      setMenuOpen(openMenu, false, true);
    }
  });

  root.addEventListener("click", (event) => {
    const item = event.target.closest("[data-context-navigation-overflow-menu-item]");
    if (!(item instanceof HTMLElement)) {
      return;
    }
    const menu = item.closest("[data-context-navigation-overflow-menu]");
    if (menu instanceof HTMLElement) {
      if (item.getAttribute("data-context-navigation-overflow-menu-item-kind") === "utility") {
        item.dispatchEvent(
          new CustomEvent("context-navigation-item-control:activate", {
            bubbles: true,
            detail: {
              id: item.id,
              value: item.getAttribute("data-context-navigation-overflow-menu-item-value") ?? "",
              label: item.textContent?.trim() ?? "",
            },
          }),
        );
      }
      setMenuOpen(menu, false, false);
    }
  });

  attachContextNavigationItemControlPrimitiveController(root);
}

function setMenuOpen(menu, open, restoreFocus) {
  const trigger = menu.querySelector("[data-context-navigation-overflow-trigger]");
  const panel = menu.querySelector("[data-context-navigation-overflow-panel]");
  if (!(trigger instanceof HTMLElement) || !(panel instanceof HTMLElement)) {
    return;
  }
  menu.setAttribute("data-context-navigation-overflow-menu-open", open ? "true" : "false");
  trigger.setAttribute("aria-expanded", open ? "true" : "false");
  panel.hidden = !open;
  menu.dispatchEvent(
    new CustomEvent("context-navigation-overflow-menu:toggle", {
      bubbles: true,
      detail: { open },
    }),
  );
  if (!open && restoreFocus) {
    trigger.focus();
  }
}
