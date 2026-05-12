import { expect, test, type Page } from "@playwright/test";

async function gotoChatWorkspace(page: Page, url = "/design-system/patterns/chat-workspace") {
  await page.goto(url);
  await expect(page.locator("[data-chat-workspace-shell]")).toBeVisible();
}

async function expandWorkspace(page: Page, options: { dispatch?: boolean } = {}) {
  const shell = page.locator("[data-chat-workspace-shell]");
  if ((await shell.getAttribute("data-chat-workspace-expanded")) !== "true") {
    const toggle = page.locator("[data-chat-workspace-toggle]:visible").first();
    await toggle.scrollIntoViewIfNeeded();
    if (options.dispatch) {
      await toggle.dispatchEvent("click");
    } else {
      await toggle.click();
    }
  }
  await expect(shell).toHaveAttribute("data-chat-workspace-expanded", "true");
  await expect(page.locator(".chat-workspace-main")).toHaveAttribute("aria-hidden", "false");
  await page.waitForTimeout(240);
}

async function revealEntityTab(page: Page, name: string) {
  const workspace = page.locator("[data-chat-workspace-entity-workspace]");
  const tab = workspace.locator(".floating-tab-card").filter({ hasText: name }).first();

  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (await tab.count() > 0 && await tab.first().isVisible()) {
      return tab.first();
    }

    const next = workspace.locator(".floating-tab-scroll-button-right");
    if (!(await next.isVisible()) || await next.isDisabled()) {
      break;
    }

    await next.click({ trial: true }).catch(() => undefined);
    if (!(await next.isVisible()) || await next.isDisabled()) {
      break;
    }
    await next.click();
    await page.waitForTimeout(100);
  }

  await expect(tab).toBeVisible();
  return tab.first();
}

async function expectActiveEntityCategory(page: Page, name: string) {
  const toggle = page.locator("[data-chat-workspace-entity-workspace] #chat-workspace-entity-category-toggle");
  await toggle.click();
  await expect(page.locator("[data-chat-workspace-entity-workspace]").getByRole("radio", { name: new RegExp(`^${name}`) })).toHaveAttribute("aria-checked", "true");
  await toggle.click();
}

test.describe("design-system chat workspace pattern variant", () => {
  test("renders right-docked chat by default and expands workspace beside it", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await gotoChatWorkspace(page);

    await expect(page.getByRole("heading", { name: "Chat Workspace" })).toBeVisible();
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expanded", "false");
    await expect(page.locator(".chat-workspace-chat-pane")).toBeVisible();
    await expect(page.locator(".chat-workspace-main")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("[data-chat-workspace-joint-header]")).not.toBeVisible();
    await expect(page.locator("[data-chat-workspace-layer-toolbar]")).not.toBeVisible();
    await expect(page.locator(".chat-workspace-main-header")).toHaveCount(0);
    await expect(page.locator(".build-work-panel-demo-thread")).toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-history")).toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-action-nav")).toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-mode]")).toHaveCount(3);
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-tools-toggle]")).toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-packet]")).toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-close]")).toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane [data-chat-workspace-toggle]")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-mode=\"discovery\"]")).toHaveAttribute("aria-pressed", "true");

    const collapsedGeometry = await page.evaluate(() => {
      const shell = document.querySelector("[data-chat-workspace-shell]")?.getBoundingClientRect();
      const chat = document.querySelector(".chat-workspace-chat-pane")?.getBoundingClientRect();
      const workspace = document.querySelector(".chat-workspace-main")?.getBoundingClientRect();
      const duration = shell
        ? getComputedStyle(document.querySelector("[data-chat-workspace-shell]") as Element)
            .transitionDuration.split(",")
            .map((value) => value.trim())
        : [];
      return shell && chat && workspace
        ? {
            shellRight: Math.round(shell.right),
            chatRight: Math.round(chat.right),
            shellWidth: Math.round(shell.width),
            workspaceWidth: Math.round(workspace.width),
            viewportRight: document.documentElement.clientWidth,
            duration,
          }
        : null;
    });

    expect(collapsedGeometry).not.toBeNull();
    expect(collapsedGeometry?.shellWidth ?? 0).toBeLessThanOrEqual(834);
    expect(collapsedGeometry?.workspaceWidth ?? 1).toBeLessThanOrEqual(2);
    expect(collapsedGeometry?.chatRight ?? 0).toBeGreaterThan((collapsedGeometry?.viewportRight ?? 0) - 140);
    expect(collapsedGeometry?.duration).toContain("0.16s");

    await expandWorkspace(page);
    await expect(page.locator(".chat-workspace-chat-pane [data-chat-workspace-toggle]")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".chat-workspace-main")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-joint-header]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-joint-header]").getByRole("button", { name: "Collapse workspace" })).toBeVisible();
    await expect(page.locator("[data-chat-workspace-layer-toolbar]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-layer-toolbar] [data-build-work-panel-mode]")).toHaveCount(3);
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-action-nav [data-build-work-panel-mode]")).toHaveCount(3);
    await expect(page.locator("[data-chat-workspace-entity-workspace]").getByRole("tab", { name: "Draft" })).toHaveAttribute("aria-selected", "true");
    await expect(await revealEntityTab(page, "In Refinement")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-entity-workspace] .floating-tab-row")).toHaveCount(3);
    await expect(page.locator("[data-chat-workspace-entity-workspace] #chat-workspace-entity-header")).toHaveAttribute("data-floating-tab-crowded", "true");

    const density = await page.locator("[data-chat-workspace-entity-workspace] #chat-workspace-entity-status-tabs").evaluate((scroller) => {
      const header = scroller.closest("#chat-workspace-entity-header");
      const visibleCards = Array.from(scroller.querySelectorAll(".floating-tab-card"))
        .filter((card) => card instanceof HTMLElement && getComputedStyle(card).display !== "none");

      return {
        visibleCount: visibleCards.length,
        slots: getComputedStyle(header ?? scroller).getPropertyValue("--floating-tab-visible-slots").trim(),
        pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(density.visibleCount).toBeGreaterThanOrEqual(1);
    expect(Number(density.slots)).toBeGreaterThanOrEqual(density.visibleCount);
    expect(density.pageOverflow).toBeLessThanOrEqual(2);

    const geometry = await page.evaluate(() => {
      const chat = document.querySelector(".chat-workspace-chat-pane")?.getBoundingClientRect();
      const workspace = document.querySelector(".chat-workspace-main")?.getBoundingClientRect();
      return chat && workspace
        ? {
            chatLeft: Math.round(chat.left),
            chatRight: Math.round(chat.right),
            workspaceRight: Math.round(workspace.right),
            workspaceWidth: Math.round(workspace.width),
          }
        : null;
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.workspaceRight ?? 0).toBeLessThanOrEqual(geometry?.chatLeft ?? 0);
    expect(Math.abs((geometry?.chatRight ?? 0) - (collapsedGeometry?.chatRight ?? 0))).toBeLessThanOrEqual(2);
    expect(geometry?.workspaceWidth ?? 0).toBeGreaterThan(480);
  });

  test("switches layer tabs and entity tabs without leaving the pattern surface", async ({ page }) => {
    await gotoChatWorkspace(page);
    await expandWorkspace(page);

    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-mode=\"design\"]").click();
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-mode=\"design\"]")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-chat-workspace-entity-workspace]").getByRole("tab", { name: "Queued" })).toHaveAttribute("aria-selected", "true");
    await page.locator("[data-chat-workspace-entity-workspace] #chat-workspace-entity-category-toggle").click();
    await page.locator("[data-chat-workspace-entity-workspace]").getByRole("radio", { name: /Design Questions/ }).click();
    await expectActiveEntityCategory(page, "Design Questions");
    await expect(await revealEntityTab(page, "Answered")).toBeVisible();

    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-mode=\"delivery\"]").click();
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-mode=\"delivery\"]")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-chat-workspace-entity-workspace]").getByRole("tab", { name: "Steering" })).toBeVisible();
    await page.locator("[data-chat-workspace-entity-workspace] #chat-workspace-entity-category-toggle").click();
    await page.locator("[data-chat-workspace-entity-workspace]").getByRole("radio", { name: /Tasks/ }).click();
    await expectActiveEntityCategory(page, "Tasks");
    await expect(await revealEntityTab(page, "Ready for Delivery")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-entity-workspace] .floating-tab-row").first()).toContainText("Task");
  });

  test("keeps the governed chat controls interactive", async ({ page }) => {
    await gotoChatWorkspace(page);

    const panel = page.locator(".chat-workspace-chat-pane [data-build-work-panel-panel]");
    await page.locator("[data-chat-workspace-toggle]:visible").first().click();
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expanded", "true");
    await page.locator("[data-chat-workspace-toggle]:visible").first().click();
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expanded", "false");

    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-history-toggle]").click();
    await expect(panel).toHaveAttribute("data-history-open", "false");

    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-tools-toggle]").click();
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-tools-menu]")).toHaveClass(/is-open/);
    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-tool-action='capture-logs']").click();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-copy-status")).toContainText("capture logs selected");

    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-copy-message]").first().click();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-copy-status")).toContainText("Message copied");

    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-message]").fill("Interactive test message");
    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-message]").press("Enter");
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-message").last()).toContainText("Captured.");

    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-close]").click();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-panel")).not.toHaveClass(/is-open/);
    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-mode='design']").click();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-panel")).toHaveClass(/is-open/);
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-mode='design']")).toHaveAttribute("aria-pressed", "true");
  });

  test("keeps dark, RTL, magnified, and mobile states reachable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await gotoChatWorkspace(page, "/design-system/patterns/chat-workspace?theme=dark&dir=rtl&scale=135");

    const shell = page.locator("[data-chat-workspace-shell]");
    await expect(shell).toHaveAttribute("data-theme-scope", "dark");
    await expect(shell).toHaveAttribute("dir", "rtl");
    await expect(page.locator(".chat-workspace-chat-pane")).toBeVisible();
    await expect(page.locator(".chat-workspace-main")).toHaveAttribute("aria-hidden", "true");
    await expandWorkspace(page, { dispatch: true });
    await expect(page.locator(".chat-workspace-main")).toBeVisible();

    const state = await page.evaluate(() => {
      const shell = document.querySelector("[data-chat-workspace-shell]");
      const chat = document.querySelector(".chat-workspace-chat-pane")?.getBoundingClientRect();
      const workspace = document.querySelector(".chat-workspace-main")?.getBoundingClientRect();
      return {
        scale: shell instanceof HTMLElement ? getComputedStyle(shell).getPropertyValue("--ui-scale").trim() : "",
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        chatAboveWorkspace: chat && workspace ? Math.round(chat.bottom) <= Math.round(workspace.top) : false,
      };
    });

    expect(state.scale).toBe("1.35");
    expect(state.overflow).toBeLessThanOrEqual(2);
    expect(state.chatAboveWorkspace).toBe(true);
  });
});
