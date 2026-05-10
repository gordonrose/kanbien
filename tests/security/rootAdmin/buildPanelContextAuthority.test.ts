import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("root-admin Build panel context authority", () => {
  it("keeps browser URL query and hash state out of harness-chat surface authority", () => {
    const appSource = readFileSync(
      resolve(process.cwd(), "src/frontend/rootAdminShell/assets/app.mjs"),
      "utf8",
    );
    const surfaceContextFunction = appSource.slice(
      appSource.indexOf("function buildPanelSurfaceContext()"),
      appSource.indexOf("function rootAdminBuilderFirstName()"),
    );

    expect(surfaceContextFunction).toContain("window.location.pathname");
    expect(surfaceContextFunction).toContain("roleContext: \"root-builder\"");
    expect(surfaceContextFunction).not.toContain("window.location.search");
    expect(surfaceContextFunction).not.toContain("window.location.hash");
    expect(surfaceContextFunction).not.toContain("tenantId");
    expect(surfaceContextFunction).not.toContain("authorization");
  });
});
