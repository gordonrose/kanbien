import { expect, test } from "@playwright/test";

test.describe("design-system dropdown token", () => {
  test("renders the dropdown token route and preserves anchored listbox behavior", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/design-system/tokens/dropdowns");

    await expect(page.locator("[data-token-layer-surface='dropdowns']")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Dropdowns Token" })).toBeVisible();

    const firstSelect = page.locator("[data-token-simple-dropdown]").first();
    const trigger = firstSelect.locator("[data-form-select-button]");
    const listbox = firstSelect.locator("[data-form-select-listbox]");
    const hiddenInput = firstSelect.locator("[data-form-select-value]");

    await expect(trigger.locator(".token-simple-dropdown-trigger-label")).toHaveText("Layer");
    await expect(trigger.locator("[data-form-select-current-label]")).toHaveText("Current");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(listbox).toBeVisible();

    const openGeometry = await firstSelect.evaluate((root) => {
      if (!(root instanceof HTMLElement)) {
        return null;
      }

      const triggerNode = root.querySelector("[data-form-select-button]");
      const listboxNode = root.querySelector("[data-form-select-listbox]");
      if (!(triggerNode instanceof HTMLElement) || !(listboxNode instanceof HTMLElement)) {
        return null;
      }

      const triggerBox = triggerNode.getBoundingClientRect();
      const listboxBox = listboxNode.getBoundingClientRect();

      return {
        listboxStartsBelowTrigger: listboxBox.top >= triggerBox.bottom,
        listboxMatchesTriggerWidth: Math.abs(listboxBox.width - triggerBox.width) < 2,
        listboxInsideViewport: listboxBox.left >= 0 && listboxBox.right <= window.innerWidth,
      };
    });

    expect(openGeometry).not.toBeNull();
    expect(openGeometry?.listboxStartsBelowTrigger).toBe(true);
    expect(openGeometry?.listboxMatchesTriggerWidth).toBe(true);
    expect(openGeometry?.listboxInsideViewport).toBe(true);

    await firstSelect.getByRole("option", { name: "Archived" }).click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(hiddenInput).toHaveValue("archived");
    await expect(trigger.locator(".token-simple-dropdown-trigger-label")).toHaveText("Layer");
    await expect(trigger.locator("[data-form-select-current-label]")).toHaveText("Archived");
  });

  test("keeps theme, disabled, overflow, and RTL states honest", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/design-system/tokens/dropdowns?theme=dark&dir=rtl&zoom=100");

    const state = await page.evaluate(() => {
      const darkPreview = document.querySelector("[data-theme-scope='dark'] [data-token-simple-dropdown]");
      const desertPreview = document.querySelector("[data-theme-scope='desert'] [data-token-simple-dropdown]");
      const disabledTrigger = document.querySelector(".token-simple-dropdown-disabled [data-form-select-button]");
      const longTrigger = document.querySelector("#dropdown-token-long-trigger");
      const rtlSample = document.querySelector("[data-token-simple-dropdown-rtl]");
      const controls = Array.from(document.querySelectorAll("[data-token-simple-dropdown]"));
      const embeddedLabels = Array.from(document.querySelectorAll(".token-simple-dropdown-trigger-label"));
      const externalLabels = Array.from(document.querySelectorAll(".token-simple-dropdown-field > .form-field-label"));

      if (
        !(darkPreview instanceof HTMLElement)
        || !(desertPreview instanceof HTMLElement)
        || !(disabledTrigger instanceof HTMLButtonElement)
        || !(longTrigger instanceof HTMLElement)
        || !(rtlSample instanceof HTMLElement)
        || controls.some((control) => !(control instanceof HTMLElement))
        || embeddedLabels.some((label) => !(label instanceof HTMLElement))
      ) {
        return null;
      }

      const longTriggerBox = longTrigger.getBoundingClientRect();
      const longValue = longTrigger.querySelector("[data-form-select-current-label]");
      const allInsideViewport = controls.every((control) => {
        const box = control.getBoundingClientRect();
        return box.left >= -1 && box.right <= window.innerWidth + 1;
      });

      return {
        darkHasScopedTheme: darkPreview.closest("[data-theme-scope='dark']") !== null,
        desertHasScopedTheme: desertPreview.closest("[data-theme-scope='desert']") !== null,
        disabled: disabledTrigger.disabled && disabledTrigger.getAttribute("aria-disabled") === "true",
        labelsAreInsideTrigger: embeddedLabels.length >= controls.length && externalLabels.length === 0,
        longLabelClippedInsideTrigger: longValue instanceof HTMLElement
          && longValue.scrollWidth > longValue.clientWidth
          && longValue.getBoundingClientRect().right <= longTriggerBox.right,
        rtlDirection: getComputedStyle(rtlSample).direction,
        allInsideViewport,
      };
    });

    expect(state).not.toBeNull();
    expect(state?.darkHasScopedTheme).toBe(true);
    expect(state?.desertHasScopedTheme).toBe(true);
    expect(state?.disabled).toBe(true);
    expect(state?.labelsAreInsideTrigger).toBe(true);
    expect(state?.longLabelClippedInsideTrigger).toBe(true);
    expect(state?.rtlDirection).toBe("rtl");
    expect(state?.allInsideViewport).toBe(true);
  });
});
