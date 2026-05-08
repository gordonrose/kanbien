import { makeContractPlugin } from "./genericContractPlugin";

export const standardsCompliancePlugin = makeContractPlugin({
  taskType: "DOC:standards-compliance",
  primarySection: "Standards Compliance Contract",
  requiredFields: [
    "Compliance Target Type",
    "Standard / Gate",
    "Source Standard Path / Reference",
    "Scope Under Review",
    "Control / Evidence Inventory",
    "Review Method / Command",
    "Compliance Posture",
    "Evidence Artifact Target",
    "Coverage Summary Command",
    "Findings Summary",
    "Follow-Up Routing",
    "Human Review Boundary",
    "Waiver / Blocker Posture",
  ],
  sourceFields: ["Source Standard Path / Reference", "Control / Evidence Inventory", "Scope Under Review"],
  proofFields: ["Review Method / Command", "Coverage Summary Command", "Evidence Artifact Target"],
  compatibilityFields: ["Compliance Posture", "Waiver / Blocker Posture"],
  splitFields: ["Follow-Up Routing"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const source = value("Source Standard Path / Reference").replace(/\\/g, "/").toLowerCase();
    const evidenceTarget = value("Evidence Artifact Target").replace(/\\/g, "/").toLowerCase();
    const review = value("Review Method / Command").toLowerCase();

    if (!/(docs\/standards|agents\.md|https?:\/\/|external:)/.test(source)) {
      notes.push("Standards compliance must name a repo standard, AGENTS.md, or external source reference");
    }

    if (!/(docs\/standards|docs\/workspace|docs\/prd|docs\/architecture)/.test(evidenceTarget)) {
      notes.push("Standards compliance evidence target must be a compliance evidence artifact");
    }

    if (!/(npm run|npx |rg |git diff|manual standards review|manual-review)/.test(review)) {
      notes.push("Standards compliance review method must name command evidence or manual standards review");
    }

    return notes;
  },
});
