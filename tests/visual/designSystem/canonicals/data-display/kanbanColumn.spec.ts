import { expect, test, type Page } from "@playwright/test";

const kanbanColumnCanonicalStates = [
  { refId: "KCR-001", label: "desktop baseline board" },
  { refId: "KCR-002", label: "column create insertion lines" },
  { refId: "KCR-003", label: "draft column inline naming" },
  { refId: "KCR-004", label: "add-card draft control" },
  { refId: "KCR-005", label: "archived column drawer recovery" },
  { refId: "KCR-006", label: "desktop drag landing marker" },
  { refId: "KCR-007", label: "dark theme count contrast" },
  { refId: "KCR-008", label: "dense long-copy strain" },
  { refId: "KCR-009", label: "mobile horizontal scroll board" },
  { refId: "KCR-010", label: "drawer visible-column manager" },
  { refId: "KCR-011", label: "hidden column card preservation" },
  { refId: "KCR-012", label: "archive education callout" },
  { refId: "KCR-013", label: "restored archived column" },
  { refId: "KCR-014", label: "non-drag moved card result" },
  { refId: "KCR-015", label: "RTL board review" },
  { refId: "KCR-016", label: "magnified board review" },
  { refId: "KCR-017", label: "accent and long-copy strain" },
] as const;

async function gotoKanbanCanonical(page: Page, refId: string) {
  const viewportWidth = refId === "KCR-009" ? 860 : 1500;
  await page.setViewportSize({ width: viewportWidth, height: 1400 });
  await page.goto(`/design-system/canonical-renderings/kanban-column/${refId}`);
  await page.locator('#kanban-column-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
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

test.describe("design-system kanban-column canonical states", () => {
  test("launcher exposes the signed-off kanban canonical refs", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/kanban-column");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(17);
    await expect(page.getByText("Column create insertion lines")).toBeVisible();
    await expect(page.getByText("Add-card draft control")).toBeVisible();
    await expect(page.getByText("Archived column drawer recovery")).toBeVisible();
    await expect(page.getByText("Drawer visible-column manager")).toBeVisible();
    await expect(page.getByText("Archive education callout")).toBeVisible();
    await expect(page.getByRole("link", { name: /KCR-001/ })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/kanban-column/KCR-001",
    );
  });

  for (const scenario of kanbanColumnCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoKanbanCanonical(page, scenario.refId);

      await expect(page.locator("body")).toHaveAttribute("data-kanban-column-surface", "canonical");
      await expect(page.locator("#kanban-column-canonical-current")).toContainText(scenario.refId);
      await expect(page.locator("#kanban-column-preview-shell")).toHaveAttribute("data-render-status", "ready");
      await expect(page.locator("#kanban-column-canonical-board")).toBeVisible();
    });
  }

  test("KCR-002 renders centered insertion-line plus glyphs", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-002");

    await expect(page.locator(".kanban-column-insert-line")).toHaveCount(3);
    const centerDelta = await page.locator(".kanban-column-insert-button").first().evaluate((button) => {
      const svg = button.querySelector("svg");
      if (!(svg instanceof SVGElement)) {
        return Number.POSITIVE_INFINITY;
      }
      const buttonBox = button.getBoundingClientRect();
      const svgBox = svg.getBoundingClientRect();
      return Math.abs((buttonBox.left + (buttonBox.width / 2)) - (svgBox.left + (svgBox.width / 2)));
    });
    expect(centerDelta).toBeLessThanOrEqual(1);
  });

  test("KCR-003 and KCR-004 focus the inline draft controls", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-003");
    await expect(page.locator("[data-kanban-draft-input]")).toBeFocused();

    await gotoKanbanCanonical(page, "KCR-004");
    await expect(page.locator("[data-kanban-draft-card-input]")).toBeFocused();

    const centerDelta = await page.getByRole("button", { name: "Add card to Ready" }).evaluate((button) => {
      const svg = button.querySelector(".kanban-add-card-glyph svg");
      if (!(svg instanceof SVGElement)) {
        return Number.POSITIVE_INFINITY;
      }
      const buttonBox = button.getBoundingClientRect();
      const svgBox = svg.getBoundingClientRect();
      return Math.abs((buttonBox.left + (buttonBox.width / 2)) - (svgBox.left + (svgBox.width / 2)));
    });
    expect(centerDelta).toBeLessThanOrEqual(1);
  });

  test("KCR-005 keeps archived drawer recovery below the active catalog", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-005");

    await expect(page.locator(".kanban-canonical-drawer-panel")).toBeVisible();
    await expect(page.locator("[data-kanban-archived-column-list]")).toContainText("Done");
    await expect(page.locator("[data-kanban-restore-column] .form-drawer-select-selected-chip-remove")).toContainText("Restore");

    const archivedGap = await page.locator(".kanban-canonical-drawer-panel").evaluate((panel) => {
      const archived = panel.querySelector(".kanban-archived-columns");
      const list = panel.querySelector("[data-form-drawer-select-option-list]");
      if (!(archived instanceof HTMLElement) || !(list instanceof HTMLElement)) {
        return -1;
      }
      return archived.getBoundingClientRect().top - list.getBoundingClientRect().bottom;
    });
    expect(archivedGap).toBeGreaterThanOrEqual(12);
  });

  test("KCR-006 shows drag source state and landing marker", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-006");

    await expect(page.locator(".kanban-card[data-dragging='true']")).toContainText("Add drag proof");
    await expect(page.locator(".kanban-drop-marker")).toBeVisible();
    await expect(page.locator('[data-kanban-column="review"]')).toHaveAttribute("data-kanban-drop-active", "true");
  });

  test("KCR-007 keeps dark count badge contrast scoped to the specimen", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-007");

    await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
    await expect(page.locator("#kanban-column-preview-frame")).toHaveAttribute("data-theme-scope", "dark");

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
  });

  test("KCR-009 uses local mobile horizontal board scrolling without mutating document direction", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-009");

    await expect(page.locator("#kanban-column-preview-shell")).toHaveAttribute("data-viewport-class", "mobile");
    await expect(page.locator(".kanban-board")).toHaveCSS("flex-direction", "row");
    await expect
      .poll(async () => page.locator(".kanban-board").evaluate((board) => board.scrollWidth > board.clientWidth))
      .toBe(true);
    await expect(page.locator("html")).not.toHaveAttribute("dir", "rtl");
    await expect(page.locator(".kanban-card-move").first()).toBeVisible();
  });

  test("KCR-010 shows the drawer manager selected and available column groups", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-010");

    await expect(page.locator(".kanban-canonical-drawer-panel")).toBeVisible();
    await expect(page.locator(".form-drawer-select-selected-count")).toContainText("3 selected");
    await expect(page.locator("[data-form-drawer-select-option-list]")).toContainText("Done");
    await expect(page.locator("[data-kanban-archived-column-list]")).toContainText("No archived columns.");
  });

  test("KCR-011 proves hidden columns do not delete their cards", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-011");

    await expect(page.locator('[data-kanban-column="done"]')).toHaveCount(0);
    await expect(page.locator("[data-form-drawer-select-option-list]")).toContainText("Done");
    await expect(page.locator("[data-form-drawer-select-option-list]")).toContainText("Hidden column; its card remains preserved.");
  });

  test("KCR-012 renders the first-archive education callout", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-012");

    await expect(page.locator(".kanban-archive-callout")).toBeVisible();
    await expect(page.locator(".kanban-archive-callout")).toContainText("Archived columns stay restorable in the column drawer.");
    await expect(page.getByLabel("Don't show again")).toBeVisible();
  });

  test("KCR-013 restores an archived column with its card content", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-013");

    await expect(page.locator('[data-kanban-column="done"]')).toBeVisible();
    await expect(page.locator('[data-kanban-column="done"]')).toContainText("Publish review notes");
    await expect(page.locator('[data-kanban-column="done"] .kanban-column-count')).toContainText("1");
  });

  test("KCR-014 shows the non-drag movement result", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-014");

    await expect(page.locator('[data-kanban-column="review"]')).toContainText("Add drag proof");
    await expect(page.locator('[data-kanban-column="progress"]')).not.toContainText("Add drag proof");
    await expect(page.locator('[data-kanban-column="review"] .kanban-card-move').first()).toBeVisible();
  });

  test("KCR-015 scopes RTL to the specimen", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-015");

    await expect(page.locator("#kanban-column-preview-shell")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).not.toHaveAttribute("dir", "rtl");
    await expect(page.locator(".kanban-column-count").first()).toBeVisible();
  });

  test("KCR-016 keeps magnified controls inside their cards", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-016");

    await expect(page.locator("#kanban-column-preview-shell")).toHaveAttribute("data-magnification", "100");
    await expect(page.locator("#kanban-column-preview-frame")).toHaveCSS("width", "880px");
    const zoom = await page.locator("#kanban-column-preview-shell").evaluate((shell) => getComputedStyle(shell).zoom);
    expect(Number(zoom)).toBeGreaterThan(1);
    const cardOverflowCount = await page.locator(".kanban-card").evaluateAll((cards) => cards.filter((card) => {
      if (!(card instanceof HTMLElement)) {
        return false;
      }
      return card.scrollWidth > card.clientWidth + 1 || card.scrollHeight > card.clientHeight + 1;
    }).length);
    expect(cardOverflowCount).toBe(0);
  });

  test("KCR-017 keeps non-default accent and long-copy strain bounded", async ({ page }) => {
    await gotoKanbanCanonical(page, "KCR-017");

    await expect(page.locator("#kanban-column-preview-shell")).toHaveAttribute("data-kanban-canonical-state", "accent-long");
    await expect(page.locator(".kanban-workspace")).toHaveAttribute("data-kanban-strain", "long");
    const accent = await page.locator("#kanban-column-preview-shell").evaluate((shell) => getComputedStyle(shell).getPropertyValue("--accent").trim());
    expect(accent).toBe("#0f766e");
    await expect(page.locator(".kanban-card-title").first()).toContainText("deliberately long review copy");
  });
});
