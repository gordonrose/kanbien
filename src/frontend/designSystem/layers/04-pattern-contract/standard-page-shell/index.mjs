import {
  attachContextNavigationPatternController,
  renderContextNavigationPattern,
} from "../context-navigation/index.mjs";
import { attachSubNavigationPatternController, renderSubNavigationPattern } from "../sub-navigation/index.mjs";
import { attachToolsNavigationPatternController, renderToolsNavigationPattern } from "../tools-navigation/index.mjs";
import { attachTopNavigationPatternController, renderTopNavigationPattern } from "../top-navigation/index.mjs";
import { resolveTokenSpec } from "../../02-token/token-spec-resolver.mjs";

const patternName = "standard-page-shell";
const allowedModes = new Set(["desktop", "compressed", "mobile"]);
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

export const standardPageShellPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/standard-page-shell/StandardPageShell-Contract.md",
  supportedSystems: ["default"],
  requiredPatterns: ["top-navigation", "sub-navigation", "context-navigation", "tools-navigation"],
  directTokenDependencies: ["standard-page-shell-frame"],
  consumerRules: [
    "Consumers must use this pattern for governed standard page shell composition.",
    "Consumers must not recreate top navigation, sub-navigation, context navigation, tools navigation, or shell-frame placement locally.",
    "Consumers must not treat this Layer 4 pattern as a component seam, use-case page, canonical page, or app adoption seam.",
  ],
};

export function standardPageShellPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `standard-page-shell-${Math.random().toString(36).slice(2, 10)}`;
  const mode = options.mode ?? "desktop";
  const direction = options.direction ?? "ltr";
  const frame = findVariant(
    resolveTokenSpec({ systemKey, tokenType: "standard-page-shell-frame" }),
    (variant) => variant.id === "standard-page-shell-frame-default",
    "standard-page-shell requires the signed standard-page-shell-frame token.",
  );

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(mode, "mode");
  assertString(direction, "direction");
  if (!allowedModes.has(mode)) {
    throw new RangeError(`standard-page-shell does not support mode "${mode}".`);
  }
  if (!allowedDirections.has(direction)) {
    throw new RangeError(`standard-page-shell does not support direction "${direction}".`);
  }

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    mode,
    direction,
    tokenDependencies: {
      standardPageShellFrame: {
        tokenName: frame.tokenName,
        variantId: frame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs#standardPageShellFrameTokenSpec",
      },
    },
    patternDependencies: {
      topNavigation: "src/frontend/designSystem/layers/04-pattern-contract/top-navigation/index.mjs#topNavigationPattern",
      subNavigation: "src/frontend/designSystem/layers/04-pattern-contract/sub-navigation/index.mjs#subNavigationPattern",
      contextNavigation: "src/frontend/designSystem/layers/04-pattern-contract/context-navigation/index.mjs#contextNavigationPattern",
      toolsNavigation: "src/frontend/designSystem/layers/04-pattern-contract/tools-navigation/index.mjs#toolsNavigationPattern",
    },
    attributes: {
      id,
      class: "ds-standard-page-shell",
      "data-standard-page-shell": "",
      "data-standard-page-shell-theme": theme,
      "data-theme-scope": theme === "original" ? null : theme,
      "data-standard-page-shell-mode": mode,
      dir: direction,
    },
    styleVars: {
      "--pattern-standard-page-shell-context-rail-inline-size": frame.contextRailInlineSize,
      "--pattern-standard-page-shell-page-padding-bottom": frame.mobileShellPagePaddingBottom,
      "--pattern-standard-page-shell-background": theme === "original" ? frame.surfaceSubNav : "var(--paper)",
      "--pattern-standard-page-shell-border": theme === "original" ? frame.borderValue : "0.0625rem solid var(--line)",
    },
    consumerRestrictions: standardPageShellPatternContract.consumerRules,
  };
}

export function renderStandardPageShellPattern(options = {}) {
  const spec = standardPageShellPattern(options);
  const attributes = {
    ...spec.attributes,
    "data-standard-page-shell-style": cssVarStyle(spec.styleVars),
  };
  const topMode = spec.mode === "mobile" ? "mobile" : "auto";
  const subMode = spec.mode === "mobile" ? "mobile" : spec.mode === "compressed" ? "compressed" : "auto";
  const contextViewportMode = spec.mode === "mobile" ? "mobile" : "desktop";
  const toolsViewportMode = spec.mode === "mobile" ? "mobile" : "desktop";
  const bodyHtml = options.bodyHtml ?? `
    <section class="ds-standard-page-shell-body-card">
      <h2>Page body</h2>
      <p>The standard shell pattern owns chrome composition and reserves page-body space without rebuilding child navigation seams.</p>
    </section>
  `;

  return `
    <section ${toAttributeString(attributes)}>
      <div class="ds-standard-page-shell-top" data-standard-page-shell-region="top-navigation">
        ${renderTopNavigationPattern({ ...options.topNavigation, systemKey: spec.systemKey, theme: spec.theme, direction: spec.direction, mode: topMode })}
      </div>
      <div class="ds-standard-page-shell-sub" data-standard-page-shell-region="sub-navigation">
        ${renderSubNavigationPattern({ ...options.subNavigation, systemKey: spec.systemKey, theme: spec.theme, direction: spec.direction, mode: subMode })}
      </div>
      <div class="ds-standard-page-shell-layout">
        <div class="ds-standard-page-shell-context" data-standard-page-shell-region="context-navigation">
          ${renderContextNavigationPattern({
            ...options.contextNavigation,
            systemKey: spec.systemKey,
            theme: spec.theme,
            viewportMode: contextViewportMode,
            mode: "proof-contained",
          })}
        </div>
        <main class="ds-standard-page-shell-body" data-standard-page-shell-region="body">
          ${bodyHtml}
        </main>
        <div class="ds-standard-page-shell-tools" data-standard-page-shell-region="tools-navigation">
          ${renderToolsNavigationPattern({
            ...options.toolsNavigation,
            systemKey: spec.systemKey,
            theme: spec.theme,
            viewportMode: toolsViewportMode,
            mode: "proof-contained",
          })}
        </div>
      </div>
    </section>
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

export function attachStandardPageShellPatternController(root = document) {
  attachTopNavigationPatternController(root);
  attachSubNavigationPatternController(root);
  attachContextNavigationPatternController(root);
  attachToolsNavigationPatternController(root);

  for (const shell of root.querySelectorAll("[data-standard-page-shell]")) {
    if (!(shell instanceof HTMLElement) || shell.dataset.standardPageShellController === "attached") {
      continue;
    }
    shell.dataset.standardPageShellController = "attached";
    applyDeclaredStyles(shell, "data-standard-page-shell-style");
  }
}
