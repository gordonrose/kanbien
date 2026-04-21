import { randomUUID } from "node:crypto";

export function createWebAppPageSettingsId(): string {
  return randomUUID();
}
