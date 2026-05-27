import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { tooltipSurfaceTokenSpec } from "../../02-token/tooltip-surface/systems/default.mjs";
import { tooltipTextStyleTokenSpec } from "../../02-token/tooltip-text-style/systems/default.mjs";

const primitiveName = "truncating-label";
const supportedSystems = new Map([
  [
    "default",
    {
      focusRingTokenSpec,
      labelTextStyleTokenSpec,
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

function getSystemProof(systemKey) {
  assertString(systemKey, "systemKey");

  const proof = supportedSystems.get(systemKey);
  if (!proof) {
    throw new RangeError(`truncating-label has no system proof for "${systemKey}".`);
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

function tokenDependenciesFor({ systemKey, theme }) {
  const proof = getSystemProof(systemKey);

  const labelTextStyle = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "truncating-label requires a signed label-text-style token for short label text.",
  );
  const tooltipTextStyle = findVariant(
    proof.tooltipTextStyleTokenSpec,
    (variant) => variant.role === "tooltip disclosure text",
    "truncating-label requires a signed tooltip-text-style token for tooltip disclosure text.",
  );
  const tooltipSurface = findVariant(
    proof.tooltipSurfaceTokenSpec,
    (variant) => variant.role === "text overflow disclosure surface" && variant.theme === theme,
    `truncating-label has no signed ${systemKey} tooltip-surface token for ${theme}.`,
  );
  const focusRing = findVariant(
    proof.focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `truncating-label has no signed ${systemKey} focus-ring token for ${theme}.`,
  );
  const minimumTargetSize = findVariant(
    proof.minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "truncating-label requires a signed minimum-target-size token for interactive target.",
  );

  return {
    labelTextStyle,
    tooltipTextStyle,
    tooltipSurface,
    focusRing,
    minimumTargetSize,
  };
}

function cssVarStyle(styleValues) {
  return Object.entries(styleValues)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
}

export const truncatingLabelPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "accepted",
  contractPath: "docs/design-system/03-primitive/shared/truncating-label/TruncatingLabel-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: [
    "label-text-style",
    "tooltip-surface",
    "tooltip-text-style",
    "focus-ring",
    "minimum-target-size",
  ],
  consumerRules: [
    "Consumers must use this primitive for governed truncating text labels instead of local ellipsis and tooltip behavior.",
    "Consumers must pass the full text value as the accessible value; visible clipping must not become the only source of meaning.",
    "Consumers must not nest this focusable primitive inside another interactive control without a later-layer composition decision.",
    "Consumers must not replace the signed token values with local CSS literals.",
  ],
};

export function truncatingLabelPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const text = options.text ?? "";
  const id = options.id ?? `truncating-label-${Math.random().toString(36).slice(2, 10)}`;

  assertString(theme, "theme");
  assertString(text, "text");
  assertString(id, "id");

  const tokens = tokenDependenciesFor({ systemKey, theme });
  const tooltipId = `${id}-tooltip`;

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    text,
    id,
    tooltipId,
    states: {
      fits: "No disclosure is required when the rendered text fits the available inline size.",
      truncated: "Visible text clips with ellipsis while the full text remains available through the disclosure surface.",
      focusVisible: "Keyboard focus reveals the disclosure surface and uses the signed focus-ring token.",
      pointerHover: "Pointer hover reveals the disclosure surface.",
      touchToggle: "Touch or click toggles the disclosure surface without emitting an app action.",
    },
    tokenDependencies: {
      labelTextStyle: {
        tokenName: tokens.labelTextStyle.tokenName,
        variantId: tokens.labelTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
      },
      tooltipSurface: {
        tokenName: tokens.tooltipSurface.tokenName,
        variantId: tokens.tooltipSurface.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/tooltip-surface/systems/default.mjs#tooltipSurfaceTokenSpec",
      },
      tooltipTextStyle: {
        tokenName: tokens.tooltipTextStyle.tokenName,
        variantId: tokens.tooltipTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs#tooltipTextStyleTokenSpec",
      },
      focusRing: {
        tokenName: tokens.focusRing.tokenName,
        variantId: tokens.focusRing.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec",
      },
      minimumTargetSize: {
        tokenName: tokens.minimumTargetSize.tokenName,
        variantId: tokens.minimumTargetSize.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec",
      },
    },
    semantics: {
      element: "span",
      focusable: true,
      interactiveRole: null,
      accessibleName: text,
      describedBy: "set only when rendered text is truncated",
      keyboard: ["Tab focuses the label.", "Focus reveals the full-text disclosure.", "Escape dismisses the disclosure."],
      pointer: ["Hover reveals disclosure.", "Click or tap toggles disclosure without emitting an app action."],
    },
    attributes: {
      id,
      class: "ds-truncating-label",
      tabindex: "0",
      "aria-label": text,
      "aria-describedby": null,
      "aria-expanded": "false",
      "data-truncating-label": "",
      "data-truncating-label-theme": theme,
    },
    tooltipAttributes: {
      id: tooltipId,
      class: "ds-truncating-label-tooltip",
      role: "tooltip",
      "data-truncating-label-tooltip": "",
    },
    styleVars: {
      "--primitive-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-label-text-transform": tokens.labelTextStyle.textTransform,
      "--primitive-tooltip-font-family": tokens.tooltipTextStyle.fontFamilyValue,
      "--primitive-tooltip-font-size": tokens.tooltipTextStyle.fontSizeValue,
      "--primitive-tooltip-font-weight": tokens.tooltipTextStyle.fontWeightValue,
      "--primitive-tooltip-line-height": tokens.tooltipTextStyle.lineHeightValue,
      "--primitive-tooltip-letter-spacing": tokens.tooltipTextStyle.letterSpacingValue,
      "--primitive-tooltip-text-transform": tokens.tooltipTextStyle.textTransform,
      "--primitive-tooltip-background": tokens.tooltipSurface.backgroundValue,
      "--primitive-tooltip-foreground": tokens.tooltipSurface.foregroundValue,
      "--primitive-tooltip-border": tokens.tooltipSurface.borderValue,
      "--primitive-tooltip-shadow": tokens.tooltipSurface.shadowValue,
      "--primitive-tooltip-radius": tokens.tooltipSurface.radiusValue,
      "--primitive-tooltip-padding-block": tokens.tooltipSurface.paddingBlockValue,
      "--primitive-tooltip-padding-inline": tokens.tooltipSurface.paddingInlineValue,
      "--primitive-tooltip-max-inline-size": tokens.tooltipSurface.maxInlineSizeValue,
      "--primitive-tooltip-z-index": tokens.tooltipSurface.zIndexValue,
      "--primitive-tooltip-motion-duration": tokens.tooltipSurface.motionDurationValue,
      "--primitive-tooltip-motion-easing": tokens.tooltipSurface.motionEasingValue,
      "--primitive-focus-ring": tokens.focusRing.ringValue,
      "--primitive-focus-ring-offset": tokens.focusRing.offsetValue,
      "--primitive-target-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-target-min-height": tokens.minimumTargetSize.minimumHeight,
    },
    layoutStyles: {
      "min-width": `min(100%, ${tokens.minimumTargetSize.minimumWidth})`,
      height: tokens.minimumTargetSize.minimumHeight,
      "min-height": tokens.minimumTargetSize.minimumHeight,
    },
    consumerRestrictions: truncatingLabelPrimitiveContract.consumerRules,
  };
}

export function renderTruncatingLabelPrimitive(options = {}) {
  const spec = truncatingLabelPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-truncating-label-style": cssVarStyle({ ...spec.layoutStyles, ...spec.styleVars }),
  };

  return `
    <span ${toAttributeString(attributes)}>
      <span class="ds-truncating-label-text" data-truncating-label-text>${escapeHtml(spec.text)}</span>
      <span ${toAttributeString(spec.tooltipAttributes)}>${escapeHtml(spec.text)}</span>
    </span>
  `;
}

export function attachTruncatingLabelPrimitiveController(root = document) {
  const labels = Array.from(root.querySelectorAll("[data-truncating-label]"));
  const userToggledOpen = new WeakSet();
  const suppressNextFocusOpen = new WeakSet();

  function applyDeclaredStyles(label) {
    const styleDeclaration = label.getAttribute("data-truncating-label-style");
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
        label.style.setProperty(property, value);
      }
    }
  }

  function setOpen(label, open) {
    if (!(label instanceof HTMLElement)) {
      return;
    }

    const canOpen = label.dataset.truncatingLabelOverflow === "true";
    label.dataset.truncatingLabelOpen = open && canOpen ? "true" : "false";
    label.setAttribute("aria-expanded", open && canOpen ? "true" : "false");
  }

  function updateOverflowState(label) {
    const text = label.querySelector("[data-truncating-label-text]");
    const tooltip = label.querySelector("[data-truncating-label-tooltip]");
    const overflows = text instanceof HTMLElement && text.scrollWidth > text.clientWidth + 1;

    label.dataset.truncatingLabelOverflow = overflows ? "true" : "false";
    if (tooltip instanceof HTMLElement) {
      if (overflows) {
        label.setAttribute("aria-describedby", tooltip.id);
      } else {
        label.removeAttribute("aria-describedby");
        setOpen(label, false);
      }
    }
  }

  for (const label of labels) {
    if (!(label instanceof HTMLElement) || label.dataset.truncatingLabelController === "attached") {
      continue;
    }

    label.dataset.truncatingLabelController = "attached";
    applyDeclaredStyles(label);
    updateOverflowState(label);
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => updateOverflowState(label));
      observer.observe(label);
    } else {
      window.addEventListener("resize", () => updateOverflowState(label));
    }

    label.addEventListener("pointerenter", () => setOpen(label, true));
    label.addEventListener("pointerleave", () => {
      userToggledOpen.delete(label);
      setOpen(label, false);
    });
    label.addEventListener("pointerdown", () => {
      suppressNextFocusOpen.add(label);
    });
    label.addEventListener("focus", () => {
      if (suppressNextFocusOpen.has(label)) {
        suppressNextFocusOpen.delete(label);
        return;
      }

      setOpen(label, true);
    });
    label.addEventListener("blur", () => {
      userToggledOpen.delete(label);
      setOpen(label, false);
    });
    label.addEventListener("click", (event) => {
      event.preventDefault();
      const nextOpen = !userToggledOpen.has(label);
      if (nextOpen) {
        userToggledOpen.add(label);
      } else {
        userToggledOpen.delete(label);
      }

      setOpen(label, nextOpen);
    });
    label.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        userToggledOpen.delete(label);
        setOpen(label, false);
      }
    });
  }
}
