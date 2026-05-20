import { expect, test } from "@playwright/test";

const entityManagementChildFamilies = [
  {
    familyKey: "entity-management-page-outer-page",
    sampleRef: "EMPO-001",
    expectedCount: 24,
  },
  {
    familyKey: "entity-management-page-navigation",
    sampleRef: "EMPN-020",
    expectedCount: 36,
  },
  {
    familyKey: "entity-management-page-detail-panel",
    sampleRef: "EMPD-001",
    expectedCount: 50,
  },
  {
    familyKey: "entity-management-page-collection-item",
    sampleRef: "EMPI-001",
    expectedCount: 38,
  },
  {
    familyKey: "entity-management-page-evidence-ai",
    sampleRef: "EMPE-003",
    expectedCount: 36,
  },
  {
    familyKey: "entity-management-page-performance",
    sampleRef: "EMPP-001",
    expectedCount: 32,
  },
] as const;

test.describe("entity-management-page child canonical renderings", () => {
  for (const family of entityManagementChildFamilies) {
    test(`${family.familyKey} launcher targets dedicated child render routes`, async ({ page }) => {
      await page.goto(`/design-system/canonical-renderings/${family.familyKey}`);

      const links = page.locator(".canonical-launcher-button");
      await expect(links).toHaveCount(family.expectedCount);

      for (const href of await links.evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")))) {
        expect(href).toMatch(new RegExp(`^/design-system/canonical-renderings/${family.familyKey}/`));
        expect(href).not.toContain("/design-system/templates/entity_management_page");
      }
    });

    test(`${family.familyKey} sample render hydrates the shared entity page behavior seam`, async ({ page }) => {
      const path = `/design-system/canonical-renderings/${family.familyKey}/${family.sampleRef}`;
      await page.goto(path);

      await expect(page).toHaveURL(new RegExp(`${family.familyKey}/${family.sampleRef}$`));
      await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
      await expect(page.locator("[data-record-management-entity-page-template]")).toHaveCount(1);
      await expect(page.locator("[data-record-management-region-shell]")).toHaveCount(1);
      await expect(page.locator("[data-record-management-region-trigger]")).not.toHaveCount(0);
      await expect(page.locator("#entity-management-page-canonical-match-list")).toContainText(family.sampleRef);
    });
  }
});
