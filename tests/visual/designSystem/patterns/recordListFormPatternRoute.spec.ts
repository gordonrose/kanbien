import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/record-list-form";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.ceil(document.documentElement.scrollWidth - document.documentElement.clientWidth));
}

async function horizontallyContainedBy(page: Page, outerSelector: string, innerSelector: string) {
  return page.evaluate(
    ({ outerSelector, innerSelector }: { outerSelector: string; innerSelector: string }) => {
      const outer = document.querySelector(outerSelector);
      const inner = document.querySelector(innerSelector);
      if (!(outer instanceof HTMLElement) || !(inner instanceof HTMLElement)) {
        return false;
      }
      const outerRect = outer.getBoundingClientRect();
      const innerRect = inner.getBoundingClientRect();
      return innerRect.left >= outerRect.left - 1 && innerRect.right <= outerRect.right + 1;
    },
    { outerSelector, innerSelector },
  );
}

async function computedBackground(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((element) => getComputedStyle(element).backgroundColor);
}

test.describe("record-list-form pattern route", () => {
  test("renders record-list with governed entity-panel in the detail slot and switches visible detail", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.locator("[data-record-list-form-pattern]")).toBeVisible();
    await expect(page.locator("[data-record-list-pattern-custom-detail='true']")).toBeVisible();
    await expect(page.locator("[data-record-list-form-detail-item='northstar']")).toBeVisible();
    await expect(page.locator("[data-record-list-form-detail-item='northstar'] [data-entity-panel]")).toBeVisible();
    await expect(page.locator("[data-record-list-form-detail-item='northstar'] [data-accordion-form-section]")).toBeVisible();

    await page.getByRole("button", { name: /LedgerWorks Finance/ }).click();
    await expect(page.locator("[data-record-list-form-log]")).toHaveText("Event log: open ledgerworks");
    await expect(page.locator("[data-record-list-form-detail-item='ledgerworks']")).toBeVisible();
    await expect(page.locator("[data-record-list-form-detail-item='northstar']")).toBeHidden();
    await expect(page.locator("[data-record-list-form-pattern]")).toHaveAttribute("data-record-list-form-selected-item", "ledgerworks");
  });

  test("passes hosted entity-panel primary-index state through the record-list detail slot", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    const hostedPanel = page.locator("[data-record-list-form-detail-item='northstar'] [data-entity-panel]");
    await expect(page.locator("[data-record-list-form-control='primaryMode']")).toHaveValue("shown");
    await expect(hostedPanel.locator("[data-entity-panel-region='primary-index']")).toHaveCount(1);
    await expect(hostedPanel).toHaveAttribute("data-entity-panel-primary-mode", "shown");
    await expect(page.locator("[data-record-list-form-pattern] [data-record-list-form-region='primary-index']")).toHaveCount(0);
    await expect(page.locator(".ds-record-list-form-primary")).toHaveCount(0);

    await page.locator("[data-record-list-form-control='mobileActiveRegion']").selectOption("primary-index");
    await expect(hostedPanel).toHaveAttribute("data-entity-panel-mobile-active", "primary-index");
    await expect(hostedPanel.locator("[data-entity-panel-region='primary-index']")).toBeVisible();

    await page.locator("[data-record-list-form-control='primaryMode']").selectOption("hidden");
    await expect(hostedPanel.locator("[data-entity-panel-region='primary-index']")).toHaveCount(0);
    await expect(hostedPanel).toHaveAttribute("data-entity-panel-primary-mode", "hidden");
  });

  test("exposes hosted entity-panel header and resize controls through the render page", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    const hostedPanel = page.locator("[data-record-list-form-detail-item='northstar'] [data-entity-panel]");
    const primaryPanel = hostedPanel.locator("[data-entity-panel-region='primary-index'] [data-index-nav-panel]");
    const secondaryPanel = hostedPanel.locator("[data-entity-panel-region='secondary-index'] [data-index-nav-panel]");

    await expect(page.locator("[data-record-list-form-control='primaryResizeMode']")).toHaveValue("off");
    await page.locator("[data-record-list-form-control='primaryResizeMode']").selectOption("on");
    await expect(primaryPanel).toHaveAttribute("data-index-nav-panel-resizable", "true");
    await expect(
      hostedPanel.locator("[data-resize-handle-control-target-id='record-list-form-proof-entity-panel-northstar-primary-index']"),
    ).toHaveCount(1);

    await expect(page.locator("[data-record-list-form-control='secondaryHeaderMode']")).toHaveValue("hidden");
    await page.locator("[data-record-list-form-control='secondaryHeaderMode']").selectOption("shown");
    await expect(secondaryPanel).toHaveAttribute("data-index-nav-panel-header-mode", "shown");
    await expect(secondaryPanel.getByRole("button", { name: "Add secondary index item" })).toBeVisible();

    await expect(page.locator("[data-record-list-form-control='secondaryResizeMode']")).toHaveValue("off");
    await page.locator("[data-record-list-form-control='secondaryResizeMode']").selectOption("on");
    await expect(secondaryPanel).toHaveAttribute("data-index-nav-panel-resizable", "true");
    await expect(
      hostedPanel.locator("[data-resize-handle-control-target-id='record-list-form-proof-entity-panel-northstar-secondary-index']"),
    ).toHaveCount(1);
  });

  test("applies selected theme to the page and hosted child seams", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-record-list-form-control='theme']").selectOption("dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("[data-record-list-form-pattern]")).toHaveAttribute("data-record-list-form-theme", "dark");
    await expect(page.locator("[data-record-list-pattern]")).toHaveAttribute("data-record-list-pattern-theme", "dark");
    await expect(page.locator("[data-record-list-form-detail-item='northstar'] [data-entity-panel]")).toHaveAttribute(
      "data-entity-panel-theme",
      "dark",
    );
    await expect(page.locator("[data-record-list-form-detail-item='northstar'] [data-accordion-form-section]")).toHaveAttribute(
      "data-accordion-form-section-theme",
      "dark",
    );
    await expect.poll(() => computedBackground(page, "[data-record-list-form-detail-item='northstar'] [data-entity-panel]")).toBe(
      "rgb(23, 27, 34)",
    );
    await expect
      .poll(() =>
        computedBackground(page, "[data-record-list-form-detail-item='northstar'] [data-entity-panel-region='primary-index'] [data-index-nav-panel]"),
      )
      .toBe("rgb(23, 27, 34)");
    await expect
      .poll(() =>
        computedBackground(page, "[data-record-list-form-detail-item='northstar'] [data-entity-panel-region='secondary-index'] [data-index-nav-panel]"),
      )
      .toBe("rgb(23, 27, 34)");
  });

  test("inherits entity-panel mobile navigation chain from list to primary to secondary to body", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.getByRole("button", { name: "Close detail" }).click();
    await page.getByRole("button", { name: /LedgerWorks Finance/ }).click();

    const hostedPanel = page.locator("[data-record-list-form-detail-item='ledgerworks'] [data-entity-panel]");
    await expect(hostedPanel).toHaveAttribute("data-entity-panel-viewport", "mobile");
    await expect(hostedPanel).toHaveAttribute("data-entity-panel-mobile-active", "primary-index");
    await expect(hostedPanel.locator("[data-entity-panel-region='primary-index']")).toBeVisible();

    await hostedPanel.locator("[data-entity-panel-region='primary-index']").getByRole("button", { name: "Workflows" }).click();
    await expect(hostedPanel).toHaveAttribute("data-entity-panel-mobile-active", "secondary-index");
    await expect(hostedPanel).toHaveAttribute("data-entity-panel-primary-current", "workflows");
    await expect(hostedPanel.locator("[data-entity-panel-region='secondary-index']")).toBeVisible();

    await hostedPanel.locator("[data-entity-panel-region='secondary-index']").getByRole("button", { name: "Operations" }).click();
    await expect(hostedPanel).toHaveAttribute("data-entity-panel-mobile-active", "body");
    await expect(hostedPanel).toHaveAttribute("data-entity-panel-secondary-current", "operations");
    await expect(hostedPanel.locator("[data-entity-panel-region='body']")).toBeVisible();
  });

  test("keeps child route behavior delegated for ratio, close, direction, and empty state", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-record-list-form-control='ratio']").selectOption("1:5");
    const geometry = await page.evaluate(() => {
      const host = document.querySelector(".record-list-pattern-proof-host");
      const list = document.querySelector(".ds-record-list-pattern-list-pane");
      const detail = document.querySelector("[data-detail-slot-control]");
      return {
        host: host?.getBoundingClientRect().width ?? 0,
        list: list?.getBoundingClientRect().width ?? 0,
        detail: detail?.getBoundingClientRect().width ?? 0,
      };
    });
    expect(geometry.detail).toBeGreaterThan(geometry.list);
    expect(geometry.detail).toBeGreaterThan(geometry.host * 0.6);

    await page.locator("[data-record-list-form-control='direction']").selectOption("rtl");
    await expect(page.locator(".record-list-pattern-proof-host")).toHaveAttribute("dir", "rtl");

    await page.getByRole("button", { name: "Close detail" }).click();
    await expect(page.locator("[data-record-list-form-log]")).toHaveText("Event log: close detail");
    await expect(page.locator("[data-detail-slot-control]")).toBeHidden();

    await page.locator("[data-record-list-form-control='fixtureCount']").selectOption("empty");
    await expect(page.locator("[data-record-list-pattern-empty]")).toBeVisible();
    await expect(page.locator("[data-record-list-form-detail-item]")).toHaveCount(0);
  });

  test("keeps hosted entity panel contained inside a reduced detail slot", async ({ page }) => {
    await page.setViewportSize({ width: 981, height: 923 });
    await page.goto(route);

    const slotSelector = "[data-detail-slot-control]";
    const panelSelector = "[data-record-list-form-detail-item='northstar'] [data-entity-panel]";
    const bodySelector = "[data-record-list-form-detail-item='northstar'] [data-entity-panel-region='body']";

    await expect(page.locator(slotSelector)).toBeVisible();
    await expect(page.locator(panelSelector)).toHaveAttribute("data-entity-panel-viewport", "mobile");
    await expect.poll(() => horizontallyContainedBy(page, slotSelector, panelSelector)).toBe(true);
    await expect.poll(() => horizontallyContainedBy(page, slotSelector, bodySelector)).toBe(true);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
