import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/brochure/primitives/brochure-text-link-action";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function linkGeometry(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll("[data-brochure-text-link-action]")).map((element) => {
      const link = element as HTMLElement;
      const label = link.querySelector("[data-brochure-text-link-action-label]") as HTMLElement | null;
      const tooltip = link.querySelector("[data-brochure-text-link-action-tooltip]") as HTMLElement | null;
      const labelStyle = label ? getComputedStyle(label) : null;
      const tooltipStyle = tooltip ? getComputedStyle(tooltip) : null;

      return {
        accessibleName: link.getAttribute("aria-label"),
        describedBy: link.getAttribute("aria-describedby"),
        href: link.getAttribute("href"),
        labelText: label?.textContent ?? "",
        labelClientWidth: label?.clientWidth ?? 0,
        labelScrollWidth: label?.scrollWidth ?? 0,
        labelWhiteSpace: labelStyle?.whiteSpace ?? "",
        labelTextOverflow: labelStyle?.textOverflow ?? "",
        minHeight: getComputedStyle(link).minHeight,
        overflowState: link.dataset.brochureTextLinkActionOverflow ?? "",
        openState: link.dataset.brochureTextLinkActionOpen ?? "",
        tooltipId: tooltip?.id ?? "",
        tooltipRole: tooltip?.getAttribute("role") ?? "",
        tooltipVisibility: tooltipStyle?.visibility ?? "",
      };
    });
  });
}

test.describe("brochure text link action primitive route", () => {
  test("long labels truncate with anchor-owned full-text disclosure", async ({ page }) => {
    await page.setViewportSize({ width: 760, height: 720 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Brochure Text Link Action Primitive", level: 1 })).toBeVisible();
    await expect(page.locator("[data-brochure-text-link-action]")).toHaveCount(2);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const links = await linkGeometry(page);
    const longLink = links[1];

    expect(longLink.accessibleName).toBe("View the governed brochure evidence section pattern proof");
    expect(longLink.href).toBe("/design-system/brochure/patterns/brochure-evidence-section");
    expect(longLink.labelWhiteSpace).toBe("nowrap");
    expect(longLink.labelTextOverflow).toBe("ellipsis");
    expect(longLink.labelScrollWidth).toBeGreaterThan(longLink.labelClientWidth);
    expect(longLink.overflowState).toBe("true");
    expect(longLink.describedBy).toBe(longLink.tooltipId);
    expect(longLink.tooltipRole).toBe("tooltip");
    expect(longLink.tooltipVisibility).toBe("hidden");

    const longLinkLocator = page.locator("[data-brochure-text-link-action]").nth(1);
    await longLinkLocator.focus();
    await expect(longLinkLocator).toHaveAttribute("data-brochure-text-link-action-open", "true");
    await expect(longLinkLocator.locator("[role='tooltip']")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(longLinkLocator).toHaveAttribute("data-brochure-text-link-action-open", "false");
  });
});
