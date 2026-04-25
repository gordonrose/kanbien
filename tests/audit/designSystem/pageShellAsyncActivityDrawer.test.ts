import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("page-shell async activity drawer", () => {
  it("keeps the async activity launcher in the context-nav bottom stack with drawer runtime support", () => {
    const markup = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/templates/page-shell/index.html"),
      "utf8",
    );
    const script = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/app.mjs"),
      "utf8",
    );
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/styles.css"),
      "utf8",
    );
    const behaviorLock = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md"),
      "utf8",
    );

    expect(markup).toContain('id="async-activity-button"');
    expect(markup).toContain('aria-controls="async-activity-drawer"');
    expect(markup).toContain('id="accessibility-button"\n            class="context-nav-item context-nav-item-button"');
    expect(markup).toContain('id="async-activity-drawer"');
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('class="async-job-list"');
    expect(markup).toContain("Import tenant records");
    expect(markup).toContain("Generate role matrix");
    expect(markup).toContain("Refresh dashboard cache");
    expect(script).toContain("function setAsyncActivityDrawerOpen(open");
    expect(script).toContain("function isAsyncActivityDrawerOpen()");
    expect(script).toContain("asyncActivityButton?.addEventListener(\"click\"");
    expect(script).toContain("asyncActivityCloseButton?.addEventListener(\"click\"");
    expect(styles).toContain(".async-job-card");
    expect(styles).toContain(".async-job-progress");
    expect(styles).toContain(".context-nav-activity-badge");
    expect(behaviorLock).toContain("CD-012");
    expect(behaviorLock).toContain("async activity drawer");
  });
});
