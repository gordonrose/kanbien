import { describe, expect, it } from "vitest";

import { rootAdminPageMetadata } from "../../../src/frontend/rootAdminShell/assets/pageMetadata.mjs";
import { rootAdminCanonicalPaths } from "../../../src/frontend/rootAdminShell/assets/routeTopology.mjs";

function pathDepth(path: string): number {
  return path.split("/").filter(Boolean).length;
}

describe("root admin page metadata", () => {
  it("TC-ROOT-PATH-UNIT-005 requires nested root-admin paths to render breadcrumb hierarchy as separate nodes", () => {
    for (const [pageKey, path] of Object.entries(rootAdminCanonicalPaths)) {
      const metadata = rootAdminPageMetadata[pageKey as keyof typeof rootAdminPageMetadata];
      expect(metadata, `${pageKey} metadata`).toBeDefined();
      expect(metadata?.breadcrumbCurrent ?? "").not.toMatch(/\s\/\s|\/.*\S/);

      if (pathDepth(path) <= 2) {
        continue;
      }

      expect(Array.isArray(metadata?.breadcrumbChain), `${pageKey} breadcrumbChain`).toBe(true);
      expect(metadata?.breadcrumbChain?.map((item) => item.label)).toEqual(["Root Admin", "Build", "Backlog"]);
      expect(metadata?.breadcrumbChain?.at(-1)?.label).toBe(metadata?.breadcrumbCurrent);
    }
  });
});
