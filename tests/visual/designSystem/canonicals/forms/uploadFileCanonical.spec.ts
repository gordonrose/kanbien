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
    expectedPreviewKind: "none",
  },
  {
    refId: "UFR-002",
    label: "upload in-progress status",
    route: "/design-system/canonical-renderings/upload-file/UFR-002",
    expectedState: "uploading",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
    expectedPreviewKind: "document",
  },
  {
    refId: "UFR-003",
    label: "upload complete status",
    route: "/design-system/canonical-renderings/upload-file/UFR-003",
    expectedState: "complete",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
    expectedPreviewKind: "document",
  },
  {
    refId: "UFR-004",
    label: "upload error review",
    route: "/design-system/canonical-renderings/upload-file/UFR-004",
    expectedState: "error",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
    expectedPreviewKind: "document",
  },
  {
    refId: "UFR-005",
    label: "disabled inherited state",
    route: "/design-system/canonical-renderings/upload-file/UFR-005",
    expectedState: "idle",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: true,
    expectedPreviewKind: "none",
  },
  {
    refId: "UFR-006",
    label: "rtl upload error review",
    route: "/design-system/canonical-renderings/upload-file/UFR-006",
    expectedState: "error",
    expectedDir: "rtl",
    expectedTheme: "normal",
    disabled: false,
    expectedPreviewKind: "document",
  },
  {
    refId: "UFR-007",
    label: "mobile upload progress review",
    route: "/design-system/canonical-renderings/upload-file/UFR-007",
    expectedState: "uploading",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
    expectedPreviewKind: "document",
  },
  {
    refId: "UFR-008",
    label: "dark theme upload error review",
    route: "/design-system/canonical-renderings/upload-file/UFR-008",
    expectedState: "error",
    expectedDir: "ltr",
    expectedTheme: "dark",
    disabled: false,
    expectedPreviewKind: "document",
  },
  {
    refId: "UFR-009",
    label: "image preview thumbnail",
    route: "/design-system/canonical-renderings/upload-file/UFR-009",
    expectedState: "complete",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
    expectedPreviewKind: "image",
  },
  {
    refId: "UFR-010",
    label: "document type thumbnail",
    route: "/design-system/canonical-renderings/upload-file/UFR-010",
    expectedState: "complete",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
    expectedPreviewKind: "document",
  },
  {
    refId: "UFR-011",
    label: "video preview thumbnail",
    route: "/design-system/canonical-renderings/upload-file/UFR-011",
    expectedState: "complete",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
    expectedPreviewKind: "video",
  },
  {
    refId: "UFR-012",
    label: "audio preview icon",
    route: "/design-system/canonical-renderings/upload-file/UFR-012",
    expectedState: "complete",
    expectedDir: "ltr",
    expectedTheme: "normal",
    disabled: false,
    expectedPreviewKind: "audio",
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
    await expect(launcherButtons).toHaveCount(12);
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
    await expect(page.getByRole("link", { name: /UFR-009 Image preview thumbnail/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/upload-file/UFR-009",
    );
    await expect(page.getByRole("link", { name: /UFR-012 Audio preview icon/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/upload-file/UFR-012",
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
      await expect(page.locator("[data-form-upload-field]")).toHaveAttribute("data-form-upload-preview-kind", scenario.expectedPreviewKind);
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

  test("preview variations expose the right visual thumbnail kind", async ({ page }) => {
    await gotoCanonicalState(page, "/design-system/canonical-renderings/upload-file/UFR-009");
    await expect(page.locator("[data-form-upload-preview]")).toHaveAttribute("data-form-upload-preview-kind", "image");
    await expect(page.locator("[data-form-upload-preview-art].form-upload-preview-art-image")).toBeVisible();

    await gotoCanonicalState(page, "/design-system/canonical-renderings/upload-file/UFR-010");
    await expect(page.locator("[data-form-upload-preview]")).toHaveAttribute("data-form-upload-preview-kind", "document");
    await expect(page.locator(".form-upload-preview-art-document")).toContainText("PDF");

    await gotoCanonicalState(page, "/design-system/canonical-renderings/upload-file/UFR-011");
    await expect(page.locator("[data-form-upload-preview]")).toHaveAttribute("data-form-upload-preview-kind", "video");
    await expect(page.locator(".form-upload-preview-art-video")).toBeVisible();

    await gotoCanonicalState(page, "/design-system/canonical-renderings/upload-file/UFR-012");
    await expect(page.locator("[data-form-upload-preview]")).toHaveAttribute("data-form-upload-preview-kind", "audio");
    await expect(page.locator(".form-upload-preview-art-audio")).toBeVisible();
  });

  test("local file selection maps selected media to preview affordances", async ({ page }) => {
    await gotoCanonicalState(page, "/design-system/canonical-renderings/upload-file/UFR-001");
    const input = page.locator("[data-form-upload-input]");

    await input.setInputFiles({
      name: "sample.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lU9pWQAAAABJRU5ErkJggg==",
        "base64",
      ),
    });
    await expect(page.locator("[data-form-upload-preview]")).toHaveAttribute("data-form-upload-preview-kind", "image");
    await expect(page.locator("[data-form-upload-preview-image]")).toBeVisible();

    await input.setInputFiles({
      name: "sample.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\n"),
    });
    await expect(page.locator("[data-form-upload-preview]")).toHaveAttribute("data-form-upload-preview-kind", "document");
    await expect(page.locator(".form-upload-preview-art-document")).toContainText("PDF");

    await input.setInputFiles({
      name: "sample.mp4",
      mimeType: "video/mp4",
      buffer: Buffer.from("video"),
    });
    await expect(page.locator("[data-form-upload-preview]")).toHaveAttribute("data-form-upload-preview-kind", "video");
    await expect(page.locator("[data-form-upload-preview-video]")).toBeVisible();

    await input.setInputFiles({
      name: "sample.mp3",
      mimeType: "audio/mpeg",
      buffer: Buffer.from("audio"),
    });
    await expect(page.locator("[data-form-upload-preview]")).toHaveAttribute("data-form-upload-preview-kind", "audio");
    await expect(page.locator(".form-upload-preview-art-audio")).toBeVisible();
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
