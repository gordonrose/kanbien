import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type SourceFile = {
  path: string;
  source: string;
};

type RequiredToken = {
  path: string;
  token: string;
  rationale: string;
};

type ForbiddenPattern = {
  path: string;
  pattern: RegExp;
  rationale: string;
};

type CssOnlyRule = {
  family: string;
  cssHref: string;
  requiredTokens: RequiredToken[];
};

type GuardResult = {
  errors: string[];
};

const adoptionContractPath =
  "docs/workspace/design-system/adoption/governed-app-component-adoption-contract.md";
const floatingTabHeaderAdoptionContractPath =
  "docs/workspace/design-system/adoption/floating-tab-header-adoption-contract.md";

const requiredContractPhrases = [
  "shared CSS seam",
  "shared render or markup seam",
  "shared interaction or controller seam",
  "Duplicating governed component markup in an app page is drift",
  "Duplicating governed interaction logic in an app page is drift",
  "/design-system/assets/rootAdminDirectoryWorkspace.mjs",
  "/design-system/assets/webAppHierarchyWorkspace.mjs",
  "/design-system/assets/loginTemplate.mjs",
  "/design-system/assets/appShell.mjs",
  "/design-system/assets/floatingTabHeader.mjs",
  "docs/workspace/design-system/adoption/floating-tab-header-adoption-contract.md",
];

const requiredFloatingTabHeaderContractPhrases = [
  "renderFloatingTabHeader(...)",
  "mountFloatingTabHeader(...)",
  "copied `.floating-tab-card`",
  "app-local `.floating-tab-*` CSS",
  "tooltip controller logic",
  "native `title` attributes are absent",
  "/design-system/assets/floatingTabHeader.mjs?v=2026-05-08-overflow-tooltip-contract",
  "tests/visual/app/rootAdminShell/rootAdminBuildBacklog.spec.ts",
];

const governedSourcePaths = [
  "src/frontend/rootAdminShell/index.html",
  "src/frontend/rootAdminShell/assets/app.mjs",
  "src/frontend/rootAdminShell/routes/users/page.mjs",
  "src/frontend/rootAdminShell/routes/tenants/page.mjs",
  "src/frontend/rootAdminShell/routes/tenant-admins/page.mjs",
  "src/frontend/rootAdminShell/routes/web-app-hierarchy/page.mjs",
  "src/frontend/rootAdminShell/routes/build/backlog/page.mjs",
  "src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs",
  "src/frontend/designSystem/assets/appShell.mjs",
  "src/frontend/designSystem/assets/loginTemplate.mjs",
  "src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs",
  "src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs",
  "src/frontend/designSystem/assets/conversationPanel.mjs",
  "src/frontend/designSystem/assets/floatingTabHeader.mjs",
];

const cssOnlyRules: CssOnlyRule[] = [
  {
    family: "root-admin page shell",
    cssHref: "/design-system/assets/styles.css",
    requiredTokens: [
      {
        path: "src/frontend/rootAdminShell/assets/app.mjs",
        token: "/design-system/assets/appShell.mjs",
        rationale:
          "Governed shell adoption must consume the app-shell render/controller seam, not only the shared stylesheet.",
      },
      {
        path: "src/frontend/rootAdminShell/assets/app.mjs",
        token: "/design-system/assets/contextNav.mjs",
        rationale:
          "Governed shell adoption must consume the context-nav render seam instead of reconstructing the host locally.",
      },
    ],
  },
  {
    family: "root-admin directory workspace",
    cssHref: "/design-system/assets/list-page-shared.css",
    requiredTokens: [
      {
        path: "src/frontend/rootAdminShell/routes/users/page.mjs",
        token: "/design-system/assets/rootAdminDirectoryWorkspace.mjs",
        rationale:
          "Users list-page styling must be paired with the DS-owned directory workspace render/controller seam.",
      },
      {
        path: "src/frontend/rootAdminShell/routes/users/page.mjs",
        token: "createRootAdminDirectoryWorkspaceController",
        rationale:
          "Users must mount through the DS-owned controller instead of app-local list behavior.",
      },
      {
        path: "src/frontend/rootAdminShell/routes/tenants/page.mjs",
        token: "/design-system/assets/rootAdminDirectoryWorkspace.mjs",
        rationale:
          "Tenants list-page styling must be paired with the DS-owned directory workspace render/controller seam.",
      },
      {
        path: "src/frontend/rootAdminShell/routes/tenants/page.mjs",
        token: "createRootAdminDirectoryWorkspaceController",
        rationale:
          "Tenants must mount through the DS-owned controller instead of app-local list behavior.",
      },
      {
        path: "src/frontend/rootAdminShell/routes/tenant-admins/page.mjs",
        token: "/design-system/assets/rootAdminDirectoryWorkspace.mjs",
        rationale:
          "Tenant Admins list-page styling must be paired with the DS-owned directory workspace render/controller seam.",
      },
      {
        path: "src/frontend/rootAdminShell/routes/tenant-admins/page.mjs",
        token: "createRootAdminDirectoryWorkspaceController",
        rationale:
          "Tenant Admins must mount through the DS-owned controller instead of app-local list behavior.",
      },
    ],
  },
  {
    family: "web-app hierarchy workspace",
    cssHref: "/design-system/assets/hierarchy-tree-shared.css",
    requiredTokens: [
      {
        path: "src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs",
        token: "/design-system/assets/webAppHierarchyWorkspace.mjs",
        rationale:
          "Hierarchy-tree styling must be paired with the DS-owned hierarchy workspace render/controller seam.",
      },
      {
        path: "src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs",
        token: "renderWebAppHierarchyWorkspaceShell",
        rationale:
          "Hierarchy workspace markup must come from the shared render seam.",
      },
      {
        path: "src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs",
        token: "createWebAppHierarchyWorkspaceController",
        rationale:
          "Hierarchy workspace behavior must come from the shared controller seam.",
      },
      {
        path: "src/frontend/rootAdminShell/routes/web-app-hierarchy/page.mjs",
        token: "../../assets/webAppHierarchyPage.mjs",
        rationale:
          "Hierarchy route module must mount through the existing thin adapter that consumes the DS-owned workspace seam.",
      },
    ],
  },
  {
    family: "form-template workspace",
    cssHref: "/design-system/assets/form-template-shared.css",
    requiredTokens: [
      {
        path: "src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs",
        token: "/design-system/assets/webAppHierarchyWorkspace.mjs",
        rationale:
          "Form-template styling in root-admin hierarchy must flow through the DS-owned hierarchy workspace seam.",
      },
      {
        path: "src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs",
        token: "renderFormDrawerSelect",
        rationale:
          "Form child drawer-select markup must remain DS-owned inside the shared workspace seam.",
      },
      {
        path: "src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs",
        token: "renderFormIconGrid",
        rationale:
          "Form child icon-grid markup must remain DS-owned inside the shared workspace seam.",
      },
    ],
  },
  {
    family: "login template",
    cssHref: "/design-system/assets/styles.css",
    requiredTokens: [
      {
        path: "src/frontend/rootAdminShell/assets/app.mjs",
        token: "/design-system/assets/loginTemplate.mjs",
        rationale:
          "Login styling must be paired with the DS-owned login render/controller seam.",
      },
      {
        path: "src/frontend/rootAdminShell/assets/app.mjs",
        token: "renderRootAdminLoginTemplate",
        rationale:
          "Root-admin login markup must come from the DS-owned login template renderer.",
      },
      {
        path: "src/frontend/rootAdminShell/assets/app.mjs",
        token: "createLoginTemplateController",
        rationale:
          "Root-admin login behavior must come from the DS-owned login template controller.",
      },
      {
        path: "src/frontend/designSystem/assets/loginTemplate.mjs",
        token: "renderRootAdminSshKeyChoiceRows",
        rationale:
          "Root-admin SSH key choice row markup must stay owned by the DS login template seam.",
      },
      {
        path: "src/frontend/rootAdminShell/assets/app.mjs",
        token: "renderSshKeyChoices",
        rationale:
          "Root-admin should pass SSH key auth data into the DS login controller instead of building choice-row DOM locally.",
      },
    ],
  },
  {
    family: "floating tab header",
    cssHref: "/design-system/assets/styles.css",
    requiredTokens: [
      {
        path: "src/frontend/rootAdminShell/routes/build/backlog/page.mjs",
        token: "/design-system/assets/floatingTabHeader.mjs",
        rationale:
          "Floating tab header styling must be paired with the DS-owned floatingTabHeader render/controller seam.",
      },
      {
        path: "src/frontend/rootAdminShell/routes/build/backlog/page.mjs",
        token: "renderFloatingTabHeader",
        rationale:
          "Floating tab header markup must come from the shared design-system renderer.",
      },
      {
        path: "src/frontend/rootAdminShell/routes/build/backlog/page.mjs",
        token: "mountFloatingTabHeader",
        rationale:
          "Floating tab header interaction behavior must come from the shared design-system controller.",
      },
    ],
  },
  {
    family: "conversation panel",
    cssHref: "/design-system/assets/conversationPanel.css",
    requiredTokens: [
      {
        path: "src/frontend/rootAdminShell/assets/app.mjs",
        token: "/design-system/assets/conversationPanel.mjs",
        rationale:
          "Root-admin must adopt the reusable conversation panel render/controller seam instead of the Build-specific wrapper or copied panel markup.",
      },
      {
        path: "src/frontend/rootAdminShell/assets/app.mjs",
        token: "renderConversationPanel",
        rationale:
          "Conversation panel markup must come from the shared design-system renderer.",
      },
      {
        path: "src/frontend/rootAdminShell/assets/app.mjs",
        token: "createConversationPanelController",
        rationale:
          "Conversation panel interaction behavior must come from the shared design-system controller.",
      },
    ],
  },
];

const forbiddenLocalReconstructions: ForbiddenPattern[] = [
  {
    path: "src/frontend/rootAdminShell/index.html",
    pattern: /\bid="root-users-list-page"/,
    rationale:
      "Root users list-page markup must render through the DS-owned directory workspace seam.",
  },
  {
    path: "src/frontend/rootAdminShell/index.html",
    pattern: /\bfloating-tab-card\b/,
    rationale:
      "Root-admin must not copy floating tab header card markup into app HTML; render through floatingTabHeader instead.",
  },
  {
    path: "src/frontend/rootAdminShell/index.html",
    pattern: /\bdata-floating-tab-seam-mount\b/,
    rationale:
      "Root-admin index may only expose a page mount section; floating tab seam hooks belong in the page adapter that invokes the shared renderer.",
  },
  {
    path: "src/frontend/rootAdminShell/assets/app.mjs",
    pattern: /\bfloating-tab-card\b/,
    rationale:
      "Root-admin shell app must not reconstruct floating tab header markup or class names locally; render through the Build Backlog page adapter.",
  },
  {
    path: "src/frontend/rootAdminShell/routes/build/backlog/page.mjs",
    pattern: /\bfunction\s+mountFloatingTabHeader\s*\(/,
    rationale:
      "Build Backlog must import the shared floatingTabHeader controller instead of defining local floating tab behavior.",
  },
  {
    path: "src/frontend/rootAdminShell/routes/build/backlog/page.mjs",
    pattern: /\baddEventListener\("click"/,
    rationale:
      "Floating tab click, overflow, drawer, sub-tab, and collapse behavior must stay inside the shared floatingTabHeader controller.",
  },
  {
    path: "src/frontend/rootAdminShell/index.html",
    pattern: /\bid="root-users-record-card-template"/,
    rationale:
      "Root users record-card templates must not be copied into app-local HTML.",
  },
  {
    path: "src/frontend/rootAdminShell/index.html",
    pattern: /\bid="web-app-page-settings-form"/,
    rationale:
      "Web-app hierarchy form host markup must render through the shared workspace seam.",
  },
  {
    path: "src/frontend/rootAdminShell/index.html",
    pattern: /\bid="hierarchy-tree-drawer"/,
    rationale:
      "Hierarchy drawer markup must render through the shared hierarchy workspace seam.",
  },
  {
    path: "src/frontend/rootAdminShell/index.html",
    pattern: /\bsub-nav-breadcrumb-list\b/,
    rationale:
      "Breadcrumb structure must remain owned by the shared page-shell breadcrumb seam.",
  },
  {
    path: "src/frontend/rootAdminShell/assets/app.mjs",
    pattern: /\bfunction\s+setMobileNavOpen\s*\(/,
    rationale:
      "Mobile navigation behavior must remain owned by the shared page-shell controller.",
  },
  {
    path: "src/frontend/rootAdminShell/assets/app.mjs",
    pattern: /\bfunction\s+setDisplaySettingsDrawerOpen\s*\(/,
    rationale:
      "Display-settings drawer behavior must remain owned by the shared page-shell controller.",
  },
  {
    path: "src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs",
    pattern: /\bfunction\s+mountHierarchyResponse\s*\(/,
    rationale:
      "Hierarchy workspace mount behavior must remain owned by the shared hierarchy workspace controller.",
  },
  {
    path: "src/frontend/rootAdminShell/index.html",
    pattern: /\bbuild-work-panel-demo-/,
    rationale:
      "Root-admin must not copy Build work panel canonical/demo classes into app HTML; render through conversationPanel instead.",
  },
  {
    path: "src/frontend/rootAdminShell/index.html",
    pattern: /\bdata-build-work-panel(?:-[a-z0-9-]+)?\b/,
    rationale:
      "Root-admin must not hardcode Build work panel data hooks in app HTML; render through conversationPanel instead.",
  },
  {
    path: "src/frontend/rootAdminShell/assets/app.mjs",
    pattern: /\/design-system\/assets\/buildWorkPanel\.mjs/,
    rationale:
      "Root-admin must import the reusable conversationPanel seam directly; buildWorkPanel.mjs is a design-system compatibility wrapper.",
  },
  {
    path: "src/frontend/rootAdminShell/assets/app.mjs",
    pattern: /\bbuild-work-panel-demo-/,
    rationale:
      "Root-admin must not reconstruct Build work panel markup or class names locally; render through conversationPanel instead.",
  },
  {
    path: "src/frontend/rootAdminShell/assets/app.mjs",
    pattern: /\bdata-build-work-panel(?:-[a-z0-9-]+)?\b/,
    rationale:
      "Root-admin must not reconstruct Build work panel data hooks locally; render through conversationPanel instead.",
  },
];

function readSource(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function listRootAdminCssFiles(): string[] {
  return readdirSync(resolve(process.cwd(), "src/frontend/rootAdminShell/assets"))
    .filter((entry) => entry.endsWith(".css"))
    .map((entry) => `src/frontend/rootAdminShell/assets/${entry}`)
    .sort();
}

function getSource(sourceFiles: SourceFile[], path: string): string {
  return sourceFiles.find((file) => file.path === path)?.source ?? "";
}

function runGuard(
  sourceFiles: SourceFile[],
  contractSource: string,
  floatingTabHeaderContractSource: string,
  rootAdminCssFiles: string[],
): GuardResult {
  const errors: string[] = [];
  const allConsumerSource = sourceFiles.map((file) => file.source).join("\n");

  for (const phrase of requiredContractPhrases) {
    if (!contractSource.includes(phrase)) {
      errors.push(
        `${adoptionContractPath} is missing required governed adoption contract phrase: ${phrase}`,
      );
    }
  }

  for (const phrase of requiredFloatingTabHeaderContractPhrases) {
    if (!floatingTabHeaderContractSource.includes(phrase)) {
      errors.push(
        `${floatingTabHeaderAdoptionContractPath} is missing required floating-tab adoption contract phrase: ${phrase}`,
      );
    }
  }

  for (const rule of cssOnlyRules) {
    if (!allConsumerSource.includes(rule.cssHref)) {
      continue;
    }

    for (const requiredToken of rule.requiredTokens) {
      const source = getSource(sourceFiles, requiredToken.path);
      if (!source.includes(requiredToken.token)) {
        errors.push(
          `${rule.family} imports ${rule.cssHref} without required DS seam token ${requiredToken.token} in ${requiredToken.path}. ${requiredToken.rationale}`,
        );
      }
    }
  }

  for (const forbidden of forbiddenLocalReconstructions) {
    const source = getSource(sourceFiles, forbidden.path);
    if (forbidden.pattern.test(source)) {
      errors.push(
        `${forbidden.path} contains forbidden governed UI reconstruction (${forbidden.pattern}). ${forbidden.rationale}`,
      );
    }
  }

  for (const cssFile of rootAdminCssFiles) {
    errors.push(
      `${cssFile} is forbidden for governed root-admin UI adoption. Styling must come from approved design-system CSS seams.`,
    );
  }

  return { errors };
}

function loadRepositorySources(): SourceFile[] {
  return governedSourcePaths.map((path) => ({
    path,
    source: readSource(path),
  }));
}

function runSelfTest(): GuardResult {
  const syntheticSources: SourceFile[] = [
    {
      path: "src/frontend/rootAdminShell/index.html",
      source:
        '<link rel="stylesheet" href="/design-system/assets/list-page-shared.css"><link rel="stylesheet" href="/design-system/assets/conversationPanel.css"><div id="root-users-list-page"></div><div class="build-work-panel-demo-panel"></div>',
    },
    {
      path: "src/frontend/rootAdminShell/assets/app.mjs",
      source: "export function boot() {}",
    },
    {
      path: "src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs",
      source: "export function createWebAppHierarchyPageController() {}",
    },
    {
      path: "src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs",
      source: "export function createWebAppHierarchyWorkspaceController() {}",
    },
    {
      path: "src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs",
      source: "export function createRootAdminDirectoryWorkspaceController() {}",
    },
    {
      path: "src/frontend/designSystem/assets/conversationPanel.mjs",
      source: "export function renderConversationPanel() {}\nexport function createConversationPanelController() {}",
    },
  ];
  const contractSource = requiredContractPhrases.join("\n");
  const floatingTabHeaderContractSource = requiredFloatingTabHeaderContractPhrases.join("\n");
  const result = runGuard(syntheticSources, contractSource, floatingTabHeaderContractSource, []);
  const expectedFragments = [
    "without required DS seam token /design-system/assets/rootAdminDirectoryWorkspace.mjs",
    "without required DS seam token createRootAdminDirectoryWorkspaceController",
    "without required DS seam token /design-system/assets/conversationPanel.mjs",
    "without required DS seam token renderConversationPanel",
    "without required DS seam token createConversationPanelController",
    "forbidden governed UI reconstruction",
  ];
  const missingExpectedFailures = expectedFragments.filter(
    (fragment) => !result.errors.some((error) => error.includes(fragment)),
  );

  if (missingExpectedFailures.length > 0) {
    return {
      errors: missingExpectedFailures.map(
        (fragment) => `Self-test did not prove expected failure: ${fragment}`,
      ),
    };
  }

  return { errors: [] };
}

function reportErrors(errors: string[]) {
  console.error("Governed UI adoption guard: blocked.");
  console.error("");
  console.error("Required follow-up:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
}

function main() {
  if (process.argv.includes("--self-test")) {
    const result = runSelfTest();
    if (result.errors.length === 0) {
      console.log("Governed UI adoption guard self-test: passed.");
      console.log("CSS-only adoption and app-local governed markup reconstruction are rejected.");
      return;
    }

    reportErrors(result.errors);
    process.exitCode = 1;
    return;
  }

  const result = runGuard(
    loadRepositorySources(),
    readSource(adoptionContractPath),
    readSource(floatingTabHeaderAdoptionContractPath),
    listRootAdminCssFiles(),
  );

  if (result.errors.length === 0) {
    console.log("Governed UI adoption guard: passed.");
    console.log("Governed app consumers pair shared CSS with DS-owned render/controller seams.");
    return;
  }

  reportErrors(result.errors);
  process.exitCode = 1;
}

main();
