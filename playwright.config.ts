import { defineConfig } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PREVIEW_PORT ?? "4317");
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const usePreviewServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/visual",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "device",
    },
  },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    browserName: "chromium",
    headless: true,
    viewport: { width: 1440, height: 1400 },
    colorScheme: "light",
    locale: "en-US",
  },
  snapshotPathTemplate: "{testDir}/__snapshots__/{testFilePath}/{arg}{ext}",
  ...(usePreviewServer
    ? {
        webServer: {
          command: `node --import tsx tests/visual/designSystem/support/servers/previewServer.ts`,
          url: `http://127.0.0.1:${port}/design-system/canonicals/top-nav`,
          reuseExistingServer: !process.env.CI,
          timeout: 30_000,
        },
      }
    : {}),
});
