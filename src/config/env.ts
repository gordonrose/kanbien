type NodeEnv = "development" | "test" | "production";

function readPort(value: string | undefined): number {
  const port = Number(value);

  if (!value || !Number.isInteger(port) || port <= 0) {
    throw new Error("Invalid PORT");
  }

  return port;
}

function readNodeEnv(value: string | undefined): NodeEnv {
  if (value === "development" || value === "test" || value === "production") {
    return value;
  }

  throw new Error("Invalid NODE_ENV");
}

export const env = {
  PORT: readPort(process.env.PORT),
  NODE_ENV: readNodeEnv(process.env.NODE_ENV)
};
