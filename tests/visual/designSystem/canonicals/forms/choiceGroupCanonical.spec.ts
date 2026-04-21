import { expect, test, type Page } from "@playwright/test";

const choiceGroupCanonicalStates = [
  {
    refId: "CGR-001",
    label: "radio-group baseline",
    route: "/design-system/components/choice-group?ref=CGR-001&width=520&state=radio-baseline&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "CGR-002",
    label: "standard checkbox-group baseline",
    route: "/design-system/components/choice-group?ref=CGR-002&width=520&state=checkbox-baseline&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "CGR-003",
    label: "shared-statement checkbox baseline",
    route: "/design-system/components/choice-group?ref=CGR-003&width=720&state=shared-statement&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "CGR-004",
    label: "inline group-error review",
    route: "/design-system/components/choice-group?ref=CGR-004&width=940&state=error-review&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "CGR-006",
    label: "dark-theme grouped-choice readability review",
    route: "/design-system/components/choice-group?ref=CGR-006&width=940&state=dark-errors&theme=dark&dir=ltr&zoom=0",
  },
  {
    refId: "CGR-007",
    label: "rtl grouped-choice row mirroring review",
    route: "/design-system/components/choice-group?ref=CGR-007&width=940&state=rtl-review&theme=normal&dir=rtl&zoom=0",
  },
  {
    refId: "CGR-010",
    label: "narrow mobile long-copy wrapping review",
    route: "/design-system/components/choice-group?ref=CGR-010&width=390&state=long-copy-mobile&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "CGR-011",
    label: "localized arabic rtl grouped-choice review",
    route: "/design-system/components/choice-group?ref=CGR-011&width=390&state=localized-rtl-mobile&theme=normal&dir=rtl&zoom=0",
  },
] as const;

async function gotoCanonicalState(page: Page, route: string) {
  const resolvedRoute = new URL(route, "http://localhost");
  const requestedWidth = Number.parseInt(resolvedRoute.searchParams.get("width") ?? "0", 10);
  const viewportWidth = Math.max(requestedWidth + 360, 1280);

  await page.setViewportSize({
    width: viewportWidth,
    height: 1400,
  });
  await page.goto(route);
  await page.locator('#choice-group-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system choice group canonical states", () => {
  test("launcher exposes the first CGR review set on the dedicated render surface", async ({ page }) => {
    await page.goto("/design-system/canonicals/choice-group");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(8);
    await expect(launcherButtons.nth(0)).toHaveAttribute("href", /\/design-system\/components\/choice-group\?/);
    await expect(page.getByRole("link", { name: /CGR-003 Shared-statement checkbox baseline/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /CGR-004 Inline group-error review for all variants/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /CGR-010 Narrow mobile long-copy wrapping review/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /CGR-011 Localized Arabic RTL grouped-choice review/i })).toBeVisible();
  });

  for (const scenario of choiceGroupCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      await expect(page.locator("body")).toHaveAttribute("data-choice-group-surface", "canonical");
      await expect(page.locator("#choice-group-canonical-current")).toContainText(scenario.refId);
      await expect(page.locator("#choice-group-preview-shell")).toBeVisible();
    });
  }

  test("CGR-001 through CGR-003 isolate the intended grouped-choice variants on the child surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/choice-group?ref=CGR-001&width=520&state=radio-baseline&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#choice-group-preview-shell")).toHaveAttribute("data-visible-group-count", "1");
    await expect(page.getByRole("group", { name: "Radio buttons", exact: true })).toBeVisible();
    await expect(page.getByRole("group", { name: "Checkboxes", exact: true })).toBeHidden();
    await expect(page.getByRole("group", { name: "Checkboxes with shared statement", exact: true })).toBeHidden();

    const singleLaneColumns = await page.locator("#choice-group-preview-shell .form-page-grid").evaluate((node) => {
      return getComputedStyle(node).gridTemplateColumns;
    });

    expect(singleLaneColumns.includes("  ")).toBe(false);

    await gotoCanonicalState(
      page,
      "/design-system/components/choice-group?ref=CGR-002&width=520&state=checkbox-baseline&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#choice-group-preview-shell")).toHaveAttribute("data-visible-group-count", "1");
    await expect(page.getByRole("group", { name: "Radio buttons", exact: true })).toBeHidden();
    await expect(page.getByRole("group", { name: "Checkboxes", exact: true })).toBeVisible();
    await expect(page.getByRole("group", { name: "Checkboxes with shared statement", exact: true })).toBeHidden();

    await gotoCanonicalState(
      page,
      "/design-system/components/choice-group?ref=CGR-003&width=720&state=shared-statement&theme=normal&dir=ltr&zoom=0",
    );

    const sharedGroup = page.getByRole("group", { name: "Checkboxes with shared statement", exact: true });
    await expect(page.locator("#choice-group-preview-shell")).toHaveAttribute("data-visible-group-count", "1");
    await expect(sharedGroup).toBeVisible();
    await expect(sharedGroup.locator(".form-choice-statement")).toBeVisible();
    await expect(sharedGroup).not.toHaveClass(/form-field-span-2/);
  });

  test("CGR-004 and CGR-006 keep error review and dark-theme readability truthful on the child surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/choice-group?ref=CGR-004&width=940&state=error-review&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#choice-group-preview-shell")).toHaveAttribute("data-form-error-mode", "true");
    await expect(page.locator(".form-group-error")).toHaveCount(3);
    await expect(page.getByText("Choose a delivery mode.", { exact: true })).toBeVisible();
    await expect(page.getByText("Select at least one channel.", { exact: true })).toBeVisible();
    await expect(page.getByText("Check all required acknowledgement items before publishing.", { exact: true })).toBeVisible();

    await gotoCanonicalState(
      page,
      "/design-system/components/choice-group?ref=CGR-006&width=940&state=dark-errors&theme=dark&dir=ltr&zoom=0",
    );

    const themeState = await page.evaluate(() => {
      const layout = document.querySelector("#choice-group-preview-frame")?.closest(".canonical-render-layout");
      return {
        documentTheme: document.documentElement.dataset.theme ?? "",
        layoutTheme: layout instanceof HTMLElement ? layout.dataset.themeScope ?? "" : "",
      };
    });

    expect(themeState.documentTheme).toBe("");
    expect(themeState.layoutTheme).toBe("dark");

    const legibilityState = await page.evaluate(() => {
      const shell = document.querySelector("#choice-group-preview-shell");
      const title = document.querySelector("#choice-group-preview-card-title");
      const legend = document.querySelector("#choice-group-radio .form-choice-legend");
      const rowTitle = document.querySelector("#choice-group-radio .form-choice-row strong");
      const row = document.querySelector("#choice-group-radio .form-choice-row");

      const shellStyle = shell ? getComputedStyle(shell) : null;
      const titleStyle = title ? getComputedStyle(title) : null;
      const legendStyle = legend ? getComputedStyle(legend) : null;
      const rowTitleStyle = rowTitle ? getComputedStyle(rowTitle) : null;
      const rowStyle = row ? getComputedStyle(row) : null;

      return {
        titleColor: titleStyle?.color ?? "",
        legendColor: legendStyle?.color ?? "",
        rowTitleColor: rowTitleStyle?.color ?? "",
        rowBackground: rowStyle?.backgroundColor ?? "",
      };
    });

    expect(legibilityState.titleColor).not.toBe(legibilityState.rowBackground);
    expect(legibilityState.legendColor).not.toBe(legibilityState.rowBackground);
    expect(legibilityState.rowTitleColor).not.toBe(legibilityState.rowBackground);
  });

  test("CGR-007, CGR-010, and CGR-011 keep direction, long-copy wrapping, and localized copy scoped to the child surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/choice-group?ref=CGR-007&width=940&state=rtl-review&theme=normal&dir=rtl&zoom=0",
    );

    const rtlState = await page.evaluate(() => ({
      documentDir: document.documentElement.getAttribute("dir"),
      surfaceDir: document.querySelector("#choice-group-preview-shell")?.getAttribute("dir"),
    }));

    expect(rtlState.documentDir).not.toBe("rtl");
    expect(rtlState.surfaceDir).toBe("rtl");

    await gotoCanonicalState(
      page,
      "/design-system/components/choice-group?ref=CGR-010&width=390&state=long-copy-mobile&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#choice-group-preview-shell")).toHaveAttribute("data-form-mobile-view", "true");
    await expect(page.getByText(/Scheduled rollout with monitored launch window/i)).toBeVisible();
    await expect(page.getByText(/Before publishing this campaign, confirm the release checklist items below and keep the release-owner acknowledgement readable/i)).toBeVisible();

    await gotoCanonicalState(
      page,
      "/design-system/components/choice-group?ref=CGR-011&width=390&state=localized-rtl-mobile&theme=normal&dir=rtl&zoom=0",
    );

    await expect(page.locator("#choice-group-preview-shell")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("group", { name: "مربعات اختيار مع بيان مشترك", exact: true })).toBeVisible();
    await expect(page.getByText("قبل نشر هذه الحملة، أكد عناصر قائمة التحقق التالية الخاصة بالإطلاق.", { exact: true })).toBeVisible();
  });
});
