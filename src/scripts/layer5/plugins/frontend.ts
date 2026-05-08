import { makeContractPlugin } from "./genericContractPlugin";

export const frontendPlugin = makeContractPlugin({
  taskType: "DEV:frontend",
  primarySection: "Frontend Change Class Contract",
  additionalSections: ["Frontend / Design-System Sub-Standard", "Frontend Runtime Data And Mock Honesty"],
  requiredFields: [
    "Frontend Change Class",
    "Primary Contract Rows Required",
    "Runtime / Browser Evidence Required",
    "Route-Away / Split Notes",
  ],
  sourceFields: ["Governing API / Projection Contract", "Fixture Source"],
  proofFields: ["Runtime / Browser Evidence Required", "Live / Runtime Payload Evidence", "Mock-Honesty Statement"],
  splitFields: ["Route-Away / Split Notes"],
  customChecks: ({ sectionRows, value }) => {
    const notes: string[] = [];
    const liveEvidence = sectionRows.map((row) => row.values["live / runtime payload evidence"] ?? "").join(" ");
    const mockHonesty = sectionRows.map((row) => row.values["mock-honesty statement"] ?? "").join(" ").toLowerCase();
    const evidence = `${value("Runtime / Browser Evidence Required")} ${liveEvidence}`.toLowerCase();
    const routeAway = value("Route-Away / Split Notes").toLowerCase();

    if (!/(browser|runtime|playwright|screenshot|served|payload|evidence)/.test(evidence)) {
      notes.push("Frontend task must name browser or runtime evidence");
    }

    if (/(api|backend|persistence|permission|evidence)/.test(routeAway) && !/(doc:|dev:backend|dev:migration-persistence|evidence:qa-evidence|test:)/.test(routeAway)) {
      notes.push("Frontend route-away notes must route API/backend/persistence/permission/evidence work");
    }

    if (!/(mock[-\s]?honesty|fixture|runtime|payload|not-applicable)/.test(mockHonesty)) {
      notes.push("Frontend task must include mock-honesty or not-applicable posture");
    }

    return notes;
  },
});
