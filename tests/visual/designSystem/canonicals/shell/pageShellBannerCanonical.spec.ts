import { expect, test, type Page } from "@playwright/test";

const canonicalStates = [
  {
    refId: "PSBR-001",
    route: "/design-system/components/page-shell-banner?ref=PSBR-001&theme=normal&dir=ltr&zoom=0",
    expectedVisible: ["info", "success", "warning", "danger"],
  },
  {
    refId: "PSBR-002",
    route: "/design-system/components/page-shell-banner?ref=PSBR-002&theme=normal&dir=ltr&zoom=0",
    expectedVisible: ["success"],
  },
  {
    refId: "PSBR-003",
    route: "/design-system/components/page-shell-banner?ref=PSBR-003&theme=normal&dir=ltr&zoom=0",
    expectedVisible: ["warning"],
  },
  {
    refId: "PSBR-004",
    route: "/design-system/components/page-shell-banner?ref=PSBR-004&theme=normal&dir=ltr&zoom=0",
    expectedVisible: ["danger"],
  },
  {
    refId: "PSBR-005",
    route: "/design-system/components/page-shell-banner?ref=PSBR-005&theme=normal&dir=ltr&zoom=0",
    expectedVisible: ["info", "success", "danger"],
  },
] as const;

async function gotoCanonical(page: Page, route: string) {
  await page.goto(route);
  await page.locator('#page-shell-banner-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system page-shell-banner canonicals", () => {
  test("launcher exposes the full PSBR set with dedicated render links", async ({ page }) => {
    await page.goto("/design-system/canonicals/page-shell-banner");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(5);
    await expect(page.getByRole("link", { name: /PSBR-001 Full four-state stack/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /PSBR-005 Partial stack after one dismiss/i })).toBeVisible();
    const launcherHrefs = await page.locator(".canonical-launcher-grid a").evaluateAll((links) =>
      links.map((link) => link.getAttribute("href") ?? ""),
    );
    expect(launcherHrefs).toHaveLength(5);
    for (const href of launcherHrefs) {
      expect(href).toMatch(/\/design-system\/components\/page-shell-banner\?/);
    }
  });

  for (const scenario of canonicalStates) {
    test(`${scenario.refId} renders on the dedicated canonical surface`, async ({ page }) => {
      await gotoCanonical(page, scenario.route);

      await expect(page.locator("body")).toHaveAttribute("data-page-shell-banner-surface", "canonical");
      await expect(page.locator("#page-shell-banner-canonical-current")).toContainText(scenario.refId);

      for (const bannerId of scenario.expectedVisible) {
        await expect(page.locator(`[data-page-shell-banner-card="${bannerId}"]`)).toBeVisible();
      }
    });
  }

  test("PSBR-001 keeps the approved spacing and close-control contract on the dedicated render surface", async ({ page }) => {
    await gotoCanonical(page, "/design-system/components/page-shell-banner?ref=PSBR-001&theme=normal&dir=ltr&zoom=0");

    await expect(page.locator(".status-message-close")).toHaveCount(4);

    const geometry = await page.evaluate(() => {
      const demo = document.querySelector<HTMLElement>("#page-shell-banner-demo");
      const headerNode = document.querySelector<HTMLElement>(".component-catalog-section-header");
      return {
        gapToHeader:
          demo && headerNode
            ? Math.round(headerNode.getBoundingClientRect().top - demo.getBoundingClientRect().bottom)
            : 0,
      };
    });

    expect(geometry.gapToHeader).toBeGreaterThanOrEqual(16);
  });
});
