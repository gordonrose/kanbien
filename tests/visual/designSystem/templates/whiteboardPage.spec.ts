import { expect, test } from "@playwright/test";

test("whiteboard page template stays in the design-system shell and creates items from the contextual click toolbar", async ({ page }) => {
  await page.goto("/design-system/templates/whiteboard-page");

  await expect(page.locator(".top-nav")).toBeVisible();
  await expect(page.locator(".sub-nav")).toBeVisible();
  await expect(page.locator(".context-nav")).toBeVisible();
  await expect(page.getByRole("link", { name: "Full screen" })).toHaveAttribute("href", "/design-system/templates/whiteboard-page?fullscreen=true");
  await expect(page.locator("[data-whiteboard-viewport]")).toBeVisible();
  await expect(page.locator("[data-whiteboard-floating-toolbar]")).toBeHidden();
  await expect(page.locator("[data-whiteboard-item]")).toHaveCount(5);
  await expect(page.locator("[data-whiteboard-connectors] line")).toHaveCount(3);

  await page.locator("[data-whiteboard-viewport]").click({ position: { x: 420, y: 280 } });
  await expect(page.locator("[data-whiteboard-floating-toolbar]")).toBeVisible();
  await expect(page.locator("[data-whiteboard-floating-toolbar]")).toHaveAttribute("data-whiteboard-toolbar-mode", "create");
  await page.getByRole("button", { name: "Post-it" }).click();

  await expect(page.locator("[data-whiteboard-item]")).toHaveCount(6);
  await expect(page.locator("[data-whiteboard-status]")).toContainText("Added post-it");
  await expect(page.locator("[data-whiteboard-floating-toolbar]")).toHaveAttribute("data-whiteboard-toolbar-mode", "edit");
});

test("whiteboard page template offers an immersive full-screen mode", async ({ page }) => {
  await page.goto("/design-system/templates/whiteboard-page?fullscreen=true");

  await expect(page.locator(".top-nav")).toBeHidden();
  await expect(page.locator(".sub-nav")).toBeHidden();
  await expect(page.locator(".context-nav")).toBeHidden();
  await expect(page.locator("[data-whiteboard-viewport]")).toBeVisible();

  const viewportBox = await page.locator("[data-whiteboard-viewport]").boundingBox();
  expect(viewportBox).not.toBeNull();
  expect(viewportBox!.height).toBeGreaterThan(850);
});

test("whiteboard page template zooms with slider, pinch-wheel, and keyboard controls", async ({ page }) => {
  await page.goto("/design-system/templates/whiteboard-page");

  const slider = page.locator("[data-whiteboard-zoom-slider]");
  const label = page.locator("[data-whiteboard-zoom-label]");
  await expect(slider).toBeVisible();
  await expect(label).toHaveText("100%");

  await slider.evaluate((node) => {
    const input = node as HTMLInputElement;
    input.value = "125";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(label).toHaveText("125%");

  await page.locator("[data-whiteboard-viewport]").dispatchEvent("wheel", { deltaY: -100 });
  await expect(label).toHaveText("125%");

  await page.locator("[data-whiteboard-viewport]").dispatchEvent("wheel", { deltaY: -100, ctrlKey: true });
  await expect(label).toHaveText("130%");

  await page.locator("[data-whiteboard-viewport]").focus();
  await page.keyboard.down("Control");
  await page.keyboard.press("-");
  await page.keyboard.up("Control");
  await expect(label).toHaveText("125%");
});

test("whiteboard page template supports expandable colour and shape menus from the creation toolbar", async ({ page }) => {
  await page.goto("/design-system/templates/whiteboard-page");

  await page.locator("[data-whiteboard-viewport]").click({ position: { x: 110, y: 110 } });
  await page.getByLabel("Colour").click();
  await page.getByRole("button", { name: "Green" }).click();
  await page.getByLabel("Shape").click();
  await page.getByRole("button", { name: "Square" }).click();

  await expect(page.locator("[data-whiteboard-item]")).toHaveCount(6);
  await expect(page.locator("[data-whiteboard-item].selected")).toHaveCSS("background-color", "rgb(198, 246, 213)");
  await expect(page.locator("[data-whiteboard-item].selected")).toHaveClass(/whiteboard-item-square/);
});

test("whiteboard page template resizes from handles and creates connectors by dragging a handle to another item", async ({ page }) => {
  await page.goto("/design-system/templates/whiteboard-page");

  const thirdItem = page.locator('[data-whiteboard-id="item-3"]');
  await thirdItem.click();
  await expect(page.locator("[data-whiteboard-floating-toolbar]")).toHaveAttribute("data-whiteboard-toolbar-mode", "edit");
  await expect(page.locator('[data-whiteboard-floating-toolbar] [data-whiteboard-text-input]')).toHaveCount(0);
  await expect(thirdItem.locator('[data-whiteboard-handle="se"]')).toBeVisible();

  const widthBefore = await thirdItem.evaluate((item) => Number.parseInt((item as HTMLElement).style.width, 10));
  const resizeHandle = await thirdItem.locator('[data-whiteboard-handle="se"]').boundingBox();
  expect(resizeHandle).not.toBeNull();
  await page.mouse.move(resizeHandle!.x + resizeHandle!.width / 2, resizeHandle!.y + resizeHandle!.height / 2);
  await page.mouse.down();
  await page.mouse.move(resizeHandle!.x + 110, resizeHandle!.y + 70);
  await page.mouse.up();

  const widthAfter = await thirdItem.evaluate((item) => Number.parseInt((item as HTMLElement).style.width, 10));
  expect(widthAfter).toBeGreaterThan(widthBefore);

  const firstItem = page.locator('[data-whiteboard-id="item-1"]');
  const secondItem = page.locator('[data-whiteboard-id="item-2"]');
  await firstItem.click();
  const edgeHandle = await firstItem.locator('[data-whiteboard-handle="e"]').boundingBox();
  const targetBox = await secondItem.boundingBox();
  expect(edgeHandle).not.toBeNull();
  expect(targetBox).not.toBeNull();
  await page.mouse.move(edgeHandle!.x + edgeHandle!.width / 2, edgeHandle!.y + edgeHandle!.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox!.x + targetBox!.width / 2, targetBox!.y + targetBox!.height / 2);
  await page.mouse.up();

  await expect(page.locator("[data-whiteboard-connectors] line")).toHaveCount(4);
  await expect(page.locator("[data-whiteboard-status]")).toContainText("Connector snapped");
});

test("whiteboard page template shows alignment guides while moving near a neighboring item", async ({ page }) => {
  await page.goto("/design-system/templates/whiteboard-page");

  const firstItem = page.locator('[data-whiteboard-id="item-1"]');
  const secondItem = page.locator('[data-whiteboard-id="item-2"]');
  const firstBox = await firstItem.boundingBox();
  const secondBox = await secondItem.boundingBox();
  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();

  await page.mouse.move(firstBox!.x + firstBox!.width / 2, firstBox!.y + firstBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(secondBox!.x + secondBox!.width / 2, secondBox!.y + secondBox!.height / 2, { steps: 8 });

  await expect(page.locator('[data-whiteboard-guide="vertical"]')).toBeVisible();
  await expect(page.locator('[data-whiteboard-guide="horizontal"]')).toBeVisible();

  await page.mouse.up();
  await expect(page.locator('[data-whiteboard-guide="vertical"]')).toBeHidden();
  await expect(page.locator('[data-whiteboard-guide="horizontal"]')).toBeHidden();
});

test("whiteboard page template groups selected items and hides the toolbar on click away", async ({ page }) => {
  await page.goto("/design-system/templates/whiteboard-page");

  const firstItem = page.locator('[data-whiteboard-id="item-1"]');
  const secondItem = page.locator('[data-whiteboard-id="item-2"]');
  await firstItem.click();
  await secondItem.click({ modifiers: ["Shift"] });
  await page.getByRole("button", { name: "Group", exact: true }).click();

  await expect(firstItem).toHaveAttribute("data-whiteboard-group", "group-1");
  await expect(secondItem).toHaveAttribute("data-whiteboard-group", "group-1");

  await page.locator("[data-whiteboard-viewport]").click({ position: { x: 20, y: 20 } });
  await expect(page.locator("[data-whiteboard-floating-toolbar]")).toBeHidden();

  await firstItem.click();
  await expect(secondItem).toHaveClass(/selected/);
});

test("whiteboard page template keeps the full board usable on mobile review width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/design-system/templates/whiteboard-page");

  await expect(page.locator("[data-whiteboard-viewport]")).toBeVisible();
  await page.locator("[data-whiteboard-viewport]").click({ position: { x: 160, y: 240 } });
  await expect(page.getByRole("button", { name: "Post-it" })).toBeVisible();

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(horizontalOverflow).toBe(false);
});
