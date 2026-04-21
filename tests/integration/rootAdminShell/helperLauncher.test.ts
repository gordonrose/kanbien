import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createApp } from "../../../src/app";
import { invokeText } from "../../harness/http";

describe("root admin helper launcher", () => {
  it("TC-ROOT-ADMIN-SHELL-SEC-005 serves a PowerShell launcher that verifies helper integrity before executing it", async () => {
    const response = await invokeText(createApp(), {
      method: "GET",
      path: "/root-admin/helper/download/start-root-auth-signer-helper.ps1",
      headers: {
        host: "admin.example.test",
      },
    });

    expect(response.status).toBe(200);
    expect(response.body).toContain("$expectedHelperSha256 =");
    expect(response.body).toContain("Get-FileHash -Algorithm SHA256");
    expect(response.body).toContain("The downloaded helper did not match the expected integrity hash.");
    expect(response.body).toContain("if ($currentHelperSha256 -ne $expectedHelperSha256)");
  });

  it("TC-ROOT-ADMIN-SHELL-EDGE-004 stages the Windows SSH private key into a locked-down WSL temp path before launching the helper", () => {
    const launcherSource = readFileSync(
      resolve(process.cwd(), "src/rootAdminHelper/start-root-admin-browser-signer.ps1"),
      "utf8",
    );

    expect(launcherSource).toContain("install -m 600");
    expect(launcherSource).toContain("/tmp/kanbien-root-admin-signer-id_ed25519");
    expect(launcherSource).toContain("ROOT_AUTH_SIGNER_PRIVATE_KEY_PATH='$stagedKeyPath'");
  });
});
