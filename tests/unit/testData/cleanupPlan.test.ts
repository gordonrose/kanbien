import { describe, expect, it } from "vitest";
import { buildCleanupPlan, cleanupOrder } from "../../../src/lib/testingData/cleanupPlan";

describe("testing data cleanup plan", () => {
  it("TC-TEST-DATA-UNIT-004 builds dependency-safe cleanup order with deduplicated IDs", () => {
    const plan = buildCleanupPlan([
      { entity: "root_users", id: "ru_1" },
      { entity: "auth_principals", id: "ap_1" },
      { entity: "auth_audit_events", id: "evt_1" },
      { entity: "auth_principals", id: "ap_1" },
    ]);

    expect(plan.map((step) => step.entity)).toEqual(cleanupOrder);
    expect(plan.find((step) => step.entity === "auth_audit_events")?.ids).toEqual(["evt_1"]);
    expect(plan.find((step) => step.entity === "auth_principals")?.ids).toEqual(["ap_1"]);
    expect(plan.find((step) => step.entity === "root_users")?.ids).toEqual(["ru_1"]);
  });
});
