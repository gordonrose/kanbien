import { expect, test, type Page } from "@playwright/test";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";
import { expectContainedWithin } from "../../support/helpers/humanReviewGuards";

const simpleSelectCanonicalStates = [
  {
    refId: "SSR-001",
    label: "default closed baseline",
    route: "/design-system/canonical-renderings/simple-select/SSR-001",
  },
  {
    refId: "SSR-002",
    label: "open anchored listbox with option-focus handoff",
    route: "/design-system/canonical-renderings/simple-select/SSR-002",
  },
  {
    refId: "SSR-003",
    label: "selected-option reflection after choice",
    route: "/design-system/canonical-renderings/simple-select/SSR-003",
  },
  {
    refId: "SSR-004",
    label: "disabled inherited state",
    route: "/design-system/canonical-renderings/simple-select/SSR-004",
  },
  {
    refId: "SSR-005",
    label: "rtl open state",
    route: "/design-system/canonical-renderings/simple-select/SSR-005",
  },
  {
    refId: "SSR-006",
    label: "theme-stress open state",
    route: "/design-system/canonical-renderings/simple-select/SSR-006",
  },
] as const;

async function gotoCanonicalState(page: Page, route: string) {
  const requestedWidth = 420;
  const viewportWidth = Math.max(requestedWidth + 360, 1280);

  await page.setViewportSize({
    width: viewportWidth,
    height: 1400,
  });
  await page.goto(route);
  await page.locator('#simple-select-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system simple select canonical states", () => {
  test("launcher exposes the full SSR set", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/simple-select");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(6);
    await expect(page.getByRole("link", { name: /SSR-002 Open anchored listbox with option-focus handoff/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/simple-select/SSR-002",
    );
    await expect(page.getByRole("link", { name: /SSR-003 Selected-option reflection after choice/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/simple-select/SSR-003",
    );
    await expect(page.getByRole("link", { name: /SSR-004 Disabled inherited state/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/simple-select/SSR-004",
    );
    await expect(page.getByRole("link", { name: /SSR-006 Theme-stress open state/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/simple-select/SSR-006",
    );
  });

  test("launcher cards open the dedicated canonical rendering surface", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/simple-select");

    await page.getByRole("link", { name: /SSR-002 Open anchored listbox with option-focus handoff/i }).click();

    await expectRouteSurfaceTruth(page, {
      expectedPath: "/design-system/canonical-renderings/simple-select/SSR-002",
      surfaceLocator: "#simple-select-preview-shell",
      waitForReadyLocator: '#simple-select-preview-shell[data-render-status="ready"]',
      bodyAttribute: { name: "data-simple-select-surface", value: "canonical" },
      fallbackHeading: /Design-System Route Families/i,
    });
    await expect(page.locator("#simple-select-canonical-current")).toContainText("SSR-002");
    await expect(page.locator("[data-form-select-listbox]")).toBeVisible();
  });

  for (const scenario of simpleSelectCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      await expectRouteSurfaceTruth(page, {
        expectedPath: scenario.route,
        surfaceLocator: "#simple-select-preview-trigger",
        waitForReadyLocator: '#simple-select-preview-shell[data-render-status="ready"]',
        bodyAttribute: { name: "data-simple-select-surface", value: "canonical" },
        fallbackHeading: /Design-System Route Families/i,
      });
      await expect(page.locator("#simple-select-canonical-current")).toContainText(scenario.refId);
    });
  }

  test("SSR-002 opens on the dedicated canonical surface with focus inside the option list", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/simple-select/SSR-002",
    );

    await expect(page.locator("[data-form-select-listbox]")).toBeVisible();
    await expect(page.locator("[data-form-select-option][aria-selected='true']").first()).toBeFocused();
  });

  test("open anchored listboxes reserve field space and stay inside the canonical frame", async ({ page }) => {
    for (const referenceId of ["SSR-002", "SSR-005", "SSR-006"] as const) {
      await gotoCanonicalState(page, `/design-system/canonical-renderings/simple-select/${referenceId}`);

      const reserve = await page.evaluate(() => {
        const field = document.querySelector(".simple-select-preview-field");
        return field instanceof HTMLElement ? field.style.getPropertyValue("--canonical-field-reserve") : null;
      });

      expect(reserve, `${referenceId} should reserve vertical space for the open listbox`).not.toBe("");
      await expectContainedWithin(
        page.locator("[data-form-select-listbox]"),
        page.locator("#simple-select-preview-frame"),
        {
          subjectLabel: `${referenceId} open simple-select listbox`,
          containerLabel: "simple-select canonical review frame",
        },
      );
    }
  });

  test("SSR-003 and SSR-004 keep selected and disabled states truthful on the dedicated surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/simple-select/SSR-003",
    );

    await expect(page.locator("#simple-select-preview-trigger")).toContainText("Trial tenants");
    await expect(page.locator("[data-form-select-value]")).toHaveValue("trial-tenants");
    await expect(page.locator("[data-form-select-listbox]")).toBeHidden();

    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/simple-select/SSR-004",
    );

    await expect(page.locator("#simple-select-preview-trigger")).toBeDisabled();
    await expect(page.locator("[data-form-select-listbox]")).toBeHidden();
  });

  test("SSR-005 and SSR-006 scope direction and theme to the local canonical surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/simple-select/SSR-005",
    );

    const directionState = await page.evaluate(() => ({
      documentDir: document.documentElement.getAttribute("dir"),
      surfaceDir: document.querySelector("#simple-select-preview-shell")?.getAttribute("dir"),
    }));

    expect(directionState.documentDir).not.toBe("rtl");
    expect(directionState.surfaceDir).toBe("rtl");

    const rtlAlignmentState = await page.evaluate(() => {
      const trigger = document.querySelector("#simple-select-preview-trigger");
      const firstOption = document.querySelector("[data-form-select-option]");
      return {
        triggerTextAlign: trigger ? getComputedStyle(trigger).textAlign : null,
        optionTextAlign: firstOption ? getComputedStyle(firstOption).textAlign : null,
      };
    });

    expect(rtlAlignmentState.triggerTextAlign).toBe("start");
    expect(rtlAlignmentState.optionTextAlign).toBe("start");

    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/simple-select/SSR-006",
    );

    const themeState = await page.evaluate(() => {
      const frame = document.querySelector("#simple-select-preview-frame");
      return {
        documentTheme: document.documentElement.dataset.theme ?? "",
        frameTheme: frame instanceof HTMLElement ? frame.dataset.themeScope ?? "" : "",
      };
    });

    expect(themeState.documentTheme).toBe("");
    expect(themeState.frameTheme).toBe("dark");
  });
});
