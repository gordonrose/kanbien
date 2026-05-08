import type { ArtifactObligation, ArtifactObligationResult, Layer5TaskContext } from "./contract";

type ObligationRule = {
  obligation: string;
  trigger: (file: string) => boolean;
  requiredArtifacts: Array<{
    label: string;
    matches: (file: string) => boolean;
  }>;
  commandTokens?: string[];
  routeTokens: string[];
  reason: string;
};

const rules: ObligationRule[] = [
  {
    obligation: "feature dependency graph regeneration",
    trigger: (file) => /^src\/features\/[^/]+\/feature\.manifest\.json$/.test(file),
    requiredArtifacts: [
      {
        label: "feature dependency graph JSON",
        matches: (file) => file === "docs/architecture/generated/feature-dependency-graph.json",
      },
      {
        label: "feature dependency graph markdown",
        matches: (file) => file === "docs/architecture/generated/feature-dependency-graph.md",
      },
    ],
    commandTokens: ["check:feature-dependencies", "generate:feature-dependencies", "checkFeatureDependencies"],
    routeTokens: ["gov:architecture-update", "doc:docs-artifact"],
    reason: "feature manifest edits require maintained dependency graph artifacts",
  },
  {
    obligation: "api contract artifact",
    trigger: (file) => /^(src\/routes\/|src\/features\/[^/]+\/(transport|contract)\/)/.test(file),
    requiredArtifacts: [
      {
        label: "API contract doc",
        matches: (file) => /^docs\/api-contracts\//.test(file),
      },
    ],
    routeTokens: ["doc:api-contract"],
    reason: "route, transport, or contract edits can change API truth",
  },
  {
    obligation: "OpenAPI artifact",
    trigger: (file) => /^(src\/routes\/|src\/features\/[^/]+\/(transport|contract)\/)/.test(file),
    requiredArtifacts: [
      {
        label: "OpenAPI spec",
        matches: (file) => file === "docs/swagger/openapi.yaml",
      },
    ],
    routeTokens: ["doc:api-contract"],
    reason: "route, transport, or contract edits can change maintained OpenAPI truth",
  },
  {
    obligation: "Postman artifact",
    trigger: (file) => /^(src\/routes\/|src\/features\/[^/]+\/(transport|contract)\/)/.test(file),
    requiredArtifacts: [
      {
        label: "Postman collection",
        matches: (file) => /^docs\/postman\/collections\/.+\.postman_collection\.json$/.test(file),
      },
    ],
    routeTokens: ["doc:api-contract"],
    reason: "route, transport, or contract edits can change maintained Postman truth",
  },
  {
    obligation: "permission mapping artifact",
    trigger: (file) => /^(src\/routes\/|src\/features\/[^/]+\/(transport|contract|domain)\/)/.test(file),
    requiredArtifacts: [
      {
        label: "permission mapping doc",
        matches: (file) => /^docs\/architecture\/permission-mappings\//.test(file) || /^docs\/workspace\/permission-mappings\//.test(file),
      },
    ],
    routeTokens: ["doc:permission-mapping"],
    reason: "route, contract, transport, or domain edits can change authorization mapping truth",
  },
  {
    obligation: "data dictionary artifact",
    trigger: (file) => /^(migrations\/|src\/features\/[^/]+\/persistence\/)/.test(file),
    requiredArtifacts: [
      {
        label: "data dictionary doc",
        matches: (file) => /^docs\/data-dictionary\//.test(file),
      },
    ],
    commandTokens: ["db:migrate", "migration", "postgres", "persistence", "read/write", "read / write", "npx vitest"],
    routeTokens: ["doc:data-dictionary"],
    reason: "migration or persistence edits can change durable data truth",
  },
  {
    obligation: "qa evidence artifact",
    trigger: (file) => /^(src\/frontend\/|tests\/visual\/|tests\/e2e\/)/.test(file),
    requiredArtifacts: [
      {
        label: "QA evidence doc or test result",
        matches: (file) => /^(docs\/workspace\/.*evidence|docs\/workspace\/qa\/|docs\/workspace\/test-run-summaries\/|test-results\/)/.test(file),
      },
    ],
    commandTokens: ["npx playwright", "playwright", "screenshot", "runtime payload", "mock honesty", "visual", "test-results"],
    routeTokens: ["evidence:qa-evidence"],
    reason: "frontend or browser-facing edits require runtime or visual evidence",
  },
  {
    obligation: "layer5 harness documentation and tests",
    trigger: (file) => /^src\/scripts\/layer5\//.test(file),
    requiredArtifacts: [
      {
        label: "Layer 5 unit tests",
        matches: (file) => /^tests\/unit\/layer5\//.test(file),
      },
      {
        label: "Layer 5 runner docs",
        matches: (file) => /^docs\/workspace\/layer5-task-runs\//.test(file),
      },
    ],
    routeTokens: ["doc:docs-artifact", "test:test-only", "test:test-suite-alignment"],
    reason: "Layer 5 harness edits require focused tests and maintained runner docs",
  },
];

export function checkArtifactObligations(context: Layer5TaskContext, changedFiles: string[]): ArtifactObligationResult {
  return analyzeArtifactObligations(context, changedFiles);
}

export function analyzeArtifactObligations(
  context: Pick<Layer5TaskContext, "routeAwayRows" | "contractRows" | "proofRows">,
  changedFiles: string[],
): ArtifactObligationResult {
  const files = [...new Set(changedFiles)].sort();
  if (files.length === 0) {
    return {
      status: "pass",
      reason: "no changed files detected",
      changedFiles: files,
      obligations: [],
    };
  }

  const routingText = [
    ...context.routeAwayRows.flat(),
    ...context.contractRows.flatMap((row) => Object.values(row.values)),
  ].join(" ").toLowerCase();
  const commandText = [
    ...context.proofRows.map((row) => row.commands),
    ...context.contractRows.flatMap((row) => Object.values(row.values)),
  ].join(" ").toLowerCase();

  const obligations = rules
    .map((rule) => makeObligation(rule, files, routingText, commandText))
    .filter((obligation): obligation is ArtifactObligation => obligation !== undefined);

  const blocked = obligations.filter((obligation) => obligation.status === "blocked");
  return {
    status: blocked.length > 0 ? "blocked" : "pass",
    reason: obligations.length === 0
      ? "no artifact obligations detected for changed file families"
      : blocked.length > 0
        ? `artifact obligations are missing or unrouted: ${blocked.map((obligation) => obligation.obligation).join(", ")}`
        : "artifact obligations are satisfied or explicitly routed",
    changedFiles: files,
    obligations,
  };
}

function makeObligation(
  rule: ObligationRule,
  changedFiles: string[],
  routingText: string,
  commandText: string,
): ArtifactObligation | undefined {
  const triggeredBy = changedFiles.filter(rule.trigger);
  if (triggeredBy.length === 0) {
    return undefined;
  }

  const missingArtifacts = rule.requiredArtifacts.filter((artifact) => !changedFiles.some(artifact.matches));
  const artifactEvidence = rule.requiredArtifacts
    .flatMap((artifact) => changedFiles.filter(artifact.matches))
    .sort();
  const commandEvidence = commandEvidenceFor(rule, commandText);
  const missingCommand = (rule.commandTokens ?? []).length > 0 && commandEvidence.length === 0;

  if (missingArtifacts.length === 0 && !missingCommand) {
    return {
      obligation: rule.obligation,
      status: "pass",
      reason: `${rule.reason}; satisfied by changed artifact evidence`,
      evidence: [...artifactEvidence, ...commandEvidence],
    };
  }

  const routedBy = rule.routeTokens.filter((token) => routingText.includes(token));
  if (routedBy.length > 0) {
    return {
      obligation: rule.obligation,
      status: "routed",
      reason: `${rule.reason}; routed to ${routedBy.join(", ")}`,
      evidence: routedBy,
    };
  }

  return {
    obligation: rule.obligation,
    status: "blocked",
    reason: [
      rule.reason,
      missingArtifacts.length > 0 ? `missing artifacts: ${missingArtifacts.map((artifact) => artifact.label).join(", ")}` : "",
      missingCommand ? `missing command evidence: ${(rule.commandTokens ?? []).join(" or ")}` : "",
    ].filter(Boolean).join("; "),
    evidence: triggeredBy,
  };
}

function commandEvidenceFor(rule: ObligationRule, commandText: string): string[] {
  return (rule.commandTokens ?? []).filter((token) => commandText.includes(token.toLowerCase()));
}
