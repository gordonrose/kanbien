export type RootUserStatus = "active" | "inactive";

export interface RootUser {
  rootUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  anonymized: boolean;
  status: RootUserStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginationInput {
  page: number;
  pageSize: number;
}

export interface SortInput<TOrderBy extends string> {
  orderBy: TOrderBy;
  orderDirection: "asc" | "desc";
}

export interface DateRangeInput {
  from?: string;
  to?: string;
}

export interface RootUserListFilters {
  emailPrefix?: string;
  firstNamePrefix?: string;
  lastNamePrefix?: string;
  createdAt?: DateRangeInput;
  updatedAt?: DateRangeInput;
  deletedAt?: DateRangeInput;
  status?: RootUserStatus;
}

export interface DeletedRootUserListFilters
  extends Omit<RootUserListFilters, "status"> {
  excludeAnonymized: boolean;
}

export interface CreateRootUserInput {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  status: RootUserStatus;
}

export interface GetRootUserInput {
  rootUserId: string;
}

export interface GetRootUserByEmailInput {
  email: string;
}

export interface ListRootUsersInput
  extends PaginationInput,
    SortInput<
      "email" | "firstName" | "lastName" | "status" | "createdAt" | "updatedAt" | "deletedAt"
    > {
  filters: RootUserListFilters;
}

export interface ListActiveRootUsersInput
  extends PaginationInput,
    SortInput<"email" | "firstName" | "lastName" | "createdAt" | "updatedAt"> {
  filters: Omit<RootUserListFilters, "deletedAt" | "status">;
}

export interface ListDeletedRootUsersInput
  extends PaginationInput,
    SortInput<
      "email" | "firstName" | "lastName" | "status" | "createdAt" | "updatedAt" | "deletedAt"
    > {
  filters: DeletedRootUserListFilters;
}

export interface UpdateRootUserInput {
  rootUserId: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  status?: RootUserStatus;
}

export interface DeleteRootUserInput {
  rootUserId: string;
}

export interface RemoveRootUserInput {
  rootUserId: string;
}

export interface ReActivateRootUserInput {
  rootUserId: string;
}

export interface PaginatedRootUsersResult {
  items: RootUser[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
