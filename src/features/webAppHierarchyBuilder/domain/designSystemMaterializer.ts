import { promises as fs } from "node:fs";
import path from "node:path";
import type { DesignSystemMaterializationPlan, DesignSystemMaterializer } from "./types";

function toRelativeDesignSystemPath(routePath: string): string[] {
  const normalized = routePath.replace(/^\/design-system\/?/, "").replace(/^\/+|\/+$/g, "");
  return normalized === "" ? [] : normalized.split("/");
}

function renderIndexHtml(displayLabel: string, routePath: string): string {
  const title = `Kanbien Design System - ${displayLabel}`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="stylesheet" href="/design-system/assets/styles.css" />
  </head>
  <body>
    <div class="design-system-shell">
      <main class="design-system-page-main canonical-launcher-page">
        <section class="canonical-launcher-layout">
          <section class="canonical-launcher-intro">
            <p class="top-nav-preview-eyebrow">Generated Page</p>
            <h1>${displayLabel}</h1>
            <p class="canonical-launcher-copy">
              This page was created through governed design-system topology materialization.
            </p>
            <dl class="canonical-render-meta" aria-label="Generated page metadata">
              <div class="canonical-render-meta-row">
                <dt>Route</dt>
                <dd>${routePath}</dd>
              </div>
              <div class="canonical-render-meta-row">
                <dt>Template</dt>
                <dd>static-html-page</dd>
              </div>
            </dl>
          </section>
        </section>
      </main>
    </div>
    <script type="module" src="/design-system/assets/app.mjs"></script>
  </body>
</html>
`;
}

function renderGovernanceStub(input: {
  pageKey: string;
  displayLabel: string;
  routePath: string;
  proposalCreatedAt: Date;
  appliedAt: Date;
}): string {
  return `# ${input.displayLabel}

- page slug: \`${input.pageKey}\`
- display label: ${input.displayLabel}
- parent placement: derived from applied hierarchy tree
- template key: \`static-html-page\`
- proposal timestamp: ${input.proposalCreatedAt.toISOString()}
- apply timestamp: ${input.appliedAt.toISOString()}
- follow-up implementation note: Replace this generated placeholder with the signed-off page implementation when the surface is ready.
`;
}

export function createFilesystemDesignSystemMaterializer(
  repoRoot: string,
): DesignSystemMaterializer {
  const designSystemRoot = path.resolve(repoRoot, "src/frontend/designSystem");
  const generatedDocsRoot = path.resolve(repoRoot, "docs/workspace/design-system/generated-pages");

  function plan(routePath: string, pageKey: string): DesignSystemMaterializationPlan {
    const segments = toRelativeDesignSystemPath(routePath);
    const folderPath = path.resolve(designSystemRoot, ...segments);
    return {
      folderPath,
      indexHtmlPath: path.resolve(folderPath, "index.html"),
      governanceStubPath: path.resolve(generatedDocsRoot, `${pageKey}.md`),
    };
  }

  return {
    plan,
    async apply(input) {
      const materializationPlan = plan(input.routePath, input.pageKey);
      await fs.mkdir(materializationPlan.folderPath, { recursive: true });
      await fs.mkdir(path.dirname(materializationPlan.governanceStubPath), { recursive: true });
      await fs.writeFile(
        materializationPlan.indexHtmlPath,
        renderIndexHtml(input.displayLabel, input.routePath),
        "utf8",
      );
      await fs.writeFile(
        materializationPlan.governanceStubPath,
        renderGovernanceStub({
          pageKey: input.pageKey,
          displayLabel: input.displayLabel,
          routePath: input.routePath,
          proposalCreatedAt: input.proposalCreatedAt,
          appliedAt: input.appliedAt,
        }),
        "utf8",
      );
      return materializationPlan;
    },
  };
}
