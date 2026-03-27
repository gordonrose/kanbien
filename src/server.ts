import { env } from "./config/env";
import { verifyDatabaseConnection } from "./lib/db";
import { createApp } from "./app";
import { assertRootAuthOpenSshVerificationAvailable } from "./features/rootAuth/domain/ssh";

async function start(): Promise<void> {
  await verifyDatabaseConnection();
  assertRootAuthOpenSshVerificationAvailable();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
}

start().catch((error: unknown) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
