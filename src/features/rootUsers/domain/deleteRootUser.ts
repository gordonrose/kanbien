import { createRootUsersService } from "./service";
import type { RootUsersRepository } from "../persistence/repository";
import type { DeleteRootUserInput, RootUser } from "./types";

export async function deleteRootUser(repository: RootUsersRepository, input: DeleteRootUserInput): Promise<RootUser> {
  return createRootUsersService(repository).deleteRootUser(input);
}
