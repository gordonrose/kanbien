import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parseNumber(name: string, rawValue: string): number {
  const value = Number(rawValue);

  if (Number.isNaN(value)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }

  return value;
}

function parseBoolean(name: string, rawValue: string): boolean {
  if (rawValue === "true") {
    return true;
  }

  if (rawValue === "false") {
    return false;
  }

  throw new Error(`Environment variable ${name} must be 'true' or 'false'`);
}

function readEnv(name: string): string | undefined {
  return process.env[name];
}

function readEnvOrDefault(name: string, defaultValue: string): string {
  return readEnv(name) ?? defaultValue;
}

function readBooleanEnvOrDefault(name: string, defaultValue: boolean): boolean {
  const value = readEnv(name);
  return value === undefined ? defaultValue : parseBoolean(name, value);
}

function readNumberEnvOrDefault(name: string, defaultValue: number): number {
  return parseNumber(name, readEnvOrDefault(name, String(defaultValue)));
}

const nodeEnv = requireEnv("NODE_ENV");
const port = parseNumber("PORT", requireEnv("PORT"));

const databaseHost = requireEnv("DATABASE_HOST");
const databasePort = parseNumber("DATABASE_PORT", requireEnv("DATABASE_PORT"));
const databaseName = requireEnv("DATABASE_NAME");
const databaseUser = requireEnv("DATABASE_USER");
const databasePassword = requireEnv("DATABASE_PASSWORD");
const databaseSsl = parseBoolean("DATABASE_SSL", requireEnv("DATABASE_SSL"));

const rootAuthBootstrapPassword = readEnv("ROOT_AUTH_BOOTSTRAP_PASSWORD");
const rootAuthBootstrapSshPublicKey = readEnv("ROOT_AUTH_BOOTSTRAP_SSH_PUBLIC_KEY");
const rootAuthChallengeTtlSeconds = parseNumber(
  "ROOT_AUTH_CHALLENGE_TTL_SECONDS",
  readEnvOrDefault("ROOT_AUTH_CHALLENGE_TTL_SECONDS", "300"),
);
const rootAuthSessionTtlSeconds = parseNumber(
  "ROOT_AUTH_SESSION_TTL_SECONDS",
  readEnvOrDefault("ROOT_AUTH_SESSION_TTL_SECONDS", "28800"),
);
const rootAdminSessionIdleTtlSeconds = parseNumber(
  "ROOT_ADMIN_SESSION_IDLE_TTL_SECONDS",
  readEnvOrDefault("ROOT_ADMIN_SESSION_IDLE_TTL_SECONDS", "1800"),
);
const rootAdminSessionAbsoluteTtlSeconds = parseNumber(
  "ROOT_ADMIN_SESSION_ABSOLUTE_TTL_SECONDS",
  readEnvOrDefault("ROOT_ADMIN_SESSION_ABSOLUTE_TTL_SECONDS", "43200"),
);
const rootAdminSessionCookieName = readEnvOrDefault(
  "ROOT_ADMIN_SESSION_COOKIE_NAME",
  "kanbien_root_admin_session",
);
const rootAdminPublicOrigin = readEnv("ROOT_ADMIN_PUBLIC_ORIGIN");
const rootAdminSignerHelperPort = parseNumber(
  "ROOT_ADMIN_SIGNER_HELPER_PORT",
  readEnvOrDefault("ROOT_ADMIN_SIGNER_HELPER_PORT", "8787"),
);
const rootAuthPasswordMinLength = parseNumber(
  "ROOT_AUTH_PASSWORD_MIN_LENGTH",
  readEnvOrDefault("ROOT_AUTH_PASSWORD_MIN_LENGTH", "12"),
);
const tenantAuthSessionTtlSeconds = parseNumber(
  "TENANT_AUTH_SESSION_TTL_SECONDS",
  readEnvOrDefault("TENANT_AUTH_SESSION_TTL_SECONDS", "28800"),
);

const platformSecurityEnabled = readBooleanEnvOrDefault("PLATFORM_SECURITY_ENABLED", true);
const publicReadWindowSeconds = readNumberEnvOrDefault("PUBLIC_READ_WINDOW_SECONDS", 60);
const publicReadMaxAttempts = readNumberEnvOrDefault("PUBLIC_READ_MAX_ATTEMPTS", 120);
const publicAuthWindowSeconds = readNumberEnvOrDefault("PUBLIC_AUTH_WINDOW_SECONDS", 300);
const publicAuthMaxAttempts = readNumberEnvOrDefault("PUBLIC_AUTH_MAX_ATTEMPTS", 15);
const publicWriteWindowSeconds = readNumberEnvOrDefault("PUBLIC_WRITE_WINDOW_SECONDS", 60);
const publicWriteMaxAttempts = readNumberEnvOrDefault("PUBLIC_WRITE_MAX_ATTEMPTS", 30);
const authenticatedGeneralWindowSeconds = readNumberEnvOrDefault(
  "AUTHENTICATED_GENERAL_WINDOW_SECONDS",
  60,
);
const authenticatedGeneralMaxAttempts = readNumberEnvOrDefault(
  "AUTHENTICATED_GENERAL_MAX_ATTEMPTS",
  240,
);
const authenticatedSensitiveWindowSeconds = readNumberEnvOrDefault(
  "AUTHENTICATED_SENSITIVE_WINDOW_SECONDS",
  300,
);
const authenticatedSensitiveMaxAttempts = readNumberEnvOrDefault(
  "AUTHENTICATED_SENSITIVE_MAX_ATTEMPTS",
  60,
);
const authFailureWindowSeconds = readNumberEnvOrDefault("AUTH_FAILURE_WINDOW_SECONDS", 900);
const authFailureIpLockdownThreshold = readNumberEnvOrDefault(
  "AUTH_FAILURE_IP_LOCKDOWN_THRESHOLD",
  25,
);
const authFailureAccountLockdownThreshold = readNumberEnvOrDefault(
  "AUTH_FAILURE_ACCOUNT_LOCKDOWN_THRESHOLD",
  8,
);
const authFailureIpAccountLockdownThreshold = readNumberEnvOrDefault(
  "AUTH_FAILURE_IP_ACCOUNT_LOCKDOWN_THRESHOLD",
  5,
);
const authLockdownDurationSeconds = readNumberEnvOrDefault(
  "AUTH_LOCKDOWN_DURATION_SECONDS",
  900,
);
const resendApiKey = readEnv("RESEND_API_KEY");
const notificationEmailFrom = readEnvOrDefault("NOTIFICATION_EMAIL_FROM", "onboarding@resend.dev");
const redisUrl = readEnvOrDefault("REDIS_URL", "redis://localhost:6379");
const assetsLocalStorageRoot = readEnv("ASSETS_LOCAL_STORAGE_ROOT");

export const env = {
  nodeEnv,
  port,
  database: {
    host: databaseHost,
    port: databasePort,
    name: databaseName,
    user: databaseUser,
    password: databasePassword,
    ssl: databaseSsl,
  },
  rootAuth: {
    bootstrapPassword: rootAuthBootstrapPassword,
    bootstrapSshPublicKey: rootAuthBootstrapSshPublicKey,
    challengeTtlSeconds: rootAuthChallengeTtlSeconds,
    sessionTtlSeconds: rootAuthSessionTtlSeconds,
    passwordMinLength: rootAuthPasswordMinLength,
  },
  tenantAuth: {
    sessionTtlSeconds: tenantAuthSessionTtlSeconds,
    passwordMinLength: rootAuthPasswordMinLength,
  },
  rootAdmin: {
    sessionIdleTtlSeconds: rootAdminSessionIdleTtlSeconds,
    sessionAbsoluteTtlSeconds: rootAdminSessionAbsoluteTtlSeconds,
    sessionCookieName: rootAdminSessionCookieName,
    publicOrigin: rootAdminPublicOrigin,
    signerHelperPort: rootAdminSignerHelperPort,
  },
  platformSecurity: {
    enabled: platformSecurityEnabled,
    rateLimitPolicies: {
      publicRead: {
        windowSeconds: publicReadWindowSeconds,
        maxAttempts: publicReadMaxAttempts,
      },
      publicAuth: {
        windowSeconds: publicAuthWindowSeconds,
        maxAttempts: publicAuthMaxAttempts,
      },
      publicWrite: {
        windowSeconds: publicWriteWindowSeconds,
        maxAttempts: publicWriteMaxAttempts,
      },
      authenticatedGeneral: {
        windowSeconds: authenticatedGeneralWindowSeconds,
        maxAttempts: authenticatedGeneralMaxAttempts,
      },
      authenticatedSensitive: {
        windowSeconds: authenticatedSensitiveWindowSeconds,
        maxAttempts: authenticatedSensitiveMaxAttempts,
      },
    },
    authAbuse: {
      failureWindowSeconds: authFailureWindowSeconds,
      ipLockdownThreshold: authFailureIpLockdownThreshold,
      accountLockdownThreshold: authFailureAccountLockdownThreshold,
      ipAccountLockdownThreshold: authFailureIpAccountLockdownThreshold,
      lockdownDurationSeconds: authLockdownDurationSeconds,
    },
  },
  notificationDelivery: {
    providers: {
      resend: {
        apiKey: resendApiKey,
        fromEmail: notificationEmailFrom,
      },
    },
  },
  jobProcessing: {
    redisUrl,
  },
  assets: {
    localStorageRoot: assetsLocalStorageRoot,
  },
} as const;
