import { env } from "../../config/env";

export function getRootAdminSessionCookieOptions(nodeEnv: string = env.nodeEnv) {
  return {
    sameSite: "strict" as const,
    httpOnly: true,
    secure: nodeEnv === "production",
    path: "/",
    maxAge: env.rootAdmin.sessionIdleTtlSeconds * 1000,
  };
}

export function getRootAdminSessionClearCookieOptions(nodeEnv: string = env.nodeEnv) {
  return {
    sameSite: "strict" as const,
    httpOnly: true,
    secure: nodeEnv === "production",
    path: "/",
  };
}
