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
    sha256: "18d92ef493641730de09d845e059c05a9918402e8d7ae474f491c0b95c8ad9d5",
    rationale:
      "Authenticated root-admin shell markup must remain outside index.html and styling must flow through shared design-system stylesheet entrypoints.",
  },
  {
    path: "src/frontend/rootAdminShell/assets/app.mjs",
    sha256: "225f91513029da3d22ec95cc1af05533dc59f1f65df961bf77806fb5960d809c",
    rationale:
      "Root-admin authenticated shell behavior remains locally composed, but approved route-topology, protected Build-panel integration, chat-workspace proof routing through the existing conversation-panel slot, and narrow session-context handoff changes may update orchestration as long as shared design-system shell, directory-workspace, conversation-panel, and chat-workspace behavior does not regress back into app-local ownership.",
  },
  {
    path: "src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs",
    sha256: "1aa3da4fc5c4ae9c05260eeae49261b8dda319537910a2241157843a23f91f63",
    rationale:
      "Non-login root-admin hierarchy composition still routes through a local adapter, but that adapter must stay thin and render the shared design-system workspace shell instead of reconstructing governed host markup locally.",
  },
];

const requiredRootAdminShellImports = [
  "/design-system/assets/appShell.mjs",
  "/design-system/assets/loginTemplate.mjs",
];

const requiredRootAdminShellStylesheets = [
  '/design-system/assets/styles.css',
  '/design-system/assets/list-page-shared.css',
  '/design-system/assets/hierarchy-tree-shared.css',
  '/design-system/assets/form-template-shared.css',
  '/design-system/assets/hierarchyTree.css',
  '/design-system/assets/conversationPanel.css',
  '/design-system/assets/chatWorkspacePattern.css',
];

const requiredRootAdminHierarchyImports = [
  "/design-system/assets/webAppHierarchyWorkspace.mjs",
];

const requiredRootAdminBuildBacklogImports = [
  "/design-system/assets/floatingTabHeader.mjs?v=2026-05-08-overflow-tooltip-contract",
];

const requiredRootAdminBuildWorkspaceImports = [
  "/design-system/assets/chatWorkspaceMockConsumer.mjs",
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
  {
    pattern: /\bbuild-work-panel-demo-/,
    rationale: "The governed conversation panel must render through the shared design-system conversationPanel seam instead of copied Build work panel classes in root-admin HTML.",
  },
  {
    pattern: /\bdata-build-work-panel(?:-[a-z0-9-]+)?\b/,
    rationale: "The governed conversation panel must render through the shared design-system conversationPanel seam instead of hardcoded Build work panel data hooks in root-admin HTML.",
  },
  {
    pattern: /\bfloating-tab-card\b/,
    rationale: "The governed floating tab header must render through the shared design-system floatingTabHeader seam instead of copied tab-card markup in root-admin HTML.",
  },
  {
    pattern: /\bdata-floating-tab-seam-mount\b/,
    rationale: "Root-admin index may only expose a page mount section; floating tab seam hooks belong in the page adapter that invokes the shared renderer.",
  },
];

const forbiddenRootAdminConversationPanelOwnershipPatterns: Array<{ pattern: RegExp; rationale: string }> = [
  {
    pattern: /\/design-system\/assets\/buildWorkPanel\.mjs/,
    rationale: "Root-admin must import the reusable conversationPanel seam directly; buildWorkPanel.mjs is a design-system compatibility wrapper.",
  },
  {
    pattern: /\bbuild-work-panel-demo-/,
    rationale: "Root-admin must not reconstruct Build work panel markup or class names locally; render through conversationPanel instead.",
  },
  {
    pattern: /\bdata-build-work-panel(?:-[a-z0-9-]+)?\b/,
    rationale: "Root-admin must not reconstruct Build work panel data hooks locally; render through conversationPanel instead.",
  },
  {
    pattern: /\bfunction\s+createBuildWorkPanelController\s*\(/,
    rationale: "Conversation panel behavior must stay owned by the shared design-system conversationPanel controller.",
  },
  {
    pattern: /\bfunction\s+renderBuildWorkPanel\s*\(/,
    rationale: "Conversation panel markup must stay owned by the shared design-system conversationPanel renderer.",
  },
];

const forbiddenRootAdminFloatingTabHeaderOwnershipPatterns: Array<{ pattern: RegExp; rationale: string }> = [
  {
    pattern: /\bfunction\s+mountFloatingTabHeader\s*\(/,
    rationale: "Build Backlog must import the shared floatingTabHeader controller instead of defining local floating tab behavior.",
  },
  {
    pattern: /\baddEventListener\("click"/,
    rationale: "Floating tab click, overflow, drawer, sub-tab, and collapse behavior must stay owned by the shared design-system floatingTabHeader controller.",
  },
  {
    pattern: /\bfloating-tab-card\b/,
    rationale: "Root-admin must not reconstruct floating tab header card markup or class names outside the shared renderer.",
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
  const buildBacklogPageSourcePath = "src/frontend/rootAdminShell/routes/build/backlog/page.mjs";
  const buildBacklogPageSource = readUtf8(buildBacklogPageSourcePath);
  const buildWorkspacePageSourcePath = "src/frontend/rootAdminShell/routes/build/workspace/page.mjs";
  const buildWorkspacePageSource = readUtf8(buildWorkspacePageSourcePath);
  const unexpectedCssFiles = listUnexpectedRootAdminCssFiles();

  const missingImports = requiredRootAdminShellImports.filter((specifier) => !shellAppSource.includes(specifier));
  const missingStylesheets = requiredRootAdminShellStylesheets.filter((href) => !shellIndexSource.includes(href));
  const missingHierarchyImports = requiredRootAdminHierarchyImports.filter((specifier) => !hierarchyPageSource.includes(specifier));
  const missingBuildBacklogImports = requiredRootAdminBuildBacklogImports.filter((specifier) => !buildBacklogPageSource.includes(specifier));
  const missingBuildWorkspaceImports = requiredRootAdminBuildWorkspaceImports.filter((specifier) => !buildWorkspacePageSource.includes(specifier));
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
  const conversationPanelOwnershipViolations = forbiddenRootAdminConversationPanelOwnershipPatterns
    .filter((entry) => entry.pattern.test(shellAppSource))
    .map((entry) => ({
      path: shellAppSourcePath,
      rationale: entry.rationale,
      pattern: entry.pattern,
    }));
  const floatingTabHeaderOwnershipViolations = forbiddenRootAdminFloatingTabHeaderOwnershipPatterns
    .filter((entry) => entry.pattern.test(buildBacklogPageSource))
    .map((entry) => ({
      path: buildBacklogPageSourcePath,
      rationale: entry.rationale,
      pattern: entry.pattern,
    }));

  if (
    driftedFiles.length === 0
    && missingImports.length === 0
    && missingStylesheets.length === 0
    && missingHierarchyImports.length === 0
    && missingBuildBacklogImports.length === 0
    && missingBuildWorkspaceImports.length === 0
    && unexpectedCssFiles.length === 0
    && indexOwnershipViolations.length === 0
    && localOwnershipViolations.length === 0
    && hierarchyOwnershipViolations.length === 0
    && conversationPanelOwnershipViolations.length === 0
    && floatingTabHeaderOwnershipViolations.length === 0
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
  if (missingBuildBacklogImports.length > 0) {
    console.error("The root-admin Build Backlog page is missing required design-system imports:");
    for (const missing of missingBuildBacklogImports) {
      console.error(`- ${missing}`);
    }
    console.error("");
  }
  if (missingBuildWorkspaceImports.length > 0) {
    console.error("The root-admin Build Workspace page is missing required design-system imports:");
    for (const missing of missingBuildWorkspaceImports) {
      console.error(`- ${missing}`);
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

  if (conversationPanelOwnershipViolations.length > 0) {
    console.error("The root-admin shell still locally owns forbidden conversation-panel behavior:");
    for (const entry of conversationPanelOwnershipViolations) {
      console.error(`- ${entry.path}`);
      console.error(`  matched: ${entry.pattern}`);
      console.error(`  why blocked: ${entry.rationale}`);
    }
  }
  if (floatingTabHeaderOwnershipViolations.length > 0) {
    console.error("The root-admin Build Backlog page owns behavior or markup that must stay in the design system:");
    for (const entry of floatingTabHeaderOwnershipViolations) {
      console.error(`- ${entry.path} matches ${entry.pattern}: ${entry.rationale}`);
    }
    console.error("");
  }
  console.error("");
  console.error("Required follow-up:");
  console.error("- Move styling or UI-behavior changes into shared design-system seams instead of editing root-admin local UI files.");
  console.error("- If a file is being intentionally unlocked because the design-system migration already landed, update this guard in the same change with the architectural proof.");
  process.exitCode = 1;
}

main();
