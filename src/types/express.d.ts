import type { RootSessionContext } from "../lib/auth/requestContext";

declare global {
  namespace Express {
    interface Request {
      rootSession?: RootSessionContext;
    }
  }
}

export {};
