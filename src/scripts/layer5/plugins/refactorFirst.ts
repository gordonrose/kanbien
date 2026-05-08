import { makeContractPlugin } from "./genericContractPlugin";

export const refactorFirstPlugin = makeContractPlugin({
  taskType: "DECISION:refactor-first",
  primarySection: "Refactor-First Contract",
  requiredFields: [
    "Refactor Trigger",
    "Refactor Type",
    "Refactor Target Inventory",
    "Detection Hints",
    "Unchanged Behavior",
    "Affected Consumers",
    "Downstream Task Unblocked",
    "Compatibility Proof",
    "Routing Check",
    "Human Review Boundary",
    "Forbidden Behavior / Authority Change",
  ],
  sourceFields: ["Refactor Target Inventory", "Detection Hints"],
  proofFields: ["Compatibility Proof"],
  compatibilityFields: ["Compatibility Proof"],
  splitFields: ["Downstream Task Unblocked", "Routing Check"],
  customChecks: ({ context, value }) => {
    const notes: string[] = [];
    const hints = value("Detection Hints").toLowerCase();
    const compatibility = value("Compatibility Proof").toLowerCase();
    const combined = `${context.task.scope} ${value("Unchanged Behavior")} ${value("Affected Consumers")}`.toLowerCase();

    if (!/(rg |git diff|npm run|npx |manual-review|manual review)/.test(hints)) {
      notes.push("Refactor-first detection hints must name command evidence or manual-review rationale");
    }

    if (!/(compat|consumer|test|proof|evidence|unchanged)/.test(compatibility)) {
      notes.push("Refactor-first compatibility proof must name existing-consumer compatibility evidence");
    }

    if (/(make nicer|tidy up|future-proof|prepare for future|make reusable)/.test(combined)) {
      notes.push("Refactor-first task must not use vague refactor rationale");
    }

    return notes;
  },
});
