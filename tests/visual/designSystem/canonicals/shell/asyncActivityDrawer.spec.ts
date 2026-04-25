import { expect, test } from "@playwright/test";

import { expectCanonicalOverlayContainedInRenderSurface } from "../../support/helpers/canonicalOverlayGuards";

const states = [
  {
    ref: "AADR-001",
    route: "/design-system/canonical-renderings/async-activity-drawer/AADR-001",
    expectedStates: ["running", "waiting", "error", "complete"],
  },
  {
    ref: "AADR-004",
    route: "/design-system/canonical-renderings/async-activity-drawer/AADR-004",
    expectedStates: ["error"],
  },
  {
    ref: "AADR-005",
    route: "/design-system/canonical-renderings/async-activity-drawer/AADR-005",
    expectedStates: ["complete"],
  },
] as const;

test.describe("async activity drawer canonicals", () => {
  test("launcher exposes dedicated async activity drawer render links", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/async-activity-drawer");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(5);
    await expect(page.getByRole("link", { name: /AADR-001 Mixed shell queue/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /AADR-004 Retryable error/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /AADR-005 Complete with report/i })).toBeVisible();

    const hrefs = await page.locator(".canonical-launcher-grid a").evaluateAll((links) =>
      links.map((link) => link.getAttribute("href") ?? ""),
    );
    expect(hrefs).toHaveLength(5);
    for (const href of hrefs) {
      expect(href).toMatch(/^\/design-system\/canonical-renderings\/async-activity-drawer\/AADR-/);
    }
  });

  for (const state of states) {
    test(`${state.ref} renders the shared async activity drawer state`, async ({ page }) => {
      await page.goto(state.route);

      const shell = page.locator('#async-activity-drawer-preview-shell[data-render-status="ready"]');
      const drawer = page.locator("#async-activity-drawer");
      await expect(shell).toBeVisible();
      await expect(drawer).toBeVisible();
      await expectCanonicalOverlayContainedInRenderSurface(page, {
        label: `${state.ref} async activity drawer`,
        overlay: "#async-activity-drawer",
        panel: "#async-activity-drawer",
        hostSurface: "#async-activity-drawer-preview-shell",
        renderFrame: "#async-activity-drawer-preview-shell",
        below: ".canonical-render-intro",
        requirePanelWidthWithinHost: true,
      });
      await expect(page.locator("body")).toHaveAttribute("data-async-activity-drawer-surface", "canonical");
      await expect(page.locator("#async-activity-drawer-canonical-current")).toContainText(state.ref);

      for (const expectedState of state.expectedStates) {
        await expect(drawer.locator(`[data-async-activity-state="${expectedState}"]`)).toBeVisible();
      }
    });
  }

  test("error state exposes stopped progress, detail, and retry action", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/async-activity-drawer/AADR-004");

    const drawer = page.locator("#async-activity-drawer");
    await expect(drawer.locator(".async-job-progress-error")).toBeVisible();
    await expect(drawer.locator(".async-job-error-detail")).toHaveText("Network timeout");
    await expect(drawer.getByRole("button", { name: "Retry sync customer segments" })).toBeVisible();
  });

  test("complete state exposes result counts and report download", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/async-activity-drawer/AADR-005");

    const drawer = page.locator("#async-activity-drawer");
    await expect(drawer.locator(".async-job-result").first()).toContainText("1,204");
    await expect(drawer.locator(".async-job-result-failed")).toContainText("7");
    await expect(drawer.locator(".async-job-download")).toHaveAttribute("download", "tenant-record-import-results.csv");
  });

  test("page-shell consumes the shared drawer seam at runtime", async ({ page }) => {
    await page.goto("/design-system/templates/page-shell");

    await page.locator("#async-activity-button").click();

    const drawer = page.locator('#async-activity-drawer[data-async-activity-drawer-mounted="true"]');
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('[data-async-activity-state="running"]')).toBeVisible();
    await expect(drawer.locator('[data-async-activity-state="waiting"]')).toBeVisible();
    await expect(drawer.locator('[data-async-activity-state="error"]')).toBeVisible();
    await expect(drawer.locator('[data-async-activity-state="complete"]')).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Close background jobs" })).toBeFocused();
  });
});
