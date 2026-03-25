import { createRootUsersService } from "./service";
import type { RootUsersRepository } from "../persistence/repository";
import type { GetRootUserInput, RootUser } from "./types";

export async function getRootUser(repository: RootUsersRepository, input: GetRootUserInput): Promise<RootUser> {
  return createRootUsersService(repository).getRootUser(input);
}
