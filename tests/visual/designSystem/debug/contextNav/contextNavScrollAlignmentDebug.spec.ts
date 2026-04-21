import { test } from "@playwright/test";

test("debug context-nav scroll alignment", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1200 });
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=620&stack=tall&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-002",
  );

  await page.locator("#context-nav-preview-frame").waitFor({ state: "visible" });

  const info = await page.evaluate(() => {
    const topItem = document.querySelector("#context-nav-preview-main-items .context-nav-item");
    const bottomItem = document.querySelector(".context-nav-bottom-group .context-nav-item");
    const main = document.querySelector(".context-nav-main");
    const mainItems = document.getElementById("context-nav-preview-main-items");

    const toBox = (node: Element | null) => {
      if (!(node instanceof HTMLElement)) {
        return null;
      }
      const r = node.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height, centerX: r.left + r.width / 2 };
    };

    return {
      mainClass: main?.className ?? null,
      mainItemsClass: mainItems?.className ?? null,
      main: toBox(main),
      mainItems: toBox(mainItems),
      topItem: toBox(topItem),
      bottomItem: toBox(bottomItem),
      scrollWidth: main instanceof HTMLElement ? main.offsetWidth : null,
      clientWidth: main instanceof HTMLElement ? main.clientWidth : null,
      offsetWidth: mainItems instanceof HTMLElement ? mainItems.offsetWidth : null,
      clientWidthItems: mainItems instanceof HTMLElement ? mainItems.clientWidth : null,
    };
  });

  console.log(JSON.stringify(info, null, 2));
  await page.screenshot({ path: "tests/visual/designSystem/debug/contextNav/context-nav-scroll-alignment-debug.png", fullPage: true });
});
