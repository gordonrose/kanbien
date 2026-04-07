import type {
  CapabilityCatalogListResult,
  CreateRootRoleAssignmentInput,
  CreateRootRoleRecordInput,
  EffectiveRootUserPermissionsRecord,
  ReplaceCapabilityGrantsInput,
  ReplaceRootRoleAssignmentInput,
  RootRoleAssignmentListInput,
  RootRoleAssignmentListResult,
  RootRoleRecord,
  RootRoleRepositoryListInput,
  RootRoleRepositoryListResult,
  UnassignRootRoleAssignmentInput,
  UpdateRootRoleRecordInput,
} from "./types";

export interface RootCapabilityAssignmentCheck {
  hasCapability(rootUserId: string, capabilityKey: string): Promise<boolean>;
}

export interface RootRolesRepository extends RootCapabilityAssignmentCheck {
  createRole(input: CreateRootRoleRecordInput): Promise<import("../domain/types").RootRoleData>;
  findRoleById(rootRoleId: string): Promise<import("../domain/types").RootRoleData | null>;
  findRoleByKey(roleKey: string): Promise<import("../domain/types").RootRoleData | null>;
  listRoles(input: RootRoleRepositoryListInput): Promise<RootRoleRepositoryListResult>;
  updateRole(input: UpdateRootRoleRecordInput): Promise<import("../domain/types").RootRoleData | null>;
  deactivateRole(
    rootRoleId: string,
    actorRootUserId: string,
  ): Promise<import("../domain/types").RootRoleData | null>;
  reactivateRole(
    rootRoleId: string,
    actorRootUserId: string,
  ): Promise<import("../domain/types").RootRoleData | null>;
  listEligibleCapabilities(input: {
    rootRoleId: string;
    page: number;
    pageSize: number;
  }): Promise<CapabilityCatalogListResult>;
  listRoleCapabilityAssignments(input: {
    rootRoleId: string;
    page: number;
    pageSize: number;
  }): Promise<CapabilityCatalogListResult>;
  replaceRoleCapabilityGrants(input: ReplaceCapabilityGrantsInput): Promise<CapabilityCatalogListResult>;
  createRoleAssignment(input: CreateRootRoleAssignmentInput): Promise<import("../domain/types").RootRoleAssignmentData>;
  unassignRoleAssignment(input: UnassignRootRoleAssignmentInput): Promise<import("../domain/types").RootRoleAssignmentData | null>;
  listRootUserAssignments(input: RootRoleAssignmentListInput): Promise<RootRoleAssignmentListResult>;
  replaceRoleAssignment(input: ReplaceRootRoleAssignmentInput): Promise<import("../domain/types").EffectiveRootUserPermissionsData>;
  getEffectivePermissions(rootUserId: string): Promise<import("../domain/types").EffectiveRootUserPermissionsData>;
  countActiveAssignmentsForRoleKey(roleKey: string): Promise<number>;
  countActiveAssignmentsForRootUser(rootUserId: string): Promise<number>;
  findActiveAssignmentByRole(rootUserId: string, rootRoleId: string): Promise<import("../domain/types").RootRoleAssignmentData | null>;
  findActiveAssignmentById(
    rootUserId: string,
    rootRoleAssignmentId: string,
  ): Promise<import("../domain/types").RootRoleAssignmentData | null>;
}
