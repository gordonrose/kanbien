import { z } from "zod";

const prefixedIdSchema = (prefix: string) =>
  z.string().trim().min(prefix.length + 1).regex(new RegExp(`^${prefix}_[a-z0-9]+$`));

const trimmedNonEmptyString = z.string().trim().min(1);
const normalizedEmailSchema = z.string().trim().email().transform((value) => value.toLowerCase());

export const loginRootUserWithPasswordBodySchema = z.object({
  email: normalizedEmailSchema,
  password: z.string().min(1),
});

export const createRootUserAuthPrincipalBodySchema = z.object({
  rootUserId: z.string().uuid(),
  loginEmail: normalizedEmailSchema,
  password: z.string().min(1),
});

export const completeRootUserSshChallengeBodySchema = z.object({
  challengeId: prefixedIdSchema("chal"),
  signature: trimmedNonEmptyString,
  publicKeyFingerprint: trimmedNonEmptyString,
});

export const changeRootUserPasswordBodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export const addRootUserSshPublicKeyBodySchema = z.object({
  label: trimmedNonEmptyString.max(120),
  publicKey: trimmedNonEmptyString,
});

export const revokeRootUserSshPublicKeyParamsSchema = z.object({
  keyId: prefixedIdSchema("key"),
});

export const revokeRootUserSessionParamsSchema = z.object({
  sessionId: prefixedIdSchema("sess"),
});
