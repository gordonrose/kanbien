import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createLocalStorageAdapter } from "../../../src/lib/storage/localStorageAdapter";

describe("local object storage adapter", () => {
  it("TC-ASSETS-EDGE-010 preserves object metadata and prevents path traversal", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "kanbien-assets-"));
    const adapter = createLocalStorageAdapter(root);

    const uploadTarget = await adapter.createUploadTarget({
      storageKey: "tenant/example/logo.png",
      contentType: "image/png",
      byteSize: 4,
      expiresAt: new Date(Date.now() + 60_000),
    });
    await writeFile(path.join(root, uploadTarget.storageKey), "logo");

    await expect(adapter.headObject("tenant/example/logo.png")).resolves.toMatchObject({
      storageKey: "tenant/example/logo.png",
      byteSize: 4,
      contentType: "image/png",
    });
    await expect(adapter.createUploadTarget({
      storageKey: "../escape.png",
      contentType: "image/png",
      byteSize: 4,
      expiresAt: new Date(),
    })).rejects.toThrow(/outside/);
  });
});
