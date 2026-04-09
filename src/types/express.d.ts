import type { RootSessionContext, TenantSessionContext } from "../lib/auth/requestContext";

declare global {
  namespace Express {
    interface Request {
      rootSession?: RootSessionContext;
      tenantSession?: TenantSessionContext;
    }
  }
}

export {};
