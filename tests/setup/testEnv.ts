import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env", override: false, quiet: true });
loadEnv({ path: ".env.test", override: false, quiet: true });
loadEnv({ path: ".env.test.local", override: true, quiet: true });

process.env.NODE_ENV = "test";
process.env.TZ = "UTC";

process.env.PORT ??= "3000";
process.env.DATABASE_HOST ??= "127.0.0.1";
process.env.DATABASE_PORT ??= "5432";
process.env.DATABASE_NAME ??= "service_platform_test";
process.env.DATABASE_USER ??= "service_platform";
process.env.DATABASE_PASSWORD ??= "test_local_only";
process.env.DATABASE_SSL ??= "false";
process.env.ROOT_AUTH_BOOTSTRAP_PASSWORD ??= "test_local_only";
process.env.ROOT_AUTH_BOOTSTRAP_SSH_PUBLIC_KEY ??=
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE+fWomSs6CBXFwaDSUYCy2FHG5UtnFJF7RE/O1hoozG fixture-root-auth.test";
