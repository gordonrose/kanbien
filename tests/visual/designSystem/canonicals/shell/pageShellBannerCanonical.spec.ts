import { expect, test, type Page } from "@playwright/test";

const canonicalStates = [
  {
    refId: "PSBR-001",
    route: "/design-system/components/page-shell-banner?ref=PSBR-001&theme=normal&dir=ltr&zoom=0",
    generatedRoute: "/design-system/canonical-renderings/page-shell-banner/PSBR-001",
    expectedVisible: ["info", "success", "warning", "danger"],
  },
  {
    refId: "PSBR-002",
    route: "/design-system/components/page-shell-banner?ref=PSBR-002&theme=normal&dir=ltr&zoom=0",
    generatedRoute: "/design-system/canonical-renderings/page-shell-banner/PSBR-002",
    expectedVisible: ["success"],
  },
  {
    refId: "PSBR-003",
    route: "/design-system/components/page-shell-banner?ref=PSBR-003&theme=normal&dir=ltr&zoom=0",
    generatedRoute: "/design-system/canonical-renderings/page-shell-banner/PSBR-003",
    expectedVisible: ["warning"],
  },
  {
    refId: "PSBR-004",
    route: "/design-system/components/page-shell-banner?ref=PSBR-004&theme=normal&dir=ltr&zoom=0",
    generatedRoute: "/design-system/canonical-renderings/page-shell-banner/PSBR-004",
    expectedVisible: ["danger"],
  },
  {
    refId: "PSBR-005",
    route: "/design-system/components/page-shell-banner?ref=PSBR-005&theme=normal&dir=ltr&zoom=0",
    generatedRoute: "/design-system/canonical-renderings/page-shell-banner/PSBR-005",
    expectedVisible: ["info", "success", "danger"],
  },
] as const;

async function gotoCanonical(page: Page, route: string) {
  await page.goto(route);
  await page.locator('#page-shell-banner-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system page-shell-banner canonicals", () => {
  for (const launcherScenario of [
    {
      label: "legacy launcher",
      route: "/design-system/canonicals/page-shell-banner",
      hrefPattern: /\/design-system\/components\/page-shell-banner\?/,
    },
    {
      label: "generated launcher",
      route: "/design-system/canonical-renderings/page-shell-banner",
      hrefPattern: /\/design-system\/canonical-renderings\/page-shell-banner\/PSBR-/,
    },
  ] as const) {
    test(`${launcherScenario.label} exposes the full PSBR set with dedicated render links`, async ({ page }) => {
      await page.goto(launcherScenario.route);

      const launcherButtons = page.locator(".canonical-launcher-button");
      await expect(launcherButtons).toHaveCount(5);
      await expect(page.getByRole("link", { name: /PSBR-001 Full four-state stack/i })).toBeVisible();
      await expect(page.getByRole("link", { name: /PSBR-005 Partial stack after one dismiss/i })).toBeVisible();
      const launcherHrefs = await page.locator(".canonical-launcher-grid a").evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? ""),
      );
      expect(launcherHrefs).toHaveLength(5);
      for (const href of launcherHrefs) {
        expect(href).toMatch(launcherScenario.hrefPattern);
      }
    });
  }

  test("generated launcher cards navigate to persisted render routes and keep the generated breadcrumb trail", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/page-shell-banner");

    const targetLink = page.getByRole("link", { name: /PSBR-003 Warning state/i });
    await expect(targetLink).toHaveAttribute("href", /\/design-system\/canonical-renderings\/page-shell-banner\/PSBR-003$/);
    await targetLink.click();

    await expect(page).toHaveURL(/\/design-system\/canonical-renderings\/page-shell-banner\/PSBR-003$/);
    await expect(page.locator("#breadcrumb-list")).toContainText("Home");
    await expect(page.locator("#breadcrumb-list")).toContainText("Canonical Renderings");
    await expect(page.locator("#breadcrumb-list")).toContainText("Page Shell Banner");
    await expect(page.locator("#breadcrumb-current-label")).toHaveText("PSBR-003");
  });

  for (const scenario of canonicalStates) {
    for (const routeUnderTest of [scenario.route, scenario.generatedRoute]) {
      test(`${scenario.refId} renders on the dedicated canonical surface for ${routeUnderTest}`, async ({ page }) => {
        await gotoCanonical(page, routeUnderTest);

        await expect(page.locator("body")).toHaveAttribute("data-page-shell-banner-surface", "canonical");
        await expect(page.locator("#page-shell-banner-canonical-current")).toContainText(scenario.refId);

        for (const bannerId of scenario.expectedVisible) {
          await expect(page.locator(`[data-page-shell-banner-card="${bannerId}"]`)).toBeVisible();
        }
      });
    }
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
