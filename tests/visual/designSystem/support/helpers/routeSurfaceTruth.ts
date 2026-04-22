import { expect, test, type Locator, type Page } from "@playwright/test";

type RouteSurfaceTruthOptions = {
  expectedPath: string;
  surfaceLocator: string | Locator;
  fallbackHeading?: string | RegExp;
  bodyAttribute?: {
    name: string;
    value?: string;
  };
  waitForReadyLocator?: string | Locator;
};

function resolveLocator(page: Page, target: string | Locator): Locator {
  return typeof target === "string" ? page.locator(target) : target;
}

export async function expectRouteSurfaceTruth(page: Page, options: RouteSurfaceTruthOptions) {
  await test.step(`route surface truth: ${options.expectedPath}`, async () => {
    await expect(page).toHaveURL(new RegExp(`${options.expectedPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));

    if (options.bodyAttribute) {
      if (options.bodyAttribute.value === undefined) {
        const value = await page.locator("body").getAttribute(options.bodyAttribute.name);
        expect(value, `body should expose ${options.bodyAttribute.name} on the expected surface`).not.toBeNull();
      } else {
        await expect(page.locator("body")).toHaveAttribute(options.bodyAttribute.name, options.bodyAttribute.value);
      }
    }

    if (options.fallbackHeading) {
      await expect(page.getByRole("heading", { name: options.fallbackHeading })).toHaveCount(0);
    }

    const surface = resolveLocator(page, options.surfaceLocator);
    await expect(surface).toBeVisible();

    if (options.waitForReadyLocator) {
      await expect(resolveLocator(page, options.waitForReadyLocator)).toBeVisible();
    }
  });
}
