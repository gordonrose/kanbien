import { expect, test, type Locator } from "@playwright/test";

type Box = NonNullable<Awaited<ReturnType<Locator["boundingBox"]>>>;

async function getVisibleBox(locator: Locator, label: string): Promise<Box> {
  const box = await locator.boundingBox();
  expect(box, `${label} should have a visible bounding box for human-review geometry checks`).not.toBeNull();
  return box as Box;
}

export async function withHumanReviewGuard(label: string, guard: () => Promise<void>) {
  await test.step(`human review guard: ${label}`, guard);
}

export async function expectContainedWithin(subject: Locator, container: Locator, options?: { epsilon?: number; subjectLabel?: string; containerLabel?: string; }) {
  const epsilon = options?.epsilon ?? 0;
  const subjectLabel = options?.subjectLabel ?? "subject";
  const containerLabel = options?.containerLabel ?? "container";
  const subjectBox = await getVisibleBox(subject, subjectLabel);
  const containerBox = await getVisibleBox(container, containerLabel);

  expect(subjectBox.x, `${subjectLabel} should not start before ${containerLabel}`).toBeGreaterThanOrEqual(containerBox.x - epsilon);
  expect(subjectBox.y, `${subjectLabel} should not start above ${containerLabel}`).toBeGreaterThanOrEqual(containerBox.y - epsilon);
  expect(subjectBox.x + subjectBox.width, `${subjectLabel} should not extend past ${containerLabel}`).toBeLessThanOrEqual(
    containerBox.x + containerBox.width + epsilon,
  );
  expect(subjectBox.y + subjectBox.height, `${subjectLabel} should not extend below ${containerLabel}`).toBeLessThanOrEqual(
    containerBox.y + containerBox.height + epsilon,
  );
}

export async function expectStackedBelow(lower: Locator, upper: Locator, options?: { epsilon?: number; lowerLabel?: string; upperLabel?: string; }) {
  const epsilon = options?.epsilon ?? 0;
  const lowerLabel = options?.lowerLabel ?? "lower element";
  const upperLabel = options?.upperLabel ?? "upper element";
  const lowerBox = await getVisibleBox(lower, lowerLabel);
  const upperBox = await getVisibleBox(upper, upperLabel);

  expect(
    lowerBox.y,
    `${lowerLabel} should start below ${upperLabel} instead of overlapping it`,
  ).toBeGreaterThanOrEqual(upperBox.y + upperBox.height - epsilon);
}

export async function expectComputedColor(locator: Locator, expectedColor: string, label: string) {
  const color = await locator.evaluate((node) => window.getComputedStyle(node).color);
  expect(color, `${label} should keep the agreed readable foreground color`).toBe(expectedColor);
}
