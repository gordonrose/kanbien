import { expect, test, type Page } from "@playwright/test";

const listRecordCardCanonicalStates = [
  {
    refId: "LRC-001",
    label: "desktop baseline full width",
    route: "/design-system/components/list-record-card?ref=LRC-001&width=760&state=baseline&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LRC-002",
    label: "desktop selected full width",
    route: "/design-system/components/list-record-card?ref=LRC-002&width=760&state=selected&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LRC-003",
    label: "field-mapping placeholder",
    route: "/design-system/components/list-record-card?ref=LRC-003&width=760&state=mapping&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LRC-004",
    label: "missing-attribute fallback",
    route: "/design-system/components/list-record-card?ref=LRC-004&width=760&state=missing&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LRC-005",
    label: "half-page long-content review",
    route: "/design-system/components/list-record-card?ref=LRC-005&width=520&state=long&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LRC-006",
    label: "mobile narrow review",
    route: "/design-system/components/list-record-card?ref=LRC-006&width=360&state=mobile&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LRC-007",
    label: "rtl half-page review",
    route: "/design-system/components/list-record-card?ref=LRC-007&width=520&state=long&theme=normal&dir=rtl&zoom=0",
  },
  {
    refId: "LRC-008",
    label: "magnified half-page review",
    route: "/design-system/components/list-record-card?ref=LRC-008&width=520&state=long&theme=normal&dir=ltr&zoom=100",
  },
  {
    refId: "LRC-009",
    label: "theme baseline normal",
    route: "/design-system/components/list-record-card?ref=LRC-009&width=760&state=baseline&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LRC-010",
    label: "theme baseline dark",
    route: "/design-system/components/list-record-card?ref=LRC-010&width=760&state=baseline&theme=dark&dir=ltr&zoom=0",
  },
  {
    refId: "LRC-011",
    label: "theme baseline desert",
    route: "/design-system/components/list-record-card?ref=LRC-011&width=760&state=baseline&theme=desert&dir=ltr&zoom=0",
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
  await page.locator('#list-record-card-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system list-record-card canonical states", () => {
  test("launcher exposes desktop, half-page, and mobile review refs", async ({ page }) => {
    await page.goto("/design-system/canonicals/list-record-card");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(11);
    await expect(page.getByText("Half-page long-content review")).toBeVisible();
    await expect(page.getByText("Mobile narrow review")).toBeVisible();
    await expect(page.getByText("Theme baseline dark")).toBeVisible();
    await expect(page.getByText("Theme baseline desert")).toBeVisible();
  });

  for (const scenario of listRecordCardCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      await expect(page.locator("body")).toHaveAttribute("data-list-record-card-surface", "canonical");
      await expect(page.locator("#list-record-card-canonical-current")).toContainText(scenario.refId);
      await expect(page.locator("#list-record-card-preview-card")).toBeVisible();
    });
  }

  test("LRC-004 uses the missing-attribute fallback without empty secondary chrome", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-record-card?ref=LRC-004&width=760&state=missing&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#list-record-card-preview-title")).toHaveText("Untitled record");
    await expect(page.locator("#list-record-card-preview-subtitle")).toBeHidden();
    await expect(page.locator("#list-record-card-preview-tags")).toBeHidden();
  });

  test("LRC-005 and LRC-006 keep half-page and mobile widths honest", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-record-card?ref=LRC-005&width=520&state=long&theme=normal&dir=ltr&zoom=0",
    );

    const halfPageState = await page.evaluate(() => {
      const frame = document.querySelector("#list-record-card-preview-frame");
      const shell = document.querySelector("#list-record-card-preview-shell");
      return {
        frameWidth: frame instanceof HTMLElement ? Math.round(frame.getBoundingClientRect().width) : 0,
        shellWidth: shell instanceof HTMLElement ? Math.round(shell.getBoundingClientRect().width) : 0,
        viewportClass: shell instanceof HTMLElement ? shell.dataset.viewportClass ?? "" : "",
      };
    });

    expect(halfPageState.shellWidth).toBeGreaterThan(450);
    expect(halfPageState.shellWidth).toBeLessThan(560);
    expect(halfPageState.viewportClass).toBe("half-page");

    await gotoCanonicalState(
      page,
      "/design-system/components/list-record-card?ref=LRC-006&width=360&state=mobile&theme=normal&dir=ltr&zoom=0",
    );

    const mobileState = await page.evaluate(() => {
      const shell = document.querySelector("#list-record-card-preview-shell");
      return {
        shellWidth: shell instanceof HTMLElement ? Math.round(shell.getBoundingClientRect().width) : 0,
        viewportClass: shell instanceof HTMLElement ? shell.dataset.viewportClass ?? "" : "",
      };
    });

    expect(mobileState.shellWidth).toBeLessThan(390);
    expect(mobileState.viewportClass).toBe("mobile");
  });

  test("LRC-007 keeps rtl direction scoped to the local canonical surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-record-card?ref=LRC-007&width=520&state=long&theme=normal&dir=rtl&zoom=0",
    );

    const directionState = await page.evaluate(() => ({
      documentDir: document.documentElement.getAttribute("dir"),
      surfaceDir: document.querySelector("#list-record-card-preview-shell")?.getAttribute("dir"),
    }));

    expect(directionState.documentDir).not.toBe("rtl");
    expect(directionState.surfaceDir).toBe("rtl");
  });

  test("LRC-008 keeps magnification scoped to the local canonical surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-record-card?ref=LRC-008&width=520&state=long&theme=normal&dir=ltr&zoom=100",
    );

    const magnificationState = await page.evaluate(() => {
      const shell = document.querySelector("#list-record-card-preview-shell");
      return {
        documentScale: document.documentElement.style.getPropertyValue("--ui-scale"),
        shellScale: shell instanceof HTMLElement ? shell.style.getPropertyValue("--ui-scale") : "",
        shellMagnification: shell instanceof HTMLElement ? shell.dataset.magnification ?? "" : "",
      };
    });

    expect(magnificationState.documentScale).toBe("");
    expect(magnificationState.shellScale).toBe("1.5");
    expect(magnificationState.shellMagnification).toBe("100");
  });

  test("LRC-009 through LRC-011 keep theme scoped to the local canonical surface", async ({ page }) => {
    for (const scenario of listRecordCardCanonicalStates.filter((state) =>
      state.refId === "LRC-009" || state.refId === "LRC-010" || state.refId === "LRC-011"
    )) {
      await gotoCanonicalState(page, scenario.route);

      const themeState = await page.evaluate(() => {
        const layout = document.querySelector("#list-record-card-preview-frame")?.closest(".canonical-render-layout");
        return {
          documentTheme: document.documentElement.dataset.theme ?? "",
          layoutTheme: layout instanceof HTMLElement ? layout.dataset.themeScope ?? "" : "",
        };
      });

      expect(themeState.documentTheme).toBe("");
      expect(themeState.layoutTheme).toBe(
        scenario.refId === "LRC-010" ? "dark" : scenario.refId === "LRC-011" ? "desert" : "normal",
      );
    }
  });

  test("LRC-010 applies dark-theme ink to the canonical stage heading", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-record-card?ref=LRC-010&width=760&state=baseline&theme=dark&dir=ltr&zoom=0",
    );

    const headingThemeState = await page.evaluate(() => {
      const heading = document.getElementById("list-record-card-stage-title");
      const layout = document.querySelector(".canonical-render-layout");
      let resolvedInk = "";

      if (layout instanceof HTMLElement) {
        const probe = document.createElement("span");
        probe.style.color = "var(--ink)";
        layout.append(probe);
        resolvedInk = window.getComputedStyle(probe).color;
        probe.remove();
      }

      return {
        headingColor: heading ? window.getComputedStyle(heading).color : "",
        layoutInk: resolvedInk,
      };
    });

    expect(headingThemeState.headingColor).toBe(headingThemeState.layoutInk);
  });
});
