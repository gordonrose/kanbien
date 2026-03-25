import { RootUserSignInBlockedError } from "../contract/errors";
import type { RootUserAuthState } from "../../rootUsers";

export function assertRootUserCanAuthenticate(rootUser: RootUserAuthState): void {
  if (rootUser.anonymized) {
    throw new RootUserSignInBlockedError("anonymized");
  }

  if (rootUser.deletedAt) {
    throw new RootUserSignInBlockedError("deleted");
  }

  if (rootUser.status !== "active") {
    throw new RootUserSignInBlockedError("inactive");
  }
}
