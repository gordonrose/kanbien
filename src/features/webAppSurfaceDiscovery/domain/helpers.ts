import { randomUUID } from "node:crypto";

export function createWebAppSurfaceDiscoveryId(): string {
  return randomUUID();
}

export function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeCanonicalLocator(value: string): string {
  return value.trim().replace(/\/+/g, "/");
}

export function normalizeStructureKey(value: string): string {
  return value.trim().replace(/\/+/g, "/").replace(/^\/+/, "").toLowerCase();
}

export function normalizeRouteHash(value: string): string {
  return value.replace(/^#+/, "").trim().toLowerCase();
}

export function buildDiscoveryKey(input: {
  rootFamilyId: string;
  locatorType: string;
  canonicalLocator: string;
}): string {
  return normalizeKey(`${input.rootFamilyId}:${input.locatorType}:${input.canonicalLocator}`);
}
