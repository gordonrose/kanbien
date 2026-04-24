import { expect, test } from "@playwright/test";

const migratedFamilyCards = [
  {
    label: /Simple Select Canonicals/i,
    href: "/design-system/canonical-renderings/simple-select",
  },
  {
    label: /Date Picker Canonicals/i,
    href: "/design-system/canonical-renderings/date-picker",
  },
  {
    label: /Time Picker Canonicals/i,
    href: "/design-system/canonical-renderings/time-picker",
  },
  {
    label: /Drawer Select Canonicals/i,
    href: "/design-system/canonical-renderings/drawer-select",
  },
  {
    label: /Choice Group Canonicals/i,
    href: "/design-system/canonical-renderings/choice-group",
  },
  {
    label: /List Record Card Canonicals/i,
    href: "/design-system/canonical-renderings/list-record-card",
  },
  {
    label: /List Detail Panel Canonicals/i,
    href: "/design-system/canonical-renderings/list-detail-panel",
  },
  {
    label: /List Detail Split Layout Canonicals/i,
    href: "/design-system/canonical-renderings/list-detail-split-layout",
  },
] as const;

test.describe("design-system legacy canonical launcher index", () => {
  test("migrated family cards now point to generated canonical-renderings launchers", async ({ page }) => {
    await page.goto("/design-system/canonicals");

    for (const card of migratedFamilyCards) {
      await expect(page.getByRole("link", { name: card.label })).toHaveAttribute("href", card.href);
    }
  });

  test("migrated launcher cards open the generated family launchers", async ({ page }) => {
    await page.goto("/design-system/canonicals");

    await page.getByRole("link", { name: /Date Picker Canonicals/i }).click();

    await expect(page).toHaveURL(/\/design-system\/canonical-renderings\/date-picker$/);
    await expect(page.locator(".canonical-launcher-button")).not.toHaveCount(0);
  });
});
