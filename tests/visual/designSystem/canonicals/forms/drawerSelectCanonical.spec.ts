import { expect, test, type Page, type TestInfo } from "@playwright/test";

import {
  expectComputedColor,
  withHumanReviewGuard,
} from "../../support/helpers/humanReviewGuards";

type ScreenshotDiffResult =
  | {
      comparable: false;
      reason: "canvas-unavailable";
    }
  | {
      comparable: false;
      reason: "size-mismatch";
      baselineWidth: number;
      baselineHeight: number;
      actualWidth: number;
      actualHeight: number;
    }
  | {
      comparable: true;
      diffPixels: number;
      width: number;
      height: number;
    };

const drawerSelectCanonicalStates = [
  {
    refId: "DSR-001",
    label: "descriptive resting three-plus summary",
    route: "/design-system/components/drawer-select?ref=DSR-001&width=940&state=collections-resting-threeplus&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: false,
    expectedSummary: "Ops Core, Customer Success +1 more",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "3 selected",
    searchValue: "",
  },
  {
    refId: "DSR-002",
    label: "descriptive open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-002&width=940&state=collections-open&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: true,
    expectedSummary: "Ops Core, Customer Success +1 more",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "3 selected",
    searchValue: "",
  },
  {
    refId: "DSR-003",
    label: "descriptive no-match search",
    route: "/design-system/components/drawer-select?ref=DSR-003&width=940&state=collections-no-match&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: true,
    expectedSummary: "Ops Core, Customer Success +1 more",
    expectedVisibleOptions: 0,
    expectedSelectedCount: "3 selected",
    searchValue: "zzzz",
  },
  {
    refId: "DSR-004",
    label: "descriptive no-selected open state",
    route: "/design-system/components/drawer-select?ref=DSR-004&width=940&state=collections-empty-open&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: true,
    expectedSummary: "Choose collections",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "0 selected",
    searchValue: "",
    expectSelectedEmpty: true,
  },
  {
    refId: "DSR-005",
    label: "compact open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-005&width=820&state=segments-open&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "segments",
    expectedOpen: true,
    expectedSummary: "New Admins, At-Risk Renewals",
    expectedVisibleOptions: 6,
    expectedSelectedCount: "2 selected",
    searchValue: "",
    expectedVariant: "attribute-cards",
  },
  {
    refId: "DSR-006",
    label: "descriptive resting two summary",
    route: "/design-system/components/drawer-select?ref=DSR-006&width=940&state=collections-resting-two&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: false,
    expectedSummary: "Ops Core, Customer Success",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "2 selected",
    searchValue: "",
  },
  {
    refId: "DSR-007",
    label: "descriptive resting one summary",
    route: "/design-system/components/drawer-select?ref=DSR-007&width=940&state=collections-resting-one&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: false,
    expectedSummary: "Ops Core",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "1 selected",
    searchValue: "",
  },
  {
    refId: "DSR-008",
    label: "descriptive open after add",
    route: "/design-system/components/drawer-select?ref=DSR-008&width=940&state=collections-open-after-add&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: true,
    expectedSummary: "Ops Core, Finance Admins +2 more",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "4 selected",
    searchValue: "",
  },
  {
    refId: "DSR-009",
    label: "descriptive open after remove",
    route: "/design-system/components/drawer-select?ref=DSR-009&width=940&state=collections-open-after-remove&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: true,
    expectedSummary: "Ops Core, Customer Success",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "2 selected",
    searchValue: "",
  },
  {
    refId: "DSR-010",
    label: "descriptive empty resting",
    route: "/design-system/components/drawer-select?ref=DSR-010&width=940&state=collections-empty-resting&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: false,
    expectedSummary: "Choose collections",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "0 selected",
    searchValue: "",
  },
  {
    refId: "DSR-011",
    label: "compact resting populated",
    route: "/design-system/components/drawer-select?ref=DSR-011&width=820&state=segments-resting&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "segments",
    expectedOpen: false,
    expectedSummary: "New Admins, At-Risk Renewals",
    expectedVisibleOptions: 6,
    expectedSelectedCount: "2 selected",
    searchValue: "",
    expectedVariant: "attribute-cards",
  },
  {
    refId: "DSR-012",
    label: "compact empty resting",
    route: "/design-system/components/drawer-select?ref=DSR-012&width=820&state=segments-empty-resting&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "segments",
    expectedOpen: false,
    expectedSummary: "Choose segments",
    expectedVisibleOptions: 6,
    expectedSelectedCount: "0 selected",
    searchValue: "",
    expectedVariant: "attribute-cards",
  },
  {
    refId: "DSR-013",
    label: "compact no-selected open state",
    route: "/design-system/components/drawer-select?ref=DSR-013&width=820&state=segments-empty-open&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "segments",
    expectedOpen: true,
    expectedSummary: "Choose segments",
    expectedVisibleOptions: 6,
    expectedSelectedCount: "0 selected",
    searchValue: "",
    expectedVariant: "attribute-cards",
    expectSelectedEmpty: true,
  },
  {
    refId: "DSR-014",
    label: "compact no-match search",
    route: "/design-system/components/drawer-select?ref=DSR-014&width=820&state=segments-no-match&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "segments",
    expectedOpen: true,
    expectedSummary: "New Admins, At-Risk Renewals",
    expectedVisibleOptions: 0,
    expectedSelectedCount: "2 selected",
    searchValue: "zzzz",
    expectedVariant: "attribute-cards",
  },
  {
    refId: "DSR-015",
    label: "rtl descriptive open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-015&width=940&state=collections-open&theme=normal&dir=rtl&zoom=0",
    expectedFixture: "collections",
    expectedOpen: true,
    expectedSummary: "Ops Core, Customer Success +1 more",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "3 selected",
    searchValue: "",
    expectedDir: "rtl",
  },
  {
    refId: "DSR-016",
    label: "dark magnified compact open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-016&width=820&state=segments-open&theme=dark&dir=ltr&zoom=100",
    expectedFixture: "segments",
    expectedOpen: true,
    expectedSummary: "New Admins, At-Risk Renewals",
    expectedVisibleOptions: 6,
    expectedSelectedCount: "2 selected",
    searchValue: "",
    expectedVariant: "attribute-cards",
    expectedTheme: "dark",
    expectedMagnification: "100",
  },
  {
    refId: "DSR-017",
    label: "mobile descriptive open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-017&width=390&state=collections-open&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: true,
    expectedSummary: "Ops Core, Customer Success +1 more",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "3 selected",
    searchValue: "",
    expectedViewportClass: "mobile",
    expectedMobileView: "true",
  },
  {
    refId: "DSR-018",
    label: "mobile compact open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-018&width=390&state=segments-open&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "segments",
    expectedOpen: true,
    expectedSummary: "New Admins, At-Risk Renewals",
    expectedVisibleOptions: 6,
    expectedSelectedCount: "2 selected",
    searchValue: "",
    expectedVariant: "attribute-cards",
    expectedViewportClass: "mobile",
    expectedMobileView: "true",
  },
  {
    refId: "DSR-019",
    label: "descriptive open drawer with long-label stress",
    route: "/design-system/components/drawer-select?ref=DSR-019&width=940&state=collections-open-long&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: true,
    expectedSummary: "Operations Coordination Council, Customer Success Enablement Leadership +1 more",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "3 selected",
    searchValue: "",
  },
  {
    refId: "DSR-020",
    label: "compact open drawer with long-label stress",
    route: "/design-system/components/drawer-select?ref=DSR-020&width=820&state=segments-open-long&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "segments",
    expectedOpen: true,
    expectedSummary: "Newly Added Workspace Administrators, Accounts With At-Risk Renewal Signals",
    expectedVisibleOptions: 6,
    expectedSelectedCount: "2 selected",
    searchValue: "",
    expectedVariant: "attribute-cards",
  },
  {
    refId: "DSR-021",
    label: "localized rtl descriptive open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-021&width=940&state=collections-open-localized&theme=normal&dir=rtl&zoom=0",
    expectedFixture: "collections",
    expectedOpen: true,
    expectedSummary: "فريق التشغيل الأساسي, فريق نجاح العملاء",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "2 selected",
    searchValue: "",
    expectedDir: "rtl",
  },
  {
    refId: "DSR-022",
    label: "localized rtl compact open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-022&width=820&state=segments-open-localized&theme=normal&dir=rtl&zoom=0",
    expectedFixture: "segments",
    expectedOpen: true,
    expectedSummary: "المسؤولون الجدد, التجديدات المعرضة للخطر",
    expectedVisibleOptions: 6,
    expectedSelectedCount: "2 selected",
    searchValue: "",
    expectedDir: "rtl",
    expectedVariant: "attribute-cards",
  },
  {
    refId: "DSR-023",
    label: "disabled descriptive resting review",
    route: "/design-system/components/drawer-select?ref=DSR-023&width=940&state=collections-resting-disabled&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: false,
    expectedSummary: "Ops Core, Customer Success +1 more",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "3 selected",
    searchValue: "",
    expectedDisabled: "true",
  },
  {
    refId: "DSR-024",
    label: "disabled compact resting review",
    route: "/design-system/components/drawer-select?ref=DSR-024&width=820&state=segments-resting-disabled&theme=normal&dir=ltr&zoom=0",
    expectedFixture: "segments",
    expectedOpen: false,
    expectedSummary: "New Admins, At-Risk Renewals",
    expectedVisibleOptions: 6,
    expectedSelectedCount: "2 selected",
    searchValue: "",
    expectedVariant: "attribute-cards",
    expectedDisabled: "true",
  },
  {
    refId: "DSR-025",
    label: "dark compact open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-025&width=820&state=segments-open-dark&theme=dark&dir=ltr&zoom=0",
    expectedFixture: "segments",
    expectedOpen: true,
    expectedSummary: "New Admins, At-Risk Renewals",
    expectedVisibleOptions: 6,
    expectedSelectedCount: "2 selected",
    searchValue: "",
    expectedVariant: "attribute-cards",
    expectedTheme: "dark",
  },
  {
    refId: "DSR-026",
    label: "dark mobile descriptive open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-026&width=390&state=collections-open-mobile-dark&theme=dark&dir=ltr&zoom=0",
    expectedFixture: "collections",
    expectedOpen: true,
    expectedSummary: "Ops Core, Customer Success +1 more",
    expectedVisibleOptions: 8,
    expectedSelectedCount: "3 selected",
    searchValue: "",
    expectedTheme: "dark",
    expectedViewportClass: "mobile",
    expectedMobileView: "true",
  },
  {
    refId: "DSR-027",
    label: "dark mobile compact open drawer",
    route: "/design-system/components/drawer-select?ref=DSR-027&width=390&state=segments-open-mobile-dark&theme=dark&dir=ltr&zoom=0",
    expectedFixture: "segments",
    expectedOpen: true,
    expectedSummary: "New Admins, At-Risk Renewals",
    expectedVisibleOptions: 6,
    expectedSelectedCount: "2 selected",
    searchValue: "",
    expectedTheme: "dark",
    expectedVariant: "attribute-cards",
    expectedViewportClass: "mobile",
    expectedMobileView: "true",
  },
] as const;

async function gotoCanonicalState(page: Page, route: string) {
  const resolvedRoute = new URL(route, "http://localhost");
  const requestedWidth = Number.parseInt(resolvedRoute.searchParams.get("width") ?? "0", 10);
  const viewportWidth = Math.max(requestedWidth + 360, 1280);

  await page.setViewportSize({ width: viewportWidth, height: 1600 });
  await page.goto(route);
  await page.locator('#drawer-select-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

async function gotoFormTemplate(page: Page, route: string, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.goto(route);
}

async function openDrawerSelectAtIndex(page: Page, index: number) {
  const trigger = page.locator("[data-form-drawer-select-button]").nth(index);
  const panel = page.locator("[data-form-drawer-select-panel]").nth(index);
  await trigger.click();
  await expect(panel).toBeVisible();
  return { trigger, panel };
}

async function captureApprovedFormSeam(
  page: Page,
  index: number,
  options?: { viewport?: { width: number; height: number }; route?: string },
) {
  await gotoFormTemplate(
    page,
    options?.route ?? "/design-system/templates/form",
    options?.viewport ?? { width: 1400, height: 1600 },
  );

  const seam = await openDrawerSelectAtIndex(page, index);
  const screenshotOptions = {
    animations: "disabled" as const,
    caret: "hide" as const,
  };

  return {
    triggerShot: await seam.trigger.screenshot(screenshotOptions),
    panelShot: await seam.panel.screenshot(screenshotOptions),
    triggerBox: await seam.trigger.boundingBox(),
    panelBox: await seam.panel.boundingBox(),
  };
}

async function expectApprovedScreenshotParity(
  page: Page,
  baselineShot: Buffer,
  canonicalLocator: ReturnType<Page["locator"]>,
  snapshotLabel: string,
  testInfo: TestInfo,
  options?: { maxDiffPixels?: number; maxDiffRatio?: number; sizeTolerancePixels?: number },
) {
  const screenshotOptions = {
    animations: "disabled" as const,
    caret: "hide" as const,
  };
  const canonicalShot = await canonicalLocator.screenshot(screenshotOptions);
  const maxDiffPixels = options?.maxDiffPixels ?? 1000;
  const maxDiffRatio = options?.maxDiffRatio ?? null;
  const sizeTolerancePixels = options?.sizeTolerancePixels ?? 0;

  const diffResult = await page.evaluate<
    ScreenshotDiffResult,
    { baseline: string; actual: string; sizeTolerance: number }
  >(async ({ baseline, actual, sizeTolerance }) => {
    const loadImageData = async (data: string): Promise<ImageData | null> => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();

      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");

      if (!context) {
        return null;
      }

      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height);
    };

    const baselineData = await loadImageData(baseline);
    const actualData = await loadImageData(actual);

    if (!baselineData || !actualData) {
      return { comparable: false, reason: "canvas-unavailable" };
    }

    const widthDelta = Math.abs(baselineData.width - actualData.width);
    const heightDelta = Math.abs(baselineData.height - actualData.height);
    if (widthDelta > sizeTolerance || heightDelta > sizeTolerance) {
      return {
        comparable: false,
        reason: "size-mismatch",
        baselineWidth: baselineData.width,
        baselineHeight: baselineData.height,
        actualWidth: actualData.width,
        actualHeight: actualData.height,
      };
    }

    let diffPixels = 0;
    const width = Math.min(baselineData.width, actualData.width);
    const height = Math.min(baselineData.height, actualData.height);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const baselineIndex = (y * baselineData.width + x) * 4;
        const actualIndex = (y * actualData.width + x) * 4;
        const redDelta = Math.abs(baselineData.data[baselineIndex] - actualData.data[actualIndex]);
        const greenDelta = Math.abs(baselineData.data[baselineIndex + 1] - actualData.data[actualIndex + 1]);
        const blueDelta = Math.abs(baselineData.data[baselineIndex + 2] - actualData.data[actualIndex + 2]);
        const alphaDelta = Math.abs(baselineData.data[baselineIndex + 3] - actualData.data[actualIndex + 3]);

        if (redDelta > 8 || greenDelta > 8 || blueDelta > 8 || alphaDelta > 8) {
          diffPixels += 1;
        }
      }
    }

    return {
      comparable: true,
      diffPixels,
      width,
      height,
    };
  }, {
    baseline: baselineShot.toString("base64"),
    actual: canonicalShot.toString("base64"),
    sizeTolerance: sizeTolerancePixels,
  });

  if (!diffResult.comparable || diffResult.diffPixels > maxDiffPixels) {
    await testInfo.attach(`${snapshotLabel}-approved-form`, {
      body: baselineShot,
      contentType: "image/png",
    });
    await testInfo.attach(`${snapshotLabel}-canonical-render`, {
      body: canonicalShot,
      contentType: "image/png",
    });
  }

  expect(
    diffResult.comparable,
    `${snapshotLabel} should produce a comparable screenshot against the approved form-template render`,
  ).toBe(true);
  if (diffResult.comparable) {
    if (maxDiffRatio !== null) {
      expect(
        diffResult.diffPixels / (diffResult.width * diffResult.height),
        `${snapshotLabel} should stay within ${(maxDiffRatio * 100).toFixed(2)}% differing pixels of the approved form-template render`,
      ).toBeLessThanOrEqual(maxDiffRatio);
    } else {
      expect(
        diffResult.diffPixels,
        `${snapshotLabel} should stay within ${maxDiffPixels} differing pixels of the approved form-template render`,
      ).toBeLessThanOrEqual(maxDiffPixels);
    }
  }
}

async function expectApprovedOverlayGeometryParity(
  baselineTriggerBox: Awaited<ReturnType<ReturnType<Page["locator"]>["boundingBox"]>>,
  baselinePanelBox: Awaited<ReturnType<ReturnType<Page["locator"]>["boundingBox"]>>,
  canonicalTrigger: ReturnType<Page["locator"]>,
  canonicalPanel: ReturnType<Page["locator"]>,
) {
  const [canonicalTriggerBox, canonicalPanelBox] = await Promise.all([
    canonicalTrigger.boundingBox(),
    canonicalPanel.boundingBox(),
  ]);

  expect(baselineTriggerBox).not.toBeNull();
  expect(baselinePanelBox).not.toBeNull();
  expect(canonicalTriggerBox).not.toBeNull();
  expect(canonicalPanelBox).not.toBeNull();

  if (!baselineTriggerBox || !baselinePanelBox || !canonicalTriggerBox || !canonicalPanelBox) {
    return;
  }

  const baselineTopOffset = Math.round((baselinePanelBox.y - baselineTriggerBox.y) * 10) / 10;
  const baselineInlineEndOffset = Math.round((baselineTriggerBox.x + baselineTriggerBox.width - (baselinePanelBox.x + baselinePanelBox.width)) * 10) / 10;
  const canonicalTopOffset = Math.round((canonicalPanelBox.y - canonicalTriggerBox.y) * 10) / 10;
  const canonicalInlineEndOffset = Math.round((canonicalTriggerBox.x + canonicalTriggerBox.width - (canonicalPanelBox.x + canonicalPanelBox.width)) * 10) / 10;

  expect(
    Math.sign(canonicalTopOffset),
    "canonical drawer should keep the approved vertical overlay relationship relative to the trigger",
  ).toBe(Math.sign(baselineTopOffset));
  expect(
    Math.sign(canonicalInlineEndOffset),
    "canonical drawer should keep the approved inline-end overlay relationship relative to the trigger",
  ).toBe(Math.sign(baselineInlineEndOffset));
}

test.describe("design-system drawer select canonicals", () => {
  test("launcher exposes the full drawer-select core set on the dedicated render surface", async ({ page }) => {
    await page.goto("/design-system/canonicals/drawer-select");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(27);
    await expect(launcherButtons.nth(0)).toHaveAttribute("href", /\/design-system\/components\/drawer-select\?/);
    await expect(page.getByText("Descriptive open state after adding one available option")).toBeVisible();
    await expect(page.getByText("Compact open state with no search matches")).toBeVisible();
    await expect(page.getByRole("link", { name: /DSR-015 RTL descriptive open drawer review/ })).toBeVisible();
    await expect(page.getByText("Dark and magnified compact open review")).toBeVisible();
    await expect(page.getByRole("link", { name: /DSR-017 Mobile descriptive open drawer review/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /DSR-018 Mobile compact open drawer review/ })).toBeVisible();
    await expect(page.getByText("Descriptive open drawer with long-label stress")).toBeVisible();
    await expect(page.getByText("Localized RTL descriptive open drawer review")).toBeVisible();
    await expect(page.getByText("Disabled compact resting review")).toBeVisible();
    await expect(page.getByText("Dark compact open review")).toBeVisible();
    await expect(page.getByText("Dark mobile compact open drawer review")).toBeVisible();
  });

  for (const scenario of drawerSelectCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      await expect(page.locator("body")).toHaveAttribute("data-drawer-select-surface", "canonical");
      await expect(page.locator("#drawer-select-canonical-current")).toContainText(scenario.refId);

      const field = page.locator(`[data-drawer-select-canonical-field="${scenario.expectedFixture}"]`);
      const root = field.locator(`[data-form-drawer-select-canonical-fixture="${scenario.expectedFixture}"]`);
      const trigger = root.locator("[data-form-drawer-select-button]");
      const panel = root.locator("[data-form-drawer-select-panel]");
      const summary = root.locator("[data-form-drawer-select-summary]");
      const selectedCount = root.locator("[data-form-drawer-select-selected-count]");
      const searchInput = root.locator("[data-form-drawer-select-search]");
      const visibleOptions = panel.locator("[data-form-drawer-select-option]:not(.hidden)");

      await expect(field).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", String(scenario.expectedOpen));
      await expect(summary).toHaveText(scenario.expectedSummary);
      await expect(searchInput).toHaveValue(scenario.searchValue);
      await expect(selectedCount).toHaveText(scenario.expectedSelectedCount);
      await expect(visibleOptions).toHaveCount(scenario.expectedVisibleOptions);

      if (scenario.expectedOpen) {
        await expect(panel).toBeVisible();
        await expect(searchInput).toBeFocused();
      } else {
        await expect(panel).toBeHidden();
      }

      if ("expectSelectedEmpty" in scenario && scenario.expectSelectedEmpty) {
        await expect(panel.locator("[data-form-drawer-select-selected-empty]")).toBeVisible();
        await expect(panel.locator("[data-form-drawer-select-selected-list]")).toBeHidden();
      }

      if (scenario.refId === "DSR-003" || scenario.refId === "DSR-014") {
        await expect(panel.locator("[data-form-drawer-select-empty]")).toBeVisible();
        await expect(panel.locator("[data-form-drawer-select-selected-empty]")).toBeHidden();
      }

      if ("expectedVariant" in scenario && scenario.expectedVariant) {
        await expect(root).toHaveAttribute("data-form-drawer-select-variant", scenario.expectedVariant);
      }

      if ("expectedDir" in scenario && scenario.expectedDir) {
        await expect(page.locator("html")).toHaveAttribute("dir", scenario.expectedDir);
      }

      if ("expectedTheme" in scenario && scenario.expectedTheme) {
        await expect(page.locator("html")).toHaveAttribute("data-theme", scenario.expectedTheme);
      }

      if ("expectedMagnification" in scenario && scenario.expectedMagnification) {
        await expect(page.locator("#drawer-select-preview-shell")).toHaveAttribute("data-magnification", scenario.expectedMagnification);
      }

      if ("expectedViewportClass" in scenario && scenario.expectedViewportClass) {
        await expect(page.locator("#drawer-select-preview-shell")).toHaveAttribute("data-viewport-class", scenario.expectedViewportClass);
      }

      if ("expectedMobileView" in scenario && scenario.expectedMobileView) {
        await expect(page.locator("#drawer-select-preview-shell")).toHaveAttribute("data-form-mobile-view", scenario.expectedMobileView);
      }

      if ("expectedDisabled" in scenario && scenario.expectedDisabled) {
        await expect(page.locator("#drawer-select-preview-shell")).toHaveAttribute("data-form-disabled-mode", scenario.expectedDisabled);
        await expect(trigger).toBeDisabled();
      }
    });
  }

  test("DSR-016 dark compact selected and active cards keep strong readable foreground contrast", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/drawer-select?ref=DSR-016&width=820&state=segments-open&theme=dark&dir=ltr&zoom=100",
    );

    await withHumanReviewGuard("dark compact cards stay readable on bright accent surfaces", async () => {
      await expectComputedColor(
        page.locator(
          '[data-form-drawer-select-canonical-fixture="segments"] .form-drawer-select-selected-chip-copy strong',
        ).first(),
        "rgb(22, 27, 38)",
        "selected compact card label",
      );
      await expectComputedColor(
        page.locator(
          '[data-form-drawer-select-canonical-fixture="segments"] .form-drawer-select-selected-chip-remove',
        ).first(),
        "rgb(22, 27, 38)",
        "selected compact card remove action",
      );
      await expectComputedColor(
        page.locator(
          '[data-form-drawer-select-canonical-fixture="segments"] .form-drawer-select-option.active .form-drawer-select-option-copy strong',
        ).first(),
        "rgb(22, 27, 38)",
        "active available compact card label",
      );
    });
  });

  test("DSR-026 dark mobile descriptive selected and active helper copy keep readable contrast", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/drawer-select?ref=DSR-026&width=390&state=collections-open-mobile-dark&theme=dark&dir=ltr&zoom=0",
    );

    await withHumanReviewGuard("dark mobile descriptive helper copy stays readable on accent surfaces", async () => {
      await expectComputedColor(
        page.locator(
          '[data-form-drawer-select-canonical-fixture="collections"] .form-drawer-select-selected-chip-copy span',
        ).first(),
        "rgb(22, 27, 38)",
        "selected descriptive card helper copy",
      );
      await expectComputedColor(
        page.locator(
          '[data-form-drawer-select-canonical-fixture="collections"] .form-drawer-select-option.active .form-drawer-select-option-copy span',
        ).first(),
        "rgb(22, 27, 38)",
        "active available descriptive helper copy",
      );
    });
  });

  test("DSR-017 and DSR-018 use the dedicated mobile overlay posture inside the canonical frame", async ({ page }) => {
    for (const route of [
      "/design-system/components/drawer-select?ref=DSR-017&width=390&state=collections-open&theme=normal&dir=ltr&zoom=0",
      "/design-system/components/drawer-select?ref=DSR-018&width=390&state=segments-open&theme=normal&dir=ltr&zoom=0",
    ]) {
      await gotoCanonicalState(page, route);

      const panelBox = await page.locator("[data-form-drawer-select-panel]:visible").boundingBox();
      expect(panelBox).not.toBeNull();
      expect(panelBox!.width).toBeLessThan(410);
    }
  });

  test("descriptive open canonical matches the approved form-template trigger, panel, and overlay anchoring", async ({ page }, testInfo) => {
    const baseline = await captureApprovedFormSeam(page, 0);

    await gotoCanonicalState(
      page,
      "/design-system/components/drawer-select?ref=DSR-002&width=940&state=collections-open&theme=normal&dir=ltr&zoom=0",
    );

    const canonicalTrigger = page.locator("#drawer-select-collections-trigger");
    const canonicalPanel = page.locator('[data-form-drawer-select-canonical-fixture="collections"] [data-form-drawer-select-panel]');

    await withHumanReviewGuard("descriptive open canonical matches the approved form-template seam", async () => {
      await expectApprovedScreenshotParity(page, baseline.panelShot, canonicalPanel, "drawer-select-descriptive-panel", testInfo, {
        maxDiffPixels: 1000,
      });
      await expectApprovedOverlayGeometryParity(baseline.triggerBox, baseline.panelBox, canonicalTrigger, canonicalPanel);
    });
  });

  test("compact open canonical matches the approved form-template trigger, panel, and overlay anchoring", async ({ page }, testInfo) => {
    const baseline = await captureApprovedFormSeam(page, 1);

    await gotoCanonicalState(
      page,
      "/design-system/components/drawer-select?ref=DSR-005&width=820&state=segments-open&theme=normal&dir=ltr&zoom=0",
    );

    const canonicalTrigger = page.locator("#drawer-select-segments-trigger");
    const canonicalPanel = page.locator('[data-form-drawer-select-canonical-fixture="segments"] [data-form-drawer-select-panel]');

    await withHumanReviewGuard("compact open canonical matches the approved form-template seam", async () => {
      await expectApprovedScreenshotParity(page, baseline.panelShot, canonicalPanel, "drawer-select-compact-panel", testInfo, {
        maxDiffPixels: 1000,
      });
      await expectApprovedOverlayGeometryParity(baseline.triggerBox, baseline.panelBox, canonicalTrigger, canonicalPanel);
    });
  });

  test("dark compact open canonical matches the approved dark form-template seam", async ({ page }, testInfo) => {
    const baseline = await captureApprovedFormSeam(page, 1, {
      route: "/design-system/templates/form?theme=dark",
    });

    await gotoCanonicalState(
      page,
      "/design-system/components/drawer-select?ref=DSR-025&width=820&state=segments-open-dark&theme=dark&dir=ltr&zoom=0",
    );

    const canonicalTrigger = page.locator("#drawer-select-segments-trigger");
    const canonicalPanel = page.locator('[data-form-drawer-select-canonical-fixture="segments"] [data-form-drawer-select-panel]');

    await withHumanReviewGuard("dark compact canonical matches the approved dark form-template seam", async () => {
      await expectApprovedScreenshotParity(page, baseline.panelShot, canonicalPanel, "drawer-select-dark-compact-panel", testInfo, {
        maxDiffPixels: 3000,
      });
      await expectApprovedOverlayGeometryParity(baseline.triggerBox, baseline.panelBox, canonicalTrigger, canonicalPanel);
    });
  });

  test("mobile descriptive canonical matches the approved mobile form-template seam", async ({ page }, testInfo) => {
    const baseline = await captureApprovedFormSeam(page, 0, {
      route: "/design-system/templates/form",
      viewport: { width: 390, height: 1600 },
    });

    await gotoCanonicalState(
      page,
      "/design-system/components/drawer-select?ref=DSR-017&width=390&state=collections-open&theme=normal&dir=ltr&zoom=0",
    );

    const canonicalTrigger = page.locator("#drawer-select-collections-trigger");
    const canonicalPanel = page.locator('[data-form-drawer-select-canonical-fixture="collections"] [data-form-drawer-select-panel]');

    await withHumanReviewGuard("mobile descriptive canonical matches the approved mobile form-template seam", async () => {
      await expectApprovedScreenshotParity(page, baseline.panelShot, canonicalPanel, "drawer-select-mobile-descriptive-panel", testInfo, {
        maxDiffRatio: 0.1,
        sizeTolerancePixels: 1,
      });
      await expectApprovedOverlayGeometryParity(baseline.triggerBox, baseline.panelBox, canonicalTrigger, canonicalPanel);
    });
  });

  test("mobile compact canonical matches the approved mobile form-template seam", async ({ page }, testInfo) => {
    const baseline = await captureApprovedFormSeam(page, 1, {
      route: "/design-system/templates/form",
      viewport: { width: 390, height: 1600 },
    });

    await gotoCanonicalState(
      page,
      "/design-system/components/drawer-select?ref=DSR-018&width=390&state=segments-open&theme=normal&dir=ltr&zoom=0",
    );

    const canonicalTrigger = page.locator("#drawer-select-segments-trigger");
    const canonicalPanel = page.locator('[data-form-drawer-select-canonical-fixture="segments"] [data-form-drawer-select-panel]');

    await withHumanReviewGuard("mobile compact canonical matches the approved mobile form-template seam", async () => {
      await expectApprovedScreenshotParity(page, baseline.panelShot, canonicalPanel, "drawer-select-mobile-compact-panel", testInfo, {
        maxDiffRatio: 0.1,
        sizeTolerancePixels: 1,
      });
      await expectApprovedOverlayGeometryParity(baseline.triggerBox, baseline.panelBox, canonicalTrigger, canonicalPanel);
    });
  });

  test("dark mobile compact canonical matches the approved dark mobile form-template seam", async ({ page }, testInfo) => {
    const baseline = await captureApprovedFormSeam(page, 1, {
      route: "/design-system/templates/form?theme=dark",
      viewport: { width: 390, height: 1600 },
    });

    await gotoCanonicalState(
      page,
      "/design-system/components/drawer-select?ref=DSR-027&width=390&state=segments-open-mobile-dark&theme=dark&dir=ltr&zoom=0",
    );

    const canonicalTrigger = page.locator("#drawer-select-segments-trigger");
    const canonicalPanel = page.locator('[data-form-drawer-select-canonical-fixture="segments"] [data-form-drawer-select-panel]');

    await withHumanReviewGuard("dark mobile compact canonical matches the approved dark mobile form-template seam", async () => {
      await expectApprovedScreenshotParity(page, baseline.panelShot, canonicalPanel, "drawer-select-dark-mobile-compact-panel", testInfo, {
        maxDiffRatio: 0.1,
        sizeTolerancePixels: 1,
      });
      await expectApprovedOverlayGeometryParity(baseline.triggerBox, baseline.panelBox, canonicalTrigger, canonicalPanel);
    });
  });

  test("dark mobile descriptive canonical matches the approved dark mobile form-template seam", async ({ page }, testInfo) => {
    const baseline = await captureApprovedFormSeam(page, 0, {
      route: "/design-system/templates/form?theme=dark",
      viewport: { width: 390, height: 1600 },
    });

    await gotoCanonicalState(
      page,
      "/design-system/components/drawer-select?ref=DSR-026&width=390&state=collections-open-mobile-dark&theme=dark&dir=ltr&zoom=0",
    );

    const canonicalTrigger = page.locator("#drawer-select-collections-trigger");
    const canonicalPanel = page.locator('[data-form-drawer-select-canonical-fixture="collections"] [data-form-drawer-select-panel]');

    await withHumanReviewGuard("dark mobile descriptive canonical matches the approved dark mobile form-template seam", async () => {
      await expectApprovedScreenshotParity(page, baseline.panelShot, canonicalPanel, "drawer-select-dark-mobile-descriptive-panel", testInfo, {
        maxDiffRatio: 0.1,
        sizeTolerancePixels: 1,
      });
      await expectApprovedOverlayGeometryParity(baseline.triggerBox, baseline.panelBox, canonicalTrigger, canonicalPanel);
    });
  });
});
