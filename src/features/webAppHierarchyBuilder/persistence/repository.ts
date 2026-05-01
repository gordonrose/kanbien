import type {
  WebAppDiscoveryLinkData,
  WebAppHierarchyAuditEventData,
  WebAppModuleData,
  WebAppPageData,
  WebAppPageLocatorData,
  WebAppPagePlacementType,
  WebAppRootFamilyData,
} from "../domain/types";
import type {
  BootstrapUpsertWebAppPageRecordInput,
  CreateWebAppHierarchyAuditEventRecordInput,
  CreateWebAppModuleRecordInput,
  CreateWebAppPageRecordInput,
  ListWebAppHierarchyAuditEventsRecordInput,
  MarkWebAppPageAppliedRecordInput,
  MoveWebAppPageRecordInput,
  UpsertWebAppDiscoveryLinkRecordInput,
  UpsertWebAppPageLocatorRecordInput,
  UpdateWebAppModuleRecordInput,
  UpdateWebAppPageMetadataRecordInput,
} from "./types";

export interface WebAppHierarchyRepository {
  listRootFamilies(): Promise<WebAppRootFamilyData[]>;
  listModules(): Promise<WebAppModuleData[]>;
  listPages(): Promise<WebAppPageData[]>;
  findModuleById(webAppModuleId: string): Promise<WebAppModuleData | null>;
  findModuleByKey(moduleKey: string): Promise<WebAppModuleData | null>;
  createModule(input: CreateWebAppModuleRecordInput): Promise<WebAppModuleData>;
  updateModule(input: UpdateWebAppModuleRecordInput): Promise<WebAppModuleData>;
  findPageById(webAppPageId: string): Promise<WebAppPageData | null>;
  findPageByKey(pageKey: string): Promise<WebAppPageData | null>;
  findPageByPlacementRoute(
    webAppModuleId: string,
    parentPageId: string | null,
    placementType: WebAppPagePlacementType,
    routeSegment: string,
  ): Promise<WebAppPageData | null>;
  createPage(input: CreateWebAppPageRecordInput): Promise<WebAppPageData>;
  bootstrapUpsertPage(input: BootstrapUpsertWebAppPageRecordInput): Promise<WebAppPageData>;
  updatePageMetadata(input: UpdateWebAppPageMetadataRecordInput): Promise<WebAppPageData>;
  markPageApplied(input: MarkWebAppPageAppliedRecordInput): Promise<WebAppPageData>;
  movePage(input: MoveWebAppPageRecordInput): Promise<WebAppPageData>;
  listPageLocators(): Promise<WebAppPageLocatorData[]>;
  findActivePageLocatorByPageId(webAppPageId: string): Promise<WebAppPageLocatorData | null>;
  findActivePageLocatorByNormalizedKey(
    normalizedLocatorKey: string,
  ): Promise<WebAppPageLocatorData | null>;
  upsertActivePageLocator(input: UpsertWebAppPageLocatorRecordInput): Promise<WebAppPageLocatorData>;
  listDiscoveryLinks(input?: {
    rootFamilyId?: string;
    linkStatus?: "matched" | "blocked" | "stale-discovered";
    driftStatus?:
      | "none"
      | "locator-drift"
      | "placement-drift"
      | "metadata-drift"
      | "stale-discovered"
      | "blocked-locator"
      | "blocked-ambiguity";
    curatedTargetType?: "module" | "page";
  }): Promise<WebAppDiscoveryLinkData[]>;
  findDiscoveryLinkByDiscoveredStructureNodeId(
    discoveredWebAppStructureNodeId: string,
  ): Promise<WebAppDiscoveryLinkData | null>;
  upsertDiscoveryLink(input: UpsertWebAppDiscoveryLinkRecordInput): Promise<WebAppDiscoveryLinkData>;
  updateResolvedFullRoutePaths(
    updates: Array<{ webAppPageId: string; resolvedFullRoutePath: string | null }>,
  ): Promise<void>;
  createAuditEvent(
    input: CreateWebAppHierarchyAuditEventRecordInput,
  ): Promise<WebAppHierarchyAuditEventData>;
  listAuditEvents(
    input?: ListWebAppHierarchyAuditEventsRecordInput,
  ): Promise<WebAppHierarchyAuditEventData[]>;
}
