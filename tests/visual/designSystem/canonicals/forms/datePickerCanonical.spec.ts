import { expect, test, type Page } from "@playwright/test";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";
import { expectContainedWithin } from "../../support/helpers/humanReviewGuards";

const datePickerCanonicalStates = [
  {
    refId: "DTPR-001",
    label: "single-date resting trigger and anchored one-month panel",
    route: "/design-system/components/date-picker?ref=DTPR-001&width=520&state=single-open&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "DTPR-002",
    label: "date-range staged start-selection state with done disabled",
    route: "/design-system/components/date-picker?ref=DTPR-002&width=980&state=range-staged&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "DTPR-003",
    label: "date-range completed state after reverse-order normalization",
    route: "/design-system/components/date-picker?ref=DTPR-003&width=980&state=range-normalized&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "DTPR-004",
    label: "range-with-time open state with nested time-picker overlap",
    route: "/design-system/components/date-picker?ref=DTPR-004&width=980&state=range-time-nested-open&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "DTPR-005",
    label: "range-with-time outer label after nested time edits",
    route: "/design-system/components/date-picker?ref=DTPR-005&width=980&state=range-time-label-sync&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "DTPR-006",
    label: "multi-month range navigation with anchored month and year jumps",
    route: "/design-system/components/date-picker?ref=DTPR-006&width=980&state=range-jump-review&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "DTPR-007",
    label: "mobile full-screen date-range overlay with sticky header and footer",
    route: "/design-system/components/date-picker?ref=DTPR-007&width=430&state=range-mobile-open&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "DTPR-008",
    label: "rtl mobile overlay with mirrored previous and next glyphs",
    route: "/design-system/components/date-picker?ref=DTPR-008&width=430&state=range-mobile-open&theme=normal&dir=rtl&zoom=0",
  },
  {
    refId: "DTPR-009",
    label: "hidden closed-state guarantee under mobile overlay rules",
    route: "/design-system/components/date-picker?ref=DTPR-009&width=430&state=mobile-hidden&theme=normal&dir=rtl&zoom=0",
  },
  {
    refId: "DTPR-010",
    label: "dark-theme and magnified range review",
    route: "/design-system/components/date-picker?ref=DTPR-010&width=980&state=range-stress-open&theme=dark&dir=ltr&zoom=100",
  },
] as const;

function routeForDatePickerRef(referenceId: string) {
  return `/design-system/canonical-renderings/date-picker/${referenceId}`;
}

async function gotoCanonicalState(page: Page, route: string) {
  await page.setViewportSize({ width: 1360, height: 1400 });
  await page.goto(route);
  await page.locator('#date-picker-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system date picker canonical states", () => {
  test("launcher exposes the full DTPR set on the dedicated render surface", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/date-picker");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(10);
    await expect(page.getByRole("link", { name: /DTPR-002 Date-range staged start-selection state with Done disabled/i })).toHaveAttribute(
      "href",
      routeForDatePickerRef("DTPR-002"),
    );
    await expect(page.getByRole("link", { name: /DTPR-004 Range-with-time open state with nested time-picker overlap/i })).toHaveAttribute(
      "href",
      routeForDatePickerRef("DTPR-004"),
    );
    await expect(page.getByRole("link", { name: /DTPR-007 Mobile full-screen date-range overlay/i })).toHaveAttribute(
      "href",
      routeForDatePickerRef("DTPR-007"),
    );
    await expect(page.getByRole("link", { name: /DTPR-010 Dark-theme and magnified range review/i })).toHaveAttribute(
      "href",
      routeForDatePickerRef("DTPR-010"),
    );
  });

  test("launcher cards open the dedicated canonical rendering surface", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/date-picker");

    await page.getByRole("link", { name: /DTPR-004 Range-with-time open state with nested time-picker overlap/i }).click();

    await expectRouteSurfaceTruth(page, {
      expectedPath: routeForDatePickerRef("DTPR-004"),
      surfaceLocator: "#date-picker-preview-shell",
      waitForReadyLocator: '#date-picker-preview-shell[data-render-status="ready"]',
      bodyAttribute: { name: "data-date-picker-surface", value: "canonical" },
      fallbackHeading: /Design-System Route Families/i,
    });
    await expect(page.locator("#date-picker-canonical-current")).toContainText("DTPR-004");
  });

  for (const scenario of datePickerCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      const route = routeForDatePickerRef(scenario.refId);
      await gotoCanonicalState(page, route);

      await expectRouteSurfaceTruth(page, {
        expectedPath: route,
        surfaceLocator: "#date-picker-preview-shell",
        waitForReadyLocator: '#date-picker-preview-shell[data-render-status="ready"]',
        bodyAttribute: { name: "data-date-picker-surface", value: "canonical" },
        fallbackHeading: /Design-System Route Families/i,
      });
      await expect(page.locator("#date-picker-canonical-current")).toContainText(scenario.refId);
    });
  }

  test("DTPR-004 and DTPR-007 keep nested overlap and mobile overlay truthful on the dedicated surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      routeForDatePickerRef("DTPR-004"),
    );

    await expect(page.locator("#date-picker-range-time-trigger")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#date-picker-start-time-trigger")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#date-picker-range-time-field [data-form-date-panel]")).toBeVisible();
    await expect(page.locator("#date-picker-range-time-field [data-form-time-panel]").first()).toBeVisible();

    await gotoCanonicalState(
      page,
      routeForDatePickerRef("DTPR-007"),
    );

    await expect(page.locator("#date-picker-preview-shell")).toHaveAttribute("data-form-mobile-view", "true");
    const datePanel = page.locator("#date-picker-range-field [data-form-date-panel]");
    await expect(datePanel).toBeVisible();
    await expectContainedWithin(
      datePanel,
      page.locator("#date-picker-preview-frame"),
      {
        subjectLabel: "DTPR-007 mobile date-picker overlay",
        containerLabel: "date-picker canonical review frame",
      },
    );
  });

  test("DTPR-008 and DTPR-010 keep direction, theme, and magnification scoped to the render surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      routeForDatePickerRef("DTPR-008"),
    );

    const rtlState = await page.evaluate(() => ({
      documentDir: document.documentElement.getAttribute("dir"),
      surfaceDir: document.querySelector("#date-picker-preview-shell")?.getAttribute("dir"),
    }));

    expect(rtlState.documentDir).not.toBe("rtl");
    expect(rtlState.surfaceDir).toBe("rtl");

    await gotoCanonicalState(
      page,
      routeForDatePickerRef("DTPR-010"),
    );

    const themeState = await page.evaluate(() => {
      const frame = document.querySelector("#date-picker-preview-frame");
      const shell = document.querySelector("#date-picker-preview-shell");

      return {
        documentTheme: document.documentElement.dataset.theme ?? "",
        frameTheme: frame instanceof HTMLElement ? frame.dataset.themeScope ?? "" : "",
        documentScale: document.documentElement.style.getPropertyValue("--ui-scale"),
        shellScale: shell instanceof HTMLElement ? shell.style.getPropertyValue("--ui-scale") : "",
      };
    });

    expect(themeState.documentTheme).toBe("");
    expect(themeState.frameTheme).toBe("dark");
    expect(themeState.documentScale).toBe("");
    expect(themeState.shellScale).toBe("1.5");
  });
});
