import { expect, test, type Page } from "@playwright/test";

async function gotoKanban(page: Page) {
  await page.goto("/design-system/patterns/kanban-column");
  await expect(page.locator("#kanban-board")).toBeVisible();
}

function contrastRatio(foreground: number[], background: number[]) {
  const luminance = (rgb: number[]) => {
    const [red, green, blue] = rgb.map((value) => {
      const channel = value / 255;
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

test.describe("design-system kanban column pattern", () => {
  test("renders the provisional board and reuses drawer-select for column management", async ({ page }) => {
    await gotoKanban(page);

    await expect(page.locator("#accessibility-button")).toBeVisible();
    await expect(page.locator("#accessibility-drawer")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(".kanban-column")).toHaveCount(4);
    await expect(page.locator(".kanban-column").nth(0)).toContainText("Ready");
    await expect(page.locator(".kanban-column").nth(1)).toContainText("In Progress");
    await expect(page.locator(".kanban-column").nth(2)).toContainText("Review");
    await expect(page.locator(".kanban-column").nth(3)).toContainText("Done");

    const trigger = page.locator("#kanban-column-manager-trigger");
    const drawer = page.locator("#kanban-column-manager [data-form-drawer-select-panel]");

    await trigger.click();
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("heading", { name: "Choose visible columns" })).toBeVisible();
    await expect(drawer.locator("[data-form-drawer-select-search]")).toBeFocused();
    await expect(drawer.locator(".form-drawer-select-selected-title").first()).toHaveText("Selected");
    await expect(drawer.locator("#kanban-column-manager-title-catalog")).toHaveText("Available");
  });

  test("opens the design drawer and applies strained display controls", async ({ page }) => {
    await gotoKanban(page);

    const drawerButton = page.locator("#accessibility-button");
    const drawer = page.locator("#accessibility-drawer");
    const workspace = page.locator(".kanban-workspace");

    await drawerButton.click();
    await expect(drawerButton).toHaveAttribute("aria-expanded", "true");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("aria-hidden", "false");
    await expect(page.locator("#accessibility-close")).toBeFocused();

    await expect(drawer.getByRole("group", { name: "Theme" })).toBeVisible();
    await expect(drawer.getByRole("group", { name: "Magnification" })).toBeVisible();
    await expect(drawer.getByRole("group", { name: "Primary colour" })).toBeVisible();
    await expect(drawer.getByRole("group", { name: "Direction" })).toBeVisible();
    await expect(drawer.getByRole("group", { name: "Board strain" })).toBeVisible();

    await drawer.getByRole("button", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    const countColors = await page.locator(".kanban-column-count").first().evaluate((node) => {
      const parseRgb = (value: string) => {
        const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : [0, 0, 0];
      };
      const style = getComputedStyle(node);
      return {
        foreground: parseRgb(style.color),
        background: parseRgb(style.backgroundColor),
      };
    });
    expect(contrastRatio(countColors.foreground, countColors.background)).toBeGreaterThanOrEqual(7);

    await drawer.getByRole("button", { name: "+100%" }).click();
    await expect
      .poll(async () => page.locator("html").evaluate((node) => node.style.getPropertyValue("--ui-scale").trim()))
      .toBe("1.5");

    await drawer.getByRole("button", { name: "Right to left" }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await drawer.getByRole("button", { name: "Dense" }).click();
    await expect(workspace).toHaveAttribute("data-kanban-strain", "dense");
    await expect(page.locator(".kanban-card")).toHaveCount(9);

    await drawer.getByRole("button", { name: "Long copy" }).click();
    await expect(workspace).toHaveAttribute("data-kanban-strain", "long");
    await expect(page.locator(".kanban-card").first()).toContainText("deliberately long lane-management title");

    await page.locator("#accessibility-close").click();
    await expect(drawer).toBeHidden();
    await expect(drawerButton).toBeFocused();
  });

  test("column drawer selection hides and restores columns without deleting cards", async ({ page }) => {
    await gotoKanban(page);

    await page.locator("#kanban-column-manager-trigger").click();
    await page.locator('[data-form-drawer-select-option][data-value="review"]').click();
    await expect(page.locator(".kanban-column")).toHaveCount(3);
    await expect(page.locator('[data-kanban-column="review"]')).toHaveCount(0);
    await expect(page.locator("#kanban-live-region")).toContainText("Visible columns updated");

    await page.locator('[data-form-drawer-select-option][data-value="review"]').click();
    await expect(page.locator(".kanban-column")).toHaveCount(4);
    await expect(page.locator('[data-kanban-column="review"]')).toContainText("Check keyboard move fallback");
  });

  test("adds columns from between-column insert lines with inline naming", async ({ page }) => {
    await gotoKanban(page);

    await page.locator("#kanban-open-add-column").click();
    await expect(page.locator(".kanban-workspace")).toHaveAttribute("data-kanban-create-mode", "true");
    await expect(page.locator("#kanban-open-add-column")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".kanban-column-insert-line")).toHaveCount(3);
    await expect(page.locator(".kanban-board")).not.toContainText("Hover beside a column");

    const insertBetweenProgressAndReview = page.getByRole("button", { name: "Add column between In Progress and Review" });
    await expect(insertBetweenProgressAndReview).toBeVisible();
    await insertBetweenProgressAndReview.click();
    await expect(page.locator("[data-kanban-draft-input]")).toBeFocused();

    await page.locator("[data-kanban-draft-input]").fill("QA Swimlane");
    await page.locator(".kanban-draft-column-form").getByRole("button", { name: "Save" }).click();

    await expect(page.locator(".kanban-column")).toHaveCount(5);
    await expect(page.locator('[data-kanban-column="qa-swimlane"]')).toContainText("QA Swimlane");
    await expect(page.locator("#kanban-live-region")).toContainText("QA Swimlane column added");
    await expect(page.locator(".kanban-column").nth(2)).toContainText("QA Swimlane");

    await page.locator("#kanban-column-manager-trigger").click();
    await expect(page.locator('[data-form-drawer-select-option][data-value="qa-swimlane"]')).toBeVisible();
  });

  test("adds cards from a subtle column-bottom draft control", async ({ page }) => {
    await gotoKanban(page);

    const readyColumn = page.locator('[data-kanban-column="ready"]');
    const addCardButton = readyColumn.getByRole("button", { name: "Add card to Ready" });
    await expect(addCardButton).toBeVisible();
    const centerDelta = await addCardButton.evaluate((button) => {
      const icon = button.querySelector(".kanban-add-card-glyph");
      if (!(icon instanceof HTMLElement)) {
        return Number.POSITIVE_INFINITY;
      }
      const buttonBox = button.getBoundingClientRect();
      const iconBox = icon.getBoundingClientRect();
      return Math.abs((buttonBox.left + (buttonBox.width / 2)) - (iconBox.left + (iconBox.width / 2)));
    });
    expect(centerDelta).toBeLessThanOrEqual(1);

    await addCardButton.click();
    await expect(page.locator("[data-kanban-draft-card-input]")).toBeFocused();

    await page.locator("[data-kanban-draft-card-input]").fill("Write card creation rules");
    await page.locator(".kanban-draft-card-form").getByRole("button", { name: "Add" }).click();

    await expect(readyColumn).toContainText("Write card creation rules");
    await expect(readyColumn.locator(".kanban-column-count")).toHaveText("2");
    await expect(page.locator("#kanban-live-region")).toContainText("Write card creation rules card added to Ready.");
  });

  test("archiving a populated column keeps it restorable under other drawer columns", async ({ page }) => {
    await gotoKanban(page);

    await page.getByRole("button", { name: "Remove Ready column" }).click();

    await expect(page.locator('[data-kanban-column="ready"]')).toHaveCount(0);
    await expect(page.locator('[data-kanban-column="progress"]')).not.toContainText("Lock column behavior");
    await expect(page.locator("#kanban-live-region")).toContainText("Ready column archived. Restore it from the column drawer.");
    await expect(page.locator("#kanban-archive-callout")).toBeVisible();
    await expect(page.locator("#kanban-archive-callout")).toContainText("Archived columns stay restorable");

    await page.locator("#kanban-column-manager-trigger").click();
    await expect(page.locator('[data-form-drawer-select-option][data-value="ready"]')).toHaveCount(0);
    await expect(page.locator("[data-kanban-archived-column-list]")).toContainText("Ready");
    await expect(page.locator("[data-kanban-archived-column-list]")).toContainText("1 archived card");
    await expect(page.locator("[data-kanban-restore-column] .form-drawer-select-selected-chip-remove")).toContainText("Restore");
    const archivedGap = await page.locator("#kanban-column-manager [data-form-drawer-select-panel]").evaluate((panel) => {
      const archived = panel.querySelector(".kanban-archived-columns");
      const list = panel.querySelector("[data-form-drawer-select-option-list]");
      if (!(archived instanceof HTMLElement) || !(list instanceof HTMLElement)) {
        return -1;
      }
      return archived.getBoundingClientRect().top - list.getBoundingClientRect().bottom;
    });
    expect(archivedGap).toBeGreaterThanOrEqual(12);

    await page.getByRole("button", { name: /Ready.*Restore/ }).click();
    await expect(page.locator('[data-kanban-column="ready"]')).toContainText("Lock column behavior");
    await expect(page.locator("#kanban-live-region")).toContainText("Ready column restored.");
  });

  test("archive callout supports the don't show again flag", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.removeItem("kanban-column-archive-callout-dismissed"));
    await gotoKanban(page);

    await page.getByRole("button", { name: "Remove Ready column" }).click();
    await expect(page.locator("#kanban-archive-callout")).toBeVisible();

    await page.getByLabel("Don't show again").check();
    await expect(page.locator("#kanban-archive-callout")).toBeHidden();

    await page.getByRole("button", { name: "Remove In Progress column" }).click();
    await expect(page.locator("#kanban-archive-callout")).toBeHidden();
  });

  test("non-drag move controls move a card between visible columns", async ({ page }) => {
    await gotoKanban(page);

    const card = page.locator(".kanban-card").filter({ hasText: "Lock column behavior" });
    await expect(page.locator('[data-kanban-column="ready"]')).toContainText("Lock column behavior");

    await card.getByRole("button", { name: "Move Lock column behavior right" }).click();

    await expect(page.locator('[data-kanban-column="ready"]')).not.toContainText("Lock column behavior");
    await expect(page.locator('[data-kanban-column="progress"]')).toContainText("Lock column behavior");
    await expect(page.locator("#kanban-live-region")).toContainText("Lock column behavior moved to In Progress");
  });

  test("desktop drag and drop moves a card to the target column", async ({ page }) => {
    await gotoKanban(page);

    await page.locator(".kanban-card").filter({ hasText: "Add drag proof" }).dragTo(page.locator('[data-kanban-dropzone="review"]'));

    await expect(page.locator('[data-kanban-column="progress"]')).not.toContainText("Add drag proof");
    await expect(page.locator('[data-kanban-column="review"]')).toContainText("Add drag proof");
    await expect(page.locator("#kanban-live-region")).toContainText("Add drag proof moved to Review");
  });

  test("desktop drag shows a clear source state and landing marker before drop", async ({ page }) => {
    await gotoKanban(page);

    const card = page.locator(".kanban-card").filter({ hasText: "Add drag proof" });
    const target = page.locator('[data-kanban-dropzone="review"]');
    const cardBox = await card.boundingBox();
    const targetBox = await target.boundingBox();

    expect(cardBox).not.toBeNull();
    expect(targetBox).not.toBeNull();

    await page.mouse.move(cardBox!.x + (cardBox!.width / 2), cardBox!.y + (cardBox!.height / 2));
    await page.mouse.down();
    await page.mouse.move(targetBox!.x + (targetBox!.width / 2), targetBox!.y + 32, { steps: 12 });

    await expect(page.locator(".kanban-card[data-dragging='true']")).toContainText("Add drag proof");
    await expect(page.locator(".kanban-drop-marker")).toBeVisible();
    await expect(page.locator('[data-kanban-column="review"]')).toHaveAttribute("data-kanban-drop-active", "true");

    await page.mouse.up();
    await expect(page.locator('[data-kanban-column="review"]')).toContainText("Add drag proof");
  });

  test("mobile scrolls columns horizontally and keeps movement button based", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await gotoKanban(page);

    await expect(page.locator(".kanban-board")).toHaveCSS("flex-direction", "row");
    await expect
      .poll(async () => page.locator(".kanban-board").evaluate((board) => board.scrollWidth > board.clientWidth))
      .toBe(true);
    await expect(page.locator(".kanban-card").first()).toHaveAttribute("draggable", "true");
    await expect(page.locator(".kanban-card-move").first()).toBeVisible();
  });
});
