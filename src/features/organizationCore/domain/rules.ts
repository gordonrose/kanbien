import { randomUUID } from "node:crypto";
import {
  OrganizationHierarchyConflictError,
  OrganizationLifecycleConflictError,
  OrganizationNameAlreadyExistsError,
  OrganizationNotFoundError,
} from "../contract/errors";
import type { OrganizationCoreRepository } from "../persistence/repository";
import type { OrganizationActorInput, OrganizationData } from "./types";

export const ORGANIZATION_MAX_DEPTH = 10;

export async function recordOrganizationAudit(
  repository: OrganizationCoreRepository,
  input: OrganizationActorInput & {
    tenantId: string;
    organizationId: string | null;
    eventType: string;
    eventOutcome?: "success" | "failure";
    eventDetails?: Record<string, unknown>;
  },
): Promise<void> {
  await repository.recordAuditEvent({
    eventId: randomUUID(),
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: input.eventType,
    eventOutcome: input.eventOutcome ?? "success",
    eventDetails: input.eventDetails,
    occurredAt: new Date(),
  });
}

export async function assertActiveNameAvailable(
  repository: OrganizationCoreRepository,
  tenantId: string,
  name: string,
  currentOrganizationId?: string,
): Promise<void> {
  const existing = await repository.findActiveByName(tenantId, name);
  if (existing && existing.organizationId !== currentOrganizationId) {
    throw new OrganizationNameAlreadyExistsError();
  }
}

export async function requireActiveOrganization(
  repository: OrganizationCoreRepository,
  tenantId: string,
  organizationId: string,
): Promise<OrganizationData> {
  const organization = await repository.findActiveById(tenantId, organizationId);
  if (!organization) {
    throw new OrganizationNotFoundError();
  }
  return organization;
}

export async function requireNonDeletedOrganization(
  repository: OrganizationCoreRepository,
  tenantId: string,
  organizationId: string,
): Promise<OrganizationData> {
  const organization = await repository.findNonDeletedById(tenantId, organizationId);
  if (!organization) {
    throw new OrganizationNotFoundError();
  }
  return organization;
}

async function collectAncestorIds(
  repository: OrganizationCoreRepository,
  tenantId: string,
  parentOrganizationId: string | null,
): Promise<string[]> {
  const ancestors: string[] = [];
  let cursor = parentOrganizationId;

  while (cursor) {
    const parent = await repository.findActiveById(tenantId, cursor);
    if (!parent) {
      throw new OrganizationHierarchyConflictError("Parent organization must be active.");
    }
    if (ancestors.includes(parent.organizationId)) {
      throw new OrganizationHierarchyConflictError("Organization hierarchy cycle detected.");
    }
    ancestors.push(parent.organizationId);
    cursor = parent.parentOrganizationId;
  }

  return ancestors;
}

function calculateSubtreeHeight(organizationId: string, descendants: OrganizationData[]): number {
  const childrenByParent = new Map<string, OrganizationData[]>();
  for (const descendant of descendants) {
    if (!descendant.parentOrganizationId) continue;
    const existing = childrenByParent.get(descendant.parentOrganizationId) ?? [];
    existing.push(descendant);
    childrenByParent.set(descendant.parentOrganizationId, existing);
  }

  function walk(parentId: string): number {
    const children = childrenByParent.get(parentId) ?? [];
    if (children.length === 0) {
      return 1;
    }
    return 1 + Math.max(...children.map((child) => walk(child.organizationId)));
  }

  return walk(organizationId);
}

export async function assertHierarchyMoveAllowed(
  repository: OrganizationCoreRepository,
  tenantId: string,
  organizationId: string,
  parentOrganizationId: string | null,
): Promise<void> {
  if (organizationId === parentOrganizationId) {
    throw new OrganizationHierarchyConflictError("Organization cannot be its own parent.");
  }

  const descendants = await repository.listNonDeletedDescendants(tenantId, organizationId);
  if (parentOrganizationId && descendants.some((item) => item.organizationId === parentOrganizationId)) {
    throw new OrganizationHierarchyConflictError("Organization cannot move under its own descendant.");
  }

  const ancestors = await collectAncestorIds(repository, tenantId, parentOrganizationId);
  const subtreeHeight = calculateSubtreeHeight(organizationId, descendants);
  const resultingDepth = ancestors.length + subtreeHeight;
  if (resultingDepth > ORGANIZATION_MAX_DEPTH) {
    throw new OrganizationHierarchyConflictError("Organization hierarchy depth limit exceeded.", {
      maxDepth: ORGANIZATION_MAX_DEPTH,
    });
  }
}

export async function assertNoActiveChildren(
  repository: OrganizationCoreRepository,
  tenantId: string,
  organizationId: string,
): Promise<void> {
  const children = await repository.listActiveChildren(tenantId, organizationId);
  if (children.length > 0) {
    throw new OrganizationLifecycleConflictError(
      "Organization has active children and must be archived as a branch or have children moved first.",
    );
  }
}
