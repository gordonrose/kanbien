import { createRootUsersService } from "./service";
import type { RootUsersRepository } from "../persistence/repository";
import type { CreateRootUserInput, RootUser } from "./types";

export async function createRootUser(repository: RootUsersRepository, input: CreateRootUserInput): Promise<RootUser> {
  return createRootUsersService(repository).createRootUser(input);
}
