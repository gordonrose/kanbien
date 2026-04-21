import { expect, test, type Page } from "@playwright/test";

const simpleSelectCanonicalStates = [
  {
    refId: "SSR-001",
    label: "default closed baseline",
    route: "/design-system/components/simple-select?ref=SSR-001&width=420&state=baseline&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "SSR-002",
    label: "open anchored listbox with option-focus handoff",
    route: "/design-system/components/simple-select?ref=SSR-002&width=420&state=open&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "SSR-003",
    label: "selected-option reflection after choice",
    route: "/design-system/components/simple-select?ref=SSR-003&width=420&state=selected&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "SSR-004",
    label: "disabled inherited state",
    route: "/design-system/components/simple-select?ref=SSR-004&width=420&state=disabled&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "SSR-005",
    label: "rtl open state",
    route: "/design-system/components/simple-select?ref=SSR-005&width=420&state=open&theme=normal&dir=rtl&zoom=0",
  },
  {
    refId: "SSR-006",
    label: "theme-stress open state",
    route: "/design-system/components/simple-select?ref=SSR-006&width=420&state=open&theme=dark&dir=ltr&zoom=0",
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
  await page.locator('#simple-select-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system simple select canonical states", () => {
  test("launcher exposes the full SSR set", async ({ page }) => {
    await page.goto("/design-system/canonicals/simple-select");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(6);
    await expect(page.getByRole("link", { name: /SSR-002 Open anchored listbox with option-focus handoff/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /SSR-003 Selected-option reflection after choice/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /SSR-004 Disabled inherited state/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /SSR-006 Theme-stress open state/i })).toBeVisible();
  });

  for (const scenario of simpleSelectCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      await expect(page.locator("body")).toHaveAttribute("data-simple-select-surface", "canonical");
      await expect(page.locator("#simple-select-canonical-current")).toContainText(scenario.refId);
      await expect(page.locator("#simple-select-preview-trigger")).toBeVisible();
    });
  }

  test("SSR-002 opens on the dedicated canonical surface with focus inside the option list", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/simple-select?ref=SSR-002&width=420&state=open&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("[data-form-select-listbox]")).toBeVisible();
    await expect(page.locator("[data-form-select-option][aria-selected='true']").first()).toBeFocused();
  });

  test("SSR-003 and SSR-004 keep selected and disabled states truthful on the dedicated surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/simple-select?ref=SSR-003&width=420&state=selected&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#simple-select-preview-trigger")).toContainText("Trial tenants");
    await expect(page.locator("[data-form-select-value]")).toHaveValue("trial-tenants");
    await expect(page.locator("[data-form-select-listbox]")).toBeHidden();

    await gotoCanonicalState(
      page,
      "/design-system/components/simple-select?ref=SSR-004&width=420&state=disabled&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#simple-select-preview-trigger")).toBeDisabled();
    await expect(page.locator("[data-form-select-listbox]")).toBeHidden();
  });

  test("SSR-005 and SSR-006 scope direction and theme to the local canonical surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/simple-select?ref=SSR-005&width=420&state=open&theme=normal&dir=rtl&zoom=0",
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
      "/design-system/components/simple-select?ref=SSR-006&width=420&state=open&theme=dark&dir=ltr&zoom=0",
    );

    const themeState = await page.evaluate(() => {
      const layout = document.querySelector("#simple-select-preview-frame")?.closest(".canonical-render-layout");
      return {
        documentTheme: document.documentElement.dataset.theme ?? "",
        layoutTheme: layout instanceof HTMLElement ? layout.dataset.themeScope ?? "" : "",
      };
    });

    expect(themeState.documentTheme).toBe("");
    expect(themeState.layoutTheme).toBe("dark");
  });
});
