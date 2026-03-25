import { createHash, createPublicKey, verify } from "node:crypto";
import {
  InvalidSshPublicKeyError,
  InvalidSshSignatureError,
  UnsupportedSshKeyAlgorithmError,
} from "../contract/errors";

function readString(buffer: Buffer, offset: number): { value: Buffer; nextOffset: number } {
  if (offset + 4 > buffer.length) {
    throw new InvalidSshPublicKeyError();
  }

  const length = buffer.readUInt32BE(offset);
  const start = offset + 4;
  const end = start + length;

  if (end > buffer.length) {
    throw new InvalidSshPublicKeyError();
  }

  return {
    value: buffer.subarray(start, end),
    nextOffset: end,
  };
}

function createEd25519Spki(publicKeyBytes: Buffer): Buffer {
  if (publicKeyBytes.length !== 32) {
    throw new InvalidSshPublicKeyError();
  }

  const prefix = Buffer.from("302a300506032b6570032100", "hex");
  return Buffer.concat([prefix, publicKeyBytes]);
}

export interface ParsedSshPublicKey {
  algorithm: "ssh-ed25519";
  fingerprint: string;
  publicKeyOpenSsh: string;
  publicKeyObject: ReturnType<typeof createPublicKey>;
}

export function parseEd25519PublicKey(publicKeyOpenSsh: string): ParsedSshPublicKey {
  const trimmed = publicKeyOpenSsh.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length < 2) {
    throw new InvalidSshPublicKeyError();
  }

  const [algorithm, keyBody] = parts;

  if (algorithm !== "ssh-ed25519") {
    throw new UnsupportedSshKeyAlgorithmError();
  }

  let decoded: Buffer;

  try {
    decoded = Buffer.from(keyBody, "base64");
  } catch {
    throw new InvalidSshPublicKeyError();
  }

  const typePart = readString(decoded, 0);
  const parsedAlgorithm = typePart.value.toString("utf8");

  if (parsedAlgorithm !== "ssh-ed25519") {
    throw new InvalidSshPublicKeyError();
  }

  const keyPart = readString(decoded, typePart.nextOffset);
  const spki = createEd25519Spki(keyPart.value);
  const fingerprint = `SHA256:${createHash("sha256").update(decoded).digest("base64").replace(/=+$/g, "")}`;

  return {
    algorithm: "ssh-ed25519",
    fingerprint,
    publicKeyOpenSsh: trimmed,
    publicKeyObject: createPublicKey({
      key: spki,
      format: "der",
      type: "spki",
    }),
  };
}

export function verifyEd25519Signature(
  challengeText: string,
  base64Signature: string,
  publicKey: ParsedSshPublicKey,
): void {
  let signature: Buffer;

  try {
    signature = Buffer.from(base64Signature, "base64");
  } catch {
    throw new InvalidSshSignatureError();
  }

  const accepted = verify(
    null,
    Buffer.from(challengeText, "utf8"),
    publicKey.publicKeyObject,
    signature,
  );

  if (!accepted) {
    throw new InvalidSshSignatureError();
  }
}
