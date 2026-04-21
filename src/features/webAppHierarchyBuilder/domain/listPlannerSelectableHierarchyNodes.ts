import type { WebAppHierarchyRepository } from "../persistence/repository";
import type {
  ListPlannerSelectableHierarchyNodesInput,
  PlannerSelectableHierarchyNode,
} from "./types";
import { buildPlannerSelectableHierarchyNodes } from "./presenters";

export async function listPlannerSelectableHierarchyNodes(
  repository: WebAppHierarchyRepository,
  input: ListPlannerSelectableHierarchyNodesInput,
): Promise<PlannerSelectableHierarchyNode[]> {
  const [modules, pages] = await Promise.all([repository.listModules(), repository.listPages()]);
  return buildPlannerSelectableHierarchyNodes(modules, pages, input.includeInactive ?? false);
}
