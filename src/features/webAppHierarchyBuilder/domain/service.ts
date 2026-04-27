import { bootstrapWebAppHierarchy } from "./bootstrapWebAppHierarchy";
import { createWebAppModule } from "./createWebAppModule";
import { createWebAppPage } from "./createWebAppPage";
import {
  applyDesignSystemMaterialization,
  createDesignSystemPageProposal,
  createDesignSystemSubpageProposal,
  previewDesignSystemMaterialization,
  readAppliedDesignSystemTopologyTree,
} from "./designSystemTopologyMaterialization";
import { syncDesignSystemCanonicalRenderingsIntoHierarchy } from "./syncDesignSystemCanonicalRenderings";
import { getResolvedWebAppHierarchyTree } from "./getResolvedWebAppHierarchyTree";
import { listOrphanedWebAppPages } from "./listOrphanedWebAppPages";
import { listPlannerSelectableHierarchyNodes } from "./listPlannerSelectableHierarchyNodes";
import { moveWebAppPage } from "./moveWebAppPage";
import { updateModuleLandingPage } from "./updateModuleLandingPage";
import {
  applyStructureAwareWebAppHierarchySync,
  previewStructureAwareWebAppHierarchySync,
  syncWebAppHierarchyFromDiscoveryStructureAware,
} from "./structureAwareDiscoverySync";
import type {
  ApplyDesignSystemMaterializationInput,
  ApplyStructureAwareWebAppHierarchySyncInput,
  BootstrapWebAppHierarchyInput,
  CreateDesignSystemPageProposalInput,
  CreateDesignSystemSubpageProposalInput,
  CreateWebAppModuleInput,
  CreateWebAppPageInput,
  DesignSystemCanonicalRenderingTreeSyncResult,
  DesignSystemMaterializationApplyResult,
  DesignSystemMaterializationPreviewResult,
  DesignSystemProposalCreateResult,
  GetResolvedWebAppHierarchyTreeInput,
  ListWebAppHierarchyDiscoveryLinksInput,
  ListOrphanedWebAppPagesInput,
  ListPlannerSelectableHierarchyNodesInput,
  MoveWebAppPageInput,
  PreviewDesignSystemMaterializationInput,
  PreviewStructureAwareWebAppHierarchySyncInput,
  PlannerSelectableHierarchyNode,
  ResolvedWebAppHierarchyTree,
  SyncWebAppHierarchyFromDiscoveryInput,
  WebAppHierarchyDiscoveryLinkListResponse,
  WebAppHierarchyDiscoverySyncPreviewResult,
  UpdateWebAppModuleInput,
  UpdateWebAppPageInput,
  WebAppModule,
  WebAppHierarchyDiscoverySyncResult,
  WebAppHierarchyStructureAwareApplyResult,
  WebAppPage,
  DesignSystemMaterializer,
} from "./types";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import { updateWebAppModule } from "./updateWebAppModule";
import { updateWebAppPage } from "./updateWebAppPage";
import type { WebAppSurfaceDiscoveryIntegrationSeam } from "../../webAppSurfaceDiscovery";
import type { DesignSystemCanonicalsPublicSeam } from "../../designSystemCanonicals";
import { buildWebAppHierarchyDiscoveryLinkListResponse } from "./presenters";

export interface WebAppHierarchyBuilderService {
  createDesignSystemPageProposal(
    input: CreateDesignSystemPageProposalInput,
  ): Promise<DesignSystemProposalCreateResult>;
  createDesignSystemSubpageProposal(
    input: CreateDesignSystemSubpageProposalInput,
  ): Promise<DesignSystemProposalCreateResult>;
  previewDesignSystemMaterialization(
    input: PreviewDesignSystemMaterializationInput,
  ): Promise<DesignSystemMaterializationPreviewResult>;
  applyDesignSystemMaterialization(
    input: ApplyDesignSystemMaterializationInput,
  ): Promise<DesignSystemMaterializationApplyResult>;
  syncDesignSystemCanonicalRenderingsIntoHierarchy(input: {
    createdByRootAdminUserId: string;
  }): Promise<DesignSystemCanonicalRenderingTreeSyncResult>;
  readAppliedDesignSystemTopologyTree(): Promise<ResolvedWebAppHierarchyTree>;
  createWebAppModule(input: CreateWebAppModuleInput): Promise<WebAppModule>;
  updateWebAppModule(input: UpdateWebAppModuleInput): Promise<WebAppModule>;
  updateModuleLandingPage(input: UpdateWebAppModuleInput): Promise<WebAppModule>;
  createWebAppPage(input: CreateWebAppPageInput): Promise<WebAppPage>;
  updateWebAppPage(input: UpdateWebAppPageInput): Promise<WebAppPage>;
  moveWebAppPage(input: MoveWebAppPageInput): Promise<WebAppPage>;
  getResolvedWebAppHierarchyTree(
    input: GetResolvedWebAppHierarchyTreeInput,
  ): Promise<ResolvedWebAppHierarchyTree>;
  listPlannerSelectableHierarchyNodes(
    input: ListPlannerSelectableHierarchyNodesInput,
  ): Promise<PlannerSelectableHierarchyNode[]>;
  listOrphanedWebAppPages(input: ListOrphanedWebAppPagesInput): Promise<WebAppPage[]>;
  bootstrapWebAppHierarchy(
    input: BootstrapWebAppHierarchyInput,
  ): Promise<ResolvedWebAppHierarchyTree>;
  syncWebAppHierarchyFromDiscovery(
    input: SyncWebAppHierarchyFromDiscoveryInput,
  ): Promise<WebAppHierarchyDiscoverySyncResult>;
  previewStructureAwareWebAppHierarchySync(
    input: PreviewStructureAwareWebAppHierarchySyncInput,
  ): Promise<WebAppHierarchyDiscoverySyncPreviewResult>;
  applyStructureAwareWebAppHierarchySync(
    input: ApplyStructureAwareWebAppHierarchySyncInput,
  ): Promise<WebAppHierarchyStructureAwareApplyResult>;
  listWebAppHierarchyDiscoveryLinks(
    input: ListWebAppHierarchyDiscoveryLinksInput,
  ): Promise<WebAppHierarchyDiscoveryLinkListResponse>;
}

export function createWebAppHierarchyBuilderService(
  repository: WebAppHierarchyRepository,
  discoverySeam: WebAppSurfaceDiscoveryIntegrationSeam,
  designSystemMaterializer: DesignSystemMaterializer,
  designSystemCanonicalsSeam: DesignSystemCanonicalsPublicSeam = {
    async listLiveFamilies() {
      return { items: [] };
    },
    async getPublicLauncherByFamilyKey() {
      throw new Error("Design-system canonicals seam is not configured.");
    },
    async getPublicRenderingByFamilyKeyAndReferenceId() {
      throw new Error("Design-system canonicals seam is not configured.");
    },
    async listLiveHierarchyNodes() {
      return [];
    },
  },
): WebAppHierarchyBuilderService {
  return {
    createDesignSystemPageProposal: (input) =>
      createDesignSystemPageProposal(repository, input),
    createDesignSystemSubpageProposal: (input) =>
      createDesignSystemSubpageProposal(repository, input),
    previewDesignSystemMaterialization: (input) =>
      previewDesignSystemMaterialization(repository, designSystemMaterializer, input),
    applyDesignSystemMaterialization: (input) =>
      applyDesignSystemMaterialization(repository, designSystemMaterializer, input),
    syncDesignSystemCanonicalRenderingsIntoHierarchy: (input) =>
      syncDesignSystemCanonicalRenderingsIntoHierarchy(
        repository,
        designSystemCanonicalsSeam,
        input,
      ),
    readAppliedDesignSystemTopologyTree: () => readAppliedDesignSystemTopologyTree(repository),
    createWebAppModule: (input) => createWebAppModule(repository, input),
    updateWebAppModule: (input) => updateWebAppModule(repository, input),
    updateModuleLandingPage: (input) => updateModuleLandingPage(repository, input),
    createWebAppPage: (input) => createWebAppPage(repository, input),
    updateWebAppPage: (input) => updateWebAppPage(repository, input),
    moveWebAppPage: (input) => moveWebAppPage(repository, input),
    getResolvedWebAppHierarchyTree: (input) => getResolvedWebAppHierarchyTree(repository, input),
    listPlannerSelectableHierarchyNodes: (input) =>
      listPlannerSelectableHierarchyNodes(repository, input),
    listOrphanedWebAppPages: (input) => listOrphanedWebAppPages(repository, input),
    bootstrapWebAppHierarchy: (input) => bootstrapWebAppHierarchy(repository, input),
    syncWebAppHierarchyFromDiscovery: (input) =>
      syncWebAppHierarchyFromDiscoveryStructureAware(repository, discoverySeam, input),
    previewStructureAwareWebAppHierarchySync: (input) =>
      previewStructureAwareWebAppHierarchySync(repository, discoverySeam, input),
    applyStructureAwareWebAppHierarchySync: (input) =>
      applyStructureAwareWebAppHierarchySync(repository, discoverySeam, input),
    listWebAppHierarchyDiscoveryLinks: async (input) =>
      buildWebAppHierarchyDiscoveryLinkListResponse(
        await repository.listDiscoveryLinks({
          rootFamilyId: input.rootFamilyId,
          linkStatus: input.linkStatus,
          driftStatus: input.driftStatus,
          curatedTargetType: input.curatedTargetType,
        }),
        input,
      ),
  };
}
