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
    expect(markup).toContain('id="primary-nav-overflow-menu"\n              class="primary-nav-overflow-menu hidden"\n              role="menu"\n              aria-labelledby="primary-nav-overflow-button"\n            >');
    expect(markup).toContain("        </nav>\n      </header>");
    expect(markup).not.toContain('aria-labelledby="primary-nav-overflow-button"\n            ></div>\n              <span class="menu-item');
    expect(script).toContain("function normalizePrimaryNavOverflowStructure(primaryNav)");
    expect(script).toContain("function normalizeTopNavUtilityPresence(root = document)");
    expect(script).toContain('topNav.classList.toggle("top-nav-no-utilities", !hasUtilities);');
    expect(styles).toContain(".top-nav.top-nav-no-utilities {\n  grid-template-columns: auto minmax(0, 1fr);\n}");
    expect(markup).toContain('data-page-shell-top-nav-visibility="hide"');
    expect(markup).toContain("Show menu items");
    expect(markup).toContain("No menu items");
    expect(markup).toContain('data-page-shell-profile-visibility="hide"');
    expect(markup).toContain('data-page-shell-profile-menu-state="collapsed"');
    expect(markup).toContain('data-page-shell-profile-menu-state="open"');
    expect(script).toContain("const pageShellTopNavVisibilityButtons = Array.from");
    expect(script).toContain("const pageShellProfileVisibilityButtons = Array.from");
    expect(script).toContain("const pageShellProfileMenuStateButtons = Array.from");
    expect(script).toContain("function setPageShellTopNavMenuVisible(visible)");
    expect(script).toContain('shellPrimaryNav?.classList.toggle("hidden", !visible);');
    expect(script).not.toContain('shellTopNav?.classList.toggle("hidden", !visible);');
    expect(script).toContain("function setPageShellProfileVisible(visible)");
    expect(script).toContain("function setPageShellProfileMenuOpen(open)");
    expect(script).toContain("data-page-shell-demo-profile-button");
    expect(script).toContain("data-page-shell-demo-profile-menu");
    expect(script).toContain('aria-expanded="false"');
    expect(script).toContain('class="profile-menu hidden"');
    expect(script).toContain("Language settings");
    expect(script).toContain("Profile settings");
    expect(script).toContain("Logout");
    expect(script).not.toContain("function buildProfileButtonMarkup");
    expect(script).toContain("const orphanMenuItems = Array.from(overflow.children).filter");
    expect(script).toContain("menu.append(orphan);");
    expect(markup).toContain('aria-controls="async-activity-drawer"');
    expect(markup).toContain('id="accessibility-button"\n            class="context-nav-item context-nav-item-button"');
    expect(markup).toContain('id="async-activity-drawer"');
    expect(markup).toContain('class="async-job-list"');
    expect(markup).toContain("Import tenant records");
    expect(markup).toContain("Generate role matrix");
    expect(markup).toContain("Sync customer segments");
    expect(markup).toContain('data-tooltip="Error"');
    expect(markup).toContain("Network timeout");
    expect(markup).toContain('class="async-job-retry tooltip-anchor"');
    expect(markup).toContain('data-tooltip="Retry job"');
    expect(markup).toContain('aria-label="Retry sync customer segments"');
    expect(markup).toContain("Tenant record import");
    expect(markup).toContain('data-tooltip="Running"');
    expect(markup).toContain('data-tooltip="Waiting"');
    expect(markup).toContain('data-tooltip="Complete"');
    expect(markup).toContain("1,204");
    expect(markup).toContain('data-tooltip="Successful records"');
    expect(markup).toContain('aria-label="Successful records"');
    expect(markup).toContain("7");
    expect(markup).toContain('data-tooltip="Failed records"');
    expect(markup).toContain('aria-label="Failed records"');
    expect(markup).not.toContain(">Successful</span>");
    expect(markup).not.toContain(">Failed</span>");
    expect(markup).toContain('download="tenant-record-import-results.csv"');
    expect(markup).toContain('data-tooltip="Download report"');
    expect(markup).toContain('aria-label="Download tenant record import results CSV"');
    expect(markup).not.toContain("This shell-level drawer stays available");
    expect(script).toContain("function setAsyncActivityDrawerOpen(open");
    expect(script).toContain("function isAsyncActivityDrawerOpen()");
    expect(script).toContain("asyncActivityButton?.addEventListener(\"click\"");
    expect(script).toContain("asyncActivityCloseButton?.addEventListener(\"click\"");
    expect(styles).toContain(".async-job-card");
    expect(styles).toContain(".async-job-card-error");
    expect(styles).toContain(".async-job-card-complete");
    expect(styles).toContain(".async-job-progress");
    expect(styles).toContain(".async-job-progress-error");
    expect(styles).toContain(".async-job-status-error");
    expect(styles).toContain(".async-job-error-row");
    expect(styles).toContain(".async-job-retry");
    expect(styles).toContain(".async-job-result-grid");
    expect(styles).toContain(".async-job-result-icon");
    expect(styles).toContain(".async-job-download");
    expect(styles).toContain(".context-nav-activity-badge");
    expect(behaviorLock).toContain("CD-012");
    expect(behaviorLock).toContain("CSV download action");
    expect(behaviorLock).toContain("error state with retry action");
  });
});
