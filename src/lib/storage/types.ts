export interface ObjectStorageUploadTarget {
  mode: "local-filesystem";
  storageKey: string;
  expiresAt: string;
}

export interface ObjectStorageMetadata {
  storageKey: string;
  byteSize: number;
  contentType: string | null;
  checksumSha256: string | null;
}

export interface ObjectStorageReadResult {
  stream: NodeJS.ReadableStream;
  metadata: ObjectStorageMetadata;
}

export interface ObjectStorageAdapter {
  provider: string;
  createUploadTarget(input: {
    storageKey: string;
    contentType: string;
    byteSize: number;
    expiresAt: Date;
    checksumSha256?: string | null;
  }): Promise<ObjectStorageUploadTarget>;
  writeObject(input: {
    storageKey: string;
    content: Buffer;
    contentType: string;
    checksumSha256?: string | null;
  }): Promise<ObjectStorageMetadata>;
  headObject(storageKey: string): Promise<ObjectStorageMetadata | null>;
  readObject(storageKey: string): Promise<ObjectStorageReadResult>;
  readObjectBytes(storageKey: string, maxBytes: number): Promise<Buffer>;
  deleteObject(storageKey: string): Promise<"deleted" | "missing">;
}
