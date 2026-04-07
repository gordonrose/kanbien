import { EventEmitter } from "node:events";
import type { Express } from "express";

export interface JsonResponse {
  status: number;
  body: unknown;
  headers: Record<string, string | string[] | undefined>;
}

export class TestCookieJar {
  private readonly cookies = new Map<string, string>();

  absorb(headers: Record<string, string | string[] | undefined>): void {
    const rawSetCookie = headers["set-cookie"];
    const setCookies = Array.isArray(rawSetCookie)
      ? rawSetCookie
      : rawSetCookie
        ? [rawSetCookie]
        : [];

    for (const entry of setCookies) {
      const [pair] = entry.split(";");
      const separatorIndex = pair.indexOf("=");

      if (separatorIndex <= 0) {
        continue;
      }

      const name = pair.slice(0, separatorIndex).trim();
      const value = pair.slice(separatorIndex + 1).trim();
      this.cookies.set(name, value);
    }
  }

  headerValue(): string | undefined {
    if (this.cookies.size === 0) {
      return undefined;
    }

    return [...this.cookies.entries()]
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }
}

export async function invokeJson<TBody = unknown>(
  app: Express,
  options: {
    method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
    path: string;
    body?: object;
    headers?: Record<string, string>;
  },
): Promise<Omit<JsonResponse, "body"> & { body: TBody }> {
  const request = new EventEmitter() as EventEmitter & {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: object;
    connection: { remoteAddress: string; destroy(): void };
    socket: { remoteAddress: string; destroy(): void };
    get(name: string): string | undefined;
    header(name: string): string | undefined;
    ip?: string;
    protocol?: string;
  };
  request.method = options.method;
  request.url = options.path;
  request.headers = {
    accept: "application/json",
    ...(options.body ? { "content-type": "application/json" } : {}),
    ...(options.headers ?? {}),
  };
  request.body = options.body;
  request.connection = { remoteAddress: "127.0.0.1", destroy() {} };
  request.socket = {
    remoteAddress: "127.0.0.1",
    destroy() {},
  };
  request.ip = "127.0.0.1";
  request.protocol = "http";
  request.get = (name: string) => request.headers[name.toLowerCase()];
  request.header = request.get;

  const chunks: Buffer[] = [];
  const headers = new Map<string, string | string[]>();
  const response = new EventEmitter() as EventEmitter & {
    statusCode: number;
    locals: Record<string, unknown>;
    writableEnded: boolean;
    req?: typeof request;
    setHeader(name: string, value: string | string[]): void;
    getHeader(name: string): string | string[] | undefined;
    removeHeader(name: string): void;
    writeHead(statusCode: number, newHeaders?: Record<string, string | string[]>): typeof response;
    status(code: number): typeof response;
    write(chunk: unknown): boolean;
    json(payload: unknown): void;
    send(payload: unknown): void;
    end(chunk?: unknown): typeof response;
  };
  response.statusCode = 200;
  response.locals = {};
  response.writableEnded = false;
  response.req = request;
  response.setHeader = (name, value) => {
    headers.set(name.toLowerCase(), value);
  };
  response.getHeader = (name) => headers.get(name.toLowerCase());
  response.removeHeader = (name) => {
    headers.delete(name.toLowerCase());
  };
  response.writeHead = (statusCode, newHeaders) => {
    response.statusCode = statusCode;
    for (const [name, value] of Object.entries(newHeaders ?? {})) {
      response.setHeader(name, value);
    }
    return response;
  };
  response.status = (code) => {
    response.statusCode = code;
    return response;
  };
  response.write = (chunk) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    return true;
  };
  response.json = (payload) => {
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify(payload));
  };
  response.send = (payload) => {
    if (typeof payload === "object" && payload !== null) {
      response.json(payload);
      return;
    }
    response.end(payload);
  };
  response.end = (chunk) => {
    if (chunk !== undefined) {
      response.write(chunk);
    }
    response.writableEnded = true;
    response.emit("finish");
    return response;
  };

  const result = await new Promise<Omit<JsonResponse, "body"> & { body: TBody }>((resolve, reject) => {
    response.on("finish", () => {
      const rawBody = Buffer.concat(chunks).toString("utf8");
      const contentType = response.getHeader("content-type");
      const shouldParseJson =
        typeof contentType === "string" && contentType.toLowerCase().includes("application/json");
      resolve({
        status: response.statusCode,
        body: ((shouldParseJson ? (rawBody ? JSON.parse(rawBody) : null) : rawBody) as TBody),
        headers: Object.fromEntries(headers),
      });
    });
    response.on("error", reject);

    (app as unknown as { handle: (req: unknown, res: unknown, next: (error?: unknown) => void) => void }).handle(
      request,
      response,
      (error?: unknown) => {
      if (error) {
        reject(error);
        return;
      }

      if (!response.writableEnded) {
        response.end();
      }
      },
    );
  });

  return result;
}

export async function invokeText(
  app: Express,
  options: {
    method: "GET";
    path: string;
    headers?: Record<string, string>;
  },
): Promise<{ status: number; body: string; headers: Record<string, string | string[] | undefined> }> {
  const response = await invokeJson<string | null>(app, options as never);

  return {
    status: response.status,
    body: typeof response.body === "string" ? response.body : "",
    headers: response.headers,
  };
}
