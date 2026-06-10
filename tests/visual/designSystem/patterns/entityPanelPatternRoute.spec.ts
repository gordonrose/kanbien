import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/entity-panel";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("entity panel pattern route", () => {
  test("keeps the dedicated entity-body-panel route separate from the entity-panel shell route", async ({ page }) => {
    await page.goto("/design-system/default/patterns/entity-body-panel");

    await expect(page).toHaveURL(/\/design-system\/default\/patterns\/entity-body-panel$/);
    await expect(page.getByRole("heading", { name: "Entity Body Panel Pattern", level: 1 })).toBeVisible();
  });

  test("updates embedded secondary current item without replacing the governed panel composition", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Entity Panel Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-entity-panel]")).toHaveAttribute("data-entity-panel-viewport", "desktop");
    await expect(page.locator("[data-entity-panel-region='primary-index']")).toBeVisible();
    await expect(page.locator("[data-entity-panel-region='primary-index'] [data-index-nav-panel]")).toHaveAttribute(
      "data-index-nav-panel-resizable",
      "true",
    );
    await expect(page.locator("[data-entity-panel-region='primary-index'] [data-index-nav-panel]")).toHaveAttribute(
      "data-index-nav-panel-header-mode",
      "hidden",
    );
    await expect(page.locator("[data-entity-panel] [data-entity-panel-region='primary-index']")).toHaveCount(0);
    const primaryIndex = page.locator("[data-entity-panel-region='primary-index']");
    await expect(primaryIndex.getByRole("button", { name: "Identity" })).toHaveAttribute("aria-current", "true");
    await primaryIndex.getByRole("button", { name: "Workflows" }).click();
    await expect(primaryIndex.getByRole("button", { name: "Workflows" })).toHaveAttribute("aria-current", "true");
    await expect(primaryIndex.getByRole("button", { name: "Identity" })).not.toHaveAttribute("aria-current", "true");
    await expect(page.getByRole("button", { name: "Primary Details" })).toHaveAttribute("aria-current", "true");

    await page.getByRole("button", { name: "Owning Feature" }).click();

    await expect(page.getByRole("button", { name: "Owning Feature" })).toHaveAttribute("aria-current", "true");
    await expect(page.locator(".token-spec-definition-grid")).toContainText("owning-feature");
    await expect(page.locator("[data-entity-panel]")).toHaveCount(1);
    await expect(page.locator("[data-entity-panel-region='secondary-index']")).toHaveCount(1);
    await expect(page.locator("[data-entity-panel-region='body']")).toHaveCount(1);
    await expect(page.locator("[data-entity-panel-region='body'] [data-entity-body-panel]")).toBeVisible();
    await expect(page.locator("[data-entity-panel-region='body'] [data-accordion-group]")).toBeVisible();
    await expect(page.locator("#entity-panel-proof-accordion-identity-panel [data-text-field-control]")).toHaveCount(2);
    await expect(page.locator("#entity-panel-proof-accordion-identity-panel [data-textarea-control]")).toBeVisible();

    await page.locator("#entity-panel-proof-accordion-workflows-button").click();
    await expect(page.locator("#entity-panel-proof-accordion-workflows-panel [data-radio-simple-select-field]")).toBeVisible();
    await expect(page.locator("#entity-panel-proof-accordion-workflows-panel [data-toggle-field]")).toBeVisible();
    await expect(page.locator("#entity-panel-proof-accordion-workflows-panel [data-simple-dropdown-field]")).toBeVisible();
    await expect(page.locator("#entity-panel-proof-accordion-workflows-panel [data-drawer-select]")).toBeVisible();
    await page.locator("#entity-panel-proof-accordion-workflows-button").click();
    await expect(page.locator("#entity-panel-proof-accordion-workflows-panel")).toBeHidden();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const body = document.querySelector("[data-entity-panel-region='body']");
          const region = document.querySelector("[data-entity-panel-region='body'] [data-body-region-control]");
          const scroll = document.querySelector("[data-entity-panel-region='body'] [data-body-region-control-scroll]");
          const accordion = document.querySelector("[data-entity-panel-region='body'] [data-accordion-group]");
          if (
            !(body instanceof HTMLElement) ||
            !(region instanceof HTMLElement) ||
            !(scroll instanceof HTMLElement) ||
            !(accordion instanceof HTMLElement)
          ) {
            return Number.POSITIVE_INFINITY;
          }
          return Math.max(
            Math.round(Math.abs(body.getBoundingClientRect().width - region.getBoundingClientRect().width)),
            Math.round(Math.abs(scroll.getBoundingClientRect().width - accordion.getBoundingClientRect().width)),
          );
        }),
      )
      .toBeLessThanOrEqual(2);
    await page.locator("#entity-panel-proof-accordion-workflows-button").click();
    await page.locator("#entity-panel-proof-accordion-workflows-panel [data-drawer-select] [data-count-card-control]").click();
    await expect(page.locator("[data-drawer-select][data-drawer-select-open='true']")).toBeVisible();
    await expect(page.locator("[data-panel-stack]")).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Search options" })).toBeFocused();
    await page.getByRole("button", { name: "Close selector" }).click();
    await expect(page.locator("[data-panel-stack]")).toHaveCount(0);
    await expect(page.locator("[data-entity-panel]")).toHaveCount(1);
    await expect(page.locator("[data-entity-panel-action-log]")).toHaveText("Panel action log: none");

    await page.locator("#entity-panel-proof-accordion-display-button").click();
    await expect(page.locator("#entity-panel-proof-accordion-display-panel [data-card-list-select-field]")).toBeVisible();
    const bodyScroll = page.locator("[data-entity-panel-region='body'] [data-body-region-control-scroll]");
    await bodyScroll.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    await expect(page.locator("#entity-panel-proof-accordion-display-panel [data-card-list-select-field]")).toBeInViewport();
    await page.locator("[data-entity-panel-primary-control]").selectOption("hidden");
    await expect(page.locator("[data-entity-panel-region='primary-index']")).toBeHidden();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("renders panel close action and optional secondary add action in the correct headers", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    const panelHeader = page.locator("[data-panel-header-control]");
    await expect(panelHeader.getByRole("button", { name: "Close panel" })).toBeVisible();
    await expect(panelHeader.getByRole("button", { name: "Panel action" })).toHaveCount(0);

    await panelHeader.getByRole("button", { name: "Close panel" }).click();
    await expect(page.locator("[data-entity-panel-action-log]")).toHaveText("Panel action log: close panel");

    await page.locator("[data-entity-panel-secondary-header-control]").selectOption("shown");
    await expect(page.locator("[data-entity-panel-region='secondary-index'] [data-index-nav-panel-header-control]")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("passes governed resize behavior through to the embedded secondary index", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-entity-panel-secondary-resize-control]").selectOption("on");
    await page.locator("[data-entity-panel-secondary-count-control]").selectOption("10");

    const secondaryPanel = page.locator("[data-entity-panel-region='secondary-index'] [data-index-nav-panel]");
    const secondaryScroll = secondaryPanel.locator("[data-index-nav-panel-scroll]");
    const handle = page.getByRole("separator", { name: "Resize Secondary index" });
    await expect(secondaryPanel).toHaveAttribute("data-index-nav-panel-resizable", "true");
    await expect(handle).toHaveAttribute("aria-valuemin", "10rem");
    await expect(handle).toHaveAttribute("aria-valuemax", "32rem");
    await expect
      .poll(() =>
        secondaryScroll.evaluate((element) => ({
          clientHeight: element.clientHeight,
          scrollHeight: element.scrollHeight,
        })),
      )
      .toMatchObject({ clientHeight: expect.any(Number), scrollHeight: expect.any(Number) });
    await expect
      .poll(() => secondaryScroll.evaluate((element) => element.scrollHeight > element.clientHeight))
      .toBe(true);

    await handle.focus();
    await page.keyboard.press("Home");
    await expect(handle).toHaveAttribute("aria-valuenow", "160px");
    await expect.poll(() => secondaryPanel.evaluate((element) => Math.round(element.getBoundingClientRect().width))).toBe(160);

    await page.keyboard.press("End");
    await expect(handle).toHaveAttribute("aria-valuenow", "512px");
    await expect.poll(() => secondaryPanel.evaluate((element) => Math.round(element.getBoundingClientRect().width))).toBe(512);
  });

  test("proves mobile active-region switching without rendering missing page-shell patterns", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-entity-panel-viewport-control]").selectOption("mobile");
    await page.locator("[data-entity-panel-secondary-header-control]").selectOption("shown");
    await expect(page.locator("[data-entity-panel]")).toHaveAttribute("data-entity-panel-viewport", "mobile");
    await expect(page.locator("[data-entity-panel-proof-slot]")).toHaveAttribute(
      "data-entity-panel-proof-viewport",
      "mobile",
    );
    await expect
      .poll(() => page.locator("[data-entity-panel-proof-slot]").evaluate((element) => Math.round(element.getBoundingClientRect().width)))
      .toBeLessThanOrEqual(416);
    await expect(page.getByRole("button", { name: "Show secondary index" })).toBeVisible();
    await expect(page.locator("[data-entity-panel-region='body']")).toBeVisible();
    await expect(page.locator("[data-entity-panel-region='body'] [data-accordion-group]")).toBeVisible();
    await expect(page.locator("#entity-panel-proof-accordion-identity-panel [data-text-field-control]").first()).toBeVisible();
    await expect(page.locator("[data-entity-panel-region='secondary-index']")).toBeVisible();

    await page.getByRole("button", { name: "Show secondary index" }).click();
    await expect(page.locator("[data-entity-panel-region='secondary-index']")).toBeVisible();
    await expect(page.locator("[data-entity-panel-region='body']")).toBeVisible();
    const secondaryRegion = page.locator("[data-entity-panel-region='secondary-index']");
    const secondaryPanel = secondaryRegion.locator("[data-index-nav-panel]");
    const secondaryHeader = secondaryRegion.locator("[data-index-nav-panel-header-control]");
    await expect(secondaryHeader.getByRole("button", { name: "Add secondary index item" })).toBeVisible();
    await expect(secondaryHeader.getByRole("button", { name: "Close secondary index" })).toHaveCount(0);
    await expect(page.locator("[data-panel-header-control]").getByRole("button", { name: "Close panel" })).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const region = document.querySelector("[data-entity-panel-region='secondary-index']");
          const panel = region?.querySelector("[data-index-nav-panel]");
          if (!(region instanceof HTMLElement) || !(panel instanceof HTMLElement)) {
            return Number.POSITIVE_INFINITY;
          }
          return Math.round(Math.abs(region.getBoundingClientRect().width - panel.getBoundingClientRect().width));
        }),
      )
      .toBeLessThanOrEqual(2);
    await expect(page.getByRole("button", { name: "Primary Details" })).not.toHaveAttribute("aria-current", "true");
    await page.locator("[data-panel-header-control]").getByRole("button", { name: "Close panel" }).click();
    await expect(page.locator("[data-entity-panel-region='primary-index']")).toBeVisible();
    await expect(page.locator("[data-entity-panel] [data-entity-panel-region='primary-index']")).toHaveCount(0);

    await page.getByRole("button", { name: "Identity" }).click();
    await expect(page.locator("[data-entity-panel-region='secondary-index']")).toBeVisible();
    await expect(secondaryHeader.getByRole("button", { name: "Close secondary index" })).toHaveCount(0);

    await page.getByRole("button", { name: "Owning Feature" }).click();
    await expect(page.locator("[data-entity-panel-region='secondary-index']")).toBeVisible();
    await expect(page.locator("[data-entity-panel-region='body']")).toBeVisible();
    await expect(page.locator("[data-entity-panel-region='body']")).toHaveCSS("position", "absolute");
    await expect(page.getByRole("button", { name: "Owning Feature" })).toHaveAttribute("aria-current", "true");

    await page.getByRole("button", { name: "Show secondary index" }).click();
    await expect(page.locator("[data-entity-panel-region='secondary-index']")).toBeVisible();
    await expect(page.locator("[data-entity-panel-region='body']")).toBeVisible();
    await expect(page.getByRole("button", { name: "Owning Feature" })).toHaveAttribute("aria-current", "true");
    await expect(secondaryHeader.getByRole("button", { name: "Close secondary index" })).toBeVisible();

    await page.getByRole("button", { name: "Close secondary index" }).click();
    await expect(page.locator("[data-entity-panel-region='primary-index']")).toBeHidden();
    await expect(page.locator("[data-entity-panel] [data-entity-panel-region='primary-index']")).toHaveCount(0);
    await expect(page.locator("[data-entity-panel-region='body']")).toBeVisible();
    await expect(page.getByRole("button", { name: "Show secondary index" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Owning Feature" })).toHaveAttribute("aria-current", "true");

    await page.getByRole("button", { name: "Show secondary index" }).click();
    await page.locator("[data-panel-header-control]").getByRole("button", { name: "Close panel" }).click();
    await expect(page.locator("[data-entity-panel-region='primary-index']")).toBeVisible();
    await expect(page.getByRole("button", { name: "Identity" })).not.toHaveAttribute("aria-current", "true");

    await page.getByRole("button", { name: "Identity" }).click();
    await expect(page.locator("[data-entity-panel-region='secondary-index']")).toBeVisible();
    await expect(page.locator("[data-entity-panel-region='primary-index']")).toBeHidden();
    await expect(page.locator("[data-entity-panel-region='body']")).toBeVisible();
    await expect(page.getByRole("button", { name: "Primary Details" })).not.toHaveAttribute("aria-current", "true");
    await page.locator("[data-entity-panel-mobile-active-control]").selectOption("primary-index");
    await expect(page.locator("[data-entity-panel-region='primary-index']")).toBeVisible();
    await expect(page.getByText("Context bar and display-settings drawer composition is blocked")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
