import { createRootUsersService } from "./service";
import type { RootUsersRepository } from "../persistence/repository";
import type { RemoveRootUserInput, RootUser } from "./types";

export async function removeRootUser(repository: RootUsersRepository, input: RemoveRootUserInput): Promise<RootUser> {
  return createRootUsersService(repository).removeRootUser(input);
}
