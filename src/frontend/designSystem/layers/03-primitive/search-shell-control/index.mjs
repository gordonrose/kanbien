import { resolveTokenSpec } from "../../02-token/token-spec-resolver.mjs";
import { attachSearchFieldControlPrimitiveController, renderSearchFieldControlPrimitive, searchFieldControlPrimitive } from "../search-field-control/index.mjs";

const primitiveName = "search-shell-control";
const supportedThemes = new Set(["original", "dark", "desert"]);
const supportedStates = new Set(["empty", "active", "filled", "disabled", "error"]);
const supportedModes = new Set(["desktop", "compressed", "mobile"]);

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

export const searchShellControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/search-shell-control/SearchShellControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: Array.from(supportedThemes),
  supportedModes: Array.from(supportedModes),
  allowedStates: Array.from(supportedStates),
  requiredTokens: ["standard-page-shell-frame"],
  primitiveDependencies: ["search-field-control"],
  consumerRules: [
    "Consumers must use this primitive for governed secondary search shell posture.",
    "Consumers must compose the governed search-field-control primitive for native input behavior.",
    "Consumers must not add result rendering, backend search, route query persistence, component props, or app-local CSS.",
  ],
};

export function searchShellControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `search-shell-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Search";
  const name = options.name ?? "q";
  const placeholder = options.placeholder ?? "Search";
  const value = options.value ?? "";
  const state = options.state ?? (value ? "filled" : "empty");
  const mode = options.mode ?? "desktop";
  const hint = options.hint ?? "Enter";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(name, "name");
  assertString(placeholder, "placeholder");
  assertString(state, "state");
  assertString(mode, "mode");
  assertString(hint, "hint");
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`search-shell-control does not support theme "${theme}".`);
  }
  if (!supportedStates.has(state)) {
    throw new RangeError(`search-shell-control does not support state "${state}".`);
  }
  if (!supportedModes.has(mode)) {
    throw new RangeError(`search-shell-control does not support mode "${mode}".`);
  }

  const shellFrame = findVariant(
    resolveTokenSpec({ systemKey, tokenType: "standard-page-shell-frame" }),
    (variant) => variant.id === "standard-page-shell-frame-default",
    "search-shell-control requires the signed standard-page-shell-frame token.",
  );
  const searchField = searchFieldControlPrimitive({
    systemKey,
    theme,
    id: `${id}-field`,
    label,
    name,
    placeholder,
    value,
    state: state === "disabled" || state === "error" ? state : "default",
  });

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    name,
    placeholder,
    value,
    state,
    mode,
    hint,
    tokenDependencies: {
      standardPageShellFrame: {
        tokenName: shellFrame.tokenName,
        variantId: shellFrame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs#standardPageShellFrameTokenSpec",
      },
      searchFieldControl: {
        primitiveName: searchField.primitiveName,
        runtimeSeam: "src/frontend/designSystem/layers/03-primitive/search-field-control/index.mjs#searchFieldControlPrimitive",
      },
    },
    attributes: {
      id,
      class: "ds-search-shell-control",
      role: "search",
      "data-search-shell-control": "",
      "data-search-shell-control-theme": theme,
      "data-search-shell-control-state": state,
      "data-search-shell-control-mode": mode,
    },
    styleVars: {
      "--primitive-search-shell-max-inline-size": mode === "mobile" ? "none" : shellFrame.subNavSearchMaxInlineSize,
    },
    consumerRestrictions: searchShellControlPrimitiveContract.consumerRules,
  };
}

export function renderSearchShellControlPrimitive(options = {}) {
  const spec = searchShellControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-search-shell-control-style": cssVarStyle(spec.styleVars),
  };
  const hintHidden = spec.mode === "mobile";
  return `
    <form ${toAttributeString(attributes)}>
      <div class="ds-search-shell-control-field">
        ${renderSearchFieldControlPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-field`,
          label: spec.label,
          name: spec.name,
          placeholder: spec.placeholder,
          value: spec.value,
          state: spec.state === "disabled" || spec.state === "error" ? spec.state : "default",
        })}
        <span class="ds-search-shell-control-hint" aria-hidden="true" ${hintHidden ? "hidden" : ""}>
          <span class="ds-search-shell-control-hint-copy">Press</span>
          <span class="ds-search-shell-control-hint-key">${escapeHtml(spec.hint)}</span>
        </span>
      </div>
    </form>
  `;
}

export function attachSearchShellControlPrimitiveController(root = document) {
  for (const shell of root.querySelectorAll("[data-search-shell-control]")) {
    if (!(shell instanceof HTMLFormElement) || shell.dataset.searchShellControlController === "attached") {
      continue;
    }
    shell.dataset.searchShellControlController = "attached";
    const styleDeclaration = shell.getAttribute("data-search-shell-control-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex !== -1) {
          shell.style.setProperty(declaration.slice(0, separatorIndex).trim(), declaration.slice(separatorIndex + 1).trim());
        }
      }
    }
    shell.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = shell.querySelector("input[type='search']");
      shell.dispatchEvent(
        new CustomEvent("search-shell-control:submit", {
          bubbles: true,
          detail: {
            value: input instanceof HTMLInputElement ? input.value : "",
            name: input instanceof HTMLInputElement ? input.name : "",
          },
        }),
      );
    });
  }
  attachSearchFieldControlPrimitiveController(root);
}
