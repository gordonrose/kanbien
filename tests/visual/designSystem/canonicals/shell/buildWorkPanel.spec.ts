import { expect, test, type Page } from "@playwright/test";

const refs = Array.from({ length: 22 }, (_, index) => `BWP-R-${String(index + 1).padStart(3, "0")}`);

function routeFor(ref: string): string {
  return `/design-system/canonical-renderings/build-work-panel/${ref}`;
}

type Rgb = {
  r: number;
  g: number;
  b: number;
  a: number;
};

function parseColor(value: string): Rgb | null {
  const rgbMatch = value.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) {
    const [r, g, b, a = 1] = rgbMatch[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r, g, b, a };
  }

  const srgbMatch = value.match(/color\(srgb ([^)]+)\)/);
  if (srgbMatch) {
    const [r, g, b, a = 1] = srgbMatch[1].split(/[ /]+/).filter(Boolean).map(Number);
    return { r: r * 255, g: g * 255, b: b * 255, a };
  }

  return null;
}

function relativeLuminance(color: Rgb): number {
  const [r, g, b] = [color.r, color.g, color.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground: Rgb, background: Rgb): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

async function expectNoVisibleTextContrastIssues(page: Page, ref: string): Promise<void> {
  const issues = await page.locator(".build-work-panel-demo-app").evaluate((root) => {
    function parseRenderedColor(value: string): Rgb | null {
      const rgbMatch = value.match(/rgba?\(([^)]+)\)/);
      if (rgbMatch) {
        const [r, g, b, a = 1] = rgbMatch[1].split(/[ ,/]+/).filter(Boolean).map(Number);
        return { r, g, b, a };
      }

      const srgbMatch = value.match(/color\(srgb ([^)]+)\)/);
      if (srgbMatch) {
        const [r, g, b, a = 1] = srgbMatch[1].split(/[ /]+/).filter(Boolean).map(Number);
        return { r: r * 255, g: g * 255, b: b * 255, a };
      }

      return null;
    }

    function luminance(color: Rgb): number {
      const [r, g, b] = [color.r, color.g, color.b].map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function contrast(foreground: Rgb, background: Rgb): number {
      const foregroundLuminance = luminance(foreground);
      const backgroundLuminance = luminance(background);
      return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
        / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
    }

    function nearestOpaqueBackground(element: Element): Rgb {
      let current: Element | null = element;
      while (current) {
        const background = parseRenderedColor(window.getComputedStyle(current).backgroundColor);
        if (background && background.a !== 0) {
          return background;
        }
        current = current.parentElement;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    }

    function isActuallyVisible(element: Element): boolean {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none"
        && style.visibility !== "hidden"
        && rect.width > 1
        && rect.height > 1
        && !style.clip.includes("rect(0px, 0px, 0px, 0px)");
    }

    return [...root.querySelectorAll("*")]
      .filter((element) =>
        isActuallyVisible(element)
        && [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()),
      )
      .flatMap((element) => {
        const style = window.getComputedStyle(element);
        const foreground = parseRenderedColor(style.color);
        if (!foreground) {
          return [];
        }

        const ratio = contrast(foreground, nearestOpaqueBackground(element));
        const fontSize = Number.parseFloat(style.fontSize);
        const fontWeight = Number.parseFloat(style.fontWeight);
        const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
        const requiredRatio = isLargeText ? 3 : 4.5;
        if (ratio >= requiredRatio) {
          return [];
        }

        return [{
          text: element.textContent?.trim().slice(0, 80) ?? "",
          className: typeof element.className === "string" ? element.className : element.tagName,
          ratio: Number(ratio.toFixed(2)),
          requiredRatio,
        }];
      });
  });

  expect(issues, `${ref} visible text contrast issues`).toEqual([]);
}

async function expectNamedControlsAndMinimumTargets(page: Page, ref: string): Promise<void> {
  const issues = await page.locator(".build-work-panel-demo-app").evaluate((root) => {
    function isActuallyVisible(element: Element): boolean {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    }

    return [...root.querySelectorAll("button, textarea")]
      .filter((element) => isActuallyVisible(element))
      .flatMap((element) => {
        const rect = element.getBoundingClientRect();
        const name = element.getAttribute("aria-label")
          ?? element.getAttribute("title")
          ?? element.textContent?.trim()
          ?? element.getAttribute("placeholder")
          ?? "";
        const elementIssues = [];

        if (!name.trim()) {
          elementIssues.push("missing accessible name");
        }
        if (rect.width < 24 || rect.height < 24) {
          elementIssues.push(`target ${Math.round(rect.width)}x${Math.round(rect.height)} below 24px`);
        }

        return elementIssues.length > 0
          ? [{ className: element.className, tagName: element.tagName, issues: elementIssues }]
          : [];
      });
  });

  expect(issues, `${ref} control accessibility issues`).toEqual([]);
}

async function expectBuildWorkPanelGeometry(page: Page, ref: string): Promise<void> {
  const geometry = await page.evaluate(() => {
    const root = document.querySelector(".build-work-panel-demo-app");
    const stage = document.querySelector(".build-work-panel-demo-stage");
    const panel = document.querySelector(".build-work-panel-demo-panel");
    const thread = document.querySelector(".build-work-panel-demo-thread");
    const composer = document.querySelector(".build-work-panel-demo-composer");
    const textarea = document.querySelector("[data-build-work-panel-message]");
    const send = document.querySelector(".build-work-panel-demo-send");
    const actionNav = document.querySelector(".build-work-panel-demo-action-nav");
    const fab = document.querySelector(".build-work-panel-demo-fab");

    function rectFor(element: Element | null) {
      if (!element) {
        return null;
      }
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    }

    return {
      viewport: root instanceof HTMLElement ? root.dataset.buildWorkPanelViewport : null,
      panelOpen: root instanceof HTMLElement ? root.dataset.panelOpen : null,
      stage: rectFor(stage),
      panel: rectFor(panel),
      thread: rectFor(thread),
      composer: rectFor(composer),
      textarea: rectFor(textarea),
      send: rectFor(send),
      actionNavDisplay: actionNav ? window.getComputedStyle(actionNav).display : null,
      fabDisplay: fab ? window.getComputedStyle(fab).display : null,
      documentOverflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      appOverflowX: root instanceof HTMLElement ? root.scrollWidth > root.clientWidth + 1 : null,
      textareaOverflowY: textarea ? window.getComputedStyle(textarea).overflowY : null,
    };
  });

  expect(geometry.documentOverflowX, `${ref} document horizontal overflow`).toBe(false);
  expect(geometry.appOverflowX, `${ref} app horizontal overflow`).toBe(false);

  if (geometry.panel && geometry.stage && geometry.panelOpen === "true") {
    expect(geometry.panel.left, `${ref} panel left contained`).toBeGreaterThanOrEqual(geometry.stage.left - 1);
    expect(geometry.panel.right, `${ref} panel right contained`).toBeLessThanOrEqual(geometry.stage.right + 1);
  }

  if (geometry.viewport === "mobile") {
    expect(geometry.panel?.width ?? 0, `${ref} mobile panel width`).toBeLessThanOrEqual(352);
    expect(geometry.actionNavDisplay, `${ref} mobile action nav hidden`).toBe("none");
  }

  if (geometry.panelOpen === "false") {
    expect(geometry.panel?.height ?? 0, `${ref} closed panel hidden`).toBe(0);
    if (geometry.viewport === "mobile") {
      expect(geometry.fabDisplay, `${ref} mobile FAB visible when closed`).not.toBe("none");
    }
  }

  if (geometry.textarea && geometry.send) {
    expect(geometry.send.height, `${ref} send button stays compact`).toBeLessThanOrEqual(44);
    expect(Math.abs(geometry.textarea.bottom - geometry.send.bottom), `${ref} composer controls bottom-align`).toBeLessThanOrEqual(2);
  }
}

test.describe("build work panel canonicals", () => {
  test("launcher exposes the complete dedicated build work panel render set", async ({ page }) => {
    await page.goto("/design-system/canonicals/build-work-panel");

    const links = page.locator(".canonical-launcher-grid a[href*='/design-system/canonical-renderings/build-work-panel/']");
    await expect(links).toHaveCount(22);

    const hrefs = await links.evaluateAll((elements) => elements.map((element) => element.getAttribute("href")));
    expect(hrefs).toEqual(refs.map((ref) => routeFor(ref)));
  });

  for (const ref of refs) {
    test(`${ref} preserves render, geometry, controls, and contrast`, async ({ page }) => {
      await page.goto(routeFor(ref));

      await expect(page.locator("#build-work-panel-preview-shell[data-render-status='ready']")).toBeVisible();
      await expect(page.locator("#build-work-panel-preview-shell")).toHaveAttribute("data-build-work-panel-canonical-ref", ref);
      await expect(page.locator("#build-work-panel-canonical-current")).toContainText(ref);

      await expectBuildWorkPanelGeometry(page, ref);
      await expectNamedControlsAndMinimumTargets(page, ref);
      await expectNoVisibleTextContrastIssues(page, ref);
    });
  }

  test("tools menu follows menu disclosure keyboard and focus behavior", async ({ page }) => {
    await page.goto(routeFor("BWP-R-014"));

    const toolsToggle = page.getByRole("button", { name: "Open chat tools" });
    const toolsMenu = page.locator("[data-build-work-panel-tools-menu]");
    await expect(toolsToggle).toHaveAttribute("aria-controls", "build-work-panel-tools-menu");
    await expect(toolsToggle).toHaveAttribute("aria-expanded", "true");
    await expect(toolsMenu).toBeVisible();
    await expect(toolsMenu.getByRole("menuitem", { name: "Attach file" })).toBeVisible();
    await expect(toolsMenu.getByRole("menuitem", { name: "Capture screen" })).toBeVisible();
    await expect(toolsMenu.getByRole("menuitem", { name: "Capture logs" })).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(toolsToggle).toHaveAttribute("aria-expanded", "false");
    await expect(toolsMenu).toBeHidden();
    await expect(toolsToggle).toBeFocused();

    await toolsToggle.click();
    await expect(toolsToggle).toHaveAttribute("aria-expanded", "true");
    await expect(toolsMenu).toBeVisible();
    await page.locator(".canonical-render-intro").click();
    await expect(toolsToggle).toHaveAttribute("aria-expanded", "false");
    await expect(toolsMenu).toBeHidden();
  });

  test("long composer input grows without stretching the send button or showing premature scrollbars", async ({ page }) => {
    await page.goto(routeFor("BWP-R-013"));

    const geometry = await page.evaluate(() => {
      const textarea = document.querySelector("[data-build-work-panel-message]");
      const send = document.querySelector(".build-work-panel-demo-send");
      if (!(textarea instanceof HTMLTextAreaElement) || !(send instanceof HTMLElement)) {
        return null;
      }
      const textareaRect = textarea.getBoundingClientRect();
      const sendRect = send.getBoundingClientRect();
      return {
        textareaHeight: textareaRect.height,
        sendHeight: sendRect.height,
        bottomDelta: Math.abs(textareaRect.bottom - sendRect.bottom),
        overflowY: window.getComputedStyle(textarea).overflowY,
        valueLength: textarea.value.length,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry!.valueLength).toBeGreaterThan(200);
    expect(geometry!.textareaHeight).toBeGreaterThan(100);
    expect(geometry!.sendHeight).toBeLessThanOrEqual(44);
    expect(geometry!.bottomDelta).toBeLessThanOrEqual(2);
    expect(geometry!.overflowY).toBe("hidden");
  });

  test("download completed journey removes the packet card and records repeatable history", async ({ page }) => {
    await page.goto(routeFor("BWP-R-015"));

    await expect(page.locator("[data-build-work-panel-packet]")).toHaveCount(0);
    await expect(page.locator("[data-build-work-panel-download]").last()).toHaveAttribute("aria-label", "Download packet again");
    await expect(page.locator(".build-work-panel-demo-message").last()).toContainText(
      "Product Discovery packet downloaded from approved packet version 1",
    );
  });

  test("RTL canonical mirrors panel direction without creating horizontal overflow", async ({ page }) => {
    await page.goto(routeFor("BWP-R-010"));

    await expect(page.locator("#build-work-panel-preview-shell")).toHaveAttribute("dir", "rtl");
    const direction = await page.locator(".build-work-panel-demo-panel").evaluate((panel) => window.getComputedStyle(panel).direction);
    expect(direction).toBe("rtl");
    await expectBuildWorkPanelGeometry(page, "BWP-R-010");
  });

  test("dark mobile preparing-download state keeps status readable and reachable", async ({ page }) => {
    await page.goto(routeFor("BWP-R-020"));

    await expect(page.locator(".build-work-panel-demo-page")).toHaveAttribute("data-demo-theme", "dark");
    await expect(page.locator("#build-work-panel-preview-shell")).toHaveAttribute("data-build-work-panel-viewport", "mobile");
    await expect(page.locator("[data-build-work-panel-download]")).toBeDisabled();
    await expect(page.locator("[data-build-work-panel-download-status]")).toHaveText("Preparing download");
    await expectNoVisibleTextContrastIssues(page, "BWP-R-020");
  });

  test("message edit and harness reply states expose named editing controls", async ({ page }) => {
    await page.goto(routeFor("BWP-R-017"));

    await expect(page.getByRole("textbox", { name: "Edit message" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();

    await page.goto(routeFor("BWP-R-018"));
    await expect(page.getByRole("textbox", { name: "Message the harness" })).toContainText("Replying to:");
  });

  test("history management state exposes new chat, hover actions, archive undo, and archived view", async ({ page }) => {
    await page.goto(routeFor("BWP-R-021"));

    await expect(page.getByRole("button", { name: "Start new chat" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Active" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("button", { name: "Edit chat title" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Archive chat" }).first()).toBeVisible();
    await expect(page.getByRole("status")).toContainText("Chat archived");
    await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();

    await page.goto(routeFor("BWP-R-022"));

    await expect(page.getByRole("tab", { name: "Archived" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("button", { name: "Design-system blockers" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Restore chat" })).toBeVisible();
  });
});
