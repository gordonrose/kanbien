import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  runCurrentTaskAuditCheck,
  validateCurrentTaskAudit,
} from "../../../src/scripts/checkCurrentTaskAudit";

const repoRoot = process.cwd();

function readRepoFile(path: string) {
  return readFileSync(resolve(repoRoot, path), "utf8");
}

describe("harness ADR routing", () => {
  it("keeps material harness-governance changes routed through ADR-0051", () => {
    const requiredSnippets = [
      {
        file: ".codex/skills/00-orchestration/change-loop-orchestrator/SKILL.md",
        snippets: [
          "material harness-governance decisions",
          "ADR-0051 makes material harness-governance changes ADR-trackable",
          "0051-log-harness-governance-decisions-as-adrs.md",
        ],
      },
      {
        file: ".codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/architecture-update-task-guardrail.md",
        snippets: [
          "harness-governance-adr",
          "ADR-0051-governed harness decision records",
          "operative skill, gate, audit, standard, or rendered-proof artifact",
        ],
      },
      {
        file: ".codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/task-type-contract-manifest.md",
        snippets: [
          "architecture or harness-governance update class",
          "ADR-0051-governed harness decision records",
          "harness-governance ADRs",
        ],
      },
      {
        file: ".codex/skills/10-repo-governance/codex-trust-override/SKILL.md",
        snippets: [
          "For material harness-governance changes, check ADR-0051",
          "0051-log-harness-governance-decisions-as-adrs.md",
          "why the change is too local to require one",
        ],
      },
      {
        file: "docs/architecture/adr/0051-log-harness-governance-decisions-as-adrs.md",
        snippets: [
          "Record material harness-governance decisions as ADRs",
          "which harness gate, skill, audit, or rendered proof is authoritative",
          "The operative trust override remains",
        ],
      },
      {
        file: "package.json",
        snippets: ["check:repo-governance-harness", "tests/audit/repoGovernance/harnessAdrRouting.test.ts"],
      },
    ];

    const violations = requiredSnippets.flatMap(({ file, snippets }) => {
      const source = readRepoFile(file);
      return snippets.filter((snippet) => !source.includes(snippet)).map((snippet) => `${file} is missing ${snippet}`);
    });

    expect(violations).toEqual([]);
  });
});

describe("current task audit harness", () => {
  function readFixture(name: string) {
    return readRepoFile(`tests/fixtures/repoGovernance/currentTaskAudit/${name}.md`);
  }

  it("accepts a current task audit with the required preflight and closure fields", () => {
    const result = validateCurrentTaskAudit({
      content: readFixture("valid"),
      changedPaths: [
        "docs/workspace/trust-harness/README.md",
        "tests/audit/repoGovernance/harnessAdrRouting.test.ts",
      ],
    });

    expect(result.violations).toEqual([]);
  });

  it("fails loudly when material changes exist without a current task audit", () => {
    const result = validateCurrentTaskAudit({
      content: null,
      changedPaths: ["src/scripts/gitPreflight.ts"],
    });

    expect(result.violations).toContain(
      "docs/workspace/trust-harness/current-task-audit.md is required before material/governed changes are present.",
    );
  });

  it("fails loudly when changed files fall outside the declared edit boundary", () => {
    const result = validateCurrentTaskAudit({
      content: readFixture("outside-boundary"),
      changedPaths: ["src/features/rootUsers/domain/service.ts"],
    });

    expect(result.violations).toContain(
      "Changed material paths are outside the current task audit edit boundary: src/features/rootUsers/domain/service.ts",
    );
    expect(result.violations).toContain(
      "Changed material paths are explicitly out of scope in docs/workspace/trust-harness/current-task-audit.md: src/features/rootUsers/domain/service.ts",
    );
  });

  it("fails loudly when duplicate active audit sections are present even if combined fields look valid", () => {
    const result = validateCurrentTaskAudit({
      content: readFixture("duplicate-sections-combined-valid"),
      changedPaths: ["docs/workspace/trust-harness/README.md"],
    });

    expect(result.violations).toContain(
      "docs/workspace/trust-harness/current-task-audit.md must contain exactly one active ## Preflight Contract section; found 2.",
    );
    expect(result.violations).toContain(
      "docs/workspace/trust-harness/current-task-audit.md must contain exactly one active ## Post-Work Closure Record section; found 2.",
    );
  });

  it("does not allow stale duplicate sections to satisfy required current fields", () => {
    const result = validateCurrentTaskAudit({
      content: readFixture("stale-duplicate-satisfies-required-fields"),
      changedPaths: ["docs/workspace/trust-harness/README.md"],
    });

    expect(result.violations).toContain(
      "docs/workspace/trust-harness/current-task-audit.md must contain exactly one active ## Preflight Contract section; found 2.",
    );
    expect(result.violations).toContain(
      "docs/workspace/trust-harness/current-task-audit.md must contain exactly one active ## Post-Work Closure Record section; found 2.",
    );
    expect(result.violations).toContain(
      "docs/workspace/trust-harness/current-task-audit.md is missing required preflight field: Files allowed to edit",
    );
  });

  it("flags completion language when evidence remains uncollected", () => {
    const result = validateCurrentTaskAudit({
      content: readFixture("completion-without-evidence"),
      changedPaths: ["docs/workspace/trust-harness/README.md"],
    });

    expect(result.violations).toContain(
      "docs/workspace/trust-harness/current-task-audit.md uses completion language without recorded evidence collected.",
    );
  });

  it("keeps the live current task audit consistent with current material changes", () => {
    const result = runCurrentTaskAuditCheck();

    expect(result.violations).toEqual([]);
  });
});
