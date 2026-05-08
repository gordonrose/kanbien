import { makeContractPlugin } from "./genericContractPlugin";

export const docsArtifactPlugin = makeContractPlugin({
  taskType: "DOC:docs-artifact",
  primarySection: "Docs Artifact Contract",
  requiredFields: [
    "Artifact Family",
    "Docs Artifact Class",
    "Scriptable Source Inventory",
    "Source Truth Reviewed",
    "Docs Target",
    "Status Posture",
    "Stale Artifact Sweep",
    "Specialized Routing / Split Decisions",
    "Diff / Check Command",
    "Human Review Boundary",
    "Validation / Review Evidence",
  ],
  sourceFields: ["Scriptable Source Inventory", "Source Truth Reviewed", "Docs Target"],
  proofFields: ["Diff / Check Command", "Validation / Review Evidence"],
  splitFields: ["Specialized Routing / Split Decisions"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const target = value("Docs Target").replace(/\\/g, "/").toLowerCase();
    const command = value("Diff / Check Command").toLowerCase();
    const routing = value("Specialized Routing / Split Decisions").toLowerCase();

    if (!target.includes("docs/") && !target.includes("readme")) {
      notes.push("Docs artifact target must be under docs/ or be a README/index artifact");
    }

    if (!/(npm run|npx |git diff|rg |manual-review|manual review)/.test(command)) {
      notes.push("Docs artifact diff/check command must name an executable command or manual-review rationale");
    }

    if (!/(not-applicable|doc:|dev:|gov:|test:|evidence:)/.test(routing)) {
      notes.push("Docs artifact specialized routing must name not-applicable or a routed task type");
    }

    return notes;
  },
});
