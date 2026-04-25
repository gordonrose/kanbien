import { expect, test, type Page } from "@playwright/test";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";

const uploadFileCanonicalStates = [
  {
    refId: "UFR-001",
    label: "idle dropzone baseline",
    route: "/design-system/canonical-renderings/upload-file/UFR-001",
    expectedState: "idle",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
  },
  {
    refId: "UFR-002",
    label: "upload in-progress status",
    route: "/design-system/canonical-renderings/upload-file/UFR-002",
    expectedState: "uploading",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
  },
  {
    refId: "UFR-003",
    label: "upload complete status",
    route: "/design-system/canonical-renderings/upload-file/UFR-003",
    expectedState: "complete",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
  },
  {
    refId: "UFR-004",
    label: "upload error review",
    route: "/design-system/canonical-renderings/upload-file/UFR-004",
    expectedState: "error",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
  },
  {
    refId: "UFR-005",
    label: "disabled inherited state",
    route: "/design-system/canonical-renderings/upload-file/UFR-005",
    expectedState: "idle",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: true,
  },
  {
    refId: "UFR-006",
    label: "rtl upload error review",
    route: "/design-system/canonical-renderings/upload-file/UFR-006",
    expectedState: "error",
    expectedDir: "rtl",
    expectedTheme: "normal",
    disabled: false,
  },
  {
    refId: "UFR-007",
    label: "mobile upload progress review",
    route: "/design-system/canonical-renderings/upload-file/UFR-007",
    expectedState: "uploading",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
  },
  {
    refId: "UFR-008",
    label: "dark theme upload error review",
    route: "/design-system/canonical-renderings/upload-file/UFR-008",
    expectedState: "error",
    expectedDir: "ltr",
    expectedTheme: "dark",
    disabled: false,
  },
] as const;

async function gotoCanonicalState(page: Page, route: string) {
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.goto(route);
  await page.locator('#upload-file-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system upload file canonical states", () => {
  test("launcher exposes the full UFR set", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/upload-file");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(8);
    await expect(page.getByRole("link", { name: /UFR-002 Upload in-progress status/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/upload-file/UFR-002",
    );
    await expect(page.getByRole("link", { name: /UFR-004 Upload error review/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/upload-file/UFR-004",
    );
    await expect(page.getByRole("link", { name: /UFR-008 Dark theme upload error review/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/upload-file/UFR-008",
    );
  });

  for (const scenario of uploadFileCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      await expectRouteSurfaceTruth(page, {
        expectedPath: scenario.route,
        surfaceLocator: "#upload-file-preview-shell",
        waitForReadyLocator: '#upload-file-preview-shell[data-render-status="ready"]',
        bodyAttribute: { name: "data-upload-file-surface", value: "canonical" },
        fallbackHeading: /Design-System Route Families/i,
      });

      await expect(page.locator("#upload-file-canonical-current")).toContainText(scenario.refId);
      await expect(page.locator("[data-form-upload-field]")).toHaveAttribute("data-form-upload-state", scenario.expectedState);
      await expect(page.locator("#upload-file-preview-shell")).toHaveAttribute("dir", scenario.expectedDir);
      await expect(page.locator("#upload-file-preview-frame")).toHaveAttribute("data-theme-scope", scenario.expectedTheme);

      if (scenario.disabled) {
        await expect(page.locator("[data-form-upload-input]")).toBeDisabled();
      } else {
        await expect(page.locator("[data-form-upload-input]")).toBeEnabled();
      }
    });
  }

  test("uploading and complete states expose status and progress locally", async ({ page }) => {
    await gotoCanonicalState(page, "/design-system/canonical-renderings/upload-file/UFR-002");

    await expect(page.locator("[data-form-upload-title]")).toHaveText("launch-audience.csv");
    await expect(page.locator("[data-form-upload-status-copy]")).toHaveText("Uploading 64%");
    await expect(page.locator("[data-form-upload-progress-bar]")).toHaveAttribute("style", /width: 64%/);

    await gotoCanonicalState(page, "/design-system/canonical-renderings/upload-file/UFR-003");

    await expect(page.locator("[data-form-upload-status-copy]")).toHaveText("Ready to attach");
    await expect(page.locator("[data-form-upload-progress-bar]")).toHaveAttribute("style", /width: 100%/);
  });

  test("error and theme states stay scoped to the upload canonical surface", async ({ page }) => {
    await gotoCanonicalState(page, "/design-system/canonical-renderings/upload-file/UFR-006");

    const directionState = await page.evaluate(() => ({
      documentDir: document.documentElement.getAttribute("dir"),
      surfaceDir: document.querySelector("#upload-file-preview-shell")?.getAttribute("dir"),
    }));

    expect(directionState.documentDir).not.toBe("rtl");
    expect(directionState.surfaceDir).toBe("rtl");
    await expect(page.locator("[data-form-upload-status-copy]")).toHaveText("Upload failed");

    await gotoCanonicalState(page, "/design-system/canonical-renderings/upload-file/UFR-008");

    const themeState = await page.evaluate(() => ({
      documentTheme: document.documentElement.dataset.theme ?? "",
      frameTheme: document.querySelector("#upload-file-preview-frame") instanceof HTMLElement
        ? (document.querySelector("#upload-file-preview-frame") as HTMLElement).dataset.themeScope ?? ""
        : "",
    }));

    expect(themeState.documentTheme).toBe("");
    expect(themeState.frameTheme).toBe("dark");

    const iconColor = await page.locator(".form-upload-icon").evaluate((node) => getComputedStyle(node).color);
    expect(iconColor).toBe("rgb(236, 240, 255)");
  });
});
