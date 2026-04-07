export interface RootRoleData {
  rootRoleId: string;
  roleKey: string;
  displayName: string;
  description: string;
  protected: boolean;
  createdAt: Date;
  updatedAt: Date;
  deactivatedAt: Date | null;
  activeGrantCount: number;
}

export interface RootRoleListInput {
  page: number;
  pageSize: number;
  includeInactive: boolean;
}

export interface RootRoleListResultData {
  items: RootRoleData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface UpdateRootRoleInput {
  rootRoleId: string;
  displayName?: string;
  description?: string;
}

export interface CreateRootRoleInput {
  roleKey: string;
  displayName: string;
  description: string;
}

export interface RootCapabilityCatalogItem {
  capabilityKey: string;
  description: string;
  mandatory: boolean;
  protected: boolean;
}

export interface RootCapabilityCatalogListInput {
  rootRoleId: string;
  page: number;
  pageSize: number;
}

export interface RootCapabilityCatalogListResult {
  items: RootCapabilityCatalogItem[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface RootRoleAssignmentData {
  rootRoleAssignmentId: string;
  rootUserId: string;
  rootRoleId: string;
  roleKey: string;
  displayName: string;
  protected: boolean;
  assignedAt: Date;
  unassignedAt: Date | null;
}

export interface RootRoleAssignmentListInput {
  rootUserId: string;
  page: number;
  pageSize: number;
}

export interface RootRoleAssignmentListResultData {
  items: RootRoleAssignmentData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface EffectivePermissionData {
  capabilityKey: string;
  grantedByRoleKeys: string[];
}

export interface EffectiveRootUserPermissionsData {
  rootUserId: string;
  roles: RootRoleAssignmentData[];
  permissions: EffectivePermissionData[];
}

export interface RootUserEligibilityState {
  rootUserId: string;
  deletedAt: Date | null;
  anonymized: boolean;
  status: "active" | "inactive";
}
