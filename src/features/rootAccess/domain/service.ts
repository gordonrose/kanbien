import { RootAccessError } from "../contract/errors";
import type {
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
} from "../contract/types";

export class RootAccessService {
  async createRootUser(_request: CreateRootUserRequest): Promise<CreateRootUserResponse> {
    throw new RootAccessError("INVALID_REQUEST", 501, "Not implemented");
  }

  async getRootUserProfile(_query: GetRootUserProfileQuery): Promise<RootUserProfileResponse> {
    throw new RootAccessError("INVALID_REQUEST", 501, "Not implemented");
  }

  async updateRootUserProfile(
    _request: UpdateRootUserProfileRequest,
  ): Promise<RootUserProfileResponse> {
    throw new RootAccessError("INVALID_REQUEST", 501, "Not implemented");
  }

  async updateRootUserPassword(
    _request: UpdateRootUserPasswordRequest,
  ): Promise<UpdateRootUserPasswordResponse> {
    throw new RootAccessError("INVALID_REQUEST", 501, "Not implemented");
  }

  async updateRootUserSshKeys(
    _request: UpdateRootUserSshKeysRequest,
  ): Promise<UpdateRootUserSshKeysResponse> {
    throw new RootAccessError("INVALID_REQUEST", 501, "Not implemented");
  }

  async deleteRootUser(_request: DeleteRootUserRequest): Promise<DeleteRootUserResponse> {
    throw new RootAccessError("INVALID_REQUEST", 501, "Not implemented");
  }

  async beginRootAuthentication(
    _request: BeginRootAuthenticationRequest,
  ): Promise<BeginRootAuthenticationResponse> {
    throw new RootAccessError("INVALID_REQUEST", 501, "Not implemented");
  }

  async completeRootAuthentication(
    _request: CompleteRootAuthenticationRequest,
  ): Promise<CompleteRootAuthenticationResponse> {
    throw new RootAccessError("INVALID_REQUEST", 501, "Not implemented");
  }

  async refreshRootSession(): Promise<RefreshRootSessionResponse> {
    throw new RootAccessError("INVALID_REQUEST", 501, "Not implemented");
  }

  async revokeRootSession(): Promise<RevokeRootSessionResponse> {
    throw new RootAccessError("INVALID_REQUEST", 501, "Not implemented");
  }
}
