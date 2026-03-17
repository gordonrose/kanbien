import { expect } from "vitest";

export function expectIsoTimestamp(value: unknown): void {
  expect(typeof value).toBe("string");
  expect(Number.isNaN(Date.parse(String(value)))).toBe(false);
}

export function expectObjectContainingKeys(
  value: unknown,
  keys: string[],
): void {
  expect(value).toBeTypeOf("object");
  expect(value).not.toBeNull();

  for (const key of keys) {
    expect(value).toHaveProperty(key);
  }
}
