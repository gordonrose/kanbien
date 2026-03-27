import { describe, expect, it } from "vitest";
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
});
