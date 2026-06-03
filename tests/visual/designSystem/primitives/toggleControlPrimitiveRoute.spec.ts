import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/toggle-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function thumbTransform(page: Page) {
  return page.locator(".ds-toggle-control-thumb").evaluate((element) => getComputedStyle(element).transform);
}

function channelToLinear(value: number) {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(rgb: number[]) {
  return 0.2126 * channelToLinear(rgb[0]) + 0.7152 * channelToLinear(rgb[1]) + 0.0722 * channelToLinear(rgb[2]);
}

function contrastRatio(a: number[], b: number[]) {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function rgbStringToChannels(value: string) {
  const rgbMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }

  const srgbMatch = value.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (srgbMatch) {
    return [Number(srgbMatch[1]), Number(srgbMatch[2]), Number(srgbMatch[3])].map((channel) =>
      Math.round(channel * 255),
    );
  }

  const oklabMatch = value.match(/oklab\(([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)/);
  if (oklabMatch) {
    const L = Number(oklabMatch[1]);
    const a = Number(oklabMatch[2]);
    const b = Number(oklabMatch[3]);
    const lPrime = L + 0.3963377774 * a + 0.2158037573 * b;
    const mPrime = L - 0.1055613458 * a - 0.0638541728 * b;
    const sPrime = L - 0.0894841775 * a - 1.291485548 * b;
    const l = lPrime ** 3;
    const m = mPrime ** 3;
    const s = sPrime ** 3;
    const linear = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];

    return linear.map((channel) => {
      const encoded = channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;
      return Math.round(Math.max(0, Math.min(1, encoded)) * 255);
    });
  }

    throw new Error(`Cannot parse rgb value: ${value}`);
}

async function togglePartColors(page: Page) {
  return page.evaluate(() => {
    const track = document.querySelector(".ds-toggle-control-frame");
    const thumb = document.querySelector(".ds-toggle-control-thumb");

    if (!(track instanceof HTMLElement) || !(thumb instanceof HTMLElement)) {
      return null;
    }

    return {
      track: getComputedStyle(track).backgroundColor,
      thumb: getComputedStyle(thumb).backgroundColor,
    };
  });
}

test.describe("toggle control primitive route", () => {
  test("renders one governed switch, toggles natively, and emits change events", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Toggle Control Primitive", level: 1 })).toBeVisible();
    const toggle = page.getByRole("switch", { name: "Enable workflow automation" });
    await expect(toggle).toBeVisible();
    await expect(toggle).not.toBeChecked();
    const beforeTransform = await thumbTransform(page);

    await toggle.focus();
    await page.keyboard.press("Space");
    await expect(toggle).toBeChecked();
    await expect(page.getByText("Selection log: checked")).toBeVisible();
    await expect.poll(() => thumbTransform(page)).not.toBe(beforeTransform);

    const target = await toggle.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { width: box.width, height: box.height };
    });
    expect(target.width).toBeGreaterThanOrEqual(44);
    expect(target.height).toBeGreaterThanOrEqual(44);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("blocks read-only changes while preserving focusability", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.getByLabel("Boolean value").selectOption("checked");
    await page.getByLabel("Field state").selectOption("read-only");

    const toggle = page.getByRole("switch", { name: "Enable workflow automation" });
    await expect(toggle).toBeChecked();
    await toggle.focus();
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Space");
    await expect(toggle).toBeChecked();
  });

  test("keeps mobile and RTL proof readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.locator("[data-toggle-direction-control]").selectOption("rtl");
    await page.locator("[data-toggle-scale-control]").selectOption({ label: "150%" });

    await expect(page.getByRole("heading", { name: "Toggle Control Primitive", level: 1 })).toBeVisible();
    await expect(page.getByRole("switch", { name: "Enable workflow automation" })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps dark resting and active thumbs distinguishable from their tracks", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);
    await page.locator("[data-toggle-theme-control]").selectOption("dark");

    const restingColors = await togglePartColors(page);
    expect(restingColors).not.toBeNull();
    expect(contrastRatio(rgbStringToChannels(restingColors?.track ?? ""), rgbStringToChannels(restingColors?.thumb ?? ""))).toBeGreaterThanOrEqual(3);

    await page.getByRole("switch", { name: "Enable workflow automation" }).click();
    const activeColors = await togglePartColors(page);
    expect(activeColors).not.toBeNull();
    expect(contrastRatio(rgbStringToChannels(activeColors?.track ?? ""), rgbStringToChannels(activeColors?.thumb ?? ""))).toBeGreaterThanOrEqual(3);
  });
});
