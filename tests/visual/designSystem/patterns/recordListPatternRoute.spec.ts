import { expect, test } from "@playwright/test";

const route = "/design-system/default/patterns/record-list";

test.describe("record list pattern route", () => {
  test("uses list-to-total ratio semantics and expands the list after close", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);
    await page.locator("[data-record-list-pattern-control='width']").selectOption("wide");
    await page.locator("[data-record-list-pattern-control='ratio']").selectOption("1:2");

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
});
