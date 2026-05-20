import { readFileSync } from "node:fs";
import {
  attachDecisionToPacket,
  decisionEvidencePaths,
  upsertDecision,
  upsertEvidencePacket,
  validateDecisionPacketLinks,
  type DecisionRecord,
  type EvidencePacketRecord,
} from "./lib/decisionEvidenceRegistry";

type Command = "record-decision" | "record-packet" | "attach-decision" | "validate";

function parseSingleArg(argv: string[], flag: string): string | null {
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === flag) {
      return argv[index + 1] ?? null;
    }
    if (value.startsWith(`${flag}=`)) {
      return value.slice(flag.length + 1) || null;
    }
  }
  return null;
}

function parseCommand(argv: string[]): Command {
  const command = argv[0];
  if (
    command === "record-decision" ||
    command === "record-packet" ||
    command === "attach-decision" ||
    command === "validate"
  ) {
    return command;
  }
  throw new Error(
    "Usage: npm run decision-evidence -- <record-decision|record-packet|attach-decision|validate> [--input path] [--root-dir path]",
  );
}

function readInput<T>(argv: string[]): T {
  const inputPath = parseSingleArg(argv, "--input");
  if (!inputPath) {
    throw new Error("Provide --input <json-file>.");
  }
  return JSON.parse(readFileSync(inputPath, "utf8")) as T;
}

function pathsFromArgs(argv: string[]) {
  return decisionEvidencePaths(parseSingleArg(argv, "--root-dir") ?? undefined);
}

function main() {
  const argv = process.argv.slice(2);
  const command = parseCommand(argv);
  const paths = pathsFromArgs(argv);

  if (command === "record-decision") {
    const decision = readInput<DecisionRecord>(argv);
    const registry = upsertDecision(decision, { paths });
    console.log(
      JSON.stringify(
        {
          status: "decision_recorded",
          decisionKey: decision.decisionKey,
          decisionCount: registry.decisions.length,
          path: paths.decisionRegistryPath,
        },
        null,
        2,
      ),
    );
    return;
  }

  if (command === "record-packet") {
    const packet = readInput<EvidencePacketRecord>(argv);
    const registry = upsertEvidencePacket(packet, { paths });
    console.log(
      JSON.stringify(
        {
          status: "evidence_packet_recorded",
          evidencePacketKey: packet.evidencePacketKey,
          evidencePacketCount: registry.evidencePackets.length,
          path: paths.evidencePacketRegistryPath,
        },
        null,
        2,
      ),
    );
    return;
  }

  if (command === "attach-decision") {
    const evidencePacketKey = parseSingleArg(argv, "--packet-key");
    const decisionKey = parseSingleArg(argv, "--decision-key");
    if (!evidencePacketKey || !decisionKey) {
      throw new Error("Provide --packet-key <key> and --decision-key <key>.");
    }
    const registry = attachDecisionToPacket({ evidencePacketKey, decisionKey }, { paths });
    console.log(
      JSON.stringify(
        {
          status: "decision_attached",
          evidencePacketKey,
          decisionKey,
          evidencePacketCount: registry.evidencePackets.length,
          path: paths.evidencePacketRegistryPath,
        },
        null,
        2,
      ),
    );
    return;
  }

  const result = validateDecisionPacketLinks({ paths });
  if (result.missingDecisionLinks.length > 0) {
    console.error(JSON.stringify({ status: "invalid", ...result }, null, 2));
    process.exitCode = 1;
    return;
  }
  console.log(JSON.stringify({ status: "valid", ...result }, null, 2));
}

main();
