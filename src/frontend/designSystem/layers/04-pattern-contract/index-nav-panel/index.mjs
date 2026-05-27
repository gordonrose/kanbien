import {
  attachIndexNavPanelHeaderControlPrimitiveController,
  renderIndexNavPanelHeaderControlPrimitive,
} from "../../03-primitive/index-nav-panel-header-control/index.mjs";
import {
  attachScrollRegionControlPrimitiveController,
  renderScrollRegionControlPrimitive,
} from "../../03-primitive/scroll-region-control/index.mjs";
import {
  attachResizeHandleControlPrimitiveController,
  renderResizeHandleControlPrimitive,
} from "../../03-primitive/resize-handle-control/index.mjs";
import { indexNavPanelFrameTokenSpec } from "../../02-token/index-nav-panel-frame/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import {
  attachIndexNavListPatternController,
  renderIndexNavListPattern,
} from "../index-nav-list/index.mjs";

const patternName = "index-nav-panel";
const supportedSystems = new Map([
  [
    "default",
    {
      indexNavPanelFrameTokenSpec,
      labelTextStyleTokenSpec,
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
    throw new RangeError(`index-nav-panel has no system proof for "${systemKey}".`);
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

function normalizeItems(items) {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array.");
  }
  return items.map((item, index) => {
    const label = item?.label ?? "";
    const value = item?.value ?? label;
    assertString(label, `items[${index}].label`);
    assertString(value, `items[${index}].value`);
    return {
      label,
      value,
      supportingText: item.supportingText ?? "",
      disabled: item.disabled === true,
    };
  });
}

function tokenDependenciesFor({ systemKey }) {
  const proof = getSystemProof(systemKey);
  const panelFrame = findVariant(
    proof.indexNavPanelFrameTokenSpec,
    (variant) => variant.id === "index-nav-panel-frame-default",
    "index-nav-panel requires a signed index-nav-panel-frame token.",
  );
  const labelTextStyle = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "index-nav-panel requires a signed label-text-style token for panel title and empty state text.",
  );

  return { labelTextStyle, panelFrame };
}

export const indexNavPanelPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/index-nav-panel/IndexNavPanel-Contract.md",
  supportedSystems: ["default"],
  requiredPatterns: ["index-nav-list"],
  requiredPrimitives: ["index-nav-panel-header-control", "icon-button-control", "scroll-region-control", "resize-handle-control"],
  directTokenDependencies: ["index-nav-panel-frame", "label-text-style"],
  consumerRules: [
    "Consumers must use this pattern for governed index-nav panel containers.",
    "Consumers must not recreate panel width, scroll region, add action, or list composition locally.",
    "Consumers must not treat this pattern as a full entity-page template, route, component seam, or app adoption seam.",
  ],
};

export function indexNavPanelPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `index-nav-panel-${Math.random().toString(36).slice(2, 10)}`;
  const title = options.title ?? "Primary index";
  const ariaLabel = options.ariaLabel ?? title;
  const currentValue = options.currentValue ?? null;
  const widthMode = options.widthMode ?? "standard";
  const mobileMode = options.mobileMode ?? "page-scroll";
  const items = normalizeItems(options.items ?? []);
  const emptyMessage = options.emptyMessage ?? "No index items available.";
  const showHeader = options.showHeader !== false;
  const showAddAction = options.showAddAction !== false;
  const resizable = options.resizable === true;
  const addLabel = options.addLabel ?? "Add";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(title, "title");
  assertString(ariaLabel, "ariaLabel");
  assertString(widthMode, "widthMode");
  assertString(mobileMode, "mobileMode");
  assertString(emptyMessage, "emptyMessage");
  assertString(addLabel, "addLabel");

  if (!["standard", "double"].includes(widthMode)) {
    throw new RangeError(`index-nav-panel does not support widthMode "${widthMode}".`);
  }
  if (!["page-scroll", "internal-scroll"].includes(mobileMode)) {
    throw new RangeError(`index-nav-panel does not support mobileMode "${mobileMode}".`);
  }

  const tokens = tokenDependenciesFor({ systemKey });
  const inlineSize = widthMode === "double" ? tokens.panelFrame.doubleInlineSize : tokens.panelFrame.standardInlineSize;

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    title,
    ariaLabel,
    currentValue,
    widthMode,
    mobileMode,
    items,
    emptyMessage,
    showAddAction,
    showHeader,
    resizable,
    addLabel,
    tokenDependencies: {
      panelFrame: {
        tokenName: tokens.panelFrame.tokenName,
        variantId: tokens.panelFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs#indexNavPanelFrameTokenSpec",
      },
      labelTextStyle: {
        tokenName: tokens.labelTextStyle.tokenName,
        variantId: tokens.labelTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-index-nav-panel",
      "data-index-nav-panel": "",
      "data-index-nav-panel-theme": theme,
      "data-index-nav-panel-width-mode": widthMode,
      "data-index-nav-panel-mobile-mode": mobileMode,
      "data-index-nav-panel-header-mode": showHeader ? "shown" : "hidden",
      "data-index-nav-panel-resizable": resizable ? "true" : "false",
      "data-index-nav-panel-mobile-breakpoint": tokens.panelFrame.mobileBreakpointValue,
      "aria-label": ariaLabel,
    },
    styleVars: {
      "--pattern-index-nav-panel-background": tokens.panelFrame.backgroundValue,
      "--pattern-index-nav-panel-foreground": tokens.panelFrame.foregroundValue,
      "--pattern-index-nav-panel-border": tokens.panelFrame.borderValue,
      "--pattern-index-nav-panel-radius": tokens.panelFrame.radiusValue,
      "--pattern-index-nav-panel-padding-block": tokens.panelFrame.paddingBlockValue,
      "--pattern-index-nav-panel-padding-inline": tokens.panelFrame.paddingInlineValue,
      "--pattern-index-nav-panel-gap": tokens.panelFrame.gapValue,
      "--pattern-index-nav-panel-inline-size": inlineSize,
      "--pattern-index-nav-panel-min-inline-size": tokens.panelFrame.minInlineSize,
      "--pattern-index-nav-panel-max-inline-size": tokens.panelFrame.maxInlineSize,
      "--pattern-index-nav-panel-mobile-inline-size": tokens.panelFrame.mobileInlineSize,
      "--pattern-index-nav-panel-max-block-size": tokens.panelFrame.maxBlockSize,
      "--pattern-index-nav-panel-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--pattern-index-nav-panel-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--pattern-index-nav-panel-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--pattern-index-nav-panel-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--pattern-index-nav-panel-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--pattern-index-nav-panel-label-text-transform": tokens.labelTextStyle.textTransform,
    },
    consumerRestrictions: indexNavPanelPatternContract.consumerRules,
  };
}

export function renderIndexNavPanelPattern(options = {}) {
  const spec = indexNavPanelPattern(options);
  const attributes = {
    ...spec.attributes,
    "data-index-nav-panel-style": cssVarStyle(spec.styleVars),
  };

  return `
    <section ${toAttributeString(attributes)}>
      ${
        spec.showHeader
          ? renderIndexNavPanelHeaderControlPrimitive({
              systemKey: spec.systemKey,
              theme: spec.theme,
              id: `${spec.id}-header`,
              title: spec.title,
              showAddAction: spec.showAddAction,
              addLabel: spec.addLabel,
            })
          : ""
      }
      ${renderScrollRegionControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: `${spec.id}-scroll`,
        mobileMode: spec.mobileMode,
        maxBlockSize: spec.styleVars["--pattern-index-nav-panel-max-block-size"],
        extraAttributes: {
          "data-index-nav-panel-scroll": "",
        },
        contentHtml: spec.items.length
          ? renderIndexNavListPattern({
              systemKey: spec.systemKey,
              theme: spec.theme,
              id: `${spec.id}-list`,
              ariaLabel: spec.ariaLabel,
              currentValue: spec.currentValue,
              items: spec.items,
            })
          : `<p class="ds-index-nav-panel-empty" data-index-nav-panel-empty>${escapeHtml(spec.emptyMessage)}</p>`,
      })}
      ${
        spec.resizable
          ? renderResizeHandleControlPrimitive({
              systemKey: spec.systemKey,
              theme: spec.theme,
              id: `${spec.id}-resize`,
              label: `Resize ${spec.title}`,
              targetId: spec.id,
              minInlineSize: spec.styleVars["--pattern-index-nav-panel-min-inline-size"],
              currentInlineSize: spec.styleVars["--pattern-index-nav-panel-inline-size"],
              maxInlineSize: spec.styleVars["--pattern-index-nav-panel-max-inline-size"],
            })
          : ""
      }
    </section>
  `;
}

export function attachIndexNavPanelPatternController(root = document) {
  const updateViewportPosture = (panel) => {
    const breakpoint = panel.getAttribute("data-index-nav-panel-mobile-breakpoint");
    const breakpointPx = toPixels(breakpoint, panel.ownerDocument);
    const viewportWidth = panel.ownerDocument?.defaultView?.innerWidth ?? 0;
    panel.dataset.indexNavPanelViewport = breakpointPx > 0 && viewportWidth <= breakpointPx ? "mobile" : "desktop";
  };

  for (const panel of root.querySelectorAll("[data-index-nav-panel]")) {
    if (!(panel instanceof HTMLElement) || panel.dataset.indexNavPanelController === "attached") {
      continue;
    }

    panel.dataset.indexNavPanelController = "attached";
    const styleDeclaration = panel.getAttribute("data-index-nav-panel-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) {
          continue;
        }
        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (property && value) {
          panel.style.setProperty(property, value);
        }
      }
    }
    updateViewportPosture(panel);
    panel.ownerDocument?.defaultView?.addEventListener("resize", () => updateViewportPosture(panel));
  }

  attachIndexNavPanelHeaderControlPrimitiveController(root);
  attachScrollRegionControlPrimitiveController(root);
  attachIndexNavListPatternController(root);
  attachResizeHandleControlPrimitiveController(root);
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
