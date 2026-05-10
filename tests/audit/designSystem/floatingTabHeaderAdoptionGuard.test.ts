import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function read(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("floating tab header governed adoption guard", () => {
  it("pins the root-admin Build Backlog consumer to the design-system floatingTabHeader seam", () => {
    const adoptionContract = read(
      "docs/workspace/design-system/adoption/root-admin-build-backlog-floating-tab-header-adoption-contract.md",
    );
    const reusableAdoptionContract = read(
      "docs/workspace/design-system/adoption/floating-tab-header-adoption-contract.md",
    );
    const rootAdminIndex = read("src/frontend/rootAdminShell/index.html");
    const rootAdminApp = read("src/frontend/rootAdminShell/assets/app.mjs");
    const buildBacklogPage = read("src/frontend/rootAdminShell/routes/build/backlog/page.mjs");
    const buildBacklogRoute = read("src/frontend/rootAdminShell/routes/build/backlog/route.mjs");
    const routeRegistry = read("src/frontend/rootAdminShell/routes/registry.mjs");
    const floatingTabHeader = read("src/frontend/designSystem/assets/floatingTabHeader.mjs");
    const governedUiGuard = read("src/scripts/checkGovernedUiAdoption.ts");
    const rootAdminUiGuard = read("src/scripts/checkGovernedRootAdminUi.ts");

    expect(adoptionContract).toContain("/root-admin/build/backlog");
    expect(adoptionContract).toContain("/design-system/assets/floatingTabHeader.mjs");
    expect(adoptionContract).toContain("renderFloatingTabHeader");
    expect(adoptionContract).toContain("mountFloatingTabHeader");
    expect(adoptionContract).toContain("The app must not own");
    expect(adoptionContract).toContain("FTH-R-024");
    expect(adoptionContract).toContain("clipped labels do expose the shared tooltip");
    expect(adoptionContract).toContain("Runtime proof");

    expect(reusableAdoptionContract).toContain("renderFloatingTabHeader(...)");
    expect(reusableAdoptionContract).toContain("mountFloatingTabHeader(...)");
    expect(reusableAdoptionContract).toContain("copied `.floating-tab-card`");
    expect(reusableAdoptionContract).toContain("native `title` attributes are absent");
    expect(reusableAdoptionContract).toContain("/design-system/assets/floatingTabHeader.mjs?v=2026-05-08-overflow-tooltip-contract");
    expect(reusableAdoptionContract).toContain("tests/visual/app/rootAdminShell/rootAdminBuildBacklog.spec.ts");

    expect(rootAdminIndex).toContain('id="page-build-backlog"');
    expect(rootAdminIndex).toContain("app.mjs?v=2026-05-08-floating-tab-tooltip-contract");
    expect(rootAdminIndex).not.toContain("floating-tab-card");
    expect(rootAdminIndex).not.toContain("data-floating-tab-seam-mount");
    expect(rootAdminApp).toContain("../routes/registry.mjs");
    expect(rootAdminApp).toContain('getRootAdminRouteDefinition("build-backlog")');

    expect(buildBacklogPage).toContain("/design-system/assets/floatingTabHeader.mjs?v=2026-05-08-overflow-tooltip-contract");
    expect(buildBacklogPage).toContain("renderFloatingTabHeader");
    expect(buildBacklogPage).toContain("mountFloatingTabHeader");
    expect(buildBacklogPage).toContain('data-floating-tab-seam-mount="true"');
    expect(buildBacklogPage).not.toContain("addEventListener(\"click\"");
    expect(buildBacklogRoute).toContain('key: "build-backlog"');
    expect(buildBacklogRoute).toContain('canonicalPath: "/root-admin/build/backlog"');
    expect(routeRegistry).toContain("buildBacklogRoute");
    expect(floatingTabHeader).toContain("export function renderFloatingTabHeader");
    expect(floatingTabHeader).toContain("export function mountFloatingTabHeader");

    expect(governedUiGuard).toContain("family: \"floating tab header\"");
    expect(governedUiGuard).toContain("/design-system/assets/floatingTabHeader.mjs");
    expect(governedUiGuard).toContain("floating-tab-header-adoption-contract.md");
    expect(governedUiGuard).toContain("floating-tab-card");
    expect(rootAdminUiGuard).toContain("forbiddenRootAdminFloatingTabHeaderOwnershipPatterns");
    expect(rootAdminUiGuard).toContain("floatingTabHeader.mjs");
  });
});
