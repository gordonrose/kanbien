import { expect, test, type Page } from "@playwright/test";

import {
  expectContainedWithin,
  withHumanReviewGuard,
} from "../support/helpers/humanReviewGuards";

async function gotoLauncherTemplate(page: Page, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.goto("/design-system/templates/launcher");
  await page.locator(".launcher-template-panel").waitFor({ state: "visible" });
}

async function getLauncherColumnCount(page: Page) {
  return page.locator(".launcher-template-grid").evaluate((node) => {
    const columns = getComputedStyle(node).gridTemplateColumns
      .split(" ")
      .map((entry) => entry.trim())
      .filter(Boolean);

    return columns.length;
  });
}

async function openDisplaySettings(page: Page) {
  await page.locator("#accessibility-button").click();
  await page.locator("#accessibility-drawer").waitFor({ state: "visible" });
}

async function applyDirection(page: Page, direction: "ltr" | "rtl") {
  await openDisplaySettings(page);
  await page.locator(`[data-direction-option="${direction}"]`).click();
  await expect(page.locator("html")).toHaveAttribute("dir", direction);
}

async function applyMagnification(page: Page, amount: "-100" | "-50" | "0" | "50" | "100") {
  await openDisplaySettings(page);
  await page.locator(`[data-magnification-option="${amount}"]`).click();

  const expectedScale = String(1 + Number(amount) / 200);
  await expect
    .poll(async () => page.locator("html").evaluate((node) => node.style.getPropertyValue("--ui-scale").trim()))
    .toBe(amount === "0" ? "" : expectedScale);
}

async function expectLauncherGridContained(page: Page, label: string) {
  await withHumanReviewGuard(label, async () => {
    const panel = page.locator(".launcher-template-panel");
    const grid = page.locator(".launcher-template-grid");
    const firstCard = page.locator(".launcher-template-grid .canonical-launcher-button").first();

    await expectContainedWithin(grid, panel, {
      epsilon: 1,
      subjectLabel: "launcher grid",
      containerLabel: "launcher panel",
    });
    await expectContainedWithin(firstCard, grid, {
      epsilon: 1,
      subjectLabel: "first launcher card",
      containerLabel: "launcher grid",
    });
  });
}

test.describe("design-system launcher template", () => {
  test("keeps the default desktop launcher grid at five columns", async ({ page }) => {
    await gotoLauncherTemplate(page, { width: 1560, height: 1200 });

    const columnCount = await getLauncherColumnCount(page);
    expect(columnCount).toBe(5);

    await expectLauncherGridContained(
      page,
      "launcher cards stay contained inside the launcher panel at the default desktop width",
    );
  });

  test("expands the launcher grid to eight columns on wide desktop without overflowing the panel", async ({ page }) => {
    await gotoLauncherTemplate(page, { width: 2048, height: 1280 });

    const columnCount = await getLauncherColumnCount(page);
    expect(columnCount).toBe(8);

    await expectLauncherGridContained(
      page,
      "wide launcher layouts use the extra lane width instead of leaving oversized five-column cards",
    );
  });

  test("keeps the default launcher baseline stable in rtl", async ({ page }) => {
    await gotoLauncherTemplate(page, { width: 1560, height: 1200 });
    await applyDirection(page, "rtl");

    const columnCount = await getLauncherColumnCount(page);
    expect(columnCount).toBe(5);

    await expectLauncherGridContained(
      page,
      "rtl launcher layouts keep the five-column baseline without escaping the panel",
    );
  });

  test("keeps the wide launcher grid at eight columns when reviewers zoom out through display settings", async ({ page }) => {
    await gotoLauncherTemplate(page, { width: 2048, height: 1280 });
    await applyMagnification(page, "-100");

    const columnCount = await getLauncherColumnCount(page);
    expect(columnCount).toBe(8);

    await expectLauncherGridContained(
      page,
      "zoomed-out launcher review keeps the wide eight-column lane contained inside the panel",
    );
  });
});
