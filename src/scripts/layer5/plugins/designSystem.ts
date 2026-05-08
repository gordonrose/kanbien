import { makeContractPlugin } from "./genericContractPlugin";

export const designSystemPlugin = makeContractPlugin({
  taskType: "GOV:design-system",
  primarySection: "Design-System Seam Contract",
  additionalSections: ["Design-System Seam Class Contract"],
  requiredFields: [
    "Seam Posture",
    "Seam Name / Export / Route",
    "Owned Render Structure",
    "Owned Behavior Controller",
    "Owned Accessibility Semantics",
    "Canonical / Behavior Lock / Evidence",
    "Frontend Consumption Contract",
  ],
  sourceFields: ["Canonical / Behavior Lock / Evidence"],
  proofFields: ["Canonical / Behavior Lock / Evidence", "Class-Specific Required Proof"],
  splitFields: ["Forbidden App / Evidence / Standards Work"],
  customChecks: ({ value }) => {
    const notes: string[] = [];
    const seam = value("Seam Name / Export / Route").toLowerCase();
    const render = value("Owned Render Structure").toLowerCase();
    const behavior = value("Owned Behavior Controller").toLowerCase();
    const accessibility = value("Owned Accessibility Semantics").toLowerCase();
    const evidence = value("Canonical / Behavior Lock / Evidence").toLowerCase();

    if (!/(route|export|component|controller|seam)/.test(seam)) {
      notes.push("Design-system task must name a consumable route, export, component, controller, or seam");
    }

    if (!render.includes("owned") || !behavior.includes("owned") || !/(a11y|accessibility|semantics|owned)/.test(accessibility)) {
      notes.push("Design-system task must name owned render, behavior, and accessibility semantics");
    }

    if (!/(canonical|behavior|evidence|docs\/workspace\/design-system|playwright)/.test(evidence)) {
      notes.push("Design-system task must name canonical, behavior-lock, or evidence source");
    }

    return notes;
  },
});
