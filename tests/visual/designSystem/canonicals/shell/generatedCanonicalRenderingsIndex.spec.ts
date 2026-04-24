import { expect, test } from "@playwright/test";
import {
  collectGeneratedCanonicalFamilyRoutes,
  collectGeneratedCanonicalRenderRoutes,
  expectCanonicalRenderIntroOutsideThemeScope,
  expectGeneratedCanonicalShellContract,
  readDesignSystemTopNavContract,
} from "../../support/helpers/generatedCanonicalGuards";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";

const generatedCanonicalFamilies = [
  {
    familyKey: "page-shell-banner",
    familyLabel: /Page-Shell Banner/i,
    sampleRenderPath: "/design-system/canonical-renderings/page-shell-banner/PSBR-001",
    surfaceLocator: "#page-shell-banner-preview-shell",
    readyLocator: "#page-shell-banner-preview-shell",
    bodyAttribute: { name: "data-page-shell-banner-surface", value: "canonical" as const },
  },
  {
    familyKey: "top-nav",
    familyLabel: /Top Nav/i,
    sampleRenderPath: "/design-system/canonical-renderings/top-nav/TRP-001",
    surfaceLocator: "#top-nav-preview-frame",
    readyLocator: "#top-nav-preview-frame .top-nav",
    bodyAttribute: { name: "data-top-nav-surface", value: "canonical" as const },
  },
  {
    familyKey: "simple-select",
    familyLabel: /Simple Select/i,
    sampleRenderPath: "/design-system/canonical-renderings/simple-select/SSR-002",
    surfaceLocator: "#simple-select-preview-shell",
    readyLocator: "#simple-select-preview-shell[data-render-status='ready']",
    bodyAttribute: { name: "data-simple-select-surface", value: "canonical" as const },
  },
  {
    familyKey: "choice-group",
    familyLabel: /Choice Group/i,
    sampleRenderPath: "/design-system/canonical-renderings/choice-group/CGR-003",
    surfaceLocator: "#choice-group-preview-shell",
    readyLocator: "#choice-group-preview-shell[data-render-status='ready']",
    bodyAttribute: { name: "data-choice-group-surface", value: "canonical" as const },
  },
  {
    familyKey: "date-picker",
    familyLabel: /Date Picker/i,
    sampleRenderPath: "/design-system/canonical-renderings/date-picker/DTPR-001",
    surfaceLocator: "#date-picker-preview-shell",
    readyLocator: "#date-picker-preview-shell[data-render-status='ready']",
    bodyAttribute: { name: "data-date-picker-surface", value: "canonical" as const },
  },
  {
    familyKey: "drawer-select",
    familyLabel: /Drawer Select/i,
    sampleRenderPath: "/design-system/canonical-renderings/drawer-select/DSR-002",
    surfaceLocator: "#drawer-select-preview-shell",
    readyLocator: "#drawer-select-preview-shell[data-render-status='ready']",
    bodyAttribute: { name: "data-drawer-select-surface", value: "canonical" as const },
  },
  {
    familyKey: "display-settings",
    familyLabel: /Display Settings/i,
    sampleRenderPath: "/design-system/canonical-renderings/display-settings/DSR-001",
    surfaceLocator: "#context-nav-preview-shell",
    readyLocator: "#context-nav-canonical-current",
    bodyAttribute: { name: "data-context-nav-surface", value: "canonical" as const },
  },
  {
    familyKey: "form-template",
    familyLabel: /Form Template/i,
    sampleRenderPath: "/design-system/canonical-renderings/form-template/FTR-001",
    surfaceLocator: ".form-page-shell",
    readyLocator: ".form-page-shell",
  },
  {
    familyKey: "icon-grid",
    familyLabel: /Icon Grid/i,
    sampleRenderPath: "/design-system/canonical-renderings/icon-grid/IGR-002",
    surfaceLocator: "#icon-grid-preview-shell",
    readyLocator: "#icon-grid-preview-shell[data-render-status='ready']",
    bodyAttribute: { name: "data-icon-grid-surface", value: "canonical" as const },
  },
  {
    familyKey: "list-record-card",
    familyLabel: /List Record Card/i,
    sampleRenderPath: "/design-system/canonical-renderings/list-record-card/LRC-001",
    surfaceLocator: "#list-record-card-preview-shell",
    readyLocator: "#list-record-card-preview-shell[data-render-status='ready']",
    bodyAttribute: { name: "data-list-record-card-surface", value: "canonical" as const },
  },
  {
    familyKey: "list-detail-panel",
    familyLabel: /List Detail Panel/i,
    sampleRenderPath: "/design-system/canonical-renderings/list-detail-panel/LDP-001",
    surfaceLocator: "#list-detail-panel-preview-shell",
    readyLocator: "#list-detail-panel-preview-shell[data-render-status='ready']",
    bodyAttribute: { name: "data-list-detail-panel-surface", value: "canonical" as const },
  },
  {
    familyKey: "list-detail-split-layout",
    familyLabel: /List Detail Split Layout/i,
    sampleRenderPath: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-002",
    surfaceLocator: "#list-detail-split-layout-preview-shell",
    readyLocator: "#list-detail-split-layout-preview-shell[data-render-status='ready']",
    bodyAttribute: { name: "data-list-detail-split-layout-surface", value: "canonical" as const },
  },
  {
    familyKey: "time-picker",
    familyLabel: /Time Picker/i,
    sampleRenderPath: "/design-system/canonical-renderings/time-picker/TPR-004",
    surfaceLocator: "#time-picker-preview-shell",
    readyLocator: "#time-picker-preview-shell",
    bodyAttribute: { name: "data-time-picker-surface", value: "canonical" as const },
  },
] as const;

test.describe("design-system generated canonical renderings index", () => {
  test("generated launcher and render pages use the normalized design-system top-nav shell", async ({ page }) => {
    const designSystemTopNavContract = await readDesignSystemTopNavContract(page);

    await expectGeneratedCanonicalShellContract(page, "/design-system/canonical-renderings", designSystemTopNavContract);

    const familyRoutes = await collectGeneratedCanonicalFamilyRoutes(page);
    expect(familyRoutes.length).toBeGreaterThan(0);

    for (const familyRoute of familyRoutes) {
      await expectGeneratedCanonicalShellContract(page, familyRoute.href, designSystemTopNavContract);
    }
  });

  test("generated render-page chrome stays outside local theme scope", async ({ page }) => {
    for (const family of generatedCanonicalFamilies) {
      if (family.familyKey === "form-template") {
        continue;
      }

      await expectCanonicalRenderIntroOutsideThemeScope(page, family.sampleRenderPath);
    }
  });

  test("top-level generated index exposes the seeded family launcher cards", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings");

    for (const family of generatedCanonicalFamilies) {
      await expect(
        page.getByRole("link", { name: family.familyLabel }),
        `${family.familyKey} should be present on the top-level generated canonical-renderings index`,
      ).toHaveAttribute("href", `/design-system/canonical-renderings/${family.familyKey}`);
    }
  });

  for (const family of generatedCanonicalFamilies) {
    test(`${family.familyKey} proves the full generated launcher chain from index card to dedicated render surface`, async ({ page }) => {
      await page.goto("/design-system/canonical-renderings");

      await page.getByRole("link", { name: family.familyLabel }).click();

      await expect(page).toHaveURL(new RegExp(`/design-system/canonical-renderings/${family.familyKey}$`));
      await expect(page.locator(".canonical-launcher-button")).not.toHaveCount(0);

      await page.locator(`.canonical-launcher-button[href="${family.sampleRenderPath}"]`).click();

      await expectRouteSurfaceTruth(page, {
        expectedPath: family.sampleRenderPath,
        surfaceLocator: family.surfaceLocator,
        waitForReadyLocator: family.readyLocator,
        bodyAttribute: family.bodyAttribute,
        fallbackHeading: /Design-System Route Families/i,
      });
    });
  }
});
