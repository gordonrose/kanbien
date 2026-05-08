import { makeContractPlugin } from "./genericContractPlugin";

export const migrationPersistencePlugin = makeContractPlugin({
  taskType: "DEV:migration-persistence",
  primarySection: "Migration / Persistence Approach",
  additionalSections: ["Migration / Persistence Class Contract"],
  requiredFields: [
    "Change Type",
    "Live Schema Check",
    "Source Data Shape Validation",
    "Migration Identity / Applied File Posture",
    "SQL Execution Semantics Check",
    "Representative Read / Write Proof",
  ],
  sourceFields: ["Live Schema Check", "Source Data Shape Validation"],
  proofFields: ["Representative Read / Write Proof", "Required Read / Write Or Harness Coverage"],
  compatibilityFields: ["Migration Identity / Applied File Posture", "Split / Blocked Follow-Up"],
  splitFields: ["Split / Blocked Follow-Up"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const identity = value("Migration Identity / Applied File Posture").toLowerCase();
    const semantics = value("SQL Execution Semantics Check").toLowerCase();
    const proof = value("Representative Read / Write Proof").toLowerCase();

    if (!/(migration|zero-padded|not-applicable|applied)/.test(identity)) {
      notes.push("Migration identity must name migration/applied-file posture or not-applicable rationale");
    }

    if (!/(sql|migration|command|review|semantics)/.test(semantics)) {
      notes.push("SQL execution semantics check must name SQL, migration command, or review evidence");
    }

    if (!/(read|write|harness|proof|test|vitest)/.test(proof)) {
      notes.push("Representative proof must cover read/write, harness, or focused test evidence");
    }

    return notes;
  },
});
