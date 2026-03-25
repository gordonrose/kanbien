export type RootUserStatus = "active" | "inactive";
export type CountValue = number | "10000+";

export interface RootUserResponse {
  rootUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  anonymized: boolean;
  status: RootUserStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateRootUserRequest {
  body: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface GetRootUserParams {
  rootUserId: string;
}

export interface GetRootUserRequest {
  params: GetRootUserParams;
}

export interface GetRootUserByEmailRequest {
  query: {
    email: string;
  };
}

export interface ListRootUsersQuery {
  page?: number;
  pageSize?: number;
  orderBy?: "email" | "firstName" | "lastName" | "status" | "createdAt" | "updatedAt" | "deletedAt";
  orderDirection?: "asc" | "desc";
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
}

export interface ListActiveRootUsersQuery {
  page?: number;
  pageSize?: number;
  orderBy?: "email" | "firstName" | "lastName" | "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
  emailPrefix?: string;
  firstNamePrefix?: string;
  lastNamePrefix?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
}

export interface ListDeletedRootUsersQuery {
  page?: number;
  pageSize?: number;
  orderBy?: "email" | "firstName" | "lastName" | "status" | "createdAt" | "updatedAt" | "deletedAt";
  orderDirection?: "asc" | "desc";
  emailPrefix?: string;
  firstNamePrefix?: string;
  lastNamePrefix?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  deletedAtFrom?: string;
  deletedAtTo?: string;
  excludeAnonymized?: boolean;
}

export interface ListRootUsersRequest { query: ListRootUsersQuery; }
export interface ListActiveRootUsersRequest { query: ListActiveRootUsersQuery; }
export interface ListDeletedRootUsersRequest { query: ListDeletedRootUsersQuery; }

export interface UpdateRootUserRequest {
  params: { rootUserId: string };
  body: {
    email?: string;
    firstName?: string;
    lastName?: string;
    status?: RootUserStatus;
  };
}

export interface DeleteRootUserRequest { params: { rootUserId: string }; }
export interface RemoveRootUserRequest { params: { rootUserId: string }; }
export interface ReActivateRootUserRequest { params: { rootUserId: string }; }

export interface PaginatedRootUsersResponse {
  items: RootUserResponse[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}
