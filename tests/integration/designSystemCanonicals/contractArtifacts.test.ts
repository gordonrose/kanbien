import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("design-system canonicals contract artifacts", () => {
  it("keeps API, OpenAPI, feature, and data-dictionary artifacts aligned to implemented routes and entities", async () => {
    const [apiContract, openApi, featureDoc, familyDictionary, referenceDictionary] =
      await Promise.all([
        readFile("docs/api-contracts/design-system-canonicals.md", "utf8"),
        readFile("docs/swagger/openapi.yaml", "utf8"),
        readFile("docs/featureDocs/design-system-canonicals-feature.md", "utf8"),
        readFile("docs/data-dictionary/design-system-canonical-family.md", "utf8"),
        readFile("docs/data-dictionary/design-system-canonical-reference.md", "utf8"),
      ]);

    for (const route of [
      "/v1/design-system-canonicals/families",
      "/v1/design-system-canonicals/families/{canonicalFamilyId}",
      "/v1/design-system-canonicals/families/{canonicalFamilyId}/references",
      "/v1/design-system-canonicals/references/{canonicalReferenceId}",
      "/v1/design-system-canonicals/public/families",
      "/v1/design-system-canonicals/public/families/{familyKey}/launcher",
      "/v1/design-system-canonicals/public/families/{familyKey}/references/{referenceId}",
    ]) {
      expect(apiContract).toContain(route);
      expect(openApi).toContain(route);
    }

    for (const artifact of [apiContract, featureDoc, familyDictionary, referenceDictionary]) {
      expect(artifact).toContain("designSystemCanonicals");
      expect(artifact).toContain("webAppHierarchyBuilder");
    }

    expect(openApi).toContain("DesignSystemCanonicalFamily");
    expect(openApi).toContain("DesignSystemCanonicalReference");
    expect(familyDictionary).toContain("design_system_canonical_families");
    expect(referenceDictionary).toContain("design_system_canonical_references");
  });
});
