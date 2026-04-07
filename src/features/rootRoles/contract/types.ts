export interface RootRoleSummary {
  rootRoleId: string;
  roleKey: string;
  displayName: string;
  description: string;
  protected: boolean;
  assignable: boolean;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string | null;
  activeGrantCount: number;
}

export interface RootRoleListResult {
  items: RootRoleSummary[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface RootAuthzCapabilitySummary {
  capabilityKey: string;
  description: string;
  mandatory: boolean;
  protected: boolean;
}

export interface RootAuthzCapabilityListResult {
  items: RootAuthzCapabilitySummary[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface RootRoleCapabilityAssignmentResult extends RootAuthzCapabilityListResult {}

export interface RootUserRoleAssignmentSummary {
  rootRoleAssignmentId: string;
  rootUserId: string;
  rootRoleId: string;
  roleKey: string;
  displayName: string;
  protected: boolean;
  assignedAt: string;
  unassignedAt: string | null;
}

export interface RootUserRoleAssignmentListResult {
  items: RootUserRoleAssignmentSummary[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface EffectiveRootUserPermission {
  capabilityKey: string;
  grantedByRoleKeys: string[];
}

export interface EffectiveRootUserPermissionsResult {
  rootUserId: string;
  roles: RootUserRoleAssignmentSummary[];
  permissions: EffectiveRootUserPermission[];
}
