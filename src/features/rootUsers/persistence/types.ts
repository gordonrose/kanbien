export type RootUserStatus = "active" | "inactive";

export interface RootUserRecord {
  root_user_id: string;
  email: string;
  normalized_email: string;
  first_name: string | null;
  normalized_first_name: string | null;
  last_name: string | null;
  normalized_last_name: string | null;
  anonymized: boolean;
  status: RootUserStatus;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateRootUserRecordInput {
  rootUserId: string;
  email: string;
  normalizedEmail: string;
  firstName: string | null;
  normalizedFirstName: string | null;
  lastName: string | null;
  normalizedLastName: string | null;
  status: RootUserStatus;
}

export interface GetRootUserByIdInput {
  rootUserId: string;
}

export interface GetRootUserByEmailInput {
  normalizedEmail: string;
}

export interface ListPagination {
  limit: number;
  offset: number;
}

export interface RootUserListWhere {
  emailPrefix?: string;
  firstNamePrefix?: string;
  lastNamePrefix?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  deletedAtFrom?: string;
  deletedAtTo?: string;
  status?: RootUserStatus;
  includeDeleted: boolean;
  deletedOnly: boolean;
  excludeAnonymized: boolean;
  activeOnly: boolean;
}

export interface RootUserListOrder {
  orderBy:
    | "email"
    | "firstName"
    | "lastName"
    | "status"
    | "createdAt"
    | "updatedAt"
    | "deletedAt";
  orderDirection: "asc" | "desc";
}

export interface UpdateRootUserRecordInput {
  rootUserId: string;
  email?: string;
  normalizedEmail?: string;
  firstName?: string | null;
  normalizedFirstName?: string | null;
  lastName?: string | null;
  normalizedLastName?: string | null;
  status?: RootUserStatus;
}

export interface SoftDeleteRootUserRecordInput {
  rootUserId: string;
}

export interface RemoveRootUserRecordInput {
  rootUserId: string;
  anonymizedEmail: string;
  normalizedAnonymizedEmail: string;
  anonymizedFirstName: string;
  normalizedAnonymizedFirstName: string;
  anonymizedLastName: string;
  normalizedAnonymizedLastName: string;
}

export interface ReActivateRootUserRecordInput {
  rootUserId: string;
}

export interface PaginatedRootUserRecords {
  items: RootUserRecord[];
  totalItems: number;
}
