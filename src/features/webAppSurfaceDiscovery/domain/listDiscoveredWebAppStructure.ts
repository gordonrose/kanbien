import { DiscoveredWebAppStructureNodeNotFoundError } from "../contract/errors";
import type { WebAppSurfaceDiscoveryRepository } from "../persistence/repository";
import type {
  DiscoveredWebAppStructureNodeData,
  DiscoveredWebAppStructureTreeNodeData,
  ListDiscoveredWebAppStructureTreeInput,
} from "./types";

function sortNodes(
  left: DiscoveredWebAppStructureNodeData,
  right: DiscoveredWebAppStructureNodeData,
): number {
  const depthDiff = left.depth - right.depth;
  if (depthDiff !== 0) {
    return depthDiff;
  }
  const nodeKindDiff = left.nodeKind.localeCompare(right.nodeKind);
  if (nodeKindDiff !== 0) {
    return nodeKindDiff;
  }
  return left.structureKey.localeCompare(right.structureKey);
}

export async function listDiscoveredWebAppStructureTree(
  repository: WebAppSurfaceDiscoveryRepository,
  input: ListDiscoveredWebAppStructureTreeInput,
): Promise<DiscoveredWebAppStructureTreeNodeData[]> {
  const nodes = await repository.listDiscoveredStructureNodes(input);
  const byId = new Map<string, DiscoveredWebAppStructureTreeNodeData>();

  for (const node of [...nodes].sort(sortNodes)) {
    byId.set(node.discoveredWebAppStructureNodeId, {
      ...node,
      children: [],
    });
  }

  const roots: DiscoveredWebAppStructureTreeNodeData[] = [];
  for (const node of byId.values()) {
    if (!node.parentDiscoveredWebAppStructureNodeId) {
      roots.push(node);
      continue;
    }

    const parent = byId.get(node.parentDiscoveredWebAppStructureNodeId);
    if (!parent) {
      roots.push(node);
      continue;
    }

    parent.children.push(node);
  }

  const sortTree = (items: DiscoveredWebAppStructureTreeNodeData[]) => {
    items.sort(sortNodes);
    for (const item of items) {
      sortTree(item.children);
    }
  };
  sortTree(roots);

  return roots;
}

export async function getDiscoveredWebAppStructureNode(
  repository: WebAppSurfaceDiscoveryRepository,
  discoveredWebAppStructureNodeId: string,
): Promise<DiscoveredWebAppStructureNodeData> {
  const node = await repository.findDiscoveredStructureNodeById(discoveredWebAppStructureNodeId);
  if (!node) {
    throw new DiscoveredWebAppStructureNodeNotFoundError();
  }
  return node;
}
