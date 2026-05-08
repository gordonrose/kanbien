import { makeContractPlugin } from "./genericContractPlugin";

export const standardsUpdatePlugin = makeContractPlugin({
  taskType: "GOV:standards-update",
  primarySection: "Standards Update Contract",
  requiredFields: [
    "Standards Update Class",
    "Approved Standards Change Source",
    "Source Path / Reference",
    "Standards Change Summary",
    "Standards Artifact Target",
    "Affected Surfaces / Consistency Sweep",
    "Artifact Invalidation Sweep",
    "Enforcement Posture",
    "Compatibility / Rollout Posture",
    "Debt Route If Not Enforced Now",
    "Forbidden Implementation / Architecture / Compliance Work",
    "Validation / Review Evidence",
  ],
  sourceFields: ["Approved Standards Change Source", "Source Path / Reference", "Affected Surfaces / Consistency Sweep"],
  proofFields: ["Enforcement Posture", "Validation / Review Evidence"],
  compatibilityFields: ["Compatibility / Rollout Posture"],
  splitFields: ["Artifact Invalidation Sweep", "Debt Route If Not Enforced Now"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const source = `${value("Approved Standards Change Source")} ${value("Source Path / Reference")}`.toLowerCase();
    const target = value("Standards Artifact Target").replace(/\\/g, "/").toLowerCase();
    const sweep = `${value("Affected Surfaces / Consistency Sweep")} ${value("Artifact Invalidation Sweep")}`.toLowerCase();
    const forbidden = value("Forbidden Implementation / Architecture / Compliance Work").toLowerCase();

    if (!/(approval|audit|reconciliation|retrospective|technical|contradiction|docs\/standards)/.test(source)) {
      notes.push("Standards update must name an approved standards change source");
    }

    if (!/(agents\.md|docs\/standards|docs\/templates|\.codex\/skills|src\/scripts)/.test(target)) {
      notes.push("Standards update target must be standards-owned");
    }

    if (!/(sweep|reviewed|not-applicable|invalidation)/.test(sweep)) {
      notes.push("Standards update must record artifact invalidation sweep or not-applicable rationale");
    }

    if (!forbidden.includes("implementation") || !forbidden.includes("architecture") || !forbidden.includes("compliance")) {
      notes.push("Standards update must forbid implementation, architecture, and compliance work");
    }

    return notes;
  },
});
