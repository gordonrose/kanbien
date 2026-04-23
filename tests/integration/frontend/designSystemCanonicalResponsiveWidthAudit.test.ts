import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const assetRoot = resolve(process.cwd(), "src/frontend/designSystem/assets");

function readAsset(path: string) {
  return readFileSync(resolve(assetRoot, path), "utf8");
}

describe("design-system canonical responsive width audit", () => {
  it("prevents date-picker canonical routes from forcing fixed inline widths on the preview surface", () => {
    const source = readAsset("datePickerCanonical.mjs");
    const helper = readAsset("canonicalOwnerReserve.mjs");

    expect(source).not.toContain("previewFrame.style.width =");
    expect(source).not.toContain("previewShell.style.width =");
    expect(source).toContain('previewFrame.style.setProperty("--date-picker-preview-width", `${width}px`);');
    expect(source).toContain('syncCanonicalOwnerReserve(previewShell, [');
    expect(source).not.toContain("canonicalEscapingSurfaceAccommodator");
    expect(helper).toContain("reserveByOwner.set(owner, Math.max(reserveByOwner.get(owner) ?? 0, reserve));");
    expect(helper).toContain('owner.style.setProperty(rule.variable, `${reserve}px`)');
  });

  it("pins date-picker canonical frame sizing to a responsive width contract", () => {
    const source = readAsset("styles.css");

    expect(source).toContain("#date-picker-preview-frame");
    expect(source).toContain("width: min(calc(var(--date-picker-preview-width, 58.75rem) + 2rem), 100%);");
    expect(source).toContain("#date-picker-preview-shell");
    expect(source).toContain("width: min(var(--date-picker-preview-width, 58.75rem), 100%);");
    expect(source).toContain('#date-picker-preview-shell:not([data-form-mobile-view="true"]) .form-field');
    expect(source).toContain('#time-picker-preview-shell:not([data-form-mobile-view="true"]) .form-field');
    expect(source).toContain('#simple-select-preview-shell .form-field');
    expect(source).toContain("padding-bottom: var(--canonical-field-reserve);");
    expect(source).toContain("overflow: auto !important;");
    expect(source).toContain("overscroll-behavior: contain;");
  });

  it("requires hosted form cards and section headers to shrink instead of clipping", () => {
    const source = readAsset("styles.css");

    expect(source).toContain(".form-page-card");
    expect(source).toContain("width: 100%;");
    expect(source).toContain("min-width: 0;");
    expect(source).toContain(".form-page-section-header > *");
    expect(source).toContain("overflow-wrap: anywhere;");
  });
});
