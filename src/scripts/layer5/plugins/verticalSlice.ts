import { makeContractPlugin } from "./genericContractPlugin";

export const verticalSlicePlugin = makeContractPlugin({
  taskType: "DEV:vertical-slice",
  primarySection: "Vertical Slice Coupling",
  additionalSections: ["Vertical Slice Split Pressure", "Frontend Runtime Data And Mock Honesty"],
  requiredFields: [
    "Journey Behavior",
    "Backend Seam",
    "Frontend Seam",
    "API / Data Contract",
    "Browser Proof Story",
    "Why Backend And Frontend Proof Are Inseparable",
    "Split Rejection Rationale",
  ],
  sourceFields: ["API / Data Contract", "Governing API / Projection Contract", "Fixture Source"],
  proofFields: ["Browser Proof Story", "Live / Runtime Payload Evidence", "Mock-Honesty Statement"],
  customChecks: ({ sectionRows, value }) => {
    const notes: string[] = [];
    const backend = value("Backend Seam").toLowerCase();
    const frontend = value("Frontend Seam").toLowerCase();
    const contract = value("API / Data Contract").toLowerCase();
    const browserProof = value("Browser Proof Story").toLowerCase();
    const inseparable = `${value("Why Backend And Frontend Proof Are Inseparable")} ${value("Split Rejection Rationale")}`.toLowerCase();
    const splitRows = sectionRows.filter((row) => row.section === "Vertical Slice Split Pressure");

    if (!backend.includes("backend") || !frontend.includes("frontend")) {
      notes.push("Vertical slice must name both backend and frontend seams");
    }

    if (!/(api|contract|payload|projection|data)/.test(contract)) {
      notes.push("Vertical slice must name an API, payload, projection, or data contract seam");
    }

    if (!/(browser|playwright|runtime|journey|e2e)/.test(browserProof)) {
      notes.push("Vertical slice browser proof must name browser, runtime, journey, or E2E evidence");
    }

    if (!/(inseparable|together|same proof|coupling|cannot split)/.test(inseparable)) {
      notes.push("Vertical slice must explain why backend and frontend proof are inseparable");
    }

    if (splitRows.length === 0) {
      notes.push("Vertical slice must include split-pressure rows");
    }

    return notes;
  },
});
