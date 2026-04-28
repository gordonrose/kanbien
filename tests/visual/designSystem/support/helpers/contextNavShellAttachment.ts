import { expect, test, type Page } from "@playwright/test";

type ContextNavShellAttachmentOptions = {
  route: string;
  scrollY?: number;
};

type ContextNavShellAttachmentState = {
  hostRailCount: number;
  shellContainsHostRails: boolean;
  topNavVisible: boolean;
  subNavVisible: boolean;
  railTop: number;
  railHeight: number;
  expectedTop: number;
  computedTop: string;
  viewportHeight: number;
};

async function readContextNavShellAttachmentState(page: Page): Promise<ContextNavShellAttachmentState> {
  return page.evaluate(() => {
    const shell = document.querySelector(".design-system-shell");
    const hostRails = Array.from(document.querySelectorAll<HTMLElement>(".context-nav"))
      .filter((rail) => !rail.closest(".context-nav-preview-shell"));
    const rail = hostRails[0];
    const topNav = document.querySelector<HTMLElement>(".design-system-shell > .top-nav");
    const subNav = document.querySelector<HTMLElement>(".design-system-shell > .sub-nav");
    const railBox = rail?.getBoundingClientRect();
    const expectedTop = Math.ceil(Math.max(
      topNav?.getBoundingClientRect().bottom ?? 0,
      subNav?.getBoundingClientRect().bottom ?? 0,
    ));

    return {
      hostRailCount: hostRails.length,
      shellContainsHostRails: hostRails.every((hostRail) => Boolean(shell?.contains(hostRail))),
      topNavVisible: Boolean(topNav && topNav.getBoundingClientRect().height > 0),
      subNavVisible: Boolean(subNav && subNav.getBoundingClientRect().height > 0),
      railTop: railBox?.top ?? 0,
      railHeight: railBox?.height ?? 0,
      expectedTop,
      computedTop: rail ? window.getComputedStyle(rail).top : "",
      viewportHeight: window.innerHeight,
    };
  });
}

export async function expectHostContextNavShellAttachment(
  page: Page,
  options: ContextNavShellAttachmentOptions,
) {
  await test.step(`host context-nav shell attachment: ${options.route}`, async () => {
    await expect(page.locator(".design-system-shell")).toBeVisible();

    const initialState = await readContextNavShellAttachmentState(page);
    expect(initialState.hostRailCount, "route should expose a host context-nav rail").toBeGreaterThan(0);
    expect(initialState.shellContainsHostRails, "host context-nav rails must stay inside .design-system-shell").toBe(true);
    expect(initialState.topNavVisible, "host top-nav must remain inside .design-system-shell").toBe(true);
    expect(initialState.subNavVisible, "host sub-nav must remain inside .design-system-shell").toBe(true);
    expect(Math.abs(initialState.railTop - initialState.expectedTop), "rail should attach to measured header bottom").toBeLessThanOrEqual(1);
    expect(initialState.railHeight, "rail should not start as a fallback full-page object").toBeLessThan(initialState.viewportHeight);

    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), options.scrollY ?? 260);
    await page.waitForTimeout(100);

    const scrolledState = await readContextNavShellAttachmentState(page);
    expect(scrolledState.shellContainsHostRails, "host context-nav rails must stay inside shell after scroll").toBe(true);
    expect(Math.abs(scrolledState.railTop - scrolledState.expectedTop), "rail should stay attached to visible header bottom after scroll").toBeLessThanOrEqual(1);
    expect(scrolledState.railHeight, "rail should remain viewport-attached after scroll").toBeGreaterThan(scrolledState.viewportHeight - scrolledState.expectedTop - 6);
    expect(scrolledState.computedTop).toBe(`${scrolledState.expectedTop}px`);
  });
}
