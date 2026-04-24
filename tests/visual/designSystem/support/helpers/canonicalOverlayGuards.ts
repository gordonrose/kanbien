import { expect, test, type Locator, type Page } from "@playwright/test";
import { expectContainedWithin, expectStackedBelow } from "./humanReviewGuards";

type LocatorTarget = string | Locator;

type CanonicalOverlayContainmentOptions = {
  label: string;
  overlay: LocatorTarget;
  panel: LocatorTarget;
  hostSurface: LocatorTarget;
  renderFrame: LocatorTarget;
  below?: LocatorTarget;
  epsilon?: number;
  requirePanelWidthWithinHost?: boolean;
};

function resolveLocator(page: Page, target: LocatorTarget): Locator {
  return typeof target === "string" ? page.locator(target) : target;
}

export async function expectCanonicalOverlayContainedInRenderSurface(
  page: Page,
  options: CanonicalOverlayContainmentOptions,
) {
  const epsilon = options.epsilon ?? 1;
  const overlay = resolveLocator(page, options.overlay);
  const panel = resolveLocator(page, options.panel);
  const hostSurface = resolveLocator(page, options.hostSurface);
  const renderFrame = resolveLocator(page, options.renderFrame);

  await test.step(`canonical overlay containment: ${options.label}`, async () => {
    await expect(overlay, `${options.label} overlay should be visible`).toBeVisible();
    await expect(panel, `${options.label} panel should be visible`).toBeVisible();

    await expectContainedWithin(overlay, hostSurface, {
      epsilon,
      subjectLabel: `${options.label} overlay`,
      containerLabel: `${options.label} host surface`,
    });

    await expectContainedWithin(panel, renderFrame, {
      epsilon,
      subjectLabel: `${options.label} panel`,
      containerLabel: `${options.label} render frame`,
    });

    if (options.below) {
      await expectStackedBelow(panel, resolveLocator(page, options.below), {
        epsilon,
        lowerLabel: `${options.label} panel`,
        upperLabel: `${options.label} preceding chrome`,
      });
    }

    if (options.requirePanelWidthWithinHost) {
      const panelBox = await panel.boundingBox();
      const hostBox = await hostSurface.boundingBox();

      expect(panelBox, `${options.label} panel should have width geometry`).not.toBeNull();
      expect(hostBox, `${options.label} host should have width geometry`).not.toBeNull();
      expect(
        panelBox?.width ?? Number.POSITIVE_INFINITY,
        `${options.label} panel width should fit inside the host surface width`,
      ).toBeLessThanOrEqual((hostBox?.width ?? 0) + epsilon);
    }
  });
}
