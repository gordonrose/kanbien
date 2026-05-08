import { describe, expect, it } from "vitest";

import {
  buildCanonicalRootAdminPath,
  deriveShellPageKeyFromPathname,
  deriveShellPageKeyFromRoutePath,
  isKnownRootAdminShellPage,
  normalizeRootAdminShellPageKey,
} from "../../../src/frontend/rootAdminShell/assets/routeTopology.mjs";

describe("root admin shell route topology", () => {
  it("TC-ROOT-PATH-UNIT-001 resolves canonical path-backed root-admin pages and rejects unknown suite paths honestly", () => {
    expect(deriveShellPageKeyFromPathname("/root-admin")).toBe("overview");
    expect(deriveShellPageKeyFromPathname("/root-admin/web-app-hierarchy")).toBe("web-app-hierarchy");
    expect(deriveShellPageKeyFromPathname("/root-admin/users")).toBe("users");
    expect(deriveShellPageKeyFromPathname("/root-admin/tenants")).toBe("tenants");
    expect(deriveShellPageKeyFromPathname("/root-admin/tenant-admins")).toBe("tenant-admins");
    expect(deriveShellPageKeyFromPathname("/root-admin/roles")).toBe("roles");
    expect(deriveShellPageKeyFromPathname("/root-admin/build/backlog")).toBe("build-backlog");

    expect(normalizeRootAdminShellPageKey("unknown-suite")).toBeNull();
    expect(deriveShellPageKeyFromPathname("/root-admin/unknown-suite", null)).toBeNull();
    expect(isKnownRootAdminShellPage("unknown-suite")).toBe(false);
  });

  it("TC-ROOT-PATH-UNIT-002 resolves legacy hash aliases without making aliases canonical", () => {
    expect(deriveShellPageKeyFromRoutePath("/root-admin#overview")).toBe("overview");
    expect(deriveShellPageKeyFromRoutePath("/root-admin#web-app-hierarchy")).toBe("web-app-hierarchy");
    expect(deriveShellPageKeyFromRoutePath("/root-admin#users")).toBe("users");
    expect(deriveShellPageKeyFromRoutePath("/root-admin#root-users")).toBe("users");
    expect(deriveShellPageKeyFromRoutePath("/root-admin#tenants")).toBe("tenants");
    expect(deriveShellPageKeyFromRoutePath("/root-admin#tenant-admins")).toBe("tenant-admins");
    expect(deriveShellPageKeyFromRoutePath("/root-admin#roles")).toBe("roles");
    expect(deriveShellPageKeyFromRoutePath("/root-admin#root-roles")).toBe("roles");
    expect(deriveShellPageKeyFromRoutePath("/root-admin#build-backlog")).toBe("build-backlog");

    expect(normalizeRootAdminShellPageKey("unsupported-alias")).toBeNull();
    expect(deriveShellPageKeyFromRoutePath("/root-admin#unsupported-alias", null)).toBeNull();
    expect(buildCanonicalRootAdminPath("root-users")).toBe("/root-admin/users");
    expect(buildCanonicalRootAdminPath("root-roles")).toBe("/root-admin/roles");
  });

  it("TC-ROOT-PATH-UNIT-003 derives canonical shell navigation hrefs instead of legacy hash aliases", () => {
    expect(buildCanonicalRootAdminPath("overview")).toBe("/root-admin");
    expect(buildCanonicalRootAdminPath("users")).toBe("/root-admin/users");
    expect(buildCanonicalRootAdminPath("roles")).toBe("/root-admin/roles");
    expect(buildCanonicalRootAdminPath("tenants")).toBe("/root-admin/tenants");
    expect(buildCanonicalRootAdminPath("tenant-admins")).toBe("/root-admin/tenant-admins");
    expect(buildCanonicalRootAdminPath("web-app-hierarchy")).toBe("/root-admin/web-app-hierarchy");
    expect(buildCanonicalRootAdminPath("build-backlog")).toBe("/root-admin/build/backlog");
  });
});
