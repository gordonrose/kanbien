import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/textarea-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("textarea-control primitive route", () => {
  test("renders a native labelled textarea with governed growth", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Textarea Control Primitive", level: 1 })).toBeVisible();
    const textarea = page.locator("[data-textarea-control-input]").first();
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveAttribute("rows", "1");
    await expect(textarea).toHaveAttribute("aria-labelledby", "textarea-control-proof-label");
    await expect(textarea).toHaveAttribute("aria-describedby", "textarea-control-proof-helper");
    await expect(page.getByText("--textarea-growth-one-line")).toBeVisible();
    await expect.poll(() => textarea.evaluate((element) => window.getComputedStyle(element).maxHeight)).toBe("430px");
  });

  test("review controls change growth, state, direction, and constrained width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const host = page.locator("[data-textarea-review-width]").first();
    const textarea = page.locator("[data-textarea-control-input]").first();

    await page.locator("[data-textarea-growth-control]").selectOption("paragraph");
    await page.locator("[data-textarea-state-control]").selectOption("error");
    await page.locator("[data-textarea-direction-control]").selectOption("rtl");
    await page.locator("[data-textarea-width-control]").selectOption("narrow");

    await expect(textarea).toHaveAttribute("rows", "15");
    await expect(textarea).toHaveAttribute("aria-invalid", "true");
    await expect(textarea).toHaveAttribute("aria-describedby", "textarea-control-proof-error");
    await expect(textarea).toHaveCSS("background-color", "rgb(255, 247, 247)");
    await expect(textarea).toHaveCSS("border-color", "rgb(217, 74, 74)");
    await expect(textarea).toHaveCSS("color", "rgb(122, 31, 31)");
    await expect(page.locator("[data-field-row-control-message='error']")).toHaveCSS("color", "rgb(122, 31, 31)");
    await expect(host).toHaveAttribute("dir", "rtl");
    await expect(host).toHaveAttribute("data-textarea-review-width", "narrow");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("renders native state evidence for every allowed state", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    const textarea = page.locator("[data-textarea-control-input]").first();
    const states = [
      ["default", null, null, null, "false"],
      ["required", "", null, null, "false"],
      ["read-only", null, "", null, "false"],
      ["disabled", null, null, "", "false"],
      ["error", null, null, null, "true"],
    ] as const;

    for (const [state, required, readonly, disabled, invalid] of states) {
      await page.locator("[data-textarea-state-control]").selectOption(state);
      await expect(textarea).toHaveAttribute("data-textarea-control-state", state);
      if (required === null) {
        await expect(textarea).not.toHaveAttribute("required", /.*/);
      } else {
        await expect(textarea).toHaveAttribute("required", required);
      }
      if (readonly === null) {
        await expect(textarea).not.toHaveAttribute("readonly", /.*/);
      } else {
        await expect(textarea).toHaveAttribute("readonly", readonly);
      }
      if (disabled === null) {
        await expect(textarea).not.toHaveAttribute("disabled", /.*/);
      } else {
        await expect(textarea).toHaveAttribute("disabled", disabled);
      }
      if (invalid === "true") {
        await expect(textarea).toHaveAttribute("aria-invalid", "true");
        await expect(textarea).toHaveAttribute("aria-describedby", "textarea-control-proof-error");
      } else {
        await expect(textarea).not.toHaveAttribute("aria-invalid", /.*/);
      }
      await expect(page.locator(".token-spec-definition-grid").getByText(`aria-invalid${invalid}`)).toBeVisible();
    }
  });

  test("auto-growth preserves an internal scroll cap and label tooltip disclosure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const textarea = page.locator("[data-textarea-control-input]").first();
    const label = page.locator("[data-truncating-label]").first();
    const tooltip = label.locator("[data-truncating-label-tooltip]");

    await page.locator("[data-textarea-growth-control]").selectOption("one-line");
    await page.locator("[data-textarea-value-control]").selectOption("overflow");
    await page.locator("[data-textarea-label-control]").selectOption("long");
    await page.locator("[data-textarea-width-control]").selectOption("narrow");

    await expect(label).toHaveAttribute("data-truncating-label-overflow", "true");
    await label.focus();
    await expect(label).toHaveAttribute("data-truncating-label-open", "true");
    await expect(tooltip).toContainText("Description fallback with long localized label text");
    await expect(tooltip).toHaveCSS("opacity", "1");

    const scrollEvidence = await textarea.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      maxHeight: window.getComputedStyle(element).maxHeight,
      overflowY: window.getComputedStyle(element).overflowY,
    }));
    expect(scrollEvidence.scrollHeight).toBeGreaterThan(scrollEvidence.clientHeight);
    expect(scrollEvidence.maxHeight).toBe("422px");
    expect(scrollEvidence.overflowY).toBe("auto");

    await page.keyboard.press("Escape");
    await expect(label).toHaveAttribute("data-truncating-label-open", "false");
  });
});
