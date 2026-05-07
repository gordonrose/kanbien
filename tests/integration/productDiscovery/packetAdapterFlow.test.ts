import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

import {
  createProductDiscoveryPacketData,
  renderProductDiscoveryPacketMarkdown,
  type ProductDiscoveryPacketAdapterInput,
} from "../../../src/lib/productDiscovery/packetAdapter";

const input: ProductDiscoveryPacketAdapterInput = {
  title: "Integration Packet",
  originalRequest: "Create a reusable Product Discovery chat entry point.",
  plainLanguageRequestSummary: "A builder can use chat to create a Product Discovery packet.",
  packetDate: "2026-05-07",
  ownerRequester: "Gordon",
  initialUnderstanding: "The app needs a reusable chat-to-discovery adapter.",
  interviewTurns: [
    {
      question: "What should the normal first version do?",
      answer: "Collect Product Discovery answers and generate packet data.",
      disposition: "rule",
    },
  ],
  assumptionsConfirmed: ["Product Discovery remains the source format."],
  technicalQuestionsPackaged: ["Which later feature persists adapter failure state?"],
  confidencePercent: 95,
  problemToSolve: "Discovery needs an app-consumable entry point.",
  businessOutcome: "Requests enter the planning loop with less rework.",
  primaryUserOutcome: "A builder gets a validated packet.",
  whyNow: "Layer 5 needs a platform seam before chat delivery.",
  successSignal: "The rendered packet passes the existing validator.",
  nonGoalSummary: "No API route, persistence, PDF rendering, or UI adoption work.",
  taxonomy: {
    productFeatureType: "workflow builder",
    uxPatterns: "chat panel",
    dataOwnershipShape: "generated artifact",
    surfaceManagementLocation: "root admin",
    actorPermissionShape: "root operator",
    relationshipShape: "versioned lineage",
    reportingReadModelShape: "audit history",
    lifecycleShape: "draft / generated / superseded",
    integrationExternalityShape: "internal-only",
    evidenceComplianceSensitivity: "permission-sensitive",
  },
  jobToBeDone: {
    actor: "builder",
    situation: "starting discovery",
    motivation: "capture intent in the canonical format",
    outcome: "validated packet markdown",
  },
  useCases: [
    {
      id: "UC-INT-001",
      actor: "builder",
      statement: "Render packet data from approved chat answers.",
      successOutcome: "Existing Product Discovery validation passes.",
    },
  ],
  capabilityBreakdown: [
    {
      id: "CAP-INT-001",
      capability: "generateDiscoveryPacketData",
      rationale: "Adapters must not invent a second discovery format.",
      downstreamSignal: "DEV:platform-seam",
    },
  ],
  technicalSteeringHandoff: {
    handoffStatus: "ready-for-technical-steering",
    architectureSignals: ["platform harness adapter"],
    riskFlags: ["generated artifact"],
    packagedQuestions: ["How should downstream packet revisions be stored?"],
  },
};

describe("Product Discovery packet adapter flow", () => {
  it("renders packet markdown that the existing CLI validator accepts", () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "product-discovery-adapter-"));

    try {
      const packetPath = path.join(tempDir, "packet.md");
      const markdown = renderProductDiscoveryPacketMarkdown(createProductDiscoveryPacketData(input));
      writeFileSync(packetPath, markdown);

      const result = spawnSync("npm", ["run", "product-discovery:validate", "--", packetPath], {
        cwd: process.cwd(),
        encoding: "utf8",
      });

      expect(readFileSync(packetPath, "utf8")).toContain("# Product Discovery Packet: Integration Packet");
      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Product Discovery packet structure OK");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
