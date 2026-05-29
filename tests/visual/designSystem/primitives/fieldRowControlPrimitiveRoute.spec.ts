import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/field-row-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("field-row-control primitive route", () => {
  test("renders label and description IDs without creating a fake input", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Field Row Control Primitive", level: 1 })).toBeVisible();
    const fieldRow = page.locator("[data-field-row-control]").first();
    await expect(fieldRow).toBeVisible();
    await expect(fieldRow).toHaveAttribute("role", "group");
    await expect(fieldRow).toHaveAttribute("aria-labelledby", "field-row-control-proof-label");
    await expect(fieldRow).toHaveAttribute("aria-describedby", "field-row-control-proof-helper");
    await expect(page.locator("[data-field-row-control-slot]").first()).toHaveAttribute(
      "data-field-row-control-slot",
      "provided",
    );
    await expect(page.locator(".field-row-proof-host input, .field-row-proof-host textarea")).toHaveCount(0);
    await expect(page.getByText("Proof-only state evidence; not a governed input.")).toBeVisible();
    await expect(page.getByText("Default state")).toBeVisible();
  });

  test("review controls change state, message, direction, slot posture, and constrained width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const host = page.locator("[data-field-row-review-width]").first();
    const fieldRow = page.locator("[data-field-row-control]").first();
    await page.locator("[data-field-row-state-control]").selectOption("error");
    await page.locator("[data-field-row-message-control]").selectOption("error");
    await page.locator("[data-field-row-direction-control]").selectOption("rtl");
    await page.locator("[data-field-row-slot-control]").selectOption("proof");
    await page.locator("[data-field-row-width-control]").selectOption("narrow");

    await expect(fieldRow).toHaveAttribute("data-field-row-control-state", "error");
    await expect(fieldRow).toHaveAttribute("aria-describedby", "field-row-control-proof-error");
    await expect(page.locator("[data-field-row-control-message='error']")).toHaveCSS("color", "rgb(122, 31, 31)");
    await expect(host).toHaveAttribute("dir", "rtl");
    await expect(host).toHaveAttribute("data-field-row-review-width", "narrow");
    await expect(page.locator("[data-field-row-control-slot]").first()).toHaveAttribute(
      "data-field-row-control-slot",
      "provided",
    );
    await expect(page.locator("[data-field-row-proof-state-cue]").getByText("Error state")).toBeVisible();
    await expect(page.getByText("Proof-only state evidence; not a governed input.")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("renders review evidence for every allowed state without creating a native control", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    const fieldRow = page.locator("[data-field-row-control]").first();
    const slot = page.locator("[data-field-row-control-slot]").first();
    const states = [
      ["default", "Default state", "false", "false", "false", "false"],
      ["required", "Required state", "true", "false", "false", "false"],
      ["read-only", "Read-only state", "false", "true", "false", "false"],
      ["disabled", "Disabled state", "false", "false", "true", "false"],
      ["error", "Error state", "false", "false", "false", "true"],
    ] as const;

    for (const [state, title, required, readonly, disabled, invalid] of states) {
      await page.locator("[data-field-row-state-control]").selectOption(state);
      await expect(fieldRow).toHaveAttribute("data-field-row-control-state", state);
      await expect(slot).toHaveAttribute("data-field-row-control-slot-state", state);
      await expect(slot).toHaveAttribute("data-field-row-control-slot-required", required);
      await expect(slot).toHaveAttribute("data-field-row-control-slot-readonly", readonly);
      await expect(slot).toHaveAttribute("data-field-row-control-slot-disabled", disabled);
      await expect(slot).toHaveAttribute("data-field-row-control-slot-invalid", invalid);
      await expect(page.locator("[data-field-row-proof-state-cue]").getByText(title)).toBeVisible();
    }

    await expect(page.locator(".field-row-proof-host input, .field-row-proof-host textarea")).toHaveCount(0);
  });

  test("discloses full label text only when rendered label is truncated", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    const label = page.locator("[data-truncating-label]").first();
    const tooltip = label.locator("[data-truncating-label-tooltip]");

    await page.locator("[data-field-row-label-control]").selectOption("long");
    await page.locator("[data-field-row-width-control]").selectOption("narrow");
    await expect(label).toHaveAttribute("data-truncating-label-overflow", "true");

    await label.focus();
    await expect(label).toHaveAttribute("data-truncating-label-open", "true");
    await expect(tooltip).toHaveText("Entity organization label with long governed field row text");
    await expect(tooltip).toHaveCSS("opacity", "1");

    await page.keyboard.press("Escape");
    await expect(label).toHaveAttribute("data-truncating-label-open", "false");

    await page.locator("[data-field-row-label-control]").selectOption("short");
    await page.locator("[data-field-row-width-control]").selectOption("wide");
    const fittingLabel = page.locator("[data-truncating-label]").first();
    const fittingTooltip = fittingLabel.locator("[data-truncating-label-tooltip]");
    await expect(fittingLabel).toHaveAttribute("data-truncating-label-overflow", "false");

    await fittingLabel.hover();
    await expect(fittingLabel).toHaveAttribute("data-truncating-label-open", "false");
    await expect(fittingLabel).not.toHaveAttribute("aria-describedby", /.+/);
    await expect(fittingTooltip).toHaveCSS("opacity", "0");
  });
});
