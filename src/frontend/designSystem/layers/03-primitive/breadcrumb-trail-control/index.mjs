import { buttonFrameTokenSpec } from "../../02-token/button-frame/systems/default.mjs";
import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import {
  attachTruncatingLabelPrimitiveController,
  renderTruncatingLabelPrimitive,
} from "../truncating-label/index.mjs";

const primitiveName = "breadcrumb-trail-control";
const supportedThemes = new Set(["original", "dark", "desert"]);
const supportedModes = new Set(["full", "reduced-page-minus-one", "reduced-middle", "compact", "mobile-hidden"]);

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

function normalizeItem(item, index, currentIndex) {
  if (!item || typeof item !== "object") {
    throw new TypeError(`items[${index}] must be an object.`);
  }
  assertString(item.label ?? "", `items[${index}].label`);
  const current = item.current === true || index === currentIndex;
  if (!current) {
    assertString(item.href ?? "", `items[${index}].href`);
  }
  return {
    id: item.id ?? `breadcrumb-item-${index}`,
    label: item.label,
    href: item.href ?? "#",
    current,
  };
}

function tokenDependenciesFor(theme) {
  const buttonFrame = findVariant(
    buttonFrameTokenSpec,
    (variant) =>
      variant.frameRole === "text action button frame" &&
      variant.intent === "subtle" &&
      (variant.themeMapping ?? variant.theme) === theme,
    `breadcrumb-trail-control requires a signed text action button-frame token for ${theme}.`,
  );
  const labelTextStyle = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "breadcrumb-trail-control requires a signed label-text-style token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `breadcrumb-trail-control requires a signed focus-ring token for ${theme}.`,
  );
  const minimumTargetSize = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "breadcrumb-trail-control requires a signed minimum-target-size token.",
  );
  return { buttonFrame, focusRing, labelTextStyle, minimumTargetSize };
}

function visibleItemsForMode(items, mode) {
  if (mode === "mobile-hidden") {
    return [];
  }
  if (mode === "compact") {
    return [];
  }
  if (items.length <= 2 || mode === "full") {
    return items;
  }
  if (mode === "reduced-page-minus-one") {
    return items.filter((item, index) => index !== items.length - 2);
  }
  if (mode === "reduced-middle") {
    return items.filter((item, index) => index === 0 || item.current || index === items.length - 1);
  }
  return items;
}

function hiddenItemsForMode(items, visibleItems, mode) {
  if (mode === "compact") {
    return items;
  }
  const visible = new Set(visibleItems.map((item) => item.id));
  return items.filter((item) => !visible.has(item.id));
}

export const breadcrumbTrailControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/breadcrumb-trail-control/BreadcrumbTrailControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: Array.from(supportedThemes),
  supportedModes: Array.from(supportedModes),
  requiredTokens: ["button-frame", "label-text-style", "focus-ring", "minimum-target-size"],
  primitiveDependencies: ["truncating-label"],
  consumerRules: [
    "Consumers must use this primitive for governed breadcrumb hierarchy controls.",
    "Consumers must not invent breadcrumb hierarchy, collapse order, reveal surfaces, current semantics, or tooltip behavior locally.",
    "Consumers must not use this primitive for sub-navigation row placement, search behavior, component props, route generation, or app adoption.",
  ],
};

export function breadcrumbTrailControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `breadcrumb-trail-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Breadcrumb";
  const mode = options.mode ?? "full";
  const direction = options.direction ?? "ltr";
  const rawItems = Array.isArray(options.items) ? options.items : [];
  const currentIndex = rawItems.findIndex((item) => item?.current === true);
  const items = rawItems.map((item, index) => normalizeItem(item, index, currentIndex === -1 ? rawItems.length - 1 : currentIndex));

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(mode, "mode");
  assertString(direction, "direction");
  if (systemKey !== "default") {
    throw new RangeError(`breadcrumb-trail-control has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`breadcrumb-trail-control does not support theme "${theme}".`);
  }
  if (!supportedModes.has(mode)) {
    throw new RangeError(`breadcrumb-trail-control does not support mode "${mode}".`);
  }

  const tokens = tokenDependenciesFor(theme);
  const visibleItems = visibleItemsForMode(items, mode);
  const hiddenItems = hiddenItemsForMode(items, visibleItems, mode);

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    mode,
    direction,
    items,
    visibleItems,
    hiddenItems,
    tokenDependencies: {
      buttonFrame: {
        tokenName: tokens.buttonFrame.tokenName,
        variantId: tokens.buttonFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/button-frame/systems/default.mjs#buttonFrameTokenSpec",
      },
      labelTextStyle: {
        tokenName: tokens.labelTextStyle.tokenName,
        variantId: tokens.labelTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
      },
      focusRing: {
        tokenName: tokens.focusRing.tokenName,
        variantId: tokens.focusRing.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec",
      },
      minimumTargetSize: {
        tokenName: tokens.minimumTargetSize.tokenName,
        variantId: tokens.minimumTargetSize.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec",
      },
      truncatingLabel: {
        primitiveName: "truncating-label",
        runtimeSeam: "src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs#truncatingLabelPrimitive",
      },
    },
    attributes: {
      id,
      class: "ds-breadcrumb-trail-control",
      "data-breadcrumb-trail-control": "",
      "data-breadcrumb-trail-control-theme": theme,
      "data-breadcrumb-trail-control-mode": mode,
      dir: direction,
      "aria-label": label,
      hidden: mode === "mobile-hidden" ? true : null,
    },
    styleVars: {
      "--primitive-breadcrumb-control-background": tokens.buttonFrame.backgroundValue,
      "--primitive-breadcrumb-control-foreground": tokens.buttonFrame.foregroundValue,
      "--primitive-breadcrumb-control-border": tokens.buttonFrame.borderValue,
      "--primitive-breadcrumb-control-radius": tokens.buttonFrame.radiusValue,
      "--primitive-breadcrumb-control-padding-block": tokens.buttonFrame.paddingBlockValue,
      "--primitive-breadcrumb-control-padding-inline": tokens.buttonFrame.paddingInlineValue,
      "--primitive-breadcrumb-control-gap": tokens.buttonFrame.gapValue,
      "--primitive-breadcrumb-control-focus-ring": tokens.focusRing.ringValue,
      "--primitive-breadcrumb-control-focus-offset": tokens.focusRing.offsetValue,
      "--primitive-breadcrumb-control-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-breadcrumb-control-min-height": tokens.minimumTargetSize.minimumHeight,
      "--primitive-breadcrumb-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-breadcrumb-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-breadcrumb-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-breadcrumb-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-breadcrumb-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-breadcrumb-label-text-transform": tokens.labelTextStyle.textTransform,
    },
    consumerRestrictions: breadcrumbTrailControlPrimitiveContract.consumerRules,
  };
}

function renderLabel(spec, item) {
  return renderTruncatingLabelPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: `${spec.id}-${item.id}-label`,
    text: item.label,
    textStyle: "label",
    focusable: false,
  });
}

function renderMenuItem(item) {
  if (item.current) {
    return `<span class="ds-breadcrumb-trail-control-menu-item" role="menuitem" aria-current="page">${escapeHtml(item.label)}</span>`;
  }
  return `<a class="ds-breadcrumb-trail-control-menu-item" href="${escapeHtml(item.href)}" role="menuitem">${escapeHtml(item.label)}</a>`;
}

function renderReveal(spec, idSuffix, label, items) {
  if (items.length === 0) {
    return "";
  }
  const buttonId = `${spec.id}-${idSuffix}-trigger`;
  const menuId = `${spec.id}-${idSuffix}-menu`;
  return `
    <span class="ds-breadcrumb-trail-control-reveal">
      <button
        id="${escapeHtml(buttonId)}"
        class="ds-breadcrumb-trail-control-button ds-breadcrumb-trail-control-reveal-trigger"
        type="button"
        aria-expanded="false"
        aria-controls="${escapeHtml(menuId)}"
        aria-label="${escapeHtml(label)}"
        data-breadcrumb-trail-control-trigger
      >...</button>
      <div
        id="${escapeHtml(menuId)}"
        class="ds-breadcrumb-trail-control-menu"
        role="menu"
        aria-labelledby="${escapeHtml(buttonId)}"
        hidden
        data-breadcrumb-trail-control-menu
      >
        ${items.map(renderMenuItem).join("")}
      </div>
    </span>
  `;
}

export function renderBreadcrumbTrailControlPrimitive(options = {}) {
  const spec = breadcrumbTrailControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-breadcrumb-trail-control-style": cssVarStyle(spec.styleVars),
  };
  if (spec.mode === "mobile-hidden") {
    return `<nav ${toAttributeString(attributes)}></nav>`;
  }
  if (spec.mode === "compact") {
    return `
      <nav ${toAttributeString(attributes)}>
        ${renderReveal(spec, "compact", "Open page structure menu", spec.hiddenItems)}
      </nav>
    `;
  }
  const trail = spec.visibleItems
    .map((item, index) => {
      const hiddenReveal =
        index === 1 && spec.hiddenItems.length > 0
          ? `<li class="ds-breadcrumb-trail-control-separator" aria-hidden="true">/</li><li>${renderReveal(
              spec,
              "collapsed",
              "Open hidden breadcrumb menu",
              spec.hiddenItems,
            )}</li>`
          : "";
      const separator = index > 0 ? `<li class="ds-breadcrumb-trail-control-separator" aria-hidden="true">/</li>` : "";
      const control = item.current
        ? `<span class="ds-breadcrumb-trail-control-button ds-breadcrumb-trail-control-current" aria-current="page">${renderLabel(spec, item)}</span>`
        : `<a class="ds-breadcrumb-trail-control-button" href="${escapeHtml(item.href)}" aria-label="${escapeHtml(item.label)}">${renderLabel(spec, item)}</a>`;
      return `${hiddenReveal}${separator}<li>${control}</li>`;
    })
    .join("");
  return `
    <nav ${toAttributeString(attributes)}>
      <ol class="ds-breadcrumb-trail-control-list">
        ${trail}
      </ol>
    </nav>
  `;
}

function closeMenu(trigger, menu, restoreFocus) {
  trigger.setAttribute("aria-expanded", "false");
  menu.hidden = true;
  if (restoreFocus) {
    trigger.focus();
  }
}

export function attachBreadcrumbTrailControlPrimitiveController(root = document) {
  for (const breadcrumb of root.querySelectorAll("[data-breadcrumb-trail-control]")) {
    if (!(breadcrumb instanceof HTMLElement) || breadcrumb.dataset.breadcrumbTrailControlController === "attached") {
      continue;
    }
    breadcrumb.dataset.breadcrumbTrailControlController = "attached";
    const styleDeclaration = breadcrumb.getAttribute("data-breadcrumb-trail-control-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex !== -1) {
          breadcrumb.style.setProperty(declaration.slice(0, separatorIndex).trim(), declaration.slice(separatorIndex + 1).trim());
        }
      }
    }
    for (const trigger of breadcrumb.querySelectorAll("[data-breadcrumb-trail-control-trigger]")) {
      if (!(trigger instanceof HTMLButtonElement)) {
        continue;
      }
      const menuId = trigger.getAttribute("aria-controls");
      const menu = menuId ? breadcrumb.querySelector(`#${CSS.escape(menuId)}`) : null;
      if (!(menu instanceof HTMLElement)) {
        continue;
      }
      trigger.addEventListener("click", () => {
        const open = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", open ? "false" : "true");
        menu.hidden = open;
      });
      document.addEventListener("click", (event) => {
        if (menu.hidden || breadcrumb.contains(event.target)) {
          return;
        }
        closeMenu(trigger, menu, false);
      });
      breadcrumb.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !menu.hidden) {
          event.preventDefault();
          closeMenu(trigger, menu, true);
        }
      });
    }
  }
  attachTruncatingLabelPrimitiveController(root);
}
