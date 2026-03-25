import { createRootUsersService } from "./service";
import type { RootUsersRepository } from "../persistence/repository";
import type { RootUser, UpdateRootUserInput } from "./types";

export async function updateRootUser(repository: RootUsersRepository, input: UpdateRootUserInput): Promise<RootUser> {
  return createRootUsersService(repository).updateRootUser(input);
}
