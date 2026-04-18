import { expect, test, type Page } from "@playwright/test";

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

async function gotoCanonicalState(page: Page, route: string) {
  const resolvedRoute = new URL(route, "http://localhost");
  const requestedWidth = Number.parseInt(resolvedRoute.searchParams.get("width") ?? "0", 10);
  const viewportWidth = Math.max(requestedWidth + 360, 1280);

  await page.setViewportSize({ width: viewportWidth, height: 1400 });
  await page.goto(route);
  await page.locator('#date-picker-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system date picker canonical states", () => {
  test("launcher exposes the full DTPR set on the dedicated render surface", async ({ page }) => {
    await page.goto("/design-system/canonicals/date-picker");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(10);
    await expect(launcherButtons.nth(0)).toHaveAttribute("href", /\/design-system\/components\/date-picker\?/);
    await expect(page.getByRole("link", { name: /DTPR-002 Date-range staged start-selection state with Done disabled/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /DTPR-004 Range-with-time open state with nested time-picker overlap/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /DTPR-007 Mobile full-screen date-range overlay/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /DTPR-010 Dark-theme and magnified range review/i })).toBeVisible();
  });

  for (const scenario of datePickerCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      await expect(page.locator("body")).toHaveAttribute("data-date-picker-surface", "canonical");
      await expect(page.locator("#date-picker-canonical-current")).toContainText(scenario.refId);
      await expect(page.locator("#date-picker-preview-shell")).toBeVisible();
    });
  }

  test("DTPR-004 and DTPR-007 keep nested overlap and mobile overlay truthful on the dedicated surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/date-picker?ref=DTPR-004&width=980&state=range-time-nested-open&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#date-picker-range-time-trigger")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#date-picker-start-time-trigger")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#date-picker-range-time-field [data-form-date-panel]")).toBeVisible();
    await expect(page.locator("#date-picker-range-time-field [data-form-time-panel]").first()).toBeVisible();

    await gotoCanonicalState(
      page,
      "/design-system/components/date-picker?ref=DTPR-007&width=430&state=range-mobile-open&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#date-picker-preview-shell")).toHaveAttribute("data-form-mobile-view", "true");
    await expect(page.locator("#date-picker-range-field [data-form-date-panel]")).toBeVisible();
  });
});
