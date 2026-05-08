import { makeContractPlugin } from "./genericContractPlugin";

export const backendPlugin = makeContractPlugin({
  taskType: "DEV:backend",
  primarySection: "Backend Implementation Approach",
  requiredFields: [
    "Backend Change Class",
    "Approved Source Authority",
    "Feature Owner",
    "Backend Source Inventory",
    "Exact Write Envelope",
    "Layer Responsibilities",
    "Authz / Tenant / Lifecycle Posture",
    "Artifact Obligations",
    "Proof Commands",
    "Human Review Boundary",
  ],
  sourceFields: ["Approved Source Authority", "Backend Source Inventory"],
  proofFields: ["Proof Commands"],
  compatibilityFields: ["Contract / API Posture", "Public Seam / Manifest Impact", "Split / Blocked Follow-Up"],
  splitFields: ["Split / Blocked Follow-Up"],
  writeEnvelopeField: "Exact Write Envelope",
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const owner = value("Feature Owner").toLowerCase();
    const authz = value("Authz / Tenant / Lifecycle Posture").toLowerCase();
    const proof = value("Proof Commands").toLowerCase();

    if (!owner || owner === "not-applicable") {
      notes.push("Backend task must name a feature owner");
    }

    if (!/(auth|tenant|lifecycle|not-applicable|root|permission)/.test(authz)) {
      notes.push("Backend task must name authz, tenant, lifecycle, root, permission, or not-applicable posture");
    }

    if (!/(npm run|npx vitest|npx playwright|proof|test)/.test(proof)) {
      notes.push("Backend task proof commands must name focused executable proof");
    }

    return notes;
  },
});
