import { RootUserSignInBlockedError } from "../contract/errors";
import type { RootUserAuthStateRecord } from "../../rootUsers/persistence/types";

export function assertRootUserCanAuthenticate(rootUser: RootUserAuthStateRecord): void {
  if (rootUser.anonymized) {
    throw new RootUserSignInBlockedError("anonymized");
  }

  if (rootUser.deleted_at) {
    throw new RootUserSignInBlockedError("deleted");
  }

  if (rootUser.status !== "active") {
    throw new RootUserSignInBlockedError("inactive");
  }
}
