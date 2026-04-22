import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("design-system architectural-first harness audit", () => {
  it("requires an explicit architectural-first fix gate for governed design-system repairs", () => {
    const source = readDoc("docs/workspace/design-system/verification/architectural-first-fix-gate.md");

    expect(source).toContain("## Required Architectural-First Decision");
    expect(source).toContain("shared-contract fix required");
    expect(source).toContain("shared-contract fix not possible because ...");
    expect(source).toContain("family-local exception approved because ...");
    expect(source).toContain("## Required Questions");
  });

  it("wires the canonical-rendering completion checklist to the architectural-first gate", () => {
    const source = readDoc("docs/workspace/design-system/verification/canonical-rendering-completion-checklist.md");

    expect(source).toContain("architectural-first-fix-gate.md");
    expect(source).toContain("## Architectural-First Triage");
    expect(source).toContain("does another governed family already solve this correctly?");
    expect(source).toContain("what shared audit will fail if this regresses again?");
  });

  it("requires the design-system loop harness to block spot fixes before architectural triage", () => {
    const source = readDoc("docs/architecture/guides/design-system-loop-harness.md");

    expect(source).toContain("Architectural-first repair is the blocker");
    expect(source).toContain("## Architectural-First Repair Rule");
    expect(source).toContain("1. shared architecture");
    expect(source).toContain("4. family-local exception");
    expect(source).toContain("If the same issue class could recur in another family");
  });

  it("requires issue reconciliations to record the architectural-first decision", () => {
    const readmeSource = readDoc("docs/workspace/issue-reconciliations/README.md");
    const templateSource = readDoc("docs/templates/issue-reconciliation-template.md");

    expect(readmeSource).toContain("architectural-first decision");
    expect(templateSource).toContain("## Architectural-First Decision");
    expect(templateSource).toContain("shared-contract fix required");
    expect(templateSource).toContain("family-local exception approved because ...");
    expect(templateSource).toContain("local symptom patched only");
  });
});
