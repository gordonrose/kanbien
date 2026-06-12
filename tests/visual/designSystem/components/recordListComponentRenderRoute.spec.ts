import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/components/record-list-component";
const legacyDemoRoute = "/design-system/default/demos/record-list-component";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("record list component render route", () => {
  test("legacy demo route redirects to the Layer 5 component render proof", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(legacyDemoRoute);

    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.getByRole("heading", { name: "Record List Component Render Proof", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Design-System Route Families" })).toHaveCount(0);
  });

  test("direct route renders the Layer 5 component seam instead of the overview fallback", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Record List Component Render Proof", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Design-System Route Families" })).toHaveCount(0);
    await expect(page.locator("[data-record-list-component]")).toHaveCount(1);
    await expect(page.locator("[data-record-list-pattern]")).toHaveCount(1);
    await expect(page.locator("[data-record-list-item-control]")).toHaveCount(4);
    await expect(page.locator("[data-detail-slot-control]")).toBeVisible();
    await expect(page.locator("[data-resize-handle-control]")).toBeVisible();
    await expect(page.locator("[data-record-list-pattern-live-region]")).toHaveAttribute("aria-live", "polite");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("root-users pressure fixture suppresses reorder affordances through allowReorder false", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-record-list-component-render-control='fixtureState']").selectOption("root-users");

    await expect(page.getByRole("heading", { name: "Record List Component Render Proof", level: 1 })).toBeVisible();
    await expect(page.locator("[data-record-list-pattern-reorder='disabled']")).toHaveCount(1);
    await expect(page.locator("[draggable='true']")).toHaveCount(0);
    await expect(page.locator("[aria-keyshortcuts='Alt+ArrowUp Alt+ArrowDown']")).toHaveCount(0);
    await expect(page.getByText("Use Alt plus Arrow Up or Arrow Down to reorder.")).toHaveCount(0);
  });

  test("uses list-to-total ratio semantics and expands the list after close", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);
    await page.locator("[data-record-list-component-render-control='width']").selectOption("wide");
    await page.locator("[data-record-list-component-render-control='ratio']").selectOption("1:2");

    const openGeometry = await page.evaluate(() => {
      const host = document.querySelector(".record-list-pattern-proof-host");
      const list = document.querySelector(".ds-record-list-pattern-list-pane");
      const detail = document.querySelector("[data-detail-slot-control]");
      return {
        host: host?.getBoundingClientRect().width ?? 0,
        list: list?.getBoundingClientRect().width ?? 0,
        detail: detail?.getBoundingClientRect().width ?? 0,
      };
    });

    expect(openGeometry.list).toBeGreaterThan(openGeometry.host * 0.45);
    expect(openGeometry.list).toBeLessThan(openGeometry.host * 0.55);
    expect(openGeometry.detail).toBeGreaterThan(openGeometry.host * 0.45);
    expect(openGeometry.detail).toBeLessThan(openGeometry.host * 0.55);

    await page.getByRole("button", { name: "Close detail" }).click();

    const closedGeometry = await page.evaluate(() => {
      const host = document.querySelector(".record-list-pattern-proof-host");
      const list = document.querySelector(".ds-record-list-pattern-list-pane");
      const detail = document.querySelector("[data-detail-slot-control]");
      const resize = document.querySelector(".ds-record-list-pattern-resize");
      return {
        host: host?.getBoundingClientRect().width ?? 0,
        list: list?.getBoundingClientRect().width ?? 0,
        detailDisplay: detail ? getComputedStyle(detail).display : "",
        resizeDisplay: resize ? getComputedStyle(resize).display : "",
      };
    });

    expect(closedGeometry.list).toBeGreaterThan(closedGeometry.host * 0.98);
    expect(closedGeometry.detailDisplay).toBe("none");
    expect(closedGeometry.resizeDisplay).toBe("none");
  });

  test("does not show keyboard reorder help after pointer selection", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.getByRole("button", { name: "LedgerWorks Finance" }).click();

    await expect(page.locator("[data-focus-instruction-disclosure]").first()).toBeHidden();
    await expect(page.getByRole("button", { name: "LedgerWorks Finance" })).toHaveAttribute(
      "data-focus-instruction-disclosure-open",
      "false",
    );
  });
});
