import { expect, test } from "@playwright/test";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";

const generatedCanonicalFamilies = [
  {
    familyKey: "page-shell-banner",
    familyLabel: /Page-Shell Banner/i,
    sampleRenderPath: "/design-system/canonical-renderings/page-shell-banner/PSBR-001",
    surfaceLocator: "#page-shell-banner-preview-shell",
    readyLocator: "#page-shell-banner-preview-shell",
    bodyAttribute: { name: "data-page-shell-banner-surface", value: "canonical" as const },
  },
  {
    familyKey: "top-nav",
    familyLabel: /Top Nav/i,
    sampleRenderPath: "/design-system/canonical-renderings/top-nav/TRP-001",
    surfaceLocator: "#top-nav-preview-frame",
    readyLocator: "#top-nav-preview-frame .top-nav",
    bodyAttribute: { name: "data-top-nav-surface", value: "canonical" as const },
  },
  {
    familyKey: "simple-select",
    familyLabel: /Simple Select/i,
    sampleRenderPath: "/design-system/canonical-renderings/simple-select/SSR-002",
    surfaceLocator: "#simple-select-preview-shell",
    readyLocator: "#simple-select-preview-shell[data-render-status='ready']",
    bodyAttribute: { name: "data-simple-select-surface", value: "canonical" as const },
  },
  {
    familyKey: "time-picker",
    familyLabel: /Time Picker/i,
    sampleRenderPath: "/design-system/canonical-renderings/time-picker/TPR-004",
    surfaceLocator: "#time-picker-preview-shell",
    readyLocator: "#time-picker-preview-shell",
    bodyAttribute: { name: "data-time-picker-surface", value: "canonical" as const },
  },
] as const;

test.describe("design-system generated canonical renderings index", () => {
  test("top-level generated index exposes the seeded family launcher cards", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings");

    for (const family of generatedCanonicalFamilies) {
      await expect(
        page.getByRole("link", { name: family.familyLabel }),
        `${family.familyKey} should be present on the top-level generated canonical-renderings index`,
      ).toHaveAttribute("href", `/design-system/canonical-renderings/${family.familyKey}`);
    }
  });

  for (const family of generatedCanonicalFamilies) {
    test(`${family.familyKey} proves the full generated launcher chain from index card to dedicated render surface`, async ({ page }) => {
      await page.goto("/design-system/canonical-renderings");

      await page.getByRole("link", { name: family.familyLabel }).click();

      await expect(page).toHaveURL(new RegExp(`/design-system/canonical-renderings/${family.familyKey}$`));
      await expect(page.locator(".canonical-launcher-button")).not.toHaveCount(0);

      await page.locator(`.canonical-launcher-button[href="${family.sampleRenderPath}"]`).click();

      await expectRouteSurfaceTruth(page, {
        expectedPath: family.sampleRenderPath,
        surfaceLocator: family.surfaceLocator,
        waitForReadyLocator: family.readyLocator,
        bodyAttribute: family.bodyAttribute,
        fallbackHeading: /Design-System Route Families/i,
      });
    });
  }
});
