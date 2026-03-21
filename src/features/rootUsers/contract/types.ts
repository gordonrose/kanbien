export type RootUserStatus = "active" | "inactive";

export interface RootUserResponse {
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

export interface PaginatedRootUsersResponse {
  items: RootUserResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateRootUserRequest {
  body: {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    status?: RootUserStatus;
  };
}

export interface GetRootUserRequest {
  params: GetRootUserParams;
}

export interface GetRootUserParams {
  rootUserId: string;
}

export interface GetRootUserByEmailRequest {
  query: {
    email: string;
  };
}

export interface RootUserListQuery {
  page?: number;
  pageSize?: number;
  orderBy?:
    | "email"
    | "firstName"
    | "lastName"
    | "status"
    | "createdAt"
    | "updatedAt"
    | "deletedAt";
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

export interface ListRootUsersRequest {
  query: RootUserListQuery;
}

export interface ActiveRootUserListQuery {
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

export interface ListActiveRootUsersRequest {
  query: ActiveRootUserListQuery;
}

export interface DeletedRootUserListQuery {
  page?: number;
  pageSize?: number;
  orderBy?:
    | "email"
    | "firstName"
    | "lastName"
    | "status"
    | "createdAt"
    | "updatedAt"
    | "deletedAt";
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

export interface ListDeletedRootUsersRequest {
  query: DeletedRootUserListQuery;
}

export interface UpdateRootUserRequest {
  params: GetRootUserParams;
  body: {
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
    status?: RootUserStatus;
  };
}

export interface DeleteRootUserRequest {
  params: GetRootUserParams;
}

export interface RemoveRootUserRequest {
  params: GetRootUserParams;
}

export interface ReActivateRootUserRequest {
  params: GetRootUserParams;
}
