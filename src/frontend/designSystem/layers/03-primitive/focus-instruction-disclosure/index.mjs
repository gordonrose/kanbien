import { tooltipSurfaceTokenSpec } from "../../02-token/tooltip-surface/systems/default.mjs";
import { tooltipTextStyleTokenSpec } from "../../02-token/tooltip-text-style/systems/default.mjs";

const primitiveName = "focus-instruction-disclosure";
const supportedThemes = new Set(["original", "dark", "desert"]);

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

function tokenDependenciesFor({ theme }) {
  const surface = findVariant(
    tooltipSurfaceTokenSpec,
    (variant) => variant.role === "text overflow disclosure surface" && variant.theme === theme,
    `focus-instruction-disclosure requires a signed ${theme} tooltip-surface token.`,
  );
  const textStyle = findVariant(
    tooltipTextStyleTokenSpec,
    (variant) => variant.id === "tooltip-text-style-default",
    "focus-instruction-disclosure requires a signed tooltip-text-style token.",
  );

  return { surface, textStyle };
}

export const focusInstructionDisclosurePrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath:
    "docs/design-system/03-primitive/shared/focus-instruction-disclosure/FocusInstructionDisclosure-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: Array.from(supportedThemes),
  requiredTokens: ["tooltip-surface", "tooltip-text-style"],
  consumerRules: [
    "Consumers must use this primitive for focus-only keyboard instruction disclosure.",
    "Consumers must keep the instruction text specific to the focused control's available keyboard behavior.",
    "Consumers must not use this primitive for persistent helper text, validation text, hover-only tooltips, or product guidance.",
  ],
};

export function focusInstructionDisclosurePrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `focus-instruction-disclosure-${Math.random().toString(36).slice(2, 10)}`;
  const text = options.text ?? "";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(text, "text");

  if (systemKey !== "default") {
    throw new RangeError(`focus-instruction-disclosure has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`focus-instruction-disclosure does not support theme "${theme}".`);
  }

  const tokens = tokenDependenciesFor({ theme });
  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    text,
    tokenDependencies: {
      tooltipSurface: { tokenName: tokens.surface.tokenName, variantId: tokens.surface.id },
      tooltipTextStyle: { tokenName: tokens.textStyle.tokenName, variantId: tokens.textStyle.id },
    },
    attributes: {
      id,
      class: "ds-focus-instruction-disclosure",
      "data-focus-instruction-disclosure": "",
      "data-focus-instruction-disclosure-theme": theme,
    },
    styleVars: {
      "--primitive-focus-instruction-z-index": tokens.surface.zIndexValue,
      "--primitive-focus-instruction-background": tokens.surface.backgroundValue,
      "--primitive-focus-instruction-foreground": tokens.surface.foregroundValue,
      "--primitive-focus-instruction-border": tokens.surface.borderValue,
      "--primitive-focus-instruction-shadow": tokens.surface.shadowValue,
      "--primitive-focus-instruction-radius": tokens.surface.radiusValue,
      "--primitive-focus-instruction-padding-block": tokens.surface.paddingBlockValue,
      "--primitive-focus-instruction-padding-inline": tokens.surface.paddingInlineValue,
      "--primitive-focus-instruction-max-inline-size": tokens.surface.maxInlineSizeValue,
      "--primitive-focus-instruction-font-family": tokens.textStyle.fontFamilyValue,
      "--primitive-focus-instruction-font-size": tokens.textStyle.fontSizeValue,
      "--primitive-focus-instruction-font-weight": tokens.textStyle.fontWeightValue,
      "--primitive-focus-instruction-line-height": tokens.textStyle.lineHeightValue,
    },
    consumerRestrictions: focusInstructionDisclosurePrimitiveContract.consumerRules,
  };
}

export function renderFocusInstructionDisclosurePrimitive(options = {}) {
  const spec = focusInstructionDisclosurePrimitive(options);
  return `
    <span ${toAttributeString({
      ...spec.attributes,
      "data-focus-instruction-disclosure-style": cssVarStyle(spec.styleVars),
    })}>${escapeHtml(spec.text)}</span>
  `;
}

function positionDisclosure(host, disclosure) {
  const viewport = host.ownerDocument?.defaultView;
  const hostBox = host.getBoundingClientRect();
  const disclosureBox = disclosure.getBoundingClientRect();
  const gutter = 8;
  const fallbackWidth = Math.min(320, Math.max(160, hostBox.width));
  const disclosureWidth = disclosureBox.width || fallbackWidth;
  const disclosureHeight = disclosureBox.height || 48;
  const viewportWidth = viewport?.innerWidth ?? 0;
  const viewportHeight = viewport?.innerHeight ?? 0;
  const aboveTop = hostBox.top - disclosureHeight - gutter;
  const belowTop = hostBox.bottom + gutter;
  const top = aboveTop >= gutter ? aboveTop : Math.min(belowTop, Math.max(gutter, viewportHeight - disclosureHeight - gutter));
  const left = Math.min(Math.max(hostBox.left, gutter), Math.max(gutter, viewportWidth - disclosureWidth - gutter));

  disclosure.style.setProperty("--primitive-focus-instruction-top", `${Math.round(top)}px`);
  disclosure.style.setProperty("--primitive-focus-instruction-left", `${Math.round(left)}px`);
}

function setOpen(host, open) {
  const disclosure = host.querySelector("[data-focus-instruction-disclosure]");
  if (!(disclosure instanceof HTMLElement)) {
    return;
  }
  host.dataset.focusInstructionDisclosureOpen = open ? "true" : "false";
  if (open) {
    positionDisclosure(host, disclosure);
    requestAnimationFrame(() => positionDisclosure(host, disclosure));
  }
}

export function attachFocusInstructionDisclosurePrimitiveController(root = document) {
  for (const disclosure of root.querySelectorAll("[data-focus-instruction-disclosure]")) {
    if (!(disclosure instanceof HTMLElement) || disclosure.dataset.focusInstructionDisclosureController === "attached") {
      continue;
    }
    disclosure.dataset.focusInstructionDisclosureController = "attached";
    const styleDeclaration = disclosure.getAttribute("data-focus-instruction-disclosure-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) {
          continue;
        }
        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (property && value) {
          disclosure.style.setProperty(property, value);
        }
      }
    }
  }

  for (const host of root.querySelectorAll("[data-focus-instruction-disclosure-host]")) {
    if (!(host instanceof HTMLElement) || host.dataset.focusInstructionDisclosureHostController === "attached") {
      continue;
    }
    host.dataset.focusInstructionDisclosureHostController = "attached";
    host.addEventListener("focusin", () => setOpen(host, true));
    host.addEventListener("focusout", () => setOpen(host, false));
    host.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(host, false);
      }
    });
  }
}
