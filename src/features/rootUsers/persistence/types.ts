export type RootUserRecordStatus = "active" | "inactive";

export interface RootUserRecord {
  root_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  anonymized: boolean;
  status: RootUserRecordStatus;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface RootUserAuthStateRecord {
  root_user_id: string;
  email: string;
  status: RootUserRecordStatus;
  anonymized: boolean;
  deleted_at: Date | null;
}

export interface CreateRootUserRecordInput {
  rootUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateRootUserRecordInput {
  rootUserId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  status?: RootUserRecordStatus;
}

export interface RootUserRepositoryListFilters {
  emailPrefix?: string;
  firstNamePrefix?: string;
  lastNamePrefix?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  deletedAtFrom?: string;
  deletedAtTo?: string;
  status?: RootUserRecordStatus;
  excludeAnonymized?: boolean;
}

export interface RootUserRepositoryListInput {
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  filters: RootUserRepositoryListFilters;
}

export interface RootUserRepositoryListResult {
  items: import("../domain/types").RootUserData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}
