import {
  attachPanelSurfaceControlPrimitiveController,
  panelSurfaceControlPrimitive,
  renderPanelSurfaceControlPrimitive,
} from "../../03-primitive/panel-surface-control/index.mjs";
import { panelStackPlacementTokenSpec } from "../../02-token/panel-stack-placement/systems/default.mjs";

const patternName = "panel-stack";
const allowedOrigins = new Set(["left", "right"]);
const allowedViewports = new Set(["desktop", "mobile"]);

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

function stackPlacementVariant() {
  const variant = panelStackPlacementTokenSpec.variants.find(
    (candidate) => candidate.id === "panel-stack-placement-default",
  );
  if (!variant) {
    throw new RangeError("panel-stack requires the signed panel-stack-placement token.");
  }
  return variant;
}

function normalizePanels(panels) {
  if (!Array.isArray(panels) || panels.length === 0) {
    throw new TypeError("panels must be a non-empty array.");
  }

  return panels.map((panel, index) => {
    const id = panel?.id ?? `panel-${index + 1}`;
    const label = panel?.label ?? id;
    assertString(id, `panels[${index}].id`);
    assertString(label, `panels[${index}].label`);
    return {
      id,
      label,
      contentHtml: panel.contentHtml ?? `<p>${escapeHtml(label)} proof content.</p>`,
    };
  });
}

export const panelStackPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/panel-stack/PanelStack-Contract.md",
  supportedSystems: ["default"],
  requiredPatterns: [],
  requiredPrimitives: ["panel-surface-control"],
  directTokenDependencies: ["panel-stack-placement"],
  consumerRules: [
    "Consumers must use this pattern for reusable side-panel stack placement.",
    "Consumers must not recreate origin-side, desktop adjacency, mobile overlay order, or covered-panel posture locally.",
    "Consumers must not treat this pattern as drawer-select, searchable selection, display settings, route topology, or app adoption.",
  ],
};

export function panelStackPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const id = options.id ?? `panel-stack-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Panel stack";
  const origin = options.origin ?? "right";
  const viewport = options.viewport ?? "desktop";
  const panels = normalizePanels(options.panels ?? []);
  const activePanelId = options.activePanelId ?? panels[panels.length - 1]?.id;

  assertString(systemKey, "systemKey");
  assertString(id, "id");
  assertString(label, "label");
  assertString(origin, "origin");
  assertString(viewport, "viewport");
  assertString(activePanelId, "activePanelId");

  if (!allowedOrigins.has(origin)) {
    throw new RangeError(`panel-stack does not support origin "${origin}".`);
  }
  if (!allowedViewports.has(viewport)) {
    throw new RangeError(`panel-stack does not support viewport "${viewport}".`);
  }
  if (!panels.some((panel) => panel.id === activePanelId)) {
    throw new RangeError(`panel-stack activePanelId "${activePanelId}" does not match a panel.`);
  }

  const placement = stackPlacementVariant();
  const layerBase = Number.parseInt(placement.layerBaseValue, 10);
  const layerStep = Number.parseInt(placement.layerStepValue, 10);

  const panelSpecs = panels.map((panel, index) => {
    const isMobile = viewport === "mobile";
    const isActive = !isMobile || panel.id === activePanelId;
    const primitive = panelSurfaceControlPrimitive({
      systemKey,
      id: `${id}-${panel.id}`,
      label: panel.label,
      state: isActive ? "active" : "covered",
    });

    return {
      ...panel,
      primitive,
      state: primitive.state,
      layer: layerBase + index * layerStep,
    };
  });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    id,
    label,
    origin,
    viewport,
    activePanelId,
    panels: panelSpecs,
    tokenDependencies: {
      panelStackPlacement: {
        tokenName: placement.tokenName,
        variantId: placement.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/panel-stack-placement/systems/default.mjs#panelStackPlacementTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-panel-stack",
      "data-panel-stack": "",
      "data-panel-stack-origin": origin,
      "data-panel-stack-viewport": viewport,
      "data-panel-stack-active-panel": activePanelId,
      "aria-label": label,
    },
    styleVars: {
      "--pattern-panel-stack-desktop-gap": placement.desktopAdjacencyGapValue,
      "--pattern-panel-stack-overlay-inset": placement.overlayInsetValue,
      "--pattern-panel-stack-mobile-breakpoint": placement.mobileBreakpointValue,
    },
    consumerRestrictions: panelStackPatternContract.consumerRules,
  };
}

export function renderPanelStackPattern(options = {}) {
  const spec = panelStackPattern(options);
  const attributes = {
    ...spec.attributes,
    role: "group",
    "data-panel-stack-style": cssVarStyle(spec.styleVars),
  };

  return `
    <section ${toAttributeString(attributes)}>
      ${spec.panels
        .map(
          (panel) => `
            <div
              class="ds-panel-stack-item"
              data-panel-stack-item="${escapeHtml(panel.id)}"
              data-panel-stack-item-state="${escapeHtml(panel.state)}"
              style="--pattern-panel-stack-panel-layer: ${escapeHtml(panel.layer)};"
            >
              ${renderPanelSurfaceControlPrimitive({
                systemKey: spec.systemKey,
                id: `${spec.id}-${panel.id}`,
                label: panel.label,
                state: panel.state,
                contentHtml: panel.contentHtml,
              })}
            </div>
          `,
        )
        .join("")}
    </section>
  `;
}

export function attachPanelStackPatternController(root = document) {
  for (const stack of root.querySelectorAll("[data-panel-stack]")) {
    if (!(stack instanceof HTMLElement) || stack.dataset.panelStackController === "attached") {
      continue;
    }

    stack.dataset.panelStackController = "attached";
    const styleDeclaration = stack.getAttribute("data-panel-stack-style");
    if (!styleDeclaration) {
      continue;
    }

    for (const declaration of styleDeclaration.split(";")) {
      const separatorIndex = declaration.indexOf(":");
      if (separatorIndex === -1) {
        continue;
      }
      const property = declaration.slice(0, separatorIndex).trim();
      const value = declaration.slice(separatorIndex + 1).trim();
      if (property && value) {
        stack.style.setProperty(property, value);
      }
    }
  }

  attachPanelSurfaceControlPrimitiveController(root);
}
