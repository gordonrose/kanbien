import { makeContractPlugin } from "./genericContractPlugin";

export const dataDictionaryPlugin = makeContractPlugin({
  taskType: "DOC:data-dictionary",
  primarySection: "Data Dictionary Contract",
  requiredFields: [
    "Entity / Table / Fact Group",
    "Dictionary Artifact Target",
    "Source Truth Reviewed",
    "Field / Index / Lifecycle Truth",
    "Durable Fact / Retention Truth",
    "Classification / Compliance Posture",
    "Enforcement Evidence",
    "Test / Evidence Trace",
    "Validation / Review Evidence",
  ],
  sourceFields: ["Source Truth Reviewed", "Enforcement Trace"],
  proofFields: ["Enforcement Evidence", "Test / Evidence Trace", "Validation / Review Evidence"],
  compatibilityFields: ["Compatibility Posture", "Split / Blocked Follow-Up"],
  splitFields: ["Split / Blocked Follow-Up"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const target = value("Dictionary Artifact Target").replace(/\\/g, "/").toLowerCase();
    const durable = value("Durable Fact / Retention Truth").toLowerCase();
    const validation = value("Validation / Review Evidence").toLowerCase();

    if (!target.includes("docs/data-dictionary/")) {
      notes.push("Data dictionary target must be under docs/data-dictionary/");
    }

    if (!/(durable|retention|not-applicable|lifecycle|delete|export|legal)/.test(durable)) {
      notes.push("Data dictionary durable fact truth must name durability, retention, lifecycle, or not-applicable posture");
    }

    if (!/(data:compliance-health|validation|review|evidence|npm run)/.test(validation)) {
      notes.push("Data dictionary validation evidence must name compliance-health, validation, review, or command evidence");
    }

    return notes;
  },
});
