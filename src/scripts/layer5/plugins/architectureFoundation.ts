import { makeContractPlugin } from "./genericContractPlugin";

export const architectureFoundationPlugin = makeContractPlugin({
  taskType: "DECISION:architecture-foundation",
  primarySection: "Architecture Foundation Contract",
  requiredFields: [
    "Concern Area",
    "Architecture Trigger",
    "Architecture Question",
    "Decision Analysis Status",
    "Decision Provenance Source",
    "Missing Analysis Fields",
    "Sources To Review",
    "Decision Source Inventory",
    "Output Artifact Target",
    "Decision Analysis Checklist",
    "Decision Owner",
    "Downstream Tasks Blocked",
    "Compatibility Posture",
    "Final Authority Route",
    "Human Review Boundary",
    "Forbidden Implementation / Guess",
  ],
  sourceFields: ["Sources To Review", "Decision Source Inventory"],
  proofFields: ["Decision Analysis Checklist", "Output Artifact Target"],
  compatibilityFields: ["Compatibility Posture"],
  splitFields: ["Downstream Tasks Blocked", "Final Authority Route"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const sources = `${value("Sources To Review")} ${value("Decision Source Inventory")}`.toLowerCase();
    const checklist = value("Decision Analysis Checklist").toLowerCase();
    const target = value("Output Artifact Target").toLowerCase();
    const compatibility = value("Compatibility Posture").toLowerCase();

    if (!/(adr|architecture|technical steering|docs\/architecture)/.test(sources)) {
      notes.push("Architecture foundation must review ADRs, architecture docs, or Technical Steering");
    }

    if (!/(option|trade|risk|cost|compat|operab|test|recommend|signoff|missing)/.test(checklist)) {
      notes.push("Architecture foundation must include decision-analysis checklist terms");
    }

    if (!/(docs\/architecture|technical-steering|technical steering|adr)/.test(target)) {
      notes.push("Architecture foundation output must target architecture or Technical Steering artifacts");
    }

    if (!/(compat|migration|not-applicable)/.test(compatibility)) {
      notes.push("Architecture foundation must name compatibility, migration, or not-applicable posture");
    }

    return notes;
  },
});
