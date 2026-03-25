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

const rootAuthBootstrapPassword = readEnvOrDefault("ROOT_AUTH_BOOTSTRAP_PASSWORD", "@Nima2or1!");
const rootAuthBootstrapSshPublicKey = readEnvOrDefault(
  "ROOT_AUTH_BOOTSTRAP_SSH_PUBLIC_KEY",
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEZeNv6aKKHqLJQQoqsHUhYyFMFFbE8WWvgDSFH0WJiq gordon@<machine-name>",
);
const rootAuthChallengeTtlSeconds = parseNumber(
  "ROOT_AUTH_CHALLENGE_TTL_SECONDS",
  readEnvOrDefault("ROOT_AUTH_CHALLENGE_TTL_SECONDS", "300"),
);
const rootAuthSessionTtlSeconds = parseNumber(
  "ROOT_AUTH_SESSION_TTL_SECONDS",
  readEnvOrDefault("ROOT_AUTH_SESSION_TTL_SECONDS", "28800"),
);
const rootAuthPasswordMinLength = parseNumber(
  "ROOT_AUTH_PASSWORD_MIN_LENGTH",
  readEnvOrDefault("ROOT_AUTH_PASSWORD_MIN_LENGTH", "12"),
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
} as const;
