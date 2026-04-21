import type { Express } from "express";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../src/lib/security/rateLimit";
import { env } from "../../src/config/env";
import type {
  WebAppHierarchyIntegrationSeam,
  WebAppHierarchySettingsSelectablePage,
} from "../../src/features/webAppHierarchyBuilder";
import type { WebAppPageData } from "../../src/features/webAppHierarchyBuilder/domain/types";
import type { WebAppHierarchyRepository } from "../../src/features/webAppHierarchyBuilder/persistence/repository";
import {
  createWebAppPageSettingsService,
} from "../../src/features/webAppPageSettings/domain/service";
import type {
  WebAppPageContextNavItemData,
  WebAppPageSettingsData,
} from "../../src/features/webAppPageSettings/domain/types";
import type { WebAppPageSettingsRepository } from "../../src/features/webAppPageSettings/persistence/repository";
import { createWebAppPageSettingsRouter } from "../../src/features/webAppPageSettings/transport/router";
import type {
  RootAuthIntegrationHarness,
} from "../harness/rootAuth/integrationHarness";

function cloneSettings(settings: WebAppPageSettingsData): WebAppPageSettingsData {
  return {
    ...settings,
    createdAt: new Date(settings.createdAt),
    updatedAt: new Date(settings.updatedAt),
  };
}

function cloneContextNavItem(item: WebAppPageContextNavItemData): WebAppPageContextNavItemData {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  };
}

function toSelectablePage(page: WebAppPageData): WebAppHierarchySettingsSelectablePage {
  return {
    webAppPageId: page.webAppPageId,
    rootFamilyId: page.rootFamilyId,
    webAppModuleId: page.webAppModuleId,
    parentPageId: page.parentPageId,
    pageKey: page.pageKey,
    displayLabel: page.displayLabel,
    resolvedFullRoutePath: page.resolvedFullRoutePath,
    status: page.status,
    topologyState: page.topologyState,
    templateKey: page.templateKey,
  };
}

export function createStubWebAppHierarchySettingsSeam(
  repository: WebAppHierarchyRepository,
): WebAppHierarchyIntegrationSeam {
  return {
    getPageById(webAppPageId) {
      return repository.findPageById(webAppPageId);
    },
    async listPagesByRootFamily(input) {
      const pages = await repository.listPages();
      return pages
        .filter((page) => page.rootFamilyId === input.rootFamilyId)
        .filter((page) => page.placementType !== "orphaned")
        .filter((page) => page.status !== "inactive")
        .map(toSelectablePage);
    },
    async listSelectablePagesForSettings(input) {
      const owner = await repository.findPageById(input.ownerWebAppPageId);
      if (!owner) {
        return [];
      }

      return this.listPagesByRootFamily({ rootFamilyId: owner.rootFamilyId });
    },
  };
}

export function createInMemoryWebAppPageSettingsRepository(seed?: {
  settings?: WebAppPageSettingsData[];
  contextNavItems?: WebAppPageContextNavItemData[];
}): WebAppPageSettingsRepository & {
  settings: Map<string, WebAppPageSettingsData>;
  contextNavItems: Map<string, WebAppPageContextNavItemData>;
} {
  const settings = new Map(
    (seed?.settings ?? []).map((item) => [item.webAppPageId, cloneSettings(item)]),
  );
  const contextNavItems = new Map(
    (seed?.contextNavItems ?? []).map((item) => [item.webAppPageContextNavItemId, cloneContextNavItem(item)]),
  );

  return {
    settings,
    contextNavItems,
    async findSettingsByPageId(webAppPageId) {
      const record = settings.get(webAppPageId) ?? null;
      return record ? cloneSettings(record) : null;
    },
    async upsertSettings(input) {
      const current = settings.get(input.webAppPageId) ?? null;
      const next: WebAppPageSettingsData = {
        webAppPageSettingsId: current?.webAppPageSettingsId ?? input.webAppPageSettingsId,
        webAppPageId: input.webAppPageId,
        parentPageId: input.parentPageId,
        iconKey: input.iconKey,
        showInTopNav: input.showInTopNav,
        topNavOrder: input.topNavOrder,
        pageTemplateKey: input.pageTemplateKey,
        createdAt: current?.createdAt ?? new Date("2026-04-20T00:00:00.000Z"),
        updatedAt: new Date("2026-04-20T01:00:00.000Z"),
      };
      settings.set(next.webAppPageId, cloneSettings(next));
      return cloneSettings(next);
    },
    async listContextNavItemsByOwnerPageId(ownerWebAppPageId) {
      return [...contextNavItems.values()]
        .filter((item) => item.ownerWebAppPageId === ownerWebAppPageId)
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map(cloneContextNavItem);
    },
    async replaceContextNavItems(ownerWebAppPageId, items) {
      for (const [id, item] of contextNavItems) {
        if (item.ownerWebAppPageId === ownerWebAppPageId) {
          contextNavItems.delete(id);
        }
      }

      for (const item of items) {
        contextNavItems.set(
          item.webAppPageContextNavItemId,
          cloneContextNavItem({
            ...item,
            createdAt: new Date("2026-04-20T01:00:00.000Z"),
            updatedAt: new Date("2026-04-20T01:00:00.000Z"),
          }),
        );
      }
    },
  };
}

export function mountWebAppPageSettingsFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  repository: WebAppPageSettingsRepository,
  hierarchySeam: WebAppHierarchyIntegrationSeam,
) {
  const requireRootSession = createRequireRootSession(harness.authRepository, {
    allowBrowserCookie: true,
  });
  const authenticatedGeneralRateLimit = createRateLimitMiddleware({
    enabled: env.platformSecurity.enabled,
    repository: harness.platformSecurityRepository,
    policy: {
      endpointClass: "authenticated-general",
      windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.windowSeconds,
      maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts,
      responseCode: "RATE_LIMITED",
      responseMessage: "Too many requests. Please wait and try again.",
    },
    subjectScope: "auth_user",
    getSubjectKey: (request) =>
      request.rootSession
        ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}`
        : null,
  });
  const capabilityChecker = {
    async hasCapability(input: { rootUserId: string; capabilityKey: string }) {
      return harness.getRootUserCapabilities(input.rootUserId).includes(input.capabilityKey);
    },
  };

  app.use(
    "/v1/web-app-page-settings",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createWebAppPageSettingsRouter(
      createWebAppPageSettingsService(repository, hierarchySeam),
      capabilityChecker,
      harness.platformSecurityRepository,
    ),
  );
}
