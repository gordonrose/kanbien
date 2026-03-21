import type { RootUsersRepository } from "../persistence/repository";
import { createRootUser } from "./createRootUser";
import { deleteRootUser } from "./deleteRootUser";
import { getRootUser } from "./getRootUser";
import { getRootUserByEmail } from "./getRootUserByEmail";
import { listActiveRootUsers } from "./listActiveRootUsers";
import { listDeletedRootUsers } from "./listDeletedRootUsers";
import { listRootUsers } from "./listRootUsers";
import { reActivateRootUser } from "./reActivateRootUser";
import { removeRootUser } from "./removeRootUser";
import { updateRootUser } from "./updateRootUser";

export interface RootUsersService {
  createRootUser: ReturnType<typeof createRootUser>;
  getRootUser: ReturnType<typeof getRootUser>;
  getRootUserByEmail: ReturnType<typeof getRootUserByEmail>;
  listRootUsers: ReturnType<typeof listRootUsers>;
  listActiveRootUsers: ReturnType<typeof listActiveRootUsers>;
  updateRootUser: ReturnType<typeof updateRootUser>;
  deleteRootUser: ReturnType<typeof deleteRootUser>;
  removeRootUser: ReturnType<typeof removeRootUser>;
  listDeletedRootUsers: ReturnType<typeof listDeletedRootUsers>;
  reActivateRootUser: ReturnType<typeof reActivateRootUser>;
}

export const createRootUsersService = (
  repository: RootUsersRepository,
): RootUsersService => ({
  createRootUser: createRootUser(repository),
  getRootUser: getRootUser(repository),
  getRootUserByEmail: getRootUserByEmail(repository),
  listRootUsers: listRootUsers(repository),
  listActiveRootUsers: listActiveRootUsers(repository),
  updateRootUser: updateRootUser(repository),
  deleteRootUser: deleteRootUser(repository),
  removeRootUser: removeRootUser(repository),
  listDeletedRootUsers: listDeletedRootUsers(repository),
  reActivateRootUser: reActivateRootUser(repository),
});
