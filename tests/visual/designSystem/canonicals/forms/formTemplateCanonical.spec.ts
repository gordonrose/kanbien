import { expect, test, type Page } from "@playwright/test";

const formTemplateCanonicalStates = [
  {
    refId: "FTR-001",
    label: "desktop no-sidebar baseline",
    route: "/design-system/templates/form?ref=FTR-001&theme=normal&dir=ltr&zoom=0",
    viewport: { width: 1600, height: 1400 },
    expectedTheme: "normal",
    expectedDir: "ltr",
    expectedZoom: "",
    errors: false,
    disabled: false,
    mobile: false,
  },
  {
    refId: "FTR-010",
    label: "normal-theme error review",
    route: "/design-system/templates/form?ref=FTR-010&theme=normal&dir=ltr&zoom=0&errors=true",
    viewport: { width: 1600, height: 1400 },
    expectedTheme: "normal",
    expectedDir: "ltr",
    expectedZoom: "",
    errors: true,
    disabled: false,
    mobile: false,
  },
  {
    refId: "FTR-011",
    label: "dark-theme error review",
    route: "/design-system/templates/form?ref=FTR-011&theme=dark&dir=ltr&zoom=0&errors=true",
    viewport: { width: 1600, height: 1400 },
    expectedTheme: "dark",
    expectedDir: "ltr",
    expectedZoom: "",
    errors: true,
    disabled: false,
    mobile: false,
  },
  {
    refId: "FTR-012",
    label: "normal-theme disabled review",
    route: "/design-system/templates/form?ref=FTR-012&theme=normal&dir=ltr&zoom=0&disabled=true",
    viewport: { width: 1600, height: 1400 },
    expectedTheme: "normal",
    expectedDir: "ltr",
    expectedZoom: "",
    errors: false,
    disabled: true,
    mobile: false,
  },
  {
    refId: "FTR-013",
    label: "dark-theme disabled review",
    route: "/design-system/templates/form?ref=FTR-013&theme=dark&dir=ltr&zoom=0&disabled=true",
    viewport: { width: 1600, height: 1400 },
    expectedTheme: "dark",
    expectedDir: "ltr",
    expectedZoom: "",
    errors: false,
    disabled: true,
    mobile: false,
  },
  {
    refId: "FTR-014",
    label: "error plus disabled review",
    route: "/design-system/templates/form?ref=FTR-014&theme=normal&dir=ltr&zoom=0&errors=true&disabled=true",
    viewport: { width: 1600, height: 1400 },
    expectedTheme: "normal",
    expectedDir: "ltr",
    expectedZoom: "",
    errors: true,
    disabled: true,
    mobile: false,
  },
  {
    refId: "FTR-015",
    label: "mobile error review",
    route: "/design-system/templates/form?ref=FTR-015&theme=normal&dir=ltr&zoom=0&errors=true&mobile=true",
    viewport: { width: 430, height: 1400 },
    expectedTheme: "normal",
    expectedDir: "ltr",
    expectedZoom: "",
    errors: true,
    disabled: false,
    mobile: true,
  },
  {
    refId: "FTR-016",
    label: "mobile disabled review",
    route: "/design-system/templates/form?ref=FTR-016&theme=normal&dir=ltr&zoom=0&disabled=true&mobile=true",
    viewport: { width: 430, height: 1400 },
    expectedTheme: "normal",
    expectedDir: "ltr",
    expectedZoom: "",
    errors: false,
    disabled: true,
    mobile: true,
  },
  {
    refId: "FTR-017",
    label: "rtl desktop review",
    route: "/design-system/templates/form?ref=FTR-017&theme=normal&dir=rtl&zoom=0",
    viewport: { width: 1600, height: 1400 },
    expectedTheme: "normal",
    expectedDir: "rtl",
    expectedZoom: "",
    errors: false,
    disabled: false,
    mobile: false,
  },
  {
    refId: "FTR-018",
    label: "rtl mobile review",
    route: "/design-system/templates/form?ref=FTR-018&theme=normal&dir=rtl&zoom=0&mobile=true",
    viewport: { width: 430, height: 1400 },
    expectedTheme: "normal",
    expectedDir: "rtl",
    expectedZoom: "",
    errors: false,
    disabled: false,
    mobile: true,
  },
  {
    refId: "FTR-019",
    label: "rtl magnified review",
    route: "/design-system/templates/form?ref=FTR-019&theme=normal&dir=rtl&zoom=100",
    viewport: { width: 1600, height: 1400 },
    expectedTheme: "normal",
    expectedDir: "rtl",
    expectedZoom: "100",
    errors: false,
    disabled: false,
    mobile: false,
  },
] as const;

async function gotoCanonicalState(page: Page, route: string, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.goto(route);
  await page.locator(".form-page-shell").waitFor({ state: "visible" });
}

test.describe("design-system form template canonicals", () => {
  test("launcher exposes the governed combination refs", async ({ page }) => {
    await page.goto("/design-system/canonicals/form-template");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(11);
    await expect(page.getByText("Dark-theme error review")).toBeVisible();
    await expect(page.getByText("Dark-theme disabled review")).toBeVisible();
    await expect(page.getByText("RTL mobile review")).toBeVisible();
    await expect(page.getByText("RTL magnified review")).toBeVisible();
  });

  for (const scenario of formTemplateCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route, scenario.viewport);

      const shell = page.locator(".form-page-shell");
      const formPageLayout = page.locator(".form-page-layout");

      await expect(shell).toHaveAttribute("data-form-error-mode", String(scenario.errors));
      await expect(shell).toHaveAttribute("data-form-disabled-mode", String(scenario.disabled));
      await expect(shell).toHaveAttribute("data-form-mobile-view", String(scenario.mobile));
      await expect(page.locator("html")).toHaveAttribute("dir", scenario.expectedDir);

      await expect(page.locator("html")).toHaveAttribute("data-theme", scenario.expectedTheme);

      await expect(formPageLayout).toBeVisible();

      const magnificationState = await page.evaluate(() => ({
        documentScale: document.documentElement.style.getPropertyValue("--ui-scale"),
        shellMagnification: document.querySelector(".form-page-shell")?.getAttribute("data-magnification") ?? "",
      }));

      if (scenario.expectedZoom === "") {
        expect(magnificationState.documentScale).toBe("1");
        expect(magnificationState.shellMagnification).toBe("");
      } else {
        expect(magnificationState.documentScale).toBe("1.5");
        expect(magnificationState.shellMagnification).toBe("");
      }
    });
  }

  test("disabled canonical states keep fields non-interactive on first render", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/templates/form?ref=FTR-013&theme=dark&dir=ltr&zoom=0&disabled=true",
      { width: 1600, height: 1400 },
    );

    const firstTextbox = page.getByRole("textbox", { name: /^Text field\b/i });
    const saveDraftButton = page.getByRole("button", { name: /save draft/i });

    await expect(firstTextbox).toBeDisabled();
    await expect(saveDraftButton).toBeDisabled();
  });

  test("mobile canonical states stack the page into one column on first render", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/templates/form?ref=FTR-018&theme=normal&dir=rtl&zoom=0&mobile=true",
      { width: 430, height: 1400 },
    );

    const mobileState = await page.evaluate(() => {
      const shell = document.querySelector(".form-page-shell");
      const grid = document.querySelector(".form-page-grid");

      return {
        mobileFlag: shell instanceof HTMLElement ? shell.dataset.formMobileView ?? "" : "",
        gridColumns: grid ? window.getComputedStyle(grid).gridTemplateColumns : "",
      };
    });

    expect(mobileState.mobileFlag).toBe("true");
    expect(mobileState.gridColumns).not.toContain(" ");
  });
});
