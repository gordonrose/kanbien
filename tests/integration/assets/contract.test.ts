import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("assets contract artifacts", () => {
  it("TC-ASSETS-EDGE-009 keeps API contract, OpenAPI, and Postman artifacts aligned to implemented routes", async () => {
    const [apiContract, openApi, postman] = await Promise.all([
      readFile("docs/api-contracts/assets.md", "utf8"),
      readFile("docs/swagger/openapi.yaml", "utf8"),
      readFile("docs/postman/collections/assets.postman_collection.json", "utf8"),
    ]);

    for (const route of [
      "/v1/assets/upload-intents",
      "/v1/assets/{assetId}/complete",
      "/v1/assets/{assetId}",
      "/v1/assets/{assetId}/content",
      "/v1/assets/{assetId}/delete",
      "/v1/assets/internal/cleanup-expired-uploads",
    ]) {
      expect(apiContract).toContain(route);
      expect(openApi).toContain(route.replace("{assetId}", "{assetId}"));
    }

    expect(postman).toContain("/v1/assets/upload-intents");
    expect(postman).toContain("/v1/assets/{{assetId}}/complete");
    expect(postman).not.toContain("signed");
  });
});
