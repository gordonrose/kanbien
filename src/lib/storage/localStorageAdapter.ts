import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  ObjectStorageAdapter,
  ObjectStorageMetadata,
  ObjectStorageUploadTarget,
} from "./types";

function safeResolve(rootDirectory: string, storageKey: string): string {
  const resolvedRoot = path.resolve(rootDirectory);
  const resolvedPath = path.resolve(resolvedRoot, storageKey);

  if (!resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error("Storage key resolves outside the configured storage root.");
  }

  return resolvedPath;
}

function metadataPath(objectPath: string): string {
  return `${objectPath}.metadata.json`;
}

async function readMetadata(objectPath: string): Promise<{
  contentType: string | null;
  checksumSha256: string | null;
} | null> {
  try {
    const raw = await readFile(metadataPath(objectPath), "utf8");
    const parsed = JSON.parse(raw) as {
      contentType?: unknown;
      checksumSha256?: unknown;
    };
    return {
      contentType: typeof parsed.contentType === "string" ? parsed.contentType : null,
      checksumSha256:
        typeof parsed.checksumSha256 === "string" ? parsed.checksumSha256 : null,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export function createLocalStorageAdapter(rootDirectory: string): ObjectStorageAdapter {
  async function toObjectMetadata(storageKey: string): Promise<ObjectStorageMetadata | null> {
    const objectPath = safeResolve(rootDirectory, storageKey);
    try {
      const [objectStat, metadata] = await Promise.all([
        stat(objectPath),
        readMetadata(objectPath),
      ]);
      const bytes = await readFile(objectPath);
      return {
        storageKey,
        byteSize: objectStat.size,
        contentType: metadata?.contentType ?? null,
        checksumSha256:
          metadata?.checksumSha256 ??
          createHash("sha256").update(bytes).digest("hex"),
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw error;
    }
  }

  return {
    provider: "local-filesystem",
    async createUploadTarget(input): Promise<ObjectStorageUploadTarget> {
      const objectPath = safeResolve(rootDirectory, input.storageKey);
      await mkdir(path.dirname(objectPath), { recursive: true });
      await writeFile(
        metadataPath(objectPath),
        JSON.stringify(
          {
            contentType: input.contentType,
            checksumSha256: input.checksumSha256 ?? null,
            byteSize: input.byteSize,
          },
          null,
          2,
        ),
        "utf8",
      );
      return {
        mode: "local-filesystem",
        storageKey: input.storageKey,
        expiresAt: input.expiresAt.toISOString(),
      };
    },
    headObject: toObjectMetadata,
    async readObject(storageKey) {
      const objectPath = safeResolve(rootDirectory, storageKey);
      const metadata = await toObjectMetadata(storageKey);
      if (!metadata) {
        throw new Error("Object not found.");
      }
      return {
        stream: createReadStream(objectPath),
        metadata,
      };
    },
    async readObjectBytes(storageKey, maxBytes) {
      const objectPath = safeResolve(rootDirectory, storageKey);
      const objectStat = await stat(objectPath);
      if (objectStat.size > maxBytes) {
        throw new Error("Object exceeds read limit.");
      }
      return readFile(objectPath);
    },
    async deleteObject(storageKey) {
      const objectPath = safeResolve(rootDirectory, storageKey);
      try {
        await rm(objectPath);
        await rm(metadataPath(objectPath), { force: true });
        return "deleted";
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          await rm(metadataPath(objectPath), { force: true });
          return "missing";
        }
        throw error;
      }
    },
  };
}
