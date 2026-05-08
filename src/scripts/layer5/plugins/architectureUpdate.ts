import { makeContractPlugin } from "./genericContractPlugin";

export const architectureUpdatePlugin = makeContractPlugin({
  taskType: "GOV:architecture-update",
  primarySection: "Architecture Update Contract",
  requiredFields: [
    "Architecture Update Class",
    "Approved Decision Source",
    "Decision Source Path / Reference",
    "Decision Summary",
    "Architecture Artifact Target",
    "Consistency Sweep Targets",
    "Authority / Consistency Inventory",
    "Downstream Impact",
    "Compatibility Posture",
    "Forbidden Implementation / Standards Work",
    "Human Review Boundary",
    "Validation / Review Evidence",
  ],
  sourceFields: ["Approved Decision Source", "Decision Source Path / Reference", "Authority / Consistency Inventory"],
  proofFields: ["Validation / Review Evidence"],
  compatibilityFields: ["Compatibility Posture", "Downstream Impact"],
  splitFields: ["Downstream Impact"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const source = `${value("Approved Decision Source")} ${value("Decision Source Path / Reference")}`.toLowerCase();
    const target = value("Architecture Artifact Target").replace(/\\/g, "/").toLowerCase();
    const forbidden = value("Forbidden Implementation / Standards Work").toLowerCase();

    if (!/(technical|adr|architecture|approval|docs\/architecture)/.test(source)) {
      notes.push("Architecture update must name an approved architecture decision source");
    }

    if (!/(docs\/architecture|docs\/workspace\/technical-steering|docs\/templates)/.test(target)) {
      notes.push("Architecture update target must be architecture-owned");
    }

    if (!forbidden.includes("implementation") || !forbidden.includes("standards")) {
      notes.push("Architecture update must forbid implementation and standards work");
    }

    return notes;
  },
});
