import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/brochure.mjs";
import { linkDecorationTokenSpec } from "../../02-token/link-decoration/systems/brochure.mjs";
import { linkTextStyleTokenSpec } from "../../02-token/link-text-style/systems/brochure.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/brochure.mjs";
import { tooltipSurfaceTokenSpec } from "../../02-token/tooltip-surface/systems/brochure.mjs";
import { tooltipTextStyleTokenSpec } from "../../02-token/tooltip-text-style/systems/brochure.mjs";

const primitiveName = "brochure-text-link-action";
const supportedSystems = new Map([
  [
    "brochure",
    {
      focusRingTokenSpec,
      linkDecorationTokenSpec,
      linkTextStyleTokenSpec,
      minimumTargetSizeTokenSpec,
      tooltipSurfaceTokenSpec,
      tooltipTextStyleTokenSpec,
    },
  ],
]);

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

function getSystemProof(systemKey) {
  assertString(systemKey, "systemKey");
  const proof = supportedSystems.get(systemKey);
  if (!proof) {
    throw new RangeError(`brochure-text-link-action has no system proof for "${systemKey}".`);
  }
  return proof;
}

function findVariant(tokenSpec, predicate, missingMessage) {
  const variant = tokenSpec.variants.find(predicate);
  if (!variant) {
    throw new RangeError(missingMessage);
  }
  return variant;
}

function tokenDependenciesFor({ systemKey }) {
  const proof = getSystemProof(systemKey);
  const linkTextStyle = findVariant(
    proof.linkTextStyleTokenSpec,
    (variant) => variant.id === "link-text-style-standalone",
    "brochure-text-link-action requires a signed standalone link text token.",
  );
  const linkDecoration = findVariant(
    proof.linkDecorationTokenSpec,
    (variant) => variant.id === "link-decoration-standalone",
    "brochure-text-link-action requires a signed standalone link decoration token.",
  );
  const focusRing = findVariant(
    proof.focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === "original",
    "brochure-text-link-action requires a signed original focus-ring token.",
  );
  const minimumTargetSize = findVariant(
    proof.minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "brochure-text-link-action requires a signed minimum-target-size token.",
  );
  const tooltipSurface = findVariant(
    proof.tooltipSurfaceTokenSpec,
    (variant) => variant.role === "text overflow disclosure surface" && variant.theme === "original",
    "brochure-text-link-action requires a signed original tooltip-surface token.",
  );
  const tooltipTextStyle = findVariant(
    proof.tooltipTextStyleTokenSpec,
    (variant) => variant.role === "tooltip disclosure text",
    "brochure-text-link-action requires a signed tooltip-text-style token.",
  );

  return { focusRing, linkDecoration, linkTextStyle, minimumTargetSize, tooltipSurface, tooltipTextStyle };
}

export const brochureTextLinkActionPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/brochure-text-link-action/BrochureTextLinkAction-Contract.md",
  supportedSystems: ["brochure"],
  requiredTokens: [
    "link-text-style",
    "link-decoration",
    "focus-ring",
    "minimum-target-size",
    "tooltip-surface",
    "tooltip-text-style",
  ],
  consumerRules: [
    "Consumers must use this primitive for governed standalone brochure text links.",
    "Consumers must not recreate native anchor markup, focus behavior, typography, decoration, target sizing, truncation, tooltip disclosure, or token values locally.",
    "Consumers must not treat this primitive as route authorization, product workflow, component seam, or app adoption.",
  ],
};

export function brochureTextLinkActionPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "brochure";
  const label = options.label ?? "View supporting proof";
  const href = options.href ?? "/design-system/brochure/";
  const id = options.id ?? `brochure-text-link-action-${Math.random().toString(36).slice(2, 10)}`;

  assertString(label, "label");
  assertString(href, "href");
  assertString(id, "id");

  const tokens = tokenDependenciesFor({ systemKey });
  const tooltipId = `${id}-tooltip`;

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    id,
    tooltipId,
    label,
    href,
    tokenDependencies: {
      linkTextStyle: {
        tokenName: tokens.linkTextStyle.tokenName,
        variantId: tokens.linkTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/link-text-style/systems/brochure.mjs#linkTextStyleTokenSpec",
      },
      linkDecoration: {
        tokenName: tokens.linkDecoration.tokenName,
        variantId: tokens.linkDecoration.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/link-decoration/systems/brochure.mjs#linkDecorationTokenSpec",
      },
      focusRing: {
        tokenName: tokens.focusRing.tokenName,
        variantId: tokens.focusRing.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/focus-ring/systems/brochure.mjs#focusRingTokenSpec",
      },
      minimumTargetSize: {
        tokenName: tokens.minimumTargetSize.tokenName,
        variantId: tokens.minimumTargetSize.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/minimum-target-size/systems/brochure.mjs#minimumTargetSizeTokenSpec",
      },
      tooltipSurface: {
        tokenName: tokens.tooltipSurface.tokenName,
        variantId: tokens.tooltipSurface.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/tooltip-surface/systems/brochure.mjs#tooltipSurfaceTokenSpec",
      },
      tooltipTextStyle: {
        tokenName: tokens.tooltipTextStyle.tokenName,
        variantId: tokens.tooltipTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/brochure.mjs#tooltipTextStyleTokenSpec",
      },
    },
    semantics: {
      element: "a",
      role: "native link",
      accessibleName: label,
      describedBy: "set only when rendered link text is truncated",
      keyboard: [
        "Tab focuses the link.",
        "Focus reveals the full-text disclosure when the label is truncated.",
        "Enter activates through native anchor behavior.",
        "Escape dismisses the disclosure.",
      ],
    },
    attributes: {
      id,
      class: "ds-brochure-text-link-action",
      href,
      "aria-label": label,
      "aria-describedby": null,
      "data-brochure-text-link-action": "",
    },
    tooltipAttributes: {
      id: tooltipId,
      class: "ds-brochure-text-link-action-tooltip",
      role: "tooltip",
      "data-brochure-text-link-action-tooltip": "",
    },
    styleVars: {
      "--primitive-brochure-link-font-family": tokens.linkTextStyle.fontFamilyValue,
      "--primitive-brochure-link-font-size": tokens.linkTextStyle.fontSizeValue,
      "--primitive-brochure-link-font-weight": tokens.linkTextStyle.fontWeightValue,
      "--primitive-brochure-link-line-height": tokens.linkTextStyle.lineHeightValue,
      "--primitive-brochure-link-letter-spacing": tokens.linkTextStyle.letterSpacingValue,
      "--primitive-brochure-link-text-transform": tokens.linkTextStyle.textTransform,
      "--primitive-brochure-link-foreground": tokens.linkTextStyle.foregroundValue,
      "--primitive-brochure-link-hover-foreground": tokens.linkTextStyle.hoverForegroundValue,
      "--primitive-brochure-link-decoration-line": tokens.linkDecoration.textDecorationLineValue,
      "--primitive-brochure-link-decoration-thickness": tokens.linkDecoration.textDecorationThicknessValue,
      "--primitive-brochure-link-underline-offset": tokens.linkDecoration.textUnderlineOffsetValue,
      "--primitive-brochure-link-hover-decoration-line": tokens.linkDecoration.hoverTextDecorationLineValue,
      "--primitive-brochure-link-focus-ring": tokens.focusRing.ringValue,
      "--primitive-brochure-link-focus-ring-offset": tokens.focusRing.offsetValue,
      "--primitive-brochure-link-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-brochure-link-min-height": tokens.minimumTargetSize.minimumHeight,
      "--primitive-brochure-link-tooltip-font-family": tokens.tooltipTextStyle.fontFamilyValue,
      "--primitive-brochure-link-tooltip-font-size": tokens.tooltipTextStyle.fontSizeValue,
      "--primitive-brochure-link-tooltip-font-weight": tokens.tooltipTextStyle.fontWeightValue,
      "--primitive-brochure-link-tooltip-line-height": tokens.tooltipTextStyle.lineHeightValue,
      "--primitive-brochure-link-tooltip-letter-spacing": tokens.tooltipTextStyle.letterSpacingValue,
      "--primitive-brochure-link-tooltip-text-transform": tokens.tooltipTextStyle.textTransform,
      "--primitive-brochure-link-tooltip-background": tokens.tooltipSurface.backgroundValue,
      "--primitive-brochure-link-tooltip-foreground": tokens.tooltipSurface.foregroundValue,
      "--primitive-brochure-link-tooltip-border": tokens.tooltipSurface.borderValue,
      "--primitive-brochure-link-tooltip-shadow": tokens.tooltipSurface.shadowValue,
      "--primitive-brochure-link-tooltip-radius": tokens.tooltipSurface.radiusValue,
      "--primitive-brochure-link-tooltip-padding-block": tokens.tooltipSurface.paddingBlockValue,
      "--primitive-brochure-link-tooltip-padding-inline": tokens.tooltipSurface.paddingInlineValue,
      "--primitive-brochure-link-tooltip-max-inline-size": tokens.tooltipSurface.maxInlineSizeValue,
      "--primitive-brochure-link-tooltip-z-index": tokens.tooltipSurface.zIndexValue,
      "--primitive-brochure-link-tooltip-motion-duration": tokens.tooltipSurface.motionDurationValue,
      "--primitive-brochure-link-tooltip-motion-easing": tokens.tooltipSurface.motionEasingValue,
    },
    consumerRestrictions: brochureTextLinkActionPrimitiveContract.consumerRules,
  };
}

export function renderBrochureTextLinkActionPrimitive(options = {}) {
  const spec = brochureTextLinkActionPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-brochure-text-link-action-style": cssVarStyle(spec.styleVars),
  };

  return `
    <a ${toAttributeString(attributes)}>
      <span class="ds-brochure-text-link-action-label" data-brochure-text-link-action-label>${escapeHtml(spec.label)}</span>
      <span ${toAttributeString(spec.tooltipAttributes)}>${escapeHtml(spec.label)}</span>
    </a>
  `;
}

export function attachBrochureTextLinkActionPrimitive(root = document) {
  function applyDeclaredStyles(link) {
    const styleDeclaration = link.getAttribute("data-brochure-text-link-action-style");
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
        link.style.setProperty(property, value);
      }
    }
  }

  function positionTooltip(link) {
    const tooltip = link.querySelector("[data-brochure-text-link-action-tooltip]");
    if (!(tooltip instanceof HTMLElement)) {
      return;
    }

    const viewport = link.ownerDocument?.defaultView;
    const linkBox = link.getBoundingClientRect();
    const tooltipBox = tooltip.getBoundingClientRect();
    const gutter = 8;
    const fallbackWidth = Math.min(320, Math.max(160, linkBox.width));
    const tooltipWidth = tooltipBox.width || fallbackWidth;
    const tooltipHeight = tooltipBox.height || 48;
    const viewportWidth = viewport?.innerWidth ?? 0;
    const viewportHeight = viewport?.innerHeight ?? 0;
    const aboveTop = linkBox.top - tooltipHeight - gutter;
    const belowTop = linkBox.bottom + gutter;
    const fitsAbove = aboveTop >= gutter;
    const top = fitsAbove ? aboveTop : Math.min(belowTop, Math.max(gutter, viewportHeight - tooltipHeight - gutter));
    const left = Math.min(Math.max(linkBox.left, gutter), Math.max(gutter, viewportWidth - tooltipWidth - gutter));

    tooltip.style.setProperty("--primitive-brochure-link-tooltip-top", `${Math.round(top)}px`);
    tooltip.style.setProperty("--primitive-brochure-link-tooltip-left", `${Math.round(left)}px`);
  }

  function setOpen(link, open) {
    const canOpen = link.dataset.brochureTextLinkActionOverflow === "true";
    link.dataset.brochureTextLinkActionOpen = open && canOpen ? "true" : "false";
    if (open && canOpen) {
      positionTooltip(link);
      requestAnimationFrame(() => positionTooltip(link));
    }
  }

  function updateOverflowState(link) {
    const label = link.querySelector("[data-brochure-text-link-action-label]");
    const tooltip = link.querySelector("[data-brochure-text-link-action-tooltip]");
    const overflows = label instanceof HTMLElement && label.scrollWidth > label.clientWidth + 1;

    link.dataset.brochureTextLinkActionOverflow = overflows ? "true" : "false";
    if (tooltip instanceof HTMLElement) {
      if (overflows) {
        link.setAttribute("aria-describedby", tooltip.id);
      } else {
        link.removeAttribute("aria-describedby");
        setOpen(link, false);
      }
    }
  }

  for (const link of root.querySelectorAll("[data-brochure-text-link-action]")) {
    if (!(link instanceof HTMLElement) || link.dataset.brochureTextLinkActionController === "attached") {
      continue;
    }

    link.dataset.brochureTextLinkActionController = "attached";
    applyDeclaredStyles(link);
    updateOverflowState(link);

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => updateOverflowState(link));
      observer.observe(link);
    } else {
      window.addEventListener("resize", () => updateOverflowState(link));
    }

    link.addEventListener("pointerenter", () => setOpen(link, true));
    link.addEventListener("pointerleave", () => setOpen(link, false));
    link.addEventListener("focus", () => setOpen(link, true));
    link.addEventListener("blur", () => setOpen(link, false));
    link.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(link, false);
      }
    });
  }
}
