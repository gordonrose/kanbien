import { makeContractPlugin } from "./genericContractPlugin";

export const apiContractPlugin = makeContractPlugin({
  taskType: "DOC:api-contract",
  primarySection: "API Contract",
  requiredFields: [
    "API Contract Class",
    "Route Family",
    "Contract Source / Authority",
    "Methods / Paths",
    "Params / Query / Body",
    "Response / Status / Error Shape",
    "Authn / Authz / Tenant Boundary",
    "Validation / Pagination / Sorting / System Fields",
    "Compatibility Posture",
    "Maintained API Artifacts",
    "Maintained Artifact Inventory",
    "Validation / Review Evidence",
  ],
  sourceFields: ["Contract Source / Authority", "Maintained Artifact Inventory"],
  proofFields: ["Validation / Review Evidence"],
  compatibilityFields: ["Compatibility Posture", "Split / Blocked Follow-Up"],
  splitFields: ["Split Routing", "Split / Blocked Follow-Up"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const methodPath = value("Methods / Paths").toLowerCase();
    const authBoundary = value("Authn / Authz / Tenant Boundary").toLowerCase();
    const validation = value("Validation / Pagination / Sorting / System Fields").toLowerCase();
    const artifacts = `${value("Maintained API Artifacts")} ${value("Maintained Artifact Inventory")}`.toLowerCase();

    if (!/(get|post|put|patch|delete)\s+\/|\/v\d+\//.test(methodPath)) {
      notes.push("API contract must name concrete HTTP methods and paths");
    }

    if (!/(auth|permission|tenant|root|public)/.test(authBoundary)) {
      notes.push("API contract must name authn, authz, tenant, root, or public boundary posture");
    }

    if (!/(validation|pagination|sorting|system|field)/.test(validation)) {
      notes.push("API contract must name validation, pagination, sorting, or system-field posture");
    }

    if (!/(docs\/api-contracts|openapi|postman|not-maintained)/.test(artifacts)) {
      notes.push("API contract must name maintained API artifacts, OpenAPI/Postman posture, or not-maintained rationale");
    }

    return notes;
  },
});
