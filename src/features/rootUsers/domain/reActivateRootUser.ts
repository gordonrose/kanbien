import { createRootUsersService } from "./service";
import type { RootUsersRepository } from "../persistence/repository";
import type { ReActivateRootUserInput, RootUser } from "./types";

export async function reActivateRootUser(repository: RootUsersRepository, input: ReActivateRootUserInput): Promise<RootUser> {
  return createRootUsersService(repository).reActivateRootUser(input);
}
