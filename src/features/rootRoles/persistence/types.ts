import type {
  EffectivePermissionData,
  RootCapabilityCatalogItem,
  RootRoleAssignmentData,
  RootRoleData,
} from "../domain/types";

export interface RootRoleRecord {
  system_root_role_id: string;
  role_key: string;
  normalized_role_key: string;
  display_name: string;
  description: string;
  is_protected: boolean;
  created_at: Date;
  updated_at: Date;
  deactivated_at: Date | null;
  active_grant_count: number;
}

export interface CreateRootRoleRecordInput {
  rootRoleId: string;
  roleKey: string;
  displayName: string;
  description: string;
  isProtected: boolean;
  actorRootUserId: string;
}

export interface UpdateRootRoleRecordInput {
  rootRoleId: string;
  displayName?: string;
  description?: string;
  actorRootUserId: string;
}

export interface RootRoleRepositoryListInput {
  page: number;
  pageSize: number;
  includeInactive: boolean;
}

export interface RootRoleRepositoryListResult {
  items: RootRoleData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface CapabilityCatalogRecord extends RootCapabilityCatalogItem {}

export interface CapabilityCatalogListResult {
  items: CapabilityCatalogRecord[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface ReplaceCapabilityGrantsInput {
  rootRoleId: string;
  capabilityKeys: string[];
  actorRootUserId: string;
  reason?: string;
}

export interface CreateRootRoleAssignmentInput {
  assignmentId: string;
  rootUserId: string;
  rootRoleId: string;
  actorRootUserId: string;
  reason?: string;
}

export interface UnassignRootRoleAssignmentInput {
  rootUserId: string;
  rootRoleAssignmentId: string;
  actorRootUserId: string;
  reason?: string;
}

export interface ReplaceRootRoleAssignmentInput {
  rootUserId: string;
  sourceRootRoleAssignmentId?: string;
  sourceRootRoleId?: string;
  targetRootRoleId: string;
  actorRootUserId: string;
  reason?: string;
}

export interface RootRoleAssignmentListInput {
  rootUserId: string;
  page: number;
  pageSize: number;
}

export interface RootRoleAssignmentListResult {
  items: RootRoleAssignmentData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface EffectiveRootUserPermissionsRecord {
  rootUserId: string;
  roles: RootRoleAssignmentData[];
  permissions: EffectivePermissionData[];
}
