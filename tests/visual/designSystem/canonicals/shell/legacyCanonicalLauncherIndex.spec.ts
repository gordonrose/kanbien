import { expect, test } from "@playwright/test";

const migratedFamilyCards = [
  {
    label: /Top Nav Canonicals/i,
    href: "/design-system/canonical-renderings/top-nav",
  },
  {
    label: /Hierarchy Tree Canonicals/i,
    href: "/design-system/canonical-renderings/hierarchy-tree",
  },
  {
    label: /Page-Shell Banner Canonicals/i,
    href: "/design-system/canonical-renderings/page-shell-banner",
  },
  {
    label: /Async Activity Drawer Canonicals/i,
    href: "/design-system/canonical-renderings/async-activity-drawer",
  },
  {
    label: /Drawer Form Canonicals/i,
    href: "/design-system/canonical-renderings/drawer-form",
  },
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
    label: /Display Settings Canonicals/i,
    href: "/design-system/canonical-renderings/display-settings",
  },
  {
    label: /Form Template Canonicals/i,
    href: "/design-system/canonical-renderings/form-template",
  },
  {
    label: /Icon Grid Canonicals/i,
    href: "/design-system/canonical-renderings/icon-grid",
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
  test("states that legacy canonicals are only a compatibility bridge", async ({ page }) => {
    await page.goto("/design-system/canonicals");

    await expect(page.getByRole("heading", { name: "Legacy Design-System Canonicals" })).toBeVisible();
    await expect(page.getByText("Generated canonical-renderings are the durable source of truth")).toBeVisible();
    await expect(page.getByText("Do not add new generated families here")).toBeVisible();
  });

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
