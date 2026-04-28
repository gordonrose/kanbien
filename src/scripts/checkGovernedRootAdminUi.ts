import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type LockedFile = {
  path: string;
  sha256: string;
  rationale: string;
};

const lockedRootAdminUiFiles: LockedFile[] = [
  {
    path: "src/frontend/rootAdminShell/index.html",
    sha256: "e38f4891b69307b4c86c33dbcd87111623506ac6066be6bf3caf6eba8593dffb",
    rationale:
      "Authenticated root-admin shell markup remains locally hosted, but governed route families such as web-app-hierarchy must no longer duplicate their workspace host markup in this file once a shared design-system render seam exists.",
  },
  {
    path: "src/frontend/rootAdminShell/assets/app.mjs",
    sha256: "da9a8f3e8603f6ad505bf1612e2772f77819573d7cf7a463d45d57df0f2c3fc2",
    rationale:
      "Root-admin authenticated shell behavior remains locally composed, but approved route-topology migrations may update path resolution and canonical-location syncing as long as shared design-system shell behavior does not regress back into app-local ownership.",
  },
  {
    path: "src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs",
    sha256: "1aa3da4fc5c4ae9c05260eeae49261b8dda319537910a2241157843a23f91f63",
    rationale:
      "Non-login root-admin hierarchy composition still routes through a local adapter, but that adapter must stay thin and render the shared design-system workspace shell instead of reconstructing governed host markup locally.",
  },
];

const requiredRootAdminShellImports = [
  "/design-system/assets/pageShellController.mjs",
  "/design-system/assets/loginTemplate.mjs",
  "/design-system/assets/rootAdminDirectoryWorkspace.mjs",
];

const requiredRootAdminShellStylesheets = [
  '/design-system/assets/styles.css',
  '/design-system/assets/list-page-shared.css',
  '/design-system/assets/hierarchy-tree-shared.css',
  '/design-system/assets/form-template-shared.css',
  '/design-system/assets/hierarchyTree.css',
];

const requiredRootAdminHierarchyImports = [
  "/design-system/assets/webAppHierarchyWorkspace.mjs",
];

const allowedRootAdminCssFiles = new Set<string>();

const forbiddenRootAdminShellOwnershipPatterns: Array<{ pattern: RegExp; rationale: string }> = [
  {
    pattern: /\bfunction\s+setMenuOpen\s*\(/,
    rationale: "Profile menu shell behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+setPrimaryNavOverflowOpen\s*\(/,
    rationale: "Primary-nav overflow shell behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+setMobileNavOpen\s*\(/,
    rationale: "Mobile shell navigation behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+setMobileProfileOpen\s*\(/,
    rationale: "Mobile profile menu behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+setContextNavMoreOpen\s*\(/,
    rationale: "Context-nav more-menu behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+setDisplaySettingsDrawerOpen\s*\(/,
    rationale: "Display-settings drawer behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+closeTransientShellSurfaces\s*\(/,
    rationale: "Shared shell surface-closing rules must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+updatePrimaryNavOverflow\s*\(/,
    rationale: "Primary-nav fit and overflow behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+syncDocumentLanguageDirection\s*\(/,
    rationale: "Language direction behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+syncLanguageTriggers\s*\(/,
    rationale: "Language trigger copy behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+syncDisplaySettingsCopy\s*\(/,
    rationale: "Display-settings shell copy behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+applyTheme\s*\(/,
    rationale: "Theme shell behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+applyMagnification\s*\(/,
    rationale: "Magnification shell behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+renderLanguageOptions\s*\(/,
    rationale: "Language modal rendering behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+setLanguageModalOpen\s*\(/,
    rationale: "Language modal open/close behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+selectLanguage\s*\(/,
    rationale: "Language selection behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+getSharedTooltipElement\s*\(/,
    rationale: "Shared shell tooltip behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+hideSharedTooltip\s*\(/,
    rationale: "Shared shell tooltip behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+positionSharedTooltip\s*\(/,
    rationale: "Shared shell tooltip behavior must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\bfunction\s+wireSharedTooltipSystem\s*\(/,
    rationale: "Shared shell tooltip event wiring must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\blet\s+activeSharedTooltipTarget\s*=/,
    rationale: "Tooltip state must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\blet\s+languageModalReturnFocusTarget\s*=/,
    rationale: "Language modal focus-return state must stay owned by the shared design-system page-shell controller.",
  },
  {
    pattern: /\blet\s+displaySettingsReturnFocusTarget\s*=/,
    rationale: "Display-settings drawer focus-return state must stay owned by the shared design-system page-shell controller.",
  },
];

const forbiddenRootAdminHierarchyOwnershipPatterns: Array<{ pattern: RegExp; rationale: string }> = [
  {
    pattern: /\bfunction\s+adaptHierarchyTree\s*\(/,
    rationale: "Hierarchy workspace tree-adaptation behavior must stay owned by the shared design-system hierarchy workspace seam.",
  },
  {
    pattern: /\bfunction\s+mountHierarchyResponse\s*\(/,
    rationale: "Hierarchy workspace mount behavior must stay owned by the shared design-system hierarchy workspace seam.",
  },
  {
    pattern: /\bfunction\s+populatePageSettings\s*\(/,
    rationale: "Hierarchy workspace page-settings UI behavior must stay owned by the shared design-system hierarchy workspace seam.",
  },
  {
    pattern: /\basync\s+function\s+loadHierarchy\s*\(/,
    rationale: "Hierarchy workspace load and redraw behavior must stay owned by the shared design-system hierarchy workspace seam.",
  },
  {
    pattern: /\basync\s+function\s+reconcileDiscoveryAndRefreshHierarchy\s*\(/,
    rationale: "Hierarchy discovery reconcile behavior must stay owned by the shared design-system hierarchy workspace seam.",
  },
  {
    pattern: /\basync\s+function\s+savePageSettings\s*\(/,
    rationale: "Hierarchy workspace page-settings save behavior must stay owned by the shared design-system hierarchy workspace seam.",
  },
  {
    pattern: /\basync\s+function\s+reparentNode\s*\(/,
    rationale: "Hierarchy drag-and-drop move behavior must stay owned by the shared design-system hierarchy workspace seam.",
  },
  {
    pattern: /\bmountRootAdminHierarchyTree\b/,
    rationale: "Hierarchy tree mounting must happen through the shared design-system hierarchy workspace seam, not directly in root-admin.",
  },
];

const forbiddenRootAdminIndexPatterns: Array<{ pattern: RegExp; rationale: string }> = [
  {
    pattern: /\/root-admin\/assets\/styles\.css/,
    rationale: "Authenticated root-admin must not load an app-owned shell stylesheet; only the explicit login exception may load local CSS.",
  },
  {
    pattern: /\bsub-nav-row\b/,
    rationale: "Root-admin must use the signed-off design-system sub-nav host class instead of a local shell wrapper class.",
  },
  {
    pattern: /\bcontext-nav-main-items\b/,
    rationale: "Root-admin must use the signed-off design-system context-nav structure instead of a local context-nav wrapper.",
  },
  {
    pattern: /\bsub-nav-breadcrumb-list\b/,
    rationale: "Root-admin must not reconstruct the breadcrumb trail markup locally; it should consume the shared design-system breadcrumb host seam.",
  },
  {
    pattern: /\bbreadcrumb-home-separator-item\b/,
    rationale: "Root-admin must not reintroduce local breadcrumb separator ownership instead of the shared design-system breadcrumb host structure.",
  },
  {
    pattern: /\bid="web-app-page-settings-form"\b/,
    rationale: "The governed web-app-hierarchy form host must render through the shared design-system workspace seam instead of being hardcoded in root-admin HTML.",
  },
  {
    pattern: /\bid="hierarchy-tree-drawer"\b/,
    rationale: "The governed hierarchy drawer host must render through the shared design-system workspace seam instead of being hardcoded in root-admin HTML.",
  },
  {
    pattern: /\bid="web-app-hierarchy-page-title"\b/,
    rationale: "The governed web-app-hierarchy workspace shell must not be reconstructed directly in root-admin HTML once the shared render seam exists.",
  },
  {
    pattern: /\bid="root-users-list-page"\b/,
    rationale: "The governed root-users list-page shell must render through the shared design-system workspace seam instead of being hardcoded in root-admin HTML.",
  },
  {
    pattern: /\bid="root-users-detail-panel"\b/,
    rationale: "The governed root-users detail-panel host must render through the shared design-system workspace seam instead of being hardcoded in root-admin HTML.",
  },
  {
    pattern: /\bid="root-users-record-card-template"\b/,
    rationale: "The governed root-users record-card template must render through the shared design-system workspace seam instead of being hardcoded in root-admin HTML.",
  },
  {
    pattern: /\bid="context-nav-more-button"\b/,
    rationale: "The governed root-admin context-nav host must render through the shared design-system context-nav seam instead of being hardcoded in root-admin HTML.",
  },
  {
    pattern: /\bid="display-settings-button"\b/,
    rationale: "The governed root-admin context-nav utility host must render through the shared design-system context-nav seam instead of being hardcoded in root-admin HTML.",
  },
  {
    pattern: /\bid="hierarchy-tree-nav-button"\b/,
    rationale: "The governed root-admin context-nav launcher host must render through the shared design-system context-nav seam instead of being hardcoded in root-admin HTML.",
  },
];

function sha256ForFile(path: string): string {
  const absolutePath = resolve(process.cwd(), path);
  const buffer = readFileSync(absolutePath);
  return createHash("sha256").update(buffer).digest("hex");
}

function readUtf8(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function listUnexpectedRootAdminCssFiles(): string[] {
  const assetsDirectory = resolve(process.cwd(), "src/frontend/rootAdminShell/assets");
  return readdirSync(assetsDirectory)
    .filter((entry) => entry.endsWith(".css"))
    .filter((entry) => !allowedRootAdminCssFiles.has(entry))
    .sort();
}

function main() {
  const driftedFiles = lockedRootAdminUiFiles
    .map((entry) => ({
      ...entry,
      actualSha256: sha256ForFile(entry.path),
    }))
    .filter((entry) => entry.actualSha256 !== entry.sha256);

  const shellAppSourcePath = "src/frontend/rootAdminShell/assets/app.mjs";
  const shellAppSource = readUtf8(shellAppSourcePath);
  const shellIndexSourcePath = "src/frontend/rootAdminShell/index.html";
  const shellIndexSource = readUtf8(shellIndexSourcePath);
  const hierarchyPageSourcePath = "src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs";
  const hierarchyPageSource = readUtf8(hierarchyPageSourcePath);
  const unexpectedCssFiles = listUnexpectedRootAdminCssFiles();

  const missingImports = requiredRootAdminShellImports.filter((specifier) => !shellAppSource.includes(specifier));
  const missingStylesheets = requiredRootAdminShellStylesheets.filter((href) => !shellIndexSource.includes(href));
  const missingHierarchyImports = requiredRootAdminHierarchyImports.filter((specifier) => !hierarchyPageSource.includes(specifier));
  const indexOwnershipViolations = forbiddenRootAdminIndexPatterns
    .filter((entry) => entry.pattern.test(shellIndexSource))
    .map((entry) => ({
      path: shellIndexSourcePath,
      rationale: entry.rationale,
      pattern: entry.pattern,
    }));
  const localOwnershipViolations = forbiddenRootAdminShellOwnershipPatterns
    .filter((entry) => entry.pattern.test(shellAppSource))
    .map((entry) => ({
      path: shellAppSourcePath,
      rationale: entry.rationale,
      pattern: entry.pattern,
    }));
  const hierarchyOwnershipViolations = forbiddenRootAdminHierarchyOwnershipPatterns
    .filter((entry) => entry.pattern.test(hierarchyPageSource))
    .map((entry) => ({
      path: hierarchyPageSourcePath,
      rationale: entry.rationale,
      pattern: entry.pattern,
    }));

  if (
    driftedFiles.length === 0
    && missingImports.length === 0
    && missingStylesheets.length === 0
    && missingHierarchyImports.length === 0
    && unexpectedCssFiles.length === 0
    && indexOwnershipViolations.length === 0
    && localOwnershipViolations.length === 0
    && hierarchyOwnershipViolations.length === 0
  ) {
    console.log("Governed root-admin UI guard: passed.");
    console.log("");
    console.log("Locked local UI files remain unchanged.");
    console.log("Root-admin styling and non-login UI behavior must continue to flow one-way from the design system.");
    return;
  }

  console.error("Governed root-admin UI guard: blocked.");
  console.error("");
  if (driftedFiles.length > 0) {
    console.error("The following local root-admin UI files changed:");
    for (const entry of driftedFiles) {
      console.error(`- ${entry.path}`);
      console.error(`  expected: ${entry.sha256}`);
      console.error(`  actual:   ${entry.actualSha256}`);
      console.error(`  why blocked: ${entry.rationale}`);
    }
    console.error("");
  }

  if (missingImports.length > 0) {
    console.error("The root-admin shell is missing required shared design-system imports:");
    for (const specifier of missingImports) {
      console.error(`- ${shellAppSourcePath}`);
      console.error(`  missing import: ${specifier}`);
      console.error("  why blocked: Root-admin shell behavior must be consumed from the shared design-system page-shell controller.");
    }
    console.error("");
  }

  if (missingStylesheets.length > 0) {
    console.error("The root-admin shell is missing required design-system stylesheet entrypoints:");
    for (const href of missingStylesheets) {
      console.error(`- ${shellIndexSourcePath}`);
      console.error(`  missing stylesheet href: ${href}`);
      console.error("  why blocked: Root-admin shell and login styling must come from design-system-owned stylesheets.");
    }
    console.error("");
  }

  if (missingHierarchyImports.length > 0) {
    console.error("The root-admin hierarchy page is missing required shared design-system imports:");
    for (const specifier of missingHierarchyImports) {
      console.error(`- ${hierarchyPageSourcePath}`);
      console.error(`  missing import: ${specifier}`);
      console.error("  why blocked: Root-admin hierarchy workspace behavior must be consumed from the shared design-system hierarchy workspace controller.");
    }
    console.error("");
  }

  if (unexpectedCssFiles.length > 0) {
    console.error("Root-admin assets contain forbidden local CSS files:");
    for (const filename of unexpectedCssFiles) {
      console.error(`- src/frontend/rootAdminShell/assets/${filename}`);
      console.error("  why blocked: Root-admin styling must come from shared design-system stylesheets.");
    }
    console.error("");
  }

  if (indexOwnershipViolations.length > 0) {
    console.error("The root-admin shell HTML still contains forbidden local render ownership:");
    for (const entry of indexOwnershipViolations) {
      console.error(`- ${entry.path}`);
      console.error(`  matched: ${entry.pattern}`);
      console.error(`  why blocked: ${entry.rationale}`);
    }
    console.error("");
  }

  if (localOwnershipViolations.length > 0) {
    console.error("The root-admin shell still locally owns forbidden page-shell behavior:");
    for (const entry of localOwnershipViolations) {
      console.error(`- ${entry.path}`);
      console.error(`  matched: ${entry.pattern}`);
      console.error(`  why blocked: ${entry.rationale}`);
    }
  }

  if (hierarchyOwnershipViolations.length > 0) {
    console.error("The root-admin hierarchy page still locally owns forbidden workspace behavior:");
    for (const entry of hierarchyOwnershipViolations) {
      console.error(`- ${entry.path}`);
      console.error(`  matched: ${entry.pattern}`);
      console.error(`  why blocked: ${entry.rationale}`);
    }
  }
  console.error("");
  console.error("Required follow-up:");
  console.error("- Move styling or UI-behavior changes into shared design-system seams instead of editing root-admin local UI files.");
  console.error("- If a file is being intentionally unlocked because the design-system migration already landed, update this guard in the same change with the architectural proof.");
  process.exitCode = 1;
}

main();
