import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { PNG } from "playwright-core/lib/utilsBundle";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";

const canonicalStates = Array.from({ length: 20 }, (_, index) => {
  const refNumber = String(index + 1).padStart(3, "0");
  return {
    refId: `CWS-R-${refNumber}`,
    route: `/design-system/canonical-renderings/chat-workspace-shell/CWS-R-${refNumber}`,
  };
});

async function gotoChatWorkspaceCanonical(page: Page, route: string, width = 1640, height = 980) {
  await page.setViewportSize({
    width,
    height,
  });
  await page.goto(route);
  await page.locator('#chat-workspace-preview-frame[data-render-status="ready"]').waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForLoadState("networkidle");
}

async function gotoChatWorkspacePattern(page: Page, route: string) {
  await page.setViewportSize({
    width: 2048,
    height: 1200,
  });
  await page.goto(route);
  await page.locator("[data-chat-workspace-shell]").waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(260);
}

async function normalizeShellForPixelComparison(page: Page) {
  await page.locator("[data-chat-workspace-shell]").evaluate((shell) => {
    if (!(shell instanceof HTMLElement)) {
      return;
    }
    const frame = shell.closest(".chat-workspace-canonical-frame");
    if (frame instanceof HTMLElement) {
      const frameStyle = getComputedStyle(frame);
      const paddingInline = Number.parseFloat(frameStyle.paddingLeft) + Number.parseFloat(frameStyle.paddingRight);
      const paddingBlock = Number.parseFloat(frameStyle.paddingTop) + Number.parseFloat(frameStyle.paddingBottom);
      frame.style.setProperty("--chat-workspace-canonical-fit-scale", "1");
      frame.style.setProperty("--chat-workspace-canonical-frame-width", `${shell.offsetWidth + paddingInline}px`);
      frame.style.setProperty("--chat-workspace-canonical-frame-height", `${shell.offsetHeight + paddingBlock}px`);
    }
    const bounds = shell.getBoundingClientRect();
    shell.style.boxSizing = "border-box";
    shell.style.inlineSize = `${bounds.width}px`;
    shell.style.blockSize = `${bounds.height}px`;
    shell.style.position = "fixed";
    shell.style.insetBlockStart = "0";
    shell.style.insetInlineStart = "0";
    shell.style.margin = "0";
    shell.style.transform = "none";
    shell.style.transformOrigin = "top left";
    shell.style.zIndex = "2147483647";
  });
  await page.waitForTimeout(80);
}

function countPixelDifferences(expectedBuffer: Buffer, actualBuffer: Buffer) {
  const expected = PNG.sync.read(expectedBuffer);
  const actual = PNG.sync.read(actualBuffer);
  const width = Math.min(expected.width, actual.width);
  const height = Math.min(expected.height, actual.height);
  let differentPixels = Math.abs(expected.width - actual.width) * height
    + Math.abs(expected.height - actual.height) * width;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const expectedIndex = (expected.width * y + x) << 2;
      const actualIndex = (actual.width * y + x) << 2;
      const delta = Math.abs(expected.data[expectedIndex] - actual.data[actualIndex])
        + Math.abs(expected.data[expectedIndex + 1] - actual.data[actualIndex + 1])
        + Math.abs(expected.data[expectedIndex + 2] - actual.data[actualIndex + 2])
        + Math.abs(expected.data[expectedIndex + 3] - actual.data[actualIndex + 3]);
      if (delta > 8) {
        differentPixels += 1;
      }
    }
  }

  return {
    actualHeight: actual.height,
    actualWidth: actual.width,
    differentPixels,
    expectedHeight: expected.height,
    expectedWidth: expected.width,
  };
}

async function getShellVisualGeometry(page: Page) {
  return page.locator("[data-chat-workspace-shell]").evaluate((shell) => {
    const shellRect = shell.getBoundingClientRect();
    const readRect = (selector: string) => {
      const rect = shell.querySelector(selector)?.getBoundingClientRect();
      return rect
        ? {
            height: Math.round(rect.height),
            left: Math.round(rect.left - shellRect.left),
            top: Math.round(rect.top - shellRect.top),
            width: Math.round(rect.width),
          }
        : null;
    };

    return {
      shell: {
        height: Math.round(shellRect.height),
        width: Math.round(shellRect.width),
      },
      chatPane: readRect(".chat-workspace-chat-pane"),
      entitySelector: readRect("[data-chat-workspace-entity-selector-trigger]"),
      historyDock: readRect("[data-chat-workspace-history-dock]"),
      jointHeader: readRect("[data-chat-workspace-joint-header]"),
      listPanel: readRect(".floating-tab-list-panel"),
      rightRail: readRect(".chat-workspace-chat-pane .build-work-panel-demo-action-nav"),
      secondaryHeader: readRect("[data-chat-workspace-secondary-header]"),
      statusBar: readRect(".floating-tab-header"),
      toolbar: readRect("[data-chat-workspace-layer-toolbar]"),
    };
  });
}

function expectShellGeometryClose(actual: unknown, expected: unknown, label: string) {
  expect(actual, `${label} should expose canonical geometry`).not.toBeNull();
  expect(expected, `${label} should expose pattern geometry`).not.toBeNull();
  const actualGeometry = actual as Record<string, Record<string, number> | null>;
  const expectedGeometry = expected as Record<string, Record<string, number> | null>;

  for (const key of Object.keys(expectedGeometry)) {
    expect(actualGeometry[key], `${label} ${key} should match presence`).not.toBeNull();
    expect(expectedGeometry[key], `${label} ${key} should match presence`).not.toBeNull();
    const actualRect = actualGeometry[key];
    const expectedRect = expectedGeometry[key];
    if (!actualRect || !expectedRect) {
      continue;
    }
    for (const property of Object.keys(expectedRect)) {
      const tolerance = property === "height" ? 16 : 1;
      expect(
        Math.abs((actualRect[property] ?? 0) - expectedRect[property]),
        `${label} ${key}.${property} should match within subpixel rounding`,
      ).toBeLessThanOrEqual(tolerance);
    }
  }
}

test.describe("design-system chat workspace shell canonical states", () => {
  test("launcher exposes the full chat workspace shell reference set", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/chat-workspace-shell");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(20);
    await expect(page.getByRole("link", { name: /CWS-R-001 Expansion disabled chat-only default/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-001",
    );
    await expect(page.getByRole("link", { name: /CWS-R-020 Mobile stacked shell/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-020",
    );
  });

  test("launcher cards open the dedicated canonical rendering surface", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/chat-workspace-shell");

    await page.getByRole("link", { name: /CWS-R-004 Expanded workspace with index/i }).click();

    await expectRouteSurfaceTruth(page, {
      expectedPath: "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-004",
      surfaceLocator: "#chat-workspace-preview-frame",
      waitForReadyLocator: '#chat-workspace-preview-frame[data-render-status="ready"]',
      bodyAttribute: { name: "data-chat-workspace-shell-surface", value: "canonical" },
      fallbackHeading: /Design-System Route Families/i,
    });
    await expect(page.locator("#chat-workspace-canonical-current")).toContainText("CWS-R-004");
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expanded", "true");
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-history-open", "true");
  });

  for (const scenario of canonicalStates) {
    test(`${scenario.refId} renders on the dedicated canonical surface`, async ({ page }) => {
      const viewportWidth = scenario.refId === "CWS-R-020" ? 760 : 1640;
      await gotoChatWorkspaceCanonical(page, scenario.route, viewportWidth);

      await expectRouteSurfaceTruth(page, {
        expectedPath: scenario.route,
        surfaceLocator: "#chat-workspace-preview-frame",
        waitForReadyLocator: '#chat-workspace-preview-frame[data-render-status="ready"]',
        bodyAttribute: { name: "data-chat-workspace-shell-surface", value: "canonical" },
        fallbackHeading: /Design-System Route Families/i,
      });
      await expect(page.locator("#chat-workspace-canonical-current")).toContainText(scenario.refId);

      const geometry = await page.evaluate(() => {
        const frame = document.querySelector("#chat-workspace-preview-frame")?.getBoundingClientRect();
        const shell = document.querySelector("[data-chat-workspace-shell]")?.getBoundingClientRect();
        const toolbar = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-action-nav")?.getBoundingClientRect();
        const toolbarVisible = toolbar ? toolbar.width > 0 && toolbar.height > 0 : false;
        return frame && shell
          ? {
              shellInsideFrame:
                shell.left >= frame.left - 1
                && shell.right <= frame.right + 1
                && shell.top >= frame.top - 1
                && shell.bottom <= frame.bottom + 1,
              shellWidth: Math.round(shell.width),
              toolbarInsideShell:
                toolbarVisible && toolbar
                  ? toolbar.top >= shell.top - 1 && toolbar.bottom <= shell.bottom + 1
                  : true,
            }
          : null;
      });
      expect(geometry, `${scenario.refId} should expose frame and shell geometry`).not.toBeNull();
      expect(geometry?.shellInsideFrame, `${scenario.refId} shell should stay inside canonical frame`).toBe(true);
      expect(geometry?.shellWidth ?? 0, `${scenario.refId} shell should not collapse into a narrow strip`).toBeGreaterThan(320);
      expect(geometry?.toolbarInsideShell, `${scenario.refId} toolbar should stay within component height`).toBe(true);
    });
  }

  test("core visual postures map to the expected shell states", async ({ page }) => {
    await gotoChatWorkspaceCanonical(page, "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-001");
    await expect(page.locator("[data-chat-workspace-toggle]")).toHaveCount(0);
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expansion-enabled", "false");

    await gotoChatWorkspaceCanonical(page, "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-005");
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expanded", "true");
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-history-open", "false");
    await expect(page.locator("[data-chat-workspace-secondary-list] [data-chat-workspace-entity-selector-trigger]")).toBeVisible();

    await gotoChatWorkspaceCanonical(page, "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-009");
    await expect(page.locator("[data-build-work-panel-packet]")).toHaveCount(0);
    await expect(page.locator(".build-work-panel-demo-composer")).toBeVisible();

    await gotoChatWorkspaceCanonical(page, "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-013");
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-drawer-open", "true");
    await expect(page.locator(".chat-workspace-list-drawer")).toBeVisible();
  });

  test("primary canonical signoff states match the interactive pattern shell pixels", async ({ browser }, testInfo) => {
    const scenarios = [
      {
        name: "collapsed chat-only",
        patternRoute: "/design-system/patterns/chat-workspace",
        canonicalRoute: "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-002",
      },
      {
        name: "collapsed conversation index open",
        patternRoute: "/design-system/patterns/chat-workspace",
        canonicalRoute: "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-003",
        async preparePattern(page: Page) {
          await page.locator("[data-chat-workspace-chat-selector-toggle]").click();
          await page.locator("[data-chat-workspace-shell][data-chat-workspace-history-open='true']").waitFor();
        },
      },
      {
        name: "expanded workspace with index",
        patternRoute: "/design-system/patterns/chat-workspace?expanded=true",
        canonicalRoute: "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-004",
      },
    ];

    for (const scenario of scenarios) {
      const context = await browser.newContext({ viewport: { width: 2048, height: 1200 } });
      const patternPage = await context.newPage();
      const canonicalPage = await context.newPage();

      await gotoChatWorkspacePattern(patternPage, scenario.patternRoute);
      await scenario.preparePattern?.(patternPage);
      await gotoChatWorkspaceCanonical(canonicalPage, scenario.canonicalRoute, 2048, 1200);
      await normalizeShellForPixelComparison(patternPage);
      await normalizeShellForPixelComparison(canonicalPage);
      const patternGeometry = await getShellVisualGeometry(patternPage);
      const canonicalGeometry = await getShellVisualGeometry(canonicalPage);

      const patternShot = await patternPage.locator("[data-chat-workspace-shell]").screenshot({
        animations: "disabled",
      });
      const canonicalShot = await canonicalPage.locator("[data-chat-workspace-shell]").screenshot({
        animations: "disabled",
      });
      const diff = countPixelDifferences(patternShot, canonicalShot);
      if (diff.differentPixels > 0) {
        const safeName = scenario.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
        const patternPath = path.join(testInfo.outputDir, `${safeName}-pattern.png`);
        const canonicalPath = path.join(testInfo.outputDir, `${safeName}-canonical.png`);
        fs.mkdirSync(testInfo.outputDir, { recursive: true });
        fs.writeFileSync(patternPath, patternShot);
        fs.writeFileSync(canonicalPath, canonicalShot);
        await testInfo.attach(`${scenario.name} pattern`, { path: patternPath, contentType: "image/png" });
        await testInfo.attach(`${scenario.name} canonical`, { path: canonicalPath, contentType: "image/png" });
      }

      await context.close();

      expectShellGeometryClose(canonicalGeometry, patternGeometry, scenario.name);

      const maxAllowedAntialiasPixels = Math.ceil(diff.expectedWidth * diff.expectedHeight * 0.06);
      expect(diff.actualWidth, `${scenario.name} canonical width should match the pattern shell`).toBe(diff.expectedWidth);
      expect(
        Math.abs(diff.actualHeight - diff.expectedHeight),
        `${scenario.name} canonical height should match the pattern shell within browser screenshot rounding`,
      ).toBeLessThanOrEqual(16);
      expect(
        diff.differentPixels,
        `${scenario.name} canonical shell should visually match the pattern shell within antialias tolerance`,
      ).toBeLessThanOrEqual(maxAllowedAntialiasPixels);
    }
  });

  test("CWS-R-003 keeps the collapsed index header and chat body in the approved desktop geometry", async ({ page }) => {
    await gotoChatWorkspaceCanonical(page, "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-003");

    const geometry = await page.evaluate(() => {
      const rect = (selector: string) => document.querySelector(selector)?.getBoundingClientRect();
      const secondaryStyle = document.querySelector("[data-chat-workspace-secondary-header]")
        ? getComputedStyle(document.querySelector("[data-chat-workspace-secondary-header]") as Element)
        : null;
      const secondary = rect("[data-chat-workspace-secondary-header]");
      const secondaryIndex = rect("[data-chat-workspace-secondary-index]");
      const newChat = rect("[data-chat-workspace-secondary-new-chat]");
      const history = rect(".chat-workspace-history-dock");
      const chat = rect(".chat-workspace-chat-pane");
      const rail = rect(".chat-workspace-chat-pane .build-work-panel-demo-action-nav");
      const firstMessage = rect(".chat-workspace-chat-pane .build-work-panel-demo-message");
      return secondary && secondaryIndex && newChat && history && chat && rail && firstMessage && secondaryStyle
        ? {
            secondaryIndexLeft: Math.round(secondaryIndex.left),
            secondaryIndexRight: Math.round(secondaryIndex.right),
            secondaryTop: Math.round(secondary.top),
            secondaryRight: Math.round(secondary.right),
            secondaryBottom: Math.round(secondary.bottom),
            historyLeft: Math.round(history.left),
            historyRight: Math.round(history.right),
            chatLeft: Math.round(chat.left),
            chatTop: Math.round(chat.top),
            newChatLeft: Math.round(newChat.left),
            newChatRight: Math.round(newChat.right),
            railLeft: Math.round(rail.left),
            firstMessageTop: Math.round(firstMessage.top),
            secondaryBackground: secondaryStyle.backgroundColor,
          }
        : null;
    });

    expect(geometry, "CWS-R-003 should expose collapsed index geometry").not.toBeNull();
    expect(Math.abs((geometry?.secondaryIndexLeft ?? 0) - (geometry?.historyLeft ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((geometry?.secondaryIndexRight ?? 0) - (geometry?.historyRight ?? 0))).toBeLessThanOrEqual(2);
    expect(geometry?.historyRight ?? 0).toBeLessThanOrEqual(geometry?.chatLeft ?? 0);
    expect(geometry?.newChatLeft ?? 0).toBeGreaterThan((geometry?.chatLeft ?? 0) + 160);
    expect(Math.abs((geometry?.newChatRight ?? 0) - (geometry?.secondaryRight ?? 0))).toBeLessThanOrEqual(2);
    expect(geometry?.secondaryRight ?? 0).toBeLessThanOrEqual(geometry?.railLeft ?? 0);
    expect(Math.abs((geometry?.chatTop ?? 0) - (geometry?.secondaryBottom ?? 0))).toBeLessThanOrEqual(2);
    expect(geometry?.firstMessageTop ?? 0).toBeGreaterThan(geometry?.secondaryBottom ?? 0);
    expect(geometry?.secondaryBackground).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("entity status sets stay unique and entity counts equal visible tab totals", async ({ page }) => {
    await gotoChatWorkspaceCanonical(page, "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-010");

    const statusState = await page.locator("[data-chat-workspace-entity-workspace]").evaluate((workspace) => {
      const cards = Array.from(workspace.querySelectorAll(".floating-tab-card:not(.hidden)"));
      const labels = cards.map((card) => card.getAttribute("data-tab-label") ?? "").filter(Boolean);
      const counts = cards.map((card) => Number(card.getAttribute("data-tab-count") ?? "0"));
      const selectorText = document.querySelector("[data-chat-workspace-entity-selector-trigger]")?.textContent ?? "";
      return {
        labels,
        duplicateLabels: labels.filter((label, index) => labels.indexOf(label) !== index),
        tabTotal: counts.reduce((total, count) => total + count, 0),
        selectorText,
      };
    });

    expect(statusState.labels).toEqual(["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"]);
    expect(statusState.duplicateLabels).toEqual([]);
    expect(statusState.selectorText).toContain("Questions");
    expect(statusState.tabTotal).toBe(22);
  });

  test("CWS-R-012 uses the shared list drop-here reorder marker", async ({ page }) => {
    await gotoChatWorkspaceCanonical(page, "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-012", 2048, 1200);

    const marker = page.locator("[data-chat-workspace-entity-workspace] [data-drag-drop-marker]");
    await expect(marker).toHaveCount(1);
    await expect(marker).toHaveAttribute("data-drag-drop-marker-label", "Drop here");
    await expect(marker).toHaveClass(/drag-drop-marker/);
    await expect(marker).toHaveClass(/floating-tab-drop-marker/);
  });

  test("CWS-R-018 keeps the list geometry steady while the entity selector is open", async ({ page }) => {
    await gotoChatWorkspaceCanonical(page, "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-018", 1640, 1100);

    const samples = await page.evaluate(async () => {
      const out = [];
      for (let index = 0; index < 18; index += 1) {
        const header = document.querySelector(".floating-tab-header")?.getBoundingClientRect();
        const panel = document.querySelector(".floating-tab-list-panel")?.getBoundingClientRect();
        const row = document.querySelector("[data-chat-workspace-list-row]")?.getBoundingClientRect();
        out.push({
          headerHeight: header ? Math.round(header.height) : 0,
          panelHeight: panel ? Math.round(panel.height) : 0,
          panelY: panel ? Math.round(panel.y) : 0,
          rowY: row ? Math.round(row.y) : 0,
        });
        await new Promise((resolve) => window.requestAnimationFrame(resolve));
      }
      return out;
    });

    const range = (values: number[]) => Math.max(...values) - Math.min(...values);
    expect(samples.length).toBeGreaterThan(0);
    expect(range(samples.map((sample) => sample.headerHeight))).toBeLessThanOrEqual(1);
    expect(range(samples.map((sample) => sample.panelY))).toBeLessThanOrEqual(1);
    expect(range(samples.map((sample) => sample.panelHeight))).toBeLessThanOrEqual(1);
    expect(range(samples.map((sample) => sample.rowY))).toBeLessThanOrEqual(1);
  });

  test("CWS-R-019 mirrors the workspace rail and keeps chat on the dark theme", async ({ page }) => {
    await gotoChatWorkspaceCanonical(page, "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-019", 1640, 1100);

    const geometry = await page.evaluate(() => {
      const shell = document.querySelector("[data-chat-workspace-shell]");
      const rect = (selector: string) => document.querySelector(selector)?.getBoundingClientRect();
      const color = (selector: string) => {
        const element = document.querySelector(selector);
        return element ? getComputedStyle(element).backgroundColor : "";
      };
      const chat = rect(".chat-workspace-chat-pane");
      const main = rect("[data-chat-workspace-main]");
      const shellRect = rect("[data-chat-workspace-shell]");
      const toolbar = rect("[data-chat-workspace-layer-toolbar]");
      const actionNav = rect(".chat-workspace-chat-pane .build-work-panel-demo-action-nav");
      const jointHeader = rect("[data-chat-workspace-joint-header]");
      const headerTitle = rect(".chat-workspace-header-title");
      const headerActions = rect("[data-chat-workspace-joint-header] .build-work-panel-demo-header-actions");
      const secondaryHeader = rect("[data-chat-workspace-secondary-header]");
      const secondaryChat = rect("[data-chat-workspace-secondary-chat]");
      const secondaryList = rect("[data-chat-workspace-secondary-list]");
      const secondaryNewChat = rect("[data-chat-workspace-secondary-new-chat]");
      const actionNavBuild = rect(".chat-workspace-chat-pane .build-work-panel-demo-action-nav");
      const firstActionButton = rect(".chat-workspace-chat-pane .build-work-panel-demo-action-nav .build-work-panel-demo-action");
      const firstHarnessMessage = rect(".chat-workspace-chat-pane .build-work-panel-demo-message:not(.is-user)");
      const firstBuilderMessage = rect(".chat-workspace-chat-pane .build-work-panel-demo-message.is-user");
      const packetText = rect(".chat-workspace-chat-pane .build-work-panel-demo-packet-row > div");
      const packetButton = rect(".chat-workspace-chat-pane .build-work-panel-demo-download");
      const composerTools = rect(".chat-workspace-chat-pane .build-work-panel-demo-tools-toggle");
      const composerInput = rect(".chat-workspace-chat-pane .build-work-panel-demo-composer textarea");
      const composerSend = rect(".chat-workspace-chat-pane .build-work-panel-demo-send");
      const chatTriggerIcon = rect("[data-chat-workspace-secondary-chat] .chat-workspace-layer-trigger-icon");
      const chatTriggerText = rect("[data-chat-workspace-secondary-chat] .chat-workspace-chat-title-trigger > span:first-child");
      const entityTriggerIcon = rect("[data-chat-workspace-secondary-list] .chat-workspace-entity-trigger-icon");
      const entityTriggerText = rect("[data-chat-workspace-secondary-list] .chat-workspace-entity-trigger-card .floating-tab-project-kicker");
      const scrollArrowTransform = (selector: string) => {
        const element = document.querySelector(selector);
        return element ? getComputedStyle(element).transform : "";
      };
      const actionNavStyle = actionNavBuild ? getComputedStyle(document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-action-nav") as Element) : null;
      return shell && shellRect && chat && main && toolbar && actionNav && jointHeader && headerTitle && headerActions && secondaryHeader && secondaryChat && secondaryList && secondaryNewChat
        && firstActionButton
        && actionNavBuild && firstHarnessMessage && firstBuilderMessage && packetText && packetButton && composerTools && composerInput && composerSend
        && chatTriggerIcon && chatTriggerText && entityTriggerIcon && entityTriggerText && actionNavStyle
        ? {
            actionNavContentBorderMirrored:
              actionNavStyle.borderLeftWidth === "0px"
              && actionNavStyle.borderRightWidth === "1px"
              && actionNavStyle.borderRightStyle === "solid",
            actionNavInsideShell:
              actionNav.top >= shellRect.top - 1
              && actionNav.bottom <= shellRect.bottom + 1
              && actionNav.left >= shellRect.left - 1
              && actionNav.right <= shellRect.right + 1,
            actionNavRailSpansShellHeight:
              Math.abs(actionNavBuild.top - shellRect.top) <= 2
              && actionNavBuild.height >= shellRect.height - 4,
            firstActionSitsInSecondaryRow:
              firstActionButton.top >= secondaryHeader.top - 1
              && firstActionButton.bottom <= secondaryHeader.bottom + 1
              && firstActionButton.right <= secondaryNewChat.left + 1,
            actionNavOnChatStart: actionNavBuild.left <= chat.left + 1,
            actionNavBackground: color(".chat-workspace-chat-pane .build-work-panel-demo-action-nav"),
            builderMessageMirrored: firstBuilderMessage.left < firstHarnessMessage.left,
            chatBackground: color(".chat-workspace-chat-pane"),
            chatTriggerCaretMirrored: chatTriggerIcon.right <= chatTriggerText.left + 1,
            chatLeftOfMain: chat.right <= main.left + 1,
            composerMirrored: composerSend.right <= composerInput.left + 1 && composerTools.left >= composerInput.right - 1,
            entityTriggerCaretMirrored: entityTriggerIcon.right <= entityTriggerText.left + 1,
            headerActionsOverChat: headerActions.left >= chat.left - 1 && headerActions.right <= chat.right + 1,
            headerActionsSameRow: Math.abs(headerActions.top - headerTitle.top) <= 1,
            jointHeaderSingleRow: jointHeader.height <= Math.max(headerTitle.height, headerActions.height) + 64,
            headerTitleOverMain: headerTitle.left >= main.left - 1 && headerTitle.right <= main.right + 1,
            messageBackground: color(".chat-workspace-chat-pane .build-work-panel-demo-message"),
            packetMirrored: packetButton.right <= packetText.left + 1,
            secondaryChatOverChat: secondaryChat.left >= chat.left - 1 && secondaryChat.right <= chat.right + 1,
            secondaryHeaderSingleRow: secondaryHeader.height <= Math.max(secondaryChat.height, secondaryList.height) + 4,
            secondaryNewChatMirrored:
              secondaryNewChat.left >= actionNavBuild.right - 1
              && secondaryNewChat.right <= secondaryChat.left + 1
              && secondaryNewChat.top >= secondaryHeader.top - 1
              && secondaryNewChat.bottom <= secondaryHeader.bottom + 1,
            secondarySectionsSameRow: Math.abs(secondaryChat.top - secondaryList.top) <= 1,
            secondaryListOverMain: secondaryList.left >= main.left - 1 && secondaryList.right <= main.right + 1,
            shellDirection: shell.getAttribute("dir"),
            tabArrowsMirrored:
              scrollArrowTransform(".floating-tab-scroll-button-left svg").includes("-1")
              && scrollArrowTransform(".floating-tab-scroll-button-right svg").includes("-1"),
            toolbarBackground: color("[data-chat-workspace-layer-toolbar]"),
            toolbarSpansShellFromTop: Math.abs(toolbar.top - shellRect.top) <= 3 && Math.abs(toolbar.bottom - shellRect.bottom) <= 3,
            toolbarTouchesMain: Math.abs(toolbar.left - main.right) <= 1,
            toolbarRightOfMain: toolbar.left >= main.right - 1,
          }
        : null;
    });

    expect(geometry, "dark RTL geometry should be measurable").not.toBeNull();
    expect(geometry?.shellDirection).toBe("rtl");
    expect(geometry?.chatLeftOfMain).toBe(true);
    expect(geometry?.toolbarRightOfMain).toBe(true);
    expect(geometry?.toolbarTouchesMain).toBe(true);
    expect(geometry?.actionNavContentBorderMirrored).toBe(true);
    expect(geometry?.actionNavInsideShell).toBe(true);
    expect(geometry?.actionNavRailSpansShellHeight).toBe(true);
    expect(geometry?.firstActionSitsInSecondaryRow).toBe(true);
    expect(geometry?.actionNavOnChatStart).toBe(true);
    expect(geometry?.builderMessageMirrored).toBe(true);
    expect(geometry?.chatTriggerCaretMirrored).toBe(true);
    expect(geometry?.composerMirrored).toBe(true);
    expect(geometry?.entityTriggerCaretMirrored).toBe(true);
    expect(geometry?.headerActionsOverChat).toBe(true);
    expect(geometry?.headerActionsSameRow).toBe(true);
    expect(geometry?.jointHeaderSingleRow).toBe(true);
    expect(geometry?.headerTitleOverMain).toBe(true);
    expect(geometry?.packetMirrored).toBe(true);
    expect(geometry?.secondaryChatOverChat).toBe(true);
    expect(geometry?.secondaryHeaderSingleRow).toBe(true);
    expect(geometry?.secondaryNewChatMirrored).toBe(true);
    expect(geometry?.secondarySectionsSameRow).toBe(true);
    expect(geometry?.secondaryListOverMain).toBe(true);
    expect(geometry?.tabArrowsMirrored).toBe(true);
    expect(geometry?.toolbarSpansShellFromTop).toBe(true);
    expect(geometry?.chatBackground).toBe("rgb(17, 24, 39)");
    expect(geometry?.toolbarBackground).toBe("rgb(17, 24, 39)");
    expect(geometry?.actionNavBackground).toBe("rgb(17, 24, 39)");
    expect(geometry?.messageBackground).toBe("rgb(23, 32, 51)");
  });

  test("CWS-R-020 overlays the conversation index instead of narrowing the mobile chat", async ({ page }) => {
    await gotoChatWorkspaceCanonical(page, "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-020", 760, 1100);

    const geometry = await page.evaluate(() => {
      const rect = (selector: string) => document.querySelector(selector)?.getBoundingClientRect();
      const chat = rect(".chat-workspace-chat-pane");
      const secondary = rect("[data-chat-workspace-secondary-header]");
      const history = rect(".chat-workspace-history-dock");
      const shell = rect("[data-chat-workspace-shell]");
      const actionNav = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-action-nav");
      return chat && secondary && history && shell && actionNav
        ? {
            actionNavHidden:
              getComputedStyle(actionNav).display === "none"
              || Math.round(actionNav.getBoundingClientRect().width) === 0,
            chatWidth: Math.round(chat.width),
            historyBelowSecondary: history.top >= secondary.bottom - 1,
            historyOverlapsChat: history.left < chat.right && history.right > chat.left,
            historyWithinShell:
              history.left >= shell.left - 1
              && history.right <= shell.right + 1
              && history.top >= shell.top - 1
              && history.bottom <= shell.bottom + 1,
          }
        : null;
    });

    expect(geometry, "mobile overlay geometry should be measurable").not.toBeNull();
    expect(geometry?.actionNavHidden).toBe(true);
    expect(geometry?.chatWidth ?? 0).toBeGreaterThan(320);
    expect(geometry?.historyBelowSecondary).toBe(true);
    expect(geometry?.historyOverlapsChat).toBe(true);
    expect(geometry?.historyWithinShell).toBe(true);
  });

  test("CWS-R-020 hides workspace expansion and stays full-width after index close", async ({ page }) => {
    await gotoChatWorkspaceCanonical(page, "/design-system/canonical-renderings/chat-workspace-shell/CWS-R-020", 760, 1100);

    await page.locator("[data-chat-workspace-chat-selector-toggle]").first().click();
    await page.waitForTimeout(240);

    const geometry = await page.evaluate(() => {
      const rect = (selector: string) => document.querySelector(selector)?.getBoundingClientRect();
      const shell = document.querySelector("[data-chat-workspace-shell]");
      const chat = rect(".chat-workspace-chat-pane");
      const header = rect("[data-chat-workspace-joint-header]");
      const history = rect(".chat-workspace-history-dock");
      const list = rect("[data-chat-workspace-main]");
      const secondary = rect("[data-chat-workspace-secondary-header]");
      const actionNav = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-action-nav");
      const visibleWorkspaceToggle = Array.from(document.querySelectorAll("[data-chat-workspace-toggle]"))
        .filter((toggle) => {
          const style = getComputedStyle(toggle);
          const box = toggle.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
        });
      return shell && chat && header && history && list && secondary && actionNav
        ? {
            actionNavHidden:
              getComputedStyle(actionNav).display === "none"
              || Math.round(actionNav.getBoundingClientRect().width) === 0,
            chatWidth: Math.round(chat.width),
            expanded: shell.getAttribute("data-chat-workspace-expanded"),
            headerWidth: Math.round(header.width),
            historyHidden: Math.round(history.width) === 0 || getComputedStyle(document.querySelector(".chat-workspace-history-dock") as Element).display === "none",
            historyOpen: shell.getAttribute("data-chat-workspace-history-open"),
            listHidden: getComputedStyle(document.querySelector("[data-chat-workspace-main]") as Element).visibility === "hidden",
            secondaryWidth: Math.round(secondary.width),
            visibleWorkspaceToggleCount: visibleWorkspaceToggle.length,
          }
        : null;
    });

    expect(geometry, "mobile no-index geometry should be measurable").not.toBeNull();
    expect(geometry?.expanded).toBe("false");
    expect(geometry?.historyOpen).toBe("false");
    expect(geometry?.actionNavHidden).toBe(true);
    expect(geometry?.historyHidden).toBe(true);
    expect(geometry?.listHidden).toBe(true);
    expect(geometry?.visibleWorkspaceToggleCount).toBe(0);
    expect(geometry?.chatWidth ?? 0).toBeGreaterThan(320);
    expect(geometry?.headerWidth ?? 0).toBeGreaterThan(320);
    expect(geometry?.secondaryWidth ?? 0).toBeGreaterThan(320);
  });
});
