import { createRootUsersService } from "./service";
import type { RootUsersRepository } from "../persistence/repository";
import type { RootUserListInput, RootUserListResult } from "./types";

export async function listRootUsers(repository: RootUsersRepository, input: RootUserListInput): Promise<RootUserListResult> {
  return createRootUsersService(repository).listRootUsers(input);
}
