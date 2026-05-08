import { makeContractPlugin } from "./genericContractPlugin";

export const testOnlyPlugin = makeContractPlugin({
  taskType: "TEST:test-only",
  primarySection: "Test-Only Coverage Contract",
  additionalSections: ["Capability Permission / State Matrix"],
  requiredFields: [
    "Test Change Class",
    "Coverage Source",
    "Traceability IDs",
    "Test Layer",
    "Proof Target",
    "Fixture / Data Source",
    "Mock / Runtime Honesty",
    "Production Behavior Change Posture",
    "Focused Command",
    "Split / Blocked Follow-Up",
  ],
  sourceFields: ["Coverage Source", "Fixture / Data Source"],
  proofFields: ["Traceability IDs", "Proof Target", "Focused Command", "Mock / Runtime Honesty"],
  splitFields: ["Split / Blocked Follow-Up", "Missing Coverage / Follow-Up Task"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const traceability = value("Traceability IDs").toLowerCase();
    const layer = value("Test Layer").toLowerCase();
    const behavior = value("Production Behavior Change Posture").toLowerCase();
    const command = value("Focused Command").toLowerCase();

    if (!/(tc-|ac-)/.test(traceability)) {
      notes.push("Test-only task must name TC-* or AC-* traceability");
    }

    if (!/(unit|integration|security|audit|e2e|visual|persistence|contract|tests\/)/.test(layer)) {
      notes.push("Test-only task must name a concrete test layer");
    }

    if (!/(no production behavior change|test-harness-only|no behavior change)/.test(behavior)) {
      notes.push("Test-only task must declare no production behavior change or test-harness-only posture");
    }

    if (!/(npx vitest run|npx playwright test|npm run)/.test(command)) {
      notes.push("Test-only focused command must name an executable test command");
    }

    return notes;
  },
});
