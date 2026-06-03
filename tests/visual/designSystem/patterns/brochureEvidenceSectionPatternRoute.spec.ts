import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/brochure/patterns/brochure-evidence-section";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function evidenceSectionGeometry(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll("[data-brochure-evidence-section]")).map((element) => {
      const section = element as HTMLElement;
      const rect = section.getBoundingClientRect();
      const heading = section.querySelector(".ds-brochure-evidence-heading") as HTMLElement | null;
      const list = section.querySelector(".ds-brochure-evidence-list") as HTMLElement | null;
      const markers = Array.from(section.querySelectorAll(".ds-brochure-evidence-marker")).map((marker) => {
        const markerRect = (marker as HTMLElement).getBoundingClientRect();
        return {
          ariaHidden: marker.getAttribute("aria-hidden"),
          width: markerRect.width,
          height: markerRect.height,
        };
      });

      return {
        id: section.id,
        width: rect.width,
        height: rect.height,
        labelledBy: section.getAttribute("aria-labelledby"),
        headingId: heading?.id ?? "",
        listTag: list?.tagName ?? "",
        itemCount: section.querySelectorAll(".ds-brochure-evidence-item").length,
        linkCount: section.querySelectorAll("a").length,
        buttonCount: section.querySelectorAll("button").length,
        tokenStyleData: section.getAttribute("data-brochure-evidence-section-style") ?? "",
        markers,
      };
    });
  });
}

test.describe("brochure evidence section pattern route", () => {
  test("desktop renders governed evidence sections without interactive controls", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Brochure Evidence Section Pattern", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Rendered Proof", level: 2 })).toBeVisible();
    await expect(page.locator("[data-brochure-evidence-section]")).toHaveCount(2);
    await expect(page.getByText("No links or buttons render until a governed link/action primitive exists.")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const sections = await evidenceSectionGeometry(page);
    expect(sections).toHaveLength(2);
    for (const section of sections) {
      expect(section.width).toBeGreaterThan(0);
      expect(section.height).toBeGreaterThan(0);
      expect(section.labelledBy).toBe(section.headingId);
      expect(section.listTag).toBe("UL");
      expect(section.itemCount).toBeGreaterThanOrEqual(3);
      expect(section.linkCount).toBe(0);
      expect(section.buttonCount).toBe(0);
      expect(section.tokenStyleData).toContain("--pattern-brochure-evidence-background");
      expect(section.tokenStyleData).toContain("--pattern-brochure-evidence-marker-background");
      for (const marker of section.markers) {
        expect(marker.ariaHidden).toBe("true");
        expect(marker.width).toBeGreaterThan(0);
        expect(marker.height).toBeGreaterThan(0);
      }
    }
  });

  test("mobile keeps the narrow proof contained and readable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Brochure Evidence Section Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-brochure-evidence-section]")).toHaveCount(2);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const sections = await evidenceSectionGeometry(page);
    for (const section of sections) {
      expect(section.width).toBeGreaterThan(0);
      expect(section.width).toBeLessThanOrEqual(390);
      expect(section.itemCount).toBeGreaterThanOrEqual(3);
      expect(section.linkCount).toBe(0);
      expect(section.buttonCount).toBe(0);
    }
  });
});
