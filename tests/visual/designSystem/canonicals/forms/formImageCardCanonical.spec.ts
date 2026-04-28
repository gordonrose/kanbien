import { expect, test, type Page } from "@playwright/test";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";

const formImageCardCanonicalStates = [
  {
    refId: "FICR-001",
    label: "picture-only square image card",
    route: "/design-system/canonical-renderings/form-image-card/FICR-001",
    expectedVariant: "image-only",
    expectedDir: "ltr",
    expectedTheme: "normal",
    expectedCopy: [],
    absentCopy: ["Amara Chen", "Priya Shah", "example.com"],
  },
  {
    refId: "FICR-002",
    label: "image plus name",
    route: "/design-system/canonical-renderings/form-image-card/FICR-002",
    expectedVariant: "name-only",
    expectedDir: "ltr",
    expectedTheme: "normal",
    expectedCopy: ["Amara Chen"],
    absentCopy: ["example.com", "Regional operations lead"],
  },
  {
    refId: "FICR-003",
    label: "image plus name, email, and job title",
    route: "/design-system/canonical-renderings/form-image-card/FICR-003",
    expectedVariant: "person-full",
    expectedDir: "ltr",
    expectedTheme: "normal",
    expectedCopy: ["Priya Shah", "priya.shah@example.com", "Regional operations lead"],
    absentCopy: [],
  },
  {
    refId: "FICR-004",
    label: "mobile full identity review",
    route: "/design-system/canonical-renderings/form-image-card/FICR-004",
    expectedVariant: "person-full",
    expectedDir: "ltr",
    expectedTheme: "normal",
    expectedCopy: ["Priya Shah", "priya.shah@example.com", "Regional operations lead"],
    absentCopy: [],
  },
  {
    refId: "FICR-005",
    label: "rtl full identity review",
    route: "/design-system/canonical-renderings/form-image-card/FICR-005",
    expectedVariant: "person-full",
    expectedDir: "rtl",
    expectedTheme: "normal",
    expectedCopy: ["Priya Shah", "priya.shah@example.com", "Regional operations lead"],
    absentCopy: [],
  },
  {
    refId: "FICR-006",
    label: "dark theme full identity review",
    route: "/design-system/canonical-renderings/form-image-card/FICR-006",
    expectedVariant: "person-full",
    expectedDir: "ltr",
    expectedTheme: "dark",
    expectedCopy: ["Priya Shah", "priya.shah@example.com", "Regional operations lead"],
    absentCopy: [],
  },
  {
    refId: "FICR-007",
    label: "magnified name-only review",
    route: "/design-system/canonical-renderings/form-image-card/FICR-007",
    expectedVariant: "name-only",
    expectedDir: "ltr",
    expectedTheme: "normal",
    expectedCopy: ["Amara Chen"],
    absentCopy: ["example.com", "Regional operations lead"],
  },
] as const;

async function gotoCanonicalState(page: Page, route: string) {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto(route);
  await page.locator('#form-image-card-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

async function expectSquareMediaAndNoOverflow(page: Page) {
  const geometry = await page.locator("[data-form-image-card]").evaluate((node) => {
    const cardRect = node.getBoundingClientRect();
    const mediaRect = node.querySelector<HTMLElement>("[data-form-image-card-media]")?.getBoundingClientRect();
    const shellRect = document.querySelector("#form-image-card-preview-shell")?.getBoundingClientRect();
    return {
      cardLeft: cardRect.left,
      cardRight: cardRect.right,
      shellLeft: shellRect?.left ?? 0,
      shellRight: shellRect?.right ?? 0,
      mediaWidth: mediaRect?.width ?? 0,
      mediaHeight: mediaRect?.height ?? 0,
    };
  });

  expect(geometry.cardLeft).toBeGreaterThanOrEqual(geometry.shellLeft - 1);
  expect(geometry.cardRight).toBeLessThanOrEqual(geometry.shellRight + 1);
  expect(geometry.mediaWidth).toBeGreaterThan(70);
  expect(Math.abs(geometry.mediaWidth - geometry.mediaHeight)).toBeLessThanOrEqual(1);
}

test.describe("design-system form image card canonical states", () => {
  test("launcher exposes form-image-card refs on dedicated generated render routes", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/form-image-card");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(7);
    await expect(page.getByRole("link", { name: /FICR-001 Picture-only square image card/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/form-image-card/FICR-001",
    );
    await expect(page.getByRole("link", { name: /FICR-002 Image plus name/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/form-image-card/FICR-002",
    );
    await expect(page.getByRole("link", { name: /FICR-003 Image plus name, email, and job title/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/form-image-card/FICR-003",
    );
  });

  test("static canonical launcher points at dedicated generated render routes", async ({ page }) => {
    await page.goto("/design-system/canonicals/form-image-card");

    const links = await page.locator(".canonical-launcher-button").evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")));
    expect(links).toContain("/design-system/canonical-renderings/form-image-card/FICR-001");
    expect(links).toContain("/design-system/canonical-renderings/form-image-card/FICR-002");
    expect(links).toContain("/design-system/canonical-renderings/form-image-card/FICR-003");
    expect(links).toContain("/design-system/canonical-renderings/form-image-card/FICR-007");
  });

  for (const scenario of formImageCardCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      await expectRouteSurfaceTruth(page, {
        expectedPath: scenario.route,
        surfaceLocator: "#form-image-card-preview-shell",
        waitForReadyLocator: '#form-image-card-preview-shell[data-render-status="ready"]',
        bodyAttribute: { name: "data-form-image-card-surface", value: "canonical" },
        fallbackHeading: /Design-System Route Families/i,
      });

      const card = page.locator("[data-form-image-card]");
      await expect(page.locator("#form-image-card-canonical-current")).toContainText(scenario.refId);
      await expect(card).toHaveAttribute("data-form-image-card-variant", scenario.expectedVariant);
      await expect(page.locator("#form-image-card-preview-shell")).toHaveAttribute("dir", scenario.expectedDir);
      await expect(page.locator("#form-image-card-preview-frame")).toHaveAttribute("data-theme-scope", scenario.expectedTheme);

      for (const copy of scenario.expectedCopy) {
        await expect(card).toContainText(copy);
      }

      for (const copy of scenario.absentCopy) {
        await expect(card).not.toContainText(copy);
      }

      if (scenario.expectedVariant === "image-only") {
        await expect(card.locator(".form-image-card-copy")).toHaveCount(0);
      } else {
        await expect(card.locator(".form-image-card-copy")).toHaveCount(1);
      }

      await expectSquareMediaAndNoOverflow(page);
    });
  }

  test("edit affordance remains attached to the image on hover and keyboard focus", async ({ page }) => {
    await gotoCanonicalState(page, "/design-system/canonical-renderings/form-image-card/FICR-003");

    const media = page.locator("[data-form-image-card-media]");
    const editButton = page.locator("[data-form-image-card-edit]");
    await expect(editButton).toHaveAccessibleName("Edit profile image for Priya Shah");
    await expect(editButton).toHaveCSS("opacity", "0");

    await media.hover();
    await expect(editButton).toHaveCSS("opacity", "1");

    await editButton.focus();
    await expect(editButton).toHaveCSS("opacity", "1");
  });

  test("component surface consumes the shared renderer and exposes canonical metadata", async ({ page }) => {
    await gotoCanonicalState(page, "/design-system/components/form-image-card?ref=FICR-002&variant=name-only&width=520");

    await expect(page.locator("#form-image-card-canonical-current")).toContainText("FICR-002");
    await expect(page.locator("[data-form-image-card]")).toHaveAttribute("data-form-image-card-variant", "name-only");
    await expect(page.locator("[data-form-image-card]")).toContainText("Amara Chen");
    await expect(page.locator("#form-image-card-canonical-match-list")).toContainText("FICR-002");
  });
});
