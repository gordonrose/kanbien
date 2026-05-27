import { scrollbarSkinTokenSpec } from "../../02-token/scrollbar-skin/systems/default.mjs";

const primitiveName = "scroll-region-control";

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
  const scrollbarSkin = findVariant(
    scrollbarSkinTokenSpec,
    (variant) => variant.id === "scrollbar-skin-primary",
    "scroll-region-control requires the signed scrollbar skin token.",
  );

  return { scrollbarSkin };
}

export const scrollRegionControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/scroll-region-control/ScrollRegionControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["scrollbar-skin"],
  consumerRules: [
    "Consumers must use this primitive for governed scroll regions.",
    "Consumers must not recreate overflow, max-height, or scrollbar styling locally.",
    "Consumers must not treat this primitive as list semantics, panel layout, route selection, or app adoption.",
  ],
};

export function scrollRegionControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `scroll-region-control-${Math.random().toString(36).slice(2, 10)}`;
  const mobileMode = options.mobileMode ?? "page-scroll";
  const maxBlockSize = options.maxBlockSize ?? "none";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(mobileMode, "mobileMode");
  assertString(maxBlockSize, "maxBlockSize");

  if (!["page-scroll", "internal-scroll"].includes(mobileMode)) {
    throw new RangeError(`scroll-region-control does not support mobileMode "${mobileMode}".`);
  }

  const tokens = tokenDependenciesFor();

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    mobileMode,
    tokenDependencies: {
      panelFrame: {
        tokenName: "inherited",
        variantId: "inherited-from-containing-pattern",
        runtimeSeam: "containing pattern must provide a signed maxBlockSize when constraining scroll height",
      },
      scrollbarSkin: {
        tokenName: tokens.scrollbarSkin.tokenName,
        variantId: tokens.scrollbarSkin.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/scrollbar-skin/systems/default.mjs#scrollbarSkinTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-scroll-region-control",
      "data-scroll-region-control": "",
      "data-scroll-region-control-theme": theme,
      "data-scroll-region-control-mobile-mode": mobileMode,
    },
    styleVars: {
      "--primitive-scroll-region-max-block-size": maxBlockSize,
      "--primitive-scrollbar-width": tokens.scrollbarSkin.scrollbarWidthValue,
      "--primitive-scrollbar-thumb": tokens.scrollbarSkin.scrollbarThumbValue,
      "--primitive-scrollbar-track": tokens.scrollbarSkin.scrollbarTrackValue,
      "--primitive-scrollbar-radius": tokens.scrollbarSkin.scrollbarRadiusValue,
    },
    consumerRestrictions: scrollRegionControlPrimitiveContract.consumerRules,
  };
}

export function renderScrollRegionControlPrimitive(options = {}) {
  const spec = scrollRegionControlPrimitive(options);
  const contentHtml = options.contentHtml ?? "";
  const extraAttributes = options.extraAttributes ?? {};
  const attributes = {
    ...spec.attributes,
    ...extraAttributes,
    "data-scroll-region-control-style": cssVarStyle(spec.styleVars),
  };

  return `<div ${toAttributeString(attributes)}>${contentHtml}</div>`;
}

export function attachScrollRegionControlPrimitiveController(root = document) {
  for (const region of root.querySelectorAll("[data-scroll-region-control]")) {
    if (!(region instanceof HTMLElement) || region.dataset.scrollRegionControlController === "attached") {
      continue;
    }

    region.dataset.scrollRegionControlController = "attached";
    const styleDeclaration = region.getAttribute("data-scroll-region-control-style");
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
        region.style.setProperty(property, value);
      }
    }
  }
}
