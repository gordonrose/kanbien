import { createApp } from "./app";
import { getEnv } from "./config/env";

const { port } = getEnv();
const app = createApp();

app.listen(port, () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});