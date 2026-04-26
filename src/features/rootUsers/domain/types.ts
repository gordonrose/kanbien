export type RootUserStatus = "active" | "inactive";
export type CountValue = number | "10000+";

export interface RootUser {
  rootUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureAssetId: string | null;
  profilePictureUrl: string | null;
  profilePictureAltText: string | null;
  profilePictureDecorative: boolean;
  anonymized: boolean;
  status: RootUserStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface RootUserData {
  rootUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureAssetId: string | null;
  profilePictureAltText: string | null;
  profilePictureDecorative: boolean;
  anonymized: boolean;
  status: RootUserStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface RootUserAuthState {
  rootUserId: string;
  email: string;
  status: RootUserStatus;
  anonymized: boolean;
  deletedAt: Date | null;
}

export interface CreateRootUserInput {
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureAssetId?: string | null;
  profilePictureAltText?: string | null;
  profilePictureDecorative?: boolean;
  requestedByActorId?: string;
}

export interface GetRootUserInput { rootUserId: string; }
export interface GetRootUserByEmailInput { email: string; }

export interface RootUserListFilters {
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
  excludeAnonymized?: boolean;
}

export interface RootUserListInput {
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  filters: RootUserListFilters;
}

export interface RootUserListResult {
  items: RootUser[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}

export interface UpdateRootUserInput {
  rootUserId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePictureAssetId?: string | null;
  profilePictureAltText?: string | null;
  profilePictureDecorative?: boolean;
  requestedByActorId?: string;
  status?: RootUserStatus;
}

export interface DeleteRootUserInput { rootUserId: string; }
export interface RemoveRootUserInput { rootUserId: string; }
export interface ReActivateRootUserInput { rootUserId: string; }
