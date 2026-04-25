import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("async activity drawer design-system seam", () => {
  it("promotes the page-shell async activity drawer into a shared governed seam", () => {
    const requiredFiles = [
      "src/frontend/designSystem/assets/asyncActivityDrawer.mjs",
      "src/frontend/designSystem/assets/asyncActivityDrawerCanonical.mjs",
      "src/frontend/designSystem/canonicals/async-activity-drawer/index.html",
      "src/frontend/designSystem/components/async-activity-drawer.html",
      "src/features/designSystemCanonicals/persistence/migrations/0043_seed_async_activity_drawer_canonicals.sql",
      "docs/workspace/design-system/behavior-locks/async-activity-drawer-behavior-lock.md",
      "docs/workspace/design-system/reference-packs/async-activity-drawer-reference-pack.md",
      "docs/workspace/design-system/patterns/async-activity-drawer-pattern.md",
      "docs/workspace/design-system/components/async-activity-drawer-component.md",
      "docs/workspace/design-system/verification/async-activity-drawer-verification-checklist.md",
    ];

    for (const relativePath of requiredFiles) {
      expect(existsSync(resolve(process.cwd(), relativePath))).toBe(true);
    }

    const markup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/templates/page-shell/index.html"),
      "utf8",
    );
    const appScript = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/app.mjs"),
      "utf8",
    );
    const seamScript = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/asyncActivityDrawer.mjs"),
      "utf8",
    );
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/styles.css"),
      "utf8",
    );
    const behaviorLock = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/behavior-locks/async-activity-drawer-behavior-lock.md"),
      "utf8",
    );
    const referencePack = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/reference-packs/async-activity-drawer-reference-pack.md"),
      "utf8",
    );
    const component = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/components/async-activity-drawer-component.md"),
      "utf8",
    );
    const canonicalLauncher = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/canonicals/async-activity-drawer/index.html"),
      "utf8",
    );
    const canonicalRender = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/components/async-activity-drawer.html"),
      "utf8",
    );
    const migration = readFileSync(
      resolve(process.cwd(), "src/features/designSystemCanonicals/persistence/migrations/0043_seed_async_activity_drawer_canonicals.sql"),
      "utf8",
    );

    expect(markup).toContain('id="async-activity-button"');
    expect(markup).toContain('aria-controls="async-activity-drawer"');
    expect(markup).toContain("data-async-activity-drawer");
    expect(markup).not.toContain("Import tenant records");
    expect(markup).not.toContain("Sync customer segments");
    expect(markup).not.toContain("Tenant record import");

    expect(appScript).toContain("createAsyncActivityDrawerController");
    expect(appScript).toContain("asyncActivityDrawerDemoJobs");
    expect(appScript).not.toContain("function setAsyncActivityDrawerOpen(open, { restoreFocus = true } = {}) {\n  asyncActivityButton?.setAttribute");

    expect(seamScript).toContain("renderAsyncActivityDrawer");
    expect(seamScript).toContain("createAsyncActivityDrawerController");
    expect(seamScript).toContain('state: "running"');
    expect(seamScript).toContain('state: "waiting"');
    expect(seamScript).toContain('state: "error"');
    expect(seamScript).toContain('state: "complete"');
    expect(seamScript).toContain("data-async-activity-retry");
    expect(seamScript).toContain("data-async-activity-report");
    expect(seamScript).toContain("Successful records");
    expect(seamScript).toContain("Failed records");

    expect(styles).toContain(".async-job-card");
    expect(styles).toContain(".async-job-card-error");
    expect(styles).toContain(".async-job-card-complete");
    expect(styles).toContain(".async-job-progress-error");
    expect(styles).toContain(".async-job-download");
    expect(styles).toContain(".context-nav-activity-badge");

    expect(behaviorLock).toContain("AAD-001");
    expect(behaviorLock).toContain("design system owns drawer structure");
    expect(behaviorLock).toContain("Backend capabilities own durable job lifecycle");
    expect(referencePack).toContain("AADR-001");
    expect(referencePack).toContain("/design-system/canonical-renderings/async-activity-drawer/AADR-001");
    expect(component).toContain("Job Data Contract");
    expect(component).toContain("running`, `waiting`, `error`, or `complete");
    expect(canonicalLauncher).toContain("Async Activity Drawer Canonicals");
    expect(canonicalLauncher).toContain("/design-system/canonical-renderings/async-activity-drawer/AADR-004");
    expect(canonicalRender).toContain('data-async-activity-drawer-surface="canonical"');
    expect(migration).toContain("/design-system/canonical-renderings/async-activity-drawer");
    expect(migration).toContain("/design-system/canonical-renderings/async-activity-drawer/AADR-001");
  });
});
