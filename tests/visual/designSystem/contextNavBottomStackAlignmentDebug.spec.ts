import { test } from "@playwright/test";

test("debug context-nav bottom stack alignment", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1200 });
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=620&stack=tall&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-002",
  );

  await page.locator("#context-nav-preview-frame").waitFor({ state: "visible" });

  const info = await page.evaluate(() => {
    const boxFor = (selector: string) => {
      const node = document.querySelector(selector);
      if (!(node instanceof HTMLElement)) {
        return null;
      }
      const rect = node.getBoundingClientRect();
      return {
        selector,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        centerX: rect.left + rect.width / 2,
        className: node.className,
      };
    };

    return {
      main: boxFor("#context-nav-preview-main-items"),
      topItem: boxFor("#context-nav-preview-main-items .context-nav-item"),
      bottomGroup: boxFor(".context-nav-bottom-group"),
      bottomItem: boxFor(".context-nav-bottom-group .context-nav-item"),
      divider: boxFor(".context-nav-stack-divider"),
    };
  });

  console.log(JSON.stringify(info, null, 2));
  await page.screenshot({ path: "tests/visual/designSystem/context-nav-bottom-stack-alignment-debug.png", fullPage: true });
});
