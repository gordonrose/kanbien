import { expect, test } from "@playwright/test";

test.describe("design-system date picker child seam", () => {
  test("single-date stays quick: selecting a day closes the panel and restores focus", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const picker = page.locator('[data-form-date-picker][data-picker-mode="single"]');
    const trigger = picker.locator("[data-form-date-button]");
    const panel = picker.locator("[data-form-date-panel]");

    await trigger.click();
    await expect(panel).toBeVisible();

    await panel.locator('[data-form-date-day][data-date="2026-04-28"]').click();

    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(picker.locator("[data-form-date-current-label]")).toHaveText("Apr 28, 2026");
  });

  test("range picker preserves staged selection, reverse normalization, and Done gating", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const picker = page.locator('[data-form-date-picker][data-picker-mode="range"]');
    const trigger = picker.locator("[data-form-date-button]");
    const panel = picker.locator("[data-form-date-panel]");
    const doneButton = picker.locator("[data-form-date-done]");
    const summary = picker.locator("[data-form-date-range-summary]");
    const startInput = picker.locator("[data-form-date-start-value]");
    const endInput = picker.locator("[data-form-date-end-value]");

    await trigger.click();
    await expect(panel).toBeVisible();

    await panel.locator('[data-form-date-day][data-date="2026-05-12"]').click();

    await expect(panel).toBeVisible();
    await expect(doneButton).toBeDisabled();
    await expect(summary).toContainText("Start selected: May 12, 2026. Choose an end date next.");
    await expect(startInput).toHaveValue("2026-05-12");
    await expect(endInput).toHaveValue("");

    await panel.locator('[data-form-date-day][data-date="2026-05-08"]').click();

    await expect(doneButton).toBeEnabled();
    await expect(summary).toContainText("Selected range: May 8, 2026 through May 12, 2026.");
    await expect(startInput).toHaveValue("2026-05-08");
    await expect(endInput).toHaveValue("2026-05-12");
    await expect(picker.locator("[data-form-date-current-label]")).toHaveText("May 8, 2026 - May 12, 2026");

    await doneButton.click();

    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("range-with-time keeps the parent panel open and syncs the outer label after nested time edits", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const picker = page.locator('[data-form-date-picker][data-picker-mode="range-time"]');
    const datePanel = picker.locator("[data-form-date-panel]");
    const trigger = picker.locator("[data-form-date-button]");
    const startTimeField = picker.locator(".form-date-time-field").first();
    const nestedTimeTrigger = startTimeField.locator("[data-form-time-button]");
    const nestedTimePanel = startTimeField.locator("[data-form-time-panel]");

    await trigger.click();
    await expect(datePanel).toBeVisible();

    await nestedTimeTrigger.click();
    await expect(datePanel).toBeVisible();
    await expect(nestedTimePanel).toBeVisible();

    await nestedTimePanel.locator('[data-form-time-hour="11"]').click();
    await expect(nestedTimePanel).toBeVisible();
    await nestedTimePanel.locator('[data-form-time-minute="30"]').click();

    await expect(nestedTimePanel).toBeHidden();
    await expect(datePanel).toBeVisible();
    await expect(picker.locator("[data-form-date-current-label]")).toHaveText(
      "May 4, 2026 11:30 AM - May 10, 2026 5:00 PM",
    );
  });

  test("multi-month range preserves anchored month and year jump controls at both edges", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const picker = page.locator('[data-form-date-picker][data-picker-mode="range"]').first();
    const trigger = picker.locator("[data-form-date-button]");
    const panel = picker.locator("[data-form-date-panel]");

    await trigger.click();
    await expect(panel).toBeVisible();
    await expect(panel.locator("[data-form-date-jump-button]")).toHaveCount(4);

    const monthSections = panel.locator(".form-date-month");
    await expect(monthSections.nth(0)).toHaveAttribute("aria-label", "April 2026");
    await expect(monthSections.nth(2)).toHaveAttribute("aria-label", "June 2026");

    const startMonthJump = panel.locator('[data-form-date-jump-button][data-form-date-jump-anchor="start"][data-form-date-jump-kind="month"]');
    await startMonthJump.click();
    await panel.locator('[data-form-date-jump-option][data-form-date-jump-anchor="start"][data-form-date-jump-kind="month"][data-value="6"]').click();

    await expect(monthSections.nth(0)).toHaveAttribute("aria-label", "July 2026");
    await expect(monthSections.nth(2)).toHaveAttribute("aria-label", "September 2026");

    const endMonthJump = panel.locator('[data-form-date-jump-button][data-form-date-jump-anchor="end"][data-form-date-jump-kind="month"]');
    await endMonthJump.click();
    await panel.locator('[data-form-date-jump-option][data-form-date-jump-anchor="end"][data-form-date-jump-kind="month"][data-value="10"]').click();

    await expect(monthSections.nth(0)).toHaveAttribute("aria-label", "September 2026");
    await expect(monthSections.nth(2)).toHaveAttribute("aria-label", "November 2026");
  });

  test("dark-theme magnified range review keeps jump controls, summary, and Done footer readable", async ({ page }) => {
    await page.goto("/design-system/templates/form?theme=dark&dir=ltr&zoom=100");

    const html = page.locator("html");
    const picker = page.locator('[data-form-date-picker][data-picker-mode="range"]').first();
    const trigger = picker.locator("[data-form-date-button]");
    const panel = picker.locator("[data-form-date-panel]");
    const summary = picker.locator("[data-form-date-range-summary]");
    const doneButton = picker.locator("[data-form-date-done]");
    const jumpButtons = panel.locator("[data-form-date-jump-button]");

    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(panel).toBeVisible();
    await expect(summary).toBeVisible();
    await expect(doneButton).toBeVisible();
    await expect(jumpButtons).toHaveCount(4);

    const scale = await page.evaluate(() => document.documentElement.style.getPropertyValue("--ui-scale"));
    expect(scale).toBe("1.5");

    const geometry = await Promise.all([
      panel.boundingBox(),
      summary.boundingBox(),
      doneButton.boundingBox(),
      jumpButtons.nth(0).boundingBox(),
      jumpButtons.nth(3).boundingBox(),
    ]);

    const [panelBox, summaryBox, doneBox, firstJumpBox, lastJumpBox] = geometry;
    expect(panelBox).not.toBeNull();
    expect(summaryBox).not.toBeNull();
    expect(doneBox).not.toBeNull();
    expect(firstJumpBox).not.toBeNull();
    expect(lastJumpBox).not.toBeNull();

    expect(summaryBox!.y).toBeGreaterThanOrEqual(panelBox!.y);
    expect(doneBox!.y + doneBox!.height).toBeLessThanOrEqual(panelBox!.y + panelBox!.height + 2);
    expect(firstJumpBox!.x).toBeGreaterThanOrEqual(panelBox!.x);
    expect(lastJumpBox!.x + lastJumpBox!.width).toBeLessThanOrEqual(panelBox!.x + panelBox!.width + 2);
  });

  test("mobile RTL keeps unopened panels hidden and opens the active range picker as a full-screen overlay", async ({ page }) => {
    await page.goto("/design-system/templates/form?mobile=true&dir=rtl&theme=normal&zoom=0");

    const singlePicker = page.locator('[data-form-date-picker][data-picker-mode="single"]');
    const rangePicker = page.locator('[data-form-date-picker][data-picker-mode="range"]');
    const timePicker = page.locator(".form-time-picker").first();
    const rangeTrigger = rangePicker.locator("[data-form-date-button]");
    const rangePanel = rangePicker.locator("[data-form-date-panel]");
    const prevButton = rangePanel.locator('[data-form-date-nav="-1"]');
    const nextButton = rangePanel.locator('[data-form-date-nav="1"]');

    await expect(singlePicker.locator("[data-form-date-panel]")).toBeHidden();
    await expect(timePicker.locator("[data-form-time-panel]")).toBeHidden();

    await rangeTrigger.click();
    await expect(rangePanel).toBeVisible();
    await expect(singlePicker.locator("[data-form-date-panel]")).toBeHidden();
    await expect(timePicker.locator("[data-form-time-panel]")).toBeHidden();

    const overlayState = await rangePanel.evaluate((node) => {
      const styles = window.getComputedStyle(node);
      return {
        position: styles.position,
        top: styles.top,
        left: styles.left,
        right: styles.right,
        bottom: styles.bottom,
        height: styles.height,
      };
    });

    expect(overlayState.position).toBe("fixed");
    expect(overlayState.top).toBe("0px");
    expect(overlayState.left).toBe("0px");
    expect(overlayState.right).toBe("0px");
    expect(overlayState.bottom).toBe("0px");
    expect(overlayState.height).not.toBe("0px");

    const navGlyphs = await Promise.all([
      prevButton.evaluate((node) => window.getComputedStyle(node, "::before").content),
      nextButton.evaluate((node) => window.getComputedStyle(node, "::before").content),
    ]);

    expect(navGlyphs).toEqual(['"›"', '"‹"']);

    await page.keyboard.press("Escape");
    await expect(rangePanel).toBeHidden();
    await expect(rangeTrigger).toBeFocused();
  });
});
