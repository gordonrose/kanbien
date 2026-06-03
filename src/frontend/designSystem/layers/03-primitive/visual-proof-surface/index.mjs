import { surfaceFrameTokenSpec } from "../../02-token/surface-frame/systems/brochure.mjs";
import { visualProofOrnamentTokenSpec } from "../../02-token/visual-proof-ornament/systems/brochure.mjs";

const primitiveName = "visual-proof-surface";
const supportedSystems = new Map([
  [
    "brochure",
    {
      surfaceFrameTokenSpec,
      visualProofOrnamentTokenSpec,
    },
  ],
]);

const requiredOrnamentIds = ["visual-proof-grid-lines", "visual-proof-overlay-wash"];

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

function getSystemProof(systemKey) {
  assertString(systemKey, "systemKey");
  const proof = supportedSystems.get(systemKey);
  if (!proof) {
    throw new RangeError(`visual-proof-surface has no system proof for "${systemKey}".`);
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
  const surfaceFrame = findVariant(
    proof.surfaceFrameTokenSpec,
    (variant) => variant.surfaceRole === "showcase surface",
    `visual-proof-surface has no signed ${systemKey} showcase surface-frame token.`,
  );
  const ornamentVariants = requiredOrnamentIds.map((id) =>
    findVariant(
      proof.visualProofOrnamentTokenSpec,
      (variant) => variant.id === id,
      `visual-proof-surface has no signed ${systemKey} visual-proof-ornament token for ${id}.`,
    ),
  );
  const ornament = ornamentVariants[0];

  return { surfaceFrame, ornament, ornamentVariants };
}

export const visualProofSurfacePrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/visual-proof-surface/VisualProofSurface-Contract.md",
  supportedSystems: ["brochure"],
  requiredTokens: ["surface-frame", "visual-proof-ornament"],
  defaultSystem: "brochure",
  consumerRules: [
    "Consumers must use this primitive for governed decorative proof surfaces.",
    "Consumers must not use ornament color, shape, or position as the only carrier of proof meaning.",
    "Consumers must not copy proof-route markup or local CSS values into patterns or app pages.",
  ],
};

export function visualProofSurfacePrimitive(options = {}) {
  const systemKey = options.systemKey ?? visualProofSurfacePrimitiveContract.defaultSystem;
  const id = options.id ?? `visual-proof-surface-${Math.random().toString(36).slice(2, 10)}`;

  assertString(id, "id");

  const tokens = tokenDependenciesFor({ systemKey });

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    id,
    tokenDependencies: {
      surfaceFrame: {
        tokenName: tokens.surfaceFrame.tokenName,
        variantId: tokens.surfaceFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/surface-frame/systems/brochure.mjs#surfaceFrameTokenSpec",
      },
      visualProofOrnament: tokens.ornamentVariants.map((variant) => ({
        tokenName: variant.tokenName,
        variantId: variant.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/visual-proof-ornament/systems/brochure.mjs#visualProofOrnamentTokenSpec",
      })),
    },
    semantics: {
      interactive: false,
      focusable: false,
      role: null,
      ariaHidden: true,
      accessibleNameRequired: false,
    },
    attributes: {
      id,
      class: "ds-visual-proof-surface",
      "aria-hidden": "true",
      "data-visual-proof-surface": "",
    },
    styleVars: {
      "--primitive-visual-proof-surface-background": tokens.surfaceFrame.backgroundValue,
      "--primitive-visual-proof-surface-foreground": tokens.surfaceFrame.foregroundValue,
      "--primitive-visual-proof-surface-border": tokens.surfaceFrame.borderValue,
      "--primitive-visual-proof-surface-border-width": tokens.surfaceFrame.borderWidthValue,
      "--primitive-visual-proof-surface-radius": tokens.surfaceFrame.radiusValue,
      "--primitive-visual-proof-surface-shadow": tokens.surfaceFrame.shadowValue,
      "--primitive-visual-proof-grid-color": tokens.ornament.gridColorValue,
      "--primitive-visual-proof-grid-size": tokens.ornament.gridSizeValue,
      "--primitive-visual-proof-overlay": tokens.ornament.overlayValue,
    },
    consumerRestrictions: visualProofSurfacePrimitiveContract.consumerRules,
  };
}

export function renderVisualProofSurfacePrimitive(options = {}) {
  const spec = visualProofSurfacePrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-visual-proof-surface-style": cssVarStyle(spec.styleVars),
  };

  return `<div ${toAttributeString(attributes)}></div>`;
}

export function attachVisualProofSurfacePrimitive(root = document) {
  for (const surface of root.querySelectorAll("[data-visual-proof-surface]")) {
    if (!(surface instanceof HTMLElement) || surface.dataset.visualProofSurfaceController === "attached") {
      continue;
    }

    surface.dataset.visualProofSurfaceController = "attached";
    const styleDeclaration = surface.getAttribute("data-visual-proof-surface-style");
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
        surface.style.setProperty(property, value);
      }
    }
  }
}
