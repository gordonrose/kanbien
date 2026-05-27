import { indexNavListGapTokenSpec } from "../../02-token/index-nav-list-gap/systems/default.mjs";
import {
  attachIndexNavItemPatternController,
  renderIndexNavItemPattern,
} from "../index-nav-item/index.mjs";

const patternName = "index-nav-list";
const supportedSystems = new Map([
  [
    "default",
    {
      indexNavListGapTokenSpec,
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
    throw new RangeError(`index-nav-list has no system proof for "${systemKey}".`);
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
  if (!Array.isArray(items) || items.length === 0) {
    throw new TypeError("items must be a non-empty array.");
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
  const listGap = findVariant(
    proof.indexNavListGapTokenSpec,
    (variant) => variant.id === "index-nav-list-gap-default",
    "index-nav-list requires a signed index-nav-list-gap token.",
  );

  return { listGap };
}

export const indexNavListPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/index-nav-list/IndexNavList-Contract.md",
  supportedSystems: ["default"],
  requiredPatterns: ["index-nav-item"],
  directTokenDependencies: ["index-nav-list-gap"],
  consumerRules: [
    "Consumers must use this pattern for governed vertical index-navigation lists.",
    "Consumers must not recreate index item behavior, ARIA, state handling, tooltip behavior, or spacing locally.",
    "Consumers must not treat this pattern as a component seam, template, route, canonical scenario, or app adoption seam.",
  ],
};

export function indexNavListPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `index-nav-list-${Math.random().toString(36).slice(2, 10)}`;
  const ariaLabel = options.ariaLabel ?? "Index navigation";
  const currentValue = options.currentValue ?? null;
  const slot = options.slot ?? "index-nav";
  const items = normalizeItems(options.items ?? []);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(ariaLabel, "ariaLabel");
  assertString(slot, "slot");

  const tokens = tokenDependenciesFor({ systemKey });
  const currentMatches = items.filter((item) => currentValue !== null && item.value === currentValue);
  if (currentMatches.length > 1) {
    throw new TypeError("currentValue must match at most one item.");
  }

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    ariaLabel,
    slot,
    currentValue,
    items,
    tokenDependencies: {
      listGap: {
        tokenName: tokens.listGap.tokenName,
        variantId: tokens.listGap.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/index-nav-list-gap/systems/default.mjs#indexNavListGapTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-index-nav-list",
      "aria-label": ariaLabel,
      "data-index-nav-list": "",
      "data-index-nav-list-slot": slot,
      "data-index-nav-list-theme": theme,
    },
    styleVars: {
      "--pattern-index-nav-list-gap": tokens.listGap.lengthValue,
    },
    consumerRestrictions: indexNavListPatternContract.consumerRules,
  };
}

export function renderIndexNavListPattern(options = {}) {
  const spec = indexNavListPattern(options);
  const attributes = {
    ...spec.attributes,
    "data-index-nav-list-style": cssVarStyle(spec.styleVars),
  };

  return `
    <nav ${toAttributeString(attributes)}>
      <ul class="ds-index-nav-list-items">
        ${spec.items
          .map((item, index) => {
            const itemState = item.disabled ? "disabled" : spec.currentValue === item.value ? "current" : "resting";
            return `
              <li class="ds-index-nav-list-item">
                ${renderIndexNavItemPattern({
                  systemKey: spec.systemKey,
                  theme: spec.theme,
                  state: itemState,
                  label: item.label,
                  supportingText: item.supportingText,
                  value: item.value,
                  id: `${spec.id}-item-${index}`,
                  slot: spec.slot,
                })}
              </li>
            `;
          })
          .join("")}
      </ul>
    </nav>
  `;
}

export function attachIndexNavListPatternController(root = document) {
  for (const list of root.querySelectorAll("[data-index-nav-list]")) {
    if (!(list instanceof HTMLElement) || list.dataset.indexNavListController === "attached") {
      continue;
    }

    list.dataset.indexNavListController = "attached";
    const styleDeclaration = list.getAttribute("data-index-nav-list-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) {
          continue;
        }
        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (property && value) {
          list.style.setProperty(property, value);
        }
      }
    }
  }

  attachIndexNavItemPatternController(root);
}
