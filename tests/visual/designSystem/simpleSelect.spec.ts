import { expect, test } from "@playwright/test";

test.describe("design-system simple select seam", () => {
  test("keeps the anchored listbox contract on open, option focus, arrow traversal, selection, escape, and outside click", async ({ page }) => {
    await page.goto("/design-system/templates/form");

    const trigger = page.locator("[data-form-select-button]").first();
    const listbox = page.locator("[data-form-select-listbox]").first();
    const valueInput = page.locator("[data-form-select-value]").first();
    const trialOption = page.locator("[data-form-select-option]").nth(1);
    const enterpriseOption = page.locator("[data-form-select-option]").nth(2);
    const outsideField = page.getByRole("textbox", { name: /^Text field\b/i });

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(listbox).toBeHidden();

    await trigger.click();

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(listbox).toBeVisible();
    await expect(page.locator("[data-form-select-option][aria-selected='true']").first()).toBeFocused();

    const geometry = await page.evaluate(() => {
      const triggerNode = document.querySelector("[data-form-select-button]");
      const listboxNode = document.querySelector("[data-form-select-listbox]");

      if (!(triggerNode instanceof HTMLElement) || !(listboxNode instanceof HTMLElement)) {
        return null;
      }

      const triggerBox = triggerNode.getBoundingClientRect();
      const listboxBox = listboxNode.getBoundingClientRect();

      return {
        topDelta: Math.round(listboxBox.top - triggerBox.bottom),
        leftDelta: Math.round(Math.abs(listboxBox.left - triggerBox.left)),
        widthDelta: Math.round(Math.abs(listboxBox.width - triggerBox.width)),
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.topDelta ?? -1).toBeGreaterThanOrEqual(4);
    expect(geometry?.leftDelta ?? 999).toBeLessThanOrEqual(2);
    expect(geometry?.widthDelta ?? 999).toBeLessThanOrEqual(2);

    await page.keyboard.press("ArrowDown");
    await expect(trialOption).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(enterpriseOption).toBeFocused();

    await page.keyboard.press("ArrowUp");
    await expect(trialOption).toBeFocused();

    await trialOption.click();

    await expect(listbox).toBeHidden();
    await expect(trigger).toHaveText(/Trial tenants/);
    await expect(valueInput).toHaveValue("trial-tenants");
    await expect(trialOption).toHaveAttribute("aria-selected", "true");
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(listbox).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(listbox).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(listbox).toBeVisible();
    await outsideField.click();
    await expect(listbox).toBeHidden();
    await expect(outsideField).toBeFocused();

    await trigger.click();
    await enterpriseOption.click();
    await expect(valueInput).toHaveValue("enterprise-tenants");
    await expect(trigger).toHaveText(/Enterprise tenants/);
  });

  test("stays truthful under rtl, dark-theme, and disabled inherited review states", async ({ page }) => {
    await page.goto("/design-system/templates/form?theme=dark&dir=rtl&zoom=0");

    const html = page.locator("html");
    const trigger = page.locator("[data-form-select-button]").first();
    const listbox = page.locator("[data-form-select-listbox]").first();

    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(html).toHaveAttribute("data-theme", "dark");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(listbox).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(listbox).toBeHidden();
    await expect(trigger).toBeFocused();

    await page.goto("/design-system/templates/form?theme=normal&dir=ltr&zoom=0&disabled=true");

    const disabledTrigger = page.locator("[data-form-select-button]").first();
    const disabledListbox = page.locator("[data-form-select-listbox]").first();

    await expect(disabledTrigger).toBeDisabled();
    await expect(disabledListbox).toBeHidden();
  });
});
