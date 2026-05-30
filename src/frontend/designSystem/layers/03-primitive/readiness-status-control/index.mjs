import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";

const primitiveName = "readiness-status-control";

const statusStates = {
  ready: {
    label: "Ready",
    meaning: "The selected entity can proceed.",
  },
  "needs-review": {
    label: "Needs review",
    meaning: "The selected entity requires attention.",
  },
  blocked: {
    label: "Blocked",
    meaning: "The selected entity cannot proceed.",
  },
  unknown: {
    label: "Unknown",
    meaning: "No reliable readiness state is available.",
  },
};

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

function tokenDependenciesFor() {
  const labelTextStyle = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "readiness-status-control requires a signed label-text-style token.",
  );

  return { labelTextStyle };
}

export const readinessStatusControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/readiness-status-control/ReadinessStatusControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["label-text-style"],
  requiredPrimitives: [],
  allowedStates: Object.keys(statusStates),
  consumerRules: [
    "Consumers must use this primitive for text-backed readiness/status indicators in governed page headers.",
    "Consumers must not locally recreate status labels, role=status semantics, or unknown-state normalization.",
    "Consumers may allow this primitive to compress as a single-line text disclosure inside constrained governed headers.",
    "Consumers must not add badge surfaces, icons, dots, borders, fills, or colour-only status meaning without a signed token and primitive revision.",
  ],
};

export function normalizeReadinessStatusState(state) {
  return Object.hasOwn(statusStates, state) ? state : "unknown";
}

export function readinessStatusControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `readiness-status-control-${Math.random().toString(36).slice(2, 10)}`;
  const state = normalizeReadinessStatusState(options.state ?? "unknown");
  const statusLabel = options.statusLabel ?? "Status";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(statusLabel, "statusLabel");

  const tokens = tokenDependenciesFor();
  const status = statusStates[state];

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    state,
    statusLabel,
    text: status.label,
    meaning: status.meaning,
    tokenDependencies: {
      labelTextStyle: {
        tokenName: tokens.labelTextStyle.tokenName,
        variantId: tokens.labelTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-readiness-status-control",
      "data-readiness-status-control": "",
      "data-readiness-status-state": state,
      "data-readiness-status-theme": theme,
      role: "status",
      "aria-live": "polite",
      "aria-label": `${statusLabel}: ${status.label}`,
    },
    styleVars: {
      "--primitive-readiness-status-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-readiness-status-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-readiness-status-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-readiness-status-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-readiness-status-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-readiness-status-text-transform": tokens.labelTextStyle.textTransform,
    },
    consumerRestrictions: readinessStatusControlPrimitiveContract.consumerRules,
  };
}

export function renderReadinessStatusControlPrimitive(options = {}) {
  const spec = readinessStatusControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-readiness-status-control-style": cssVarStyle(spec.styleVars),
  };

  return `
    <span ${toAttributeString(attributes)}>
      <span class="ds-readiness-status-control-label">${escapeHtml(spec.statusLabel)}</span>
      <span class="ds-readiness-status-control-value">${escapeHtml(spec.text)}</span>
    </span>
  `;
}

export function attachReadinessStatusControlPrimitiveController(root = document) {
  for (const status of root.querySelectorAll("[data-readiness-status-control]")) {
    if (!(status instanceof HTMLElement) || status.dataset.readinessStatusControlController === "attached") {
      continue;
    }

    status.dataset.readinessStatusControlController = "attached";
    const styleDeclaration = status.getAttribute("data-readiness-status-control-style");
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
        status.style.setProperty(property, value);
      }
    }
  }
}
