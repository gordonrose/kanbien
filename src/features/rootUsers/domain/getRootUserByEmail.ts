import { createRootUsersService } from "./service";
import type { RootUsersRepository } from "../persistence/repository";
import type { GetRootUserByEmailInput, RootUser } from "./types";

export async function getRootUserByEmail(repository: RootUsersRepository, input: GetRootUserByEmailInput): Promise<RootUser> {
  return createRootUsersService(repository).getRootUserByEmail(input);
}
