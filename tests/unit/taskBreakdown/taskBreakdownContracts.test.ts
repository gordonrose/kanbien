import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  layer4GuardrailReferenceByTaskType,
  layer4RequiredCheckIdsByTaskType,
  layer4SharedCodePlacementCheckIds,
  layer4TaskTypes,
} from "../../../src/scripts/featureCompiler/contracts";

const referenceDir = path.resolve(
  process.cwd(),
  ".codex/skills/20-planning-artifacts/task-breakdown-maintainer/references",
);

const requiredCheckIdPattern = /^- `([^`]+)`$/gm;

function requiredCheckIdsFromReference(referencePath: string): string[] {
  const content = readFileSync(referencePath, "utf8");
  const sectionStart = content.indexOf("## Required Check IDs");
  const section = sectionStart === -1 ? "" : content.slice(sectionStart);

  return [...section.matchAll(requiredCheckIdPattern)].map((match) => match[1]);
}

describe("task breakdown compiler contracts", () => {
  it("maps every Layer 4 task type to an existing guardrail reference", () => {
    for (const taskType of layer4TaskTypes) {
      const referenceName = layer4GuardrailReferenceByTaskType[taskType];

      expect(referenceName, `${taskType} missing guardrail reference`).toBeTruthy();
      expect(existsSync(path.join(referenceDir, referenceName)), `${taskType} reference file missing`).toBe(true);
    }
  });

  it("keeps task-type reference check IDs aligned with the compiler registry", () => {
    for (const taskType of layer4TaskTypes) {
      const referenceName = layer4GuardrailReferenceByTaskType[taskType];
      const referencePath = path.join(referenceDir, referenceName);
      const referenceCheckIds = requiredCheckIdsFromReference(referencePath);
      const registeredCheckIds = [...layer4RequiredCheckIdsByTaskType[taskType]];

      expect(referenceCheckIds, `${referenceName} check IDs`).toEqual(registeredCheckIds);
    }
  });

  it("keeps the shared-code placement supplemental reference aligned with the compiler registry", () => {
    const referencePath = path.join(referenceDir, "shared-code-placement-task-guardrail.md");

    expect(requiredCheckIdsFromReference(referencePath)).toEqual([...layer4SharedCodePlacementCheckIds]);
  });

  it("does not leave unregistered task guardrail references in the task breakdown reference folder", () => {
    const registeredReferences: Set<string> = new Set(Object.values(layer4GuardrailReferenceByTaskType));
    registeredReferences.add("shared-code-placement-task-guardrail.md");

    const referenceFiles = readdirSync(referenceDir)
      .filter((fileName) => fileName.endsWith("task-guardrail.md"))
      .sort();

    expect(referenceFiles).toEqual([...registeredReferences].sort());
  });
});
