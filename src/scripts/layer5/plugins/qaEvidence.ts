import { makeContractPlugin } from "./genericContractPlugin";

export const qaEvidencePlugin = makeContractPlugin({
  taskType: "EVIDENCE:qa-evidence",
  primarySection: "QA Evidence Instrument Summary",
  requiredFields: [
    "QA Evidence Class",
    "Evidence Source Inventory",
    "Selected Evidence Instruments",
    "Live Runtime / Payload Evidence",
    "Expected Evidence Output",
    "Evidence Status / Remaining Gap",
    "Human Review Boundary",
  ],
  sourceFields: ["Evidence Source Inventory", "Live Runtime / Payload Evidence"],
  proofFields: ["Selected Evidence Instruments", "Expected Evidence Output"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const source = value("Evidence Source Inventory").toLowerCase();
    const runtime = value("Live Runtime / Payload Evidence").toLowerCase();
    const output = value("Expected Evidence Output").toLowerCase();

    if (!/(docs\/|src\/|tests\/|test-results|exact runtime target|api|payload)/.test(source)) {
      notes.push("QA evidence must name scriptable evidence source inventory or exact runtime target");
    }

    if (runtime.startsWith("blocked") || runtime === "not-applicable") {
      notes.push("QA evidence must not be queued without live/runtime payload evidence or explicit captured evidence");
    }

    if (!/(docs\/workspace\/qa-evidence|test-results|evidence|artifact|output)/.test(output)) {
      notes.push("QA evidence expected output must name evidence artifact or test-results output");
    }

    return notes;
  },
});
