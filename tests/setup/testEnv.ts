import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env", override: false, quiet: true });
loadEnv({ path: ".env.test", override: false, quiet: true });
loadEnv({ path: ".env.test.local", override: true, quiet: true });

process.env.NODE_ENV = "test";
process.env.TZ = "UTC";
