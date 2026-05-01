import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function readRepoFile(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("root admin path topology maintained artifacts", () => {
  it("TC-ROOT-PATH-COMPAT-001 keeps docs and maintained examples from treating hash-only suite routes as canonical", () => {
    const prd = readRepoFile("docs/prd/2026-04-21-0019-root-admin-path-topology-foundation.md");
    const capabilityMatrix = readRepoFile(
      "docs/workspace/capability-matrices/2026-04-21-root-admin-path-topology-foundation-capability-matrix-first-draft.csv",
    );
    const agentGuidance = readRepoFile("AGENTS.md");

    for (const canonicalPath of [
      "/root-admin",
      "/root-admin/web-app-hierarchy",
      "/root-admin/users",
      "/root-admin/tenants",
      "/root-admin/tenant-admins",
      "/root-admin/roles",
    ]) {
      expect(prd).toContain(canonicalPath);
      expect(capabilityMatrix).toContain(canonicalPath);
      expect(agentGuidance).toContain(canonicalPath);
    }

    expect(prd).toContain("compatibility aliases");
    expect(capabilityMatrix).toContain("compatibility aliases");
    expect(agentGuidance).toContain("compatibility aliases");
    expect(agentGuidance).toContain("legacy hash URLs");
    expect(agentGuidance).toContain("not canonical route truth");
  });

  it("TC-ROOT-PATH-COMPAT-002 keeps future planning artifacts aligned on durable path grammar", () => {
    const blueprint = readRepoFile("docs/workspace/implementation-blueprints/2026-04-21-root-admin-path-topology-foundation.md");
    const journeyInventory = readRepoFile(
      "docs/prd/journey_inventories/2026-04-21-0019-root-admin-path-topology-foundation-journey-inventory.md",
    );
    const adr = readRepoFile(
      "docs/architecture/adr/0032-promote-selected-root-admin-suites-from-hash-aliases-to-path-backed-canonical-routes.md",
    );

    expect(blueprint).toContain("path-backed");
    expect(journeyInventory).toContain("path-backed");
    expect(adr).toContain("path-backed");
    expect(blueprint).toContain("creating new hash");
    expect(journeyInventory).toContain("hash aliases");
    expect(adr).toContain("hash aliases");
  });
});
