import { makeContractPlugin } from "./genericContractPlugin";

export const permissionMappingPlugin = makeContractPlugin({
  taskType: "DOC:permission-mapping",
  primarySection: "Permission Mapping Contract",
  requiredFields: [
    "Permission Mapping Class",
    "Approved Authz Source",
    "Capability / Route / Surface",
    "Authority World / Actor Boundary",
    "Mapping Row Posture",
    "Allow / Deny Expectations",
    "Evidence Mapping Inventory",
    "Human Review Boundary",
  ],
  sourceFields: ["Approved Authz Source", "Evidence Mapping Inventory"],
  proofFields: ["Denial / Audit / Proof Expectation", "Evidence Mapping Inventory"],
  compatibilityFields: ["Migration Impact", "Split / Blocked Follow-Up"],
  splitFields: ["Split / Blocked Follow-Up"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const source = value("Approved Authz Source").toLowerCase();
    const boundary = value("Tenant / Object Boundary").toLowerCase();
    const expectations = value("Allow / Deny Expectations").toLowerCase();

    if (!/(adr|technical steering|product discovery|prd|capability|api contract|permission|architecture|docs\/)/.test(source)) {
      notes.push("Permission mapping must name an approved authz source");
    }

    if (!/(tenant|root|object|not-applicable|boundary|deny)/.test(boundary)) {
      notes.push("Permission mapping must name tenant, root, object, boundary, deny, or not-applicable posture");
    }

    if (!expectations.includes("allow") || !expectations.includes("deny")) {
      notes.push("Permission mapping must name both allow and deny expectations");
    }

    return notes;
  },
});
