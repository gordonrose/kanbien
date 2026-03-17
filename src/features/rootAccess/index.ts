export { registerRootAccessRoutes } from "./integration";
export { createRootAccessRouter } from "./transport/router";

export type {
  BeginRootAuthenticationRequest,
  BeginRootAuthenticationResponse,
  CompleteRootAuthenticationRequest,
  CompleteRootAuthenticationResponse,
  CreateRootUserRequest,
  CreateRootUserResponse,
  DeleteRootUserRequest,
  DeleteRootUserResponse,
  GetRootUserProfileQuery,
  RefreshRootSessionResponse,
  RevokeRootSessionResponse,
  RootUserProfileResponse,
  UpdateRootUserPasswordRequest,
  UpdateRootUserPasswordResponse,
  UpdateRootUserProfileRequest,
  UpdateRootUserSshKeysRequest,
  UpdateRootUserSshKeysResponse,
} from "./contract/types";

export { RootAccessError, ROOT_ACCESS_ERROR_CODES } from "./contract/errors";
