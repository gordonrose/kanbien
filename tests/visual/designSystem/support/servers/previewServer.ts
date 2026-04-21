import { createServer } from "node:http";
import { createApp } from "../../../../../src/app";

const port = Number(process.env.PLAYWRIGHT_PREVIEW_PORT ?? "4317");
const app = createApp();
const server = createServer(app);

server.listen(port, "127.0.0.1", () => {
  // Keep startup output minimal so Playwright can wait on the health URL.
  // eslint-disable-next-line no-console
  console.log(`design-system preview server listening on http://127.0.0.1:${port}`);
});
