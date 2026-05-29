import {
  attachPanelHeaderControlPrimitiveController,
  renderPanelHeaderControlPrimitive,
} from "../../03-primitive/panel-header-control/index.mjs";
import {
  attachIconButtonControlPrimitiveController,
} from "../../03-primitive/icon-button-control/index.mjs";
import { panelFrameTokenSpec } from "../../02-token/panel-frame/systems/default.mjs";
import {
  attachIndexNavPanelPatternController,
  renderIndexNavPanelPattern,
} from "../index-nav-panel/index.mjs";
import {
  attachEntityBodyPanelPatternController,
  renderEntityBodyPanelPattern,
} from "../entity-body-panel/index.mjs";

const patternName = "entity-panel";

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

function normalizeIndexItems(items, fieldName) {
  if (!Array.isArray(items)) {
    throw new TypeError(`${fieldName} must be an array.`);
  }
  return items.map((item, index) => {
    const label = item?.label ?? "";
    const value = item?.value ?? label;
    assertString(label, `${fieldName}[${index}].label`);
    assertString(value, `${fieldName}[${index}].value`);
    return {
      label,
      value,
      supportingText: item.supportingText ?? "",
      disabled: item.disabled === true,
    };
  });
}

function tokenDependenciesFor() {
  const panelFrame = findVariant(
    panelFrameTokenSpec,
    (variant) => variant.id === "panel-frame-default",
    "entity-panel requires a signed generic panel-frame token.",
  );

  return { panelFrame };
}

export const entityPanelPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/entity-panel/EntityPanel-Contract.md",
  supportedSystems: ["default"],
  requiredPatterns: ["index-nav-panel", "entity-body-panel"],
  requiredPrimitives: ["panel-header-control", "icon-button-control"],
  directTokenDependencies: ["panel-frame"],
  consumerRules: [
    "Consumers must use this pattern for governed entity panel shells.",
    "Consumers must not recreate panel frame, header, secondary index, or body-panel behavior locally.",
    "Consumers must not treat proof-only body HTML as governed form or builder controls.",
  ],
};

export function entityPanelPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `entity-panel-${Math.random().toString(36).slice(2, 10)}`;
  const title = options.title ?? "Entity body";
  const ariaLabel = options.ariaLabel ?? title;
  const secondaryTitle = options.secondaryTitle ?? "Secondary index";
  const secondaryItems = normalizeIndexItems(options.secondaryItems ?? [], "secondaryItems");
  const secondaryCurrent = options.secondaryCurrent ?? null;
  const showSecondaryIndex = options.showSecondaryIndex !== false;
  const showSecondaryHeader = options.showSecondaryHeader === true;
  const secondaryResizable = options.secondaryResizable === true;
  const panelActionLabel = options.panelActionLabel ?? "Close panel";
  const panelActionIcon = options.panelActionIcon ?? "close";
  const secondaryActionLabel = options.secondaryActionLabel ?? "Add secondary index item";
  const secondaryActionIcon = options.secondaryActionIcon ?? "plus";
  const mobileActiveRegion = options.mobileActiveRegion ?? "body";
  const bodyHtml = options.bodyHtml ?? `<p data-entity-panel-placeholder>Governed body slot placeholder.</p>`;
  const bodyState = options.bodyState ?? "default";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(title, "title");
  assertString(ariaLabel, "ariaLabel");
  assertString(secondaryTitle, "secondaryTitle");
  assertString(panelActionLabel, "panelActionLabel");
  assertString(panelActionIcon, "panelActionIcon");
  assertString(secondaryActionLabel, "secondaryActionLabel");
  assertString(secondaryActionIcon, "secondaryActionIcon");
  assertString(mobileActiveRegion, "mobileActiveRegion");
  assertString(bodyState, "bodyState");

  if (!["body", "secondary-index"].includes(mobileActiveRegion)) {
    throw new RangeError(`entity-panel does not support mobileActiveRegion "${mobileActiveRegion}".`);
  }

  const tokens = tokenDependenciesFor();

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    title,
    ariaLabel,
    secondaryTitle,
    secondaryItems,
    secondaryCurrent,
    showSecondaryIndex,
    showSecondaryHeader,
    secondaryResizable,
    panelActionLabel,
    panelActionIcon,
    secondaryActionLabel,
    secondaryActionIcon,
    mobileActiveRegion,
    bodyState,
    bodyHtml,
    tokenDependencies: {
      panelFrame: {
        tokenName: tokens.panelFrame.tokenName,
        variantId: tokens.panelFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/panel-frame/systems/default.mjs#panelFrameTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-entity-panel",
      "data-entity-panel": "",
      "data-entity-panel-theme": theme,
      "data-entity-panel-mobile-active": mobileActiveRegion,
      "data-entity-panel-mobile-breakpoint": tokens.panelFrame.mobileBreakpointValue,
      "aria-label": ariaLabel,
    },
    styleVars: {
      "--pattern-entity-panel-background": tokens.panelFrame.backgroundValue,
      "--pattern-entity-panel-foreground": tokens.panelFrame.foregroundValue,
      "--pattern-entity-panel-border": tokens.panelFrame.borderValue,
      "--pattern-entity-panel-radius": tokens.panelFrame.radiusValue,
      "--pattern-entity-panel-padding-block": tokens.panelFrame.paddingBlockValue,
      "--pattern-entity-panel-padding-inline": tokens.panelFrame.paddingInlineValue,
      "--pattern-entity-panel-gap": tokens.panelFrame.gapValue,
      "--pattern-entity-panel-max-block-size": tokens.panelFrame.maxBlockSize,
      "--pattern-entity-panel-mobile-breakpoint": tokens.panelFrame.mobileBreakpointValue,
    },
    consumerRestrictions: entityPanelPatternContract.consumerRules,
  };
}

export function renderEntityPanelPattern(options = {}) {
  const spec = entityPanelPattern(options);
  const shouldRenderSecondaryHeader =
    spec.showSecondaryHeader || (spec.mobileActiveRegion === "secondary-index" && spec.secondaryCurrent !== null);
  const attributes = {
    ...spec.attributes,
    "data-entity-panel-style": cssVarStyle(spec.styleVars),
  };

  return `
    <section ${toAttributeString(attributes)}>
      ${renderPanelHeaderControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: `${spec.id}-header`,
        title: spec.title,
        actionLabel: spec.panelActionLabel,
        actionIcon: spec.panelActionIcon,
        showAction: true,
      })}
      <div class="ds-entity-panel-layout" data-entity-panel-layout>
        ${
          spec.showSecondaryIndex
            ? `<aside class="ds-entity-panel-secondary" data-entity-panel-region="secondary-index">
                ${renderIndexNavPanelPattern({
                  systemKey: spec.systemKey,
                  theme: spec.theme,
                  id: `${spec.id}-secondary-index`,
                  title: spec.secondaryTitle,
                  ariaLabel: spec.secondaryTitle,
                  currentValue: spec.secondaryCurrent,
                  items: spec.secondaryItems,
                  showHeader: shouldRenderSecondaryHeader,
                  showAddAction: spec.showSecondaryHeader,
                  addLabel: spec.secondaryActionLabel,
                  actionIcon: spec.secondaryActionIcon,
                  headerActions:
                    spec.secondaryCurrent === null
                      ? []
                      : [
                          {
                            label: "Close secondary index",
                            value: "close-secondary-index",
                            icon: "close",
                            visibility: "mobile",
                          },
                        ],
                  widthMode: "standard",
                  mobileMode: "page-scroll",
                  resizable: spec.secondaryResizable,
                })}
              </aside>`
            : ""
        }
        <div class="ds-entity-panel-body" data-entity-panel-region="body">
          ${renderEntityBodyPanelPattern({
            systemKey: spec.systemKey,
            theme: spec.theme,
            id: `${spec.id}-body-panel`,
            label: `${spec.title} body content`,
            state: spec.bodyState,
            mobileMode: "page-scroll",
            bodyHtml: spec.bodyHtml,
          })}
        </div>
      </div>
    </section>
  `;
}

export function attachEntityPanelPatternController(root = document) {
  const updateViewportPosture = (panel) => {
    const breakpoint = panel.getAttribute("data-entity-panel-mobile-breakpoint");
    const breakpointPx = toPixels(breakpoint, panel.ownerDocument);
    const viewportWidth = panel.ownerDocument?.defaultView?.innerWidth ?? 0;
    panel.dataset.entityPanelViewport = breakpointPx > 0 && viewportWidth <= breakpointPx ? "mobile" : "desktop";
  };

  for (const panel of root.querySelectorAll("[data-entity-panel]")) {
    if (!(panel instanceof HTMLElement) || panel.dataset.entityPanelController === "attached") {
      continue;
    }

    panel.dataset.entityPanelController = "attached";
    const styleDeclaration = panel.getAttribute("data-entity-panel-style");
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

  attachPanelHeaderControlPrimitiveController(root);
  attachIconButtonControlPrimitiveController(root);
  attachEntityBodyPanelPatternController(root);
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
