import { makeContractPlugin } from "./genericContractPlugin";

export const testSuiteAlignmentPlugin = makeContractPlugin({
  taskType: "TEST:test-suite-alignment",
  primarySection: "Test Suite Alignment Contract",
  requiredFields: [
    "Alignment Source / Trigger",
    "Mismatch Class",
    "Documentation Targets",
    "Executable Targets",
    "Allowed Edit Posture",
    "Split Decision For New Proof",
    "Traceability Command",
    "Completion Evidence",
  ],
  sourceFields: ["Alignment Source / Trigger", "Documentation Targets", "Executable Targets"],
  proofFields: ["Traceability Command", "Completion Evidence"],
  splitFields: ["Split Decision For New Proof"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const docs = value("Documentation Targets").toLowerCase();
    const edits = value("Allowed Edit Posture").toLowerCase();
    const command = value("Traceability Command").toLowerCase();
    const evidence = value("Completion Evidence").toLowerCase();

    if (!/(docs\/prd\/test_cases|docs\/workspace|qa|status|documentation)/.test(docs)) {
      notes.push("Test suite alignment must name documentation or QA/status targets");
    }

    if (/(production behavior|required production change|src\/features)/.test(edits)) {
      notes.push("Test suite alignment cannot include production behavior changes");
    }

    if (!/(test:traceability|traceability-equivalent)/.test(command)) {
      notes.push("Test suite alignment must name traceability command evidence");
    }

    if (!/(before|after|delta|alignment|evidence)/.test(evidence)) {
      notes.push("Test suite alignment completion evidence must name before/after or alignment evidence");
    }

    return notes;
  },
});
