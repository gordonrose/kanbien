import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const behaviorLockDir = resolve(process.cwd(), "docs/workspace/design-system/behavior-locks");
const referencePackDir = resolve(process.cwd(), "docs/workspace/design-system/reference-packs");
const componentArtifactDir = resolve(process.cwd(), "docs/workspace/design-system/components");
const verificationArtifactDir = resolve(process.cwd(), "docs/workspace/design-system/verification");
const canonicalExceptionDir = resolve(process.cwd(), "docs/workspace/design-system/canonical-rendering-exceptions");
const componentInventoryPath = resolve(process.cwd(), "docs/workspace/design-system/component-inventory.md");

const legacyReferencePackExemptions = new Set([
  "async-activity-drawer",
  "breadcrumb",
  "brochure-page",
  "build-work-panel",
  "choice-group",
  "context-nav",
  "context-nav-drawer",
  "date-picker",
  "display-settings",
  "drawer-form",
  "drawer-select",
  "form-image-card",
  "form-template",
  "hierarchy-tree",
  "icon-grid",
  "list-detail-panel",
  "list-detail-split-layout",
  "list-form-drawer",
  "list-page",
  "list-record-card",
  "page-shell-banner",
  "search-shell",
  "simple-select",
  "sub-nav-row",
  "tenant-branding-composition",
  "time-picker",
  "top-nav",
  "upload-file",
]);

const requiredDimensions = [
  "responsive",
  "theme",
  "direction",
  "magnification",
  "density",
  "overflow",
  "interaction",
  "accessibility",
  "keyboard",
  "focus",
  "attention",
  "disabled",
];

const minimumReferenceRowsByComplexity = {
  simple: 8,
  standard: 12,
  complex: 20,
};

function extractSection(markdown: string, heading: string) {
  const start = markdown.indexOf(heading);
  if (start === -1) {
    return "";
  }

  const next = markdown.indexOf("\n## ", start + heading.length);
  return markdown.slice(start, next === -1 ? markdown.length : next);
}

function extractBehaviorIds(markdown: string) {
  return Array.from(
    new Set(
      Array.from(markdown.matchAll(/`([A-Z][A-Z0-9]+-\d+[A-Z0-9-]*)`/g))
        .map((match) => match[1])
        .filter((id) => !id.includes("-R-")),
    ),
  );
}

function extractReferenceRows(markdown: string) {
  const section = extractSection(markdown, "## Required Reference States");
  return section
    .split("\n")
    .filter((line) => /^\| `[^`]+` \|/.test(line.trim()));
}

function getFamilyKey(fileName: string) {
  return basename(fileName, "-behavior-lock.md");
}

function readOptional(path: string) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function claimsSystemReadyOrConsumable(markdown: string) {
  return /-\s*(Status|Status under review|Promotion decision):\s*\n\s*system-ready\b/i.test(markdown)
    || /-\s*(Status|Status under review|Promotion decision):\s*system-ready\b/i.test(markdown)
    || /-\s*Real-app adoption now allowed:\s*yes\b/i.test(markdown)
    || /-\s*(App-consumable|Consumable seam|Consumable shared seam):\s*yes\b/i.test(markdown);
}

function getInventoryRow(markdown: string, familyKey: string) {
  return markdown
    .split("\n")
    .find((line) => line.startsWith(`| \`${familyKey}\``)) ?? "";
}

function inventoryRowClaimsSystemReady(row: string) {
  return row.split("|").map((cell) => cell.trim())[4] === "`system-ready`";
}

function hasCanonicalException(familyKey: string) {
  const exceptionPath = join(canonicalExceptionDir, `${familyKey}-canonical-rendering-exception.md`);
  return readOptional(exceptionPath).includes("Approved canonical rendering exception");
}

describe("design-system artifact quality gate", () => {
  it("requires non-legacy promoted families to include a production-grade behavior/reference matrix", () => {
    const behaviorLockFiles = readdirSync(behaviorLockDir)
      .filter((file) => file.endsWith("-behavior-lock.md"))
      .sort();

    for (const file of behaviorLockFiles) {
      const familyKey = getFamilyKey(file);
      if (legacyReferencePackExemptions.has(familyKey)) {
        continue;
      }

      const behaviorLockPath = join(behaviorLockDir, file);
      const referencePackPath = join(referencePackDir, `${familyKey}-reference-pack.md`);
      expect(existsSync(referencePackPath), `${familyKey} must have a reference pack`).toBe(true);

      const behaviorLock = readFileSync(behaviorLockPath, "utf8");
      const referencePack = readFileSync(referencePackPath, "utf8");
      const behaviorIds = extractBehaviorIds(behaviorLock);
      const referenceRows = extractReferenceRows(referencePack);
      const profile = referencePack.match(/Complexity:\s*`?(simple|standard|complex)`?/i)?.[1]?.toLowerCase();
      const minimumReferenceRows =
        minimumReferenceRowsByComplexity[profile as keyof typeof minimumReferenceRowsByComplexity];
      const dimensions = extractSection(referencePack, "## Required Dimensions").toLowerCase();
      const behaviorCoverage = extractSection(referencePack, "## Behavior Coverage Matrix");

      expect(referencePack, `${familyKey} must declare a quality gate profile`).toContain("## Quality Gate Profile");
      expect(profile, `${familyKey} must declare Complexity: simple, standard, or complex`).toBeTruthy();
      expect(referencePack, `${familyKey} must include required dimensions`).toContain("## Required Dimensions");
      expect(referencePack, `${familyKey} must include behavior coverage`).toContain("## Behavior Coverage Matrix");
      expect(referencePack, `${familyKey} must include required reference states`).toContain("## Required Reference States");
      expect(behaviorIds.length, `${familyKey} needs traceable behavior IDs`).toBeGreaterThanOrEqual(8);
      expect(referenceRows.length, `${familyKey} reference matrix is too shallow for ${profile}`).toBeGreaterThanOrEqual(
        minimumReferenceRows,
      );

      for (const dimension of requiredDimensions) {
        expect(dimensions, `${familyKey} must explicitly cover or mark N/A for ${dimension}`).toContain(dimension);
      }

      for (const behaviorId of behaviorIds) {
        expect(behaviorCoverage, `${familyKey} must map ${behaviorId} to reference states`).toContain(behaviorId);
      }

      for (const row of referenceRows) {
        expect(row, `${familyKey} reference rows must include deterministic design-system URLs`).toContain("/design-system/");
      }
    }
  });

  it("blocks system-ready or consumable claims before canonical renderings exist", () => {
    const behaviorLockFiles = readdirSync(behaviorLockDir)
      .filter((file) => file.endsWith("-behavior-lock.md"))
      .sort();
    const componentInventory = readOptional(componentInventoryPath);

    for (const file of behaviorLockFiles) {
      const familyKey = getFamilyKey(file);
      if (legacyReferencePackExemptions.has(familyKey)) {
        continue;
      }

      const referencePackPath = join(referencePackDir, `${familyKey}-reference-pack.md`);
      const componentPath = join(componentArtifactDir, `${familyKey}-component.md`);
      const verificationPath = join(verificationArtifactDir, `${familyKey}-verification-checklist.md`);
      const referencePack = readOptional(referencePackPath);
      const componentArtifact = readOptional(componentPath);
      const verificationArtifact = readOptional(verificationPath);
      const inventoryRow = getInventoryRow(componentInventory, familyKey);
      const claimSources = [
        componentArtifact,
        verificationArtifact,
      ].join("\n");

      if (!claimsSystemReadyOrConsumable(claimSources) && !inventoryRowClaimsSystemReady(inventoryRow)) {
        continue;
      }

      expect(
        referencePack.includes(`/design-system/canonical-renderings/${familyKey}`) || hasCanonicalException(familyKey),
        `${familyKey} cannot claim system-ready or consumable without canonical-renderings reference URLs or an approved exception artifact`,
      ).toBe(true);
    }
  });
});
