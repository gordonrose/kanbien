import { expect, test, type Page } from "@playwright/test";

const timePickerCanonicalStates = [
  {
    refId: "TPR-001",
    label: "standalone resting trigger with closed panel",
    route: "/design-system/components/time-picker?ref=TPR-001&width=420&state=baseline&theme=normal&dir=ltr&zoom=0",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-002",
    label: "standalone picker open with hour and minute columns",
    route: "/design-system/components/time-picker?ref=TPR-002&width=420&state=open&theme=normal&dir=ltr&zoom=0",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-003",
    label: "standalone quick-pick completion with close and focus return",
    route: "/design-system/components/time-picker?ref=TPR-003&width=420&state=completed&theme=normal&dir=ltr&zoom=0",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-004",
    label: "nested time picker open inside date range with time",
    route: "/design-system/components/time-picker?ref=TPR-004&width=760&state=nested-open&theme=normal&dir=ltr&zoom=0",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-005",
    label: "nested minute completion with composed outer-label sync",
    route: "/design-system/components/time-picker?ref=TPR-005&width=760&state=nested-sync&theme=normal&dir=ltr&zoom=0",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-006",
    label: "mobile standalone open overlay",
    route: "/design-system/components/time-picker?ref=TPR-006&width=390&state=mobile-open&theme=normal&dir=ltr&zoom=0",
    viewport: { width: 430, height: 1400 },
  },
  {
    refId: "TPR-007",
    label: "rtl mobile open overlay",
    route: "/design-system/components/time-picker?ref=TPR-007&width=390&state=mobile-open&theme=normal&dir=rtl&zoom=0",
    viewport: { width: 430, height: 1400 },
  },
  {
    refId: "TPR-008",
    label: "dark-theme standalone open-state review",
    route: "/design-system/components/time-picker?ref=TPR-008&width=420&state=open&theme=dark&dir=ltr&zoom=0",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-009",
    label: "rtl and magnified open-state review",
    route: "/design-system/components/time-picker?ref=TPR-009&width=420&state=open&theme=normal&dir=rtl&zoom=100",
    viewport: { width: 1600, height: 1400 },
  },
] as const;

async function gotoCanonicalState(page: Page, route: string, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.goto(route);
  await page.locator("#time-picker-preview-shell").waitFor({ state: "visible" });
}

test.describe("design-system time picker canonical states", () => {
  test("launcher exposes the full TPR set", async ({ page }) => {
    await page.goto("/design-system/canonicals/time-picker");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(9);
    await expect(page.getByRole("link", { name: /TPR-002 Standalone picker open with hour and minute columns/i })).toHaveAttribute(
      "href",
      "/design-system/components/time-picker?ref=TPR-002&width=420&state=open&theme=normal&dir=ltr&zoom=0",
    );
    await expect(page.getByRole("link", { name: /TPR-004 Nested time picker open inside date range with time/i })).toHaveAttribute(
      "href",
      "/design-system/components/time-picker?ref=TPR-004&width=760&state=nested-open&theme=normal&dir=ltr&zoom=0",
    );
    await expect(page.getByRole("link", { name: /TPR-006 Mobile standalone open overlay/i })).toHaveAttribute(
      "href",
      "/design-system/components/time-picker?ref=TPR-006&width=390&state=mobile-open&theme=normal&dir=ltr&zoom=0",
    );
    await expect(page.getByRole("link", { name: /TPR-008 Dark-theme standalone open-state review/i })).toHaveAttribute(
      "href",
      "/design-system/components/time-picker?ref=TPR-008&width=420&state=open&theme=dark&dir=ltr&zoom=0",
    );
  });

  for (const scenario of timePickerCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route, scenario.viewport);

      await expect(page.locator("#time-picker-preview-shell")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("dir", scenario.route.includes("dir=rtl") ? "rtl" : "ltr");
    });
  }

  test("priority canonical states are true on first load", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/time-picker?ref=TPR-004&width=760&state=nested-open&theme=normal&dir=ltr&zoom=0",
      { width: 1600, height: 1400 },
    );

    const standaloneRoot = page.locator("#time-picker-standalone-root");
    const standalonePanel = standaloneRoot.locator("[data-form-time-panel]");
    const rangeTimePanel = page.locator("#time-picker-range-host-panel");
    const nestedStartTimeRoot = page.locator("#time-picker-nested-root");
    const nestedStartTimePanel = nestedStartTimeRoot.locator("[data-form-time-panel]");

    await expect(rangeTimePanel).toBeVisible();
    await expect(nestedStartTimePanel).toBeVisible();
    await expect(standalonePanel).toBeHidden();

    await gotoCanonicalState(
      page,
      "/design-system/components/time-picker?ref=TPR-006&width=390&state=mobile-open&theme=normal&dir=ltr&zoom=0",
      { width: 430, height: 1400 },
    );

    await expect(standalonePanel).toBeVisible();
    const overlayState = await standalonePanel.evaluate((node) => {
      const style = window.getComputedStyle(node);
      return { position: style.position, top: style.top };
    });
    expect(overlayState.position).toBe("fixed");
    expect(overlayState.top).toBe("0px");

    await gotoCanonicalState(
      page,
      "/design-system/components/time-picker?ref=TPR-008&width=420&state=open&theme=dark&dir=ltr&zoom=0",
      { width: 1600, height: 1400 },
    );

    await expect(page.locator(".canonical-render-layout")).toHaveAttribute("data-theme-scope", "dark");
    await expect(standalonePanel).toBeVisible();
    await expect(standaloneRoot.locator('[data-form-time-hour="09"]')).toBeVisible();
    await expect(standaloneRoot.locator('[data-form-time-minute="30"]')).toBeVisible();
  });
});
