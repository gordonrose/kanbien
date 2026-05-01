import { createWebAppHierarchyId } from "./helpers";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import type { WebAppRootFamilyId } from "./types";

export const WEB_APP_HIERARCHY_AUDIT_EVENTS = {
  moduleCreated: "web_app_hierarchy.module_created",
  moduleUpdated: "web_app_hierarchy.module_updated",
  moduleLandingPageUpdated: "web_app_hierarchy.module_landing_page_updated",
  pageCreated: "web_app_hierarchy.page_created",
  pageUpdated: "web_app_hierarchy.page_updated",
  pageMoved: "web_app_hierarchy.page_moved",
  bootstrapApplied: "web_app_hierarchy.bootstrap_applied",
  discoverySyncApplied: "web_app_hierarchy.discovery_sync_applied",
} as const;

export async function recordWebAppHierarchyAuditEvent(
  repository: WebAppHierarchyRepository,
  input: {
    actorRootUserId?: string | null;
    rootFamilyId?: WebAppRootFamilyId | null;
    webAppModuleId?: string | null;
    webAppPageId?: string | null;
    eventType: string;
    reason?: string | null;
    beforeState?: unknown | null;
    afterState?: unknown | null;
  },
): Promise<void> {
  await repository.createAuditEvent({
    webAppHierarchyAuditEventId: createWebAppHierarchyId(),
    actorRootUserId: input.actorRootUserId ?? null,
    rootFamilyId: input.rootFamilyId ?? null,
    webAppModuleId: input.webAppModuleId ?? null,
    webAppPageId: input.webAppPageId ?? null,
    eventType: input.eventType,
    eventOutcome: "success",
    reason: input.reason ?? null,
    beforeState: input.beforeState ?? null,
    afterState: input.afterState ?? null,
  });
}
