import { createHash } from "node:crypto";
import {
  BlobReader,
  BlobWriter,
  TextReader,
  TextWriter,
  Uint8ArrayReader,
  ZipReader,
  ZipWriter,
} from "@zip.js/zip.js";

export interface ExportZipEntry {
  path: string;
  content: Buffer | string;
}

export interface PasswordProtectedZipBundle {
  content: Buffer;
  contentType: "application/zip";
  checksumSha256: string;
  byteSize: number;
}

function assertSafeZipPath(entryPath: string): void {
  if (
    entryPath.trim() === "" ||
    entryPath.startsWith("/") ||
    entryPath.includes("\\") ||
    entryPath.split("/").some((part) => part === "" || part === "." || part === "..")
  ) {
    throw new Error(`Unsafe export ZIP entry path: ${entryPath}`);
  }
}

function entryReader(content: Buffer | string): TextReader | Uint8ArrayReader {
  if (typeof content === "string") {
    return new TextReader(content);
  }
  return new Uint8ArrayReader(new Uint8Array(content));
}

export async function createPasswordProtectedZipBundle(input: {
  entries: ExportZipEntry[];
  password: string;
}): Promise<PasswordProtectedZipBundle> {
  if (input.entries.length === 0) {
    throw new Error("Export ZIP must contain at least one entry.");
  }
  if (input.password.trim().length < 8) {
    throw new Error("Export ZIP password must be at least 8 characters.");
  }

  const writer = new BlobWriter("application/zip");
  const zipWriter = new ZipWriter(writer);
  for (const entry of input.entries) {
    assertSafeZipPath(entry.path);
    await zipWriter.add(entry.path, entryReader(entry.content), {
      password: input.password,
      encryptionStrength: 3,
    });
  }
  const blob = await zipWriter.close();
  const content = Buffer.from(await blob.arrayBuffer());
  return {
    content,
    contentType: "application/zip",
    byteSize: content.byteLength,
    checksumSha256: createHash("sha256").update(content).digest("hex"),
  };
}

export async function readPasswordProtectedZipTextEntry(input: {
  content: Buffer;
  password: string;
  path: string;
}): Promise<string> {
  const reader = new ZipReader(new BlobReader(new Blob([input.content])));
  try {
    const entries = await reader.getEntries();
    const entry = entries.find((candidate) => candidate.filename === input.path);
    if (!entry || !("getData" in entry)) {
      throw new Error(`Export ZIP entry not found: ${input.path}`);
    }
    return entry.getData(new TextWriter(), { password: input.password });
  } finally {
    await reader.close();
  }
}
