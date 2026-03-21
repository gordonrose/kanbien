import { expect } from "vitest";

export function expectIsoDate(value: unknown) {
  expect(typeof value).toBe("string");
  expect(Number.isNaN(Date.parse(String(value)))).toBe(false);
}