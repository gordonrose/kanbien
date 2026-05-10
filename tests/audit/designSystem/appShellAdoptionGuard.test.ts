import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function read(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("app shell governed adoption guard", () => {
  it("keeps root-admin on the reusable design-system appShell seam", () => {
    const appShell = read("src/frontend/designSystem/assets/appShell.mjs");
    const rootAdminIndex = read("src/frontend/rootAdminShell/index.html");
    const rootAdminApp = read("src/frontend/rootAdminShell/assets/app.mjs");
    const seamContract = read("docs/workspace/design-system/adoption/app-shell-render-seam-contract.md");
    const seamAudit = read("docs/workspace/design-system/adoption/frontend-seam-classification-audit.md");
    const governedUiGuard = read("src/scripts/checkGovernedUiAdoption.ts");
    const rootAdminUiGuard = read("src/scripts/checkGovernedRootAdminUi.ts");

    expect(appShell).toContain("export function renderAppShell");
    expect(appShell).toContain("export function createAppShellController");
    expect(appShell).not.toMatch(/export function .*RootAdmin/);
    expect(appShell).not.toMatch(/export const .*RootAdmin/);
    expect(appShell).toContain("./pageShellController.mjs");

    expect(rootAdminIndex).toContain('<div id="shell-view" class="design-system-shell hidden"></div>');
    expect(rootAdminIndex).not.toContain("<header class=\"top-nav\"");
    expect(rootAdminIndex).not.toContain('id="root-admin-main"');
    expect(rootAdminIndex).not.toContain('id="display-settings-drawer"');

    expect(rootAdminApp).toContain("/design-system/assets/appShell.mjs");
    expect(rootAdminApp).toContain("renderAppShell(rootAdminAppShellInput)");
    expect(rootAdminApp).toContain("createAppShellController");

    expect(seamContract).toContain("Target implementation family:");
    expect(seamContract).toContain("src/frontend/designSystem/assets/appShell.mjs");
    expect(seamContract).toContain("compatibility");
    expect(seamContract).toContain("root-admin-specific assumptions inside the shared shell primitive");
    expect(seamAudit).toContain("App Shell Seam");
    expect(seamAudit).toContain("root-admin is the first governed consumer");

    expect(governedUiGuard).toContain("/design-system/assets/appShell.mjs");
    expect(rootAdminUiGuard).toContain("/design-system/assets/appShell.mjs");
  });
});
