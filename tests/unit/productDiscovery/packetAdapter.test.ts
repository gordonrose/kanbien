import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  createProductDiscoveryPacketData,
  renderProductDiscoveryPacketMarkdown,
  type ProductDiscoveryPacketAdapterInput,
} from "../../../src/lib/productDiscovery/packetAdapter";
import {
  validateAllProductDiscoveryPackets,
  validateProductDiscoveryContent,
} from "../../../src/scripts/productDiscoveryValidate";

const validInput: ProductDiscoveryPacketAdapterInput = {
  title: "Chat Interface For Layer One Product Discovery",
  originalRequest: "Build a chat interface like Slack that my app can consume.",
  plainLanguageRequestSummary: "Add a reusable chat panel that starts Product Discovery and preserves packet output.",
  packetDate: "2026-05-07",
  ownerRequester: "Gordon",
  initialUnderstanding: "The first version should help a builder start Product Discovery from inside the app.",
  interviewTurns: [
    {
      question: "Who is this first version for?",
      answer: "Root builders using the root admin app.",
      disposition: "rule",
    },
  ],
  assumptionsConfirmed: [
    "The chat starts Layer 1 Product Discovery.",
    "The output remains a Product Discovery packet.",
  ],
  technicalQuestionsPackaged: [
    "Which harness adapter seam owns packet data creation?",
  ],
  confidencePercent: 95,
  problemToSolve: "Builders need a contextual way to begin Product Discovery.",
  businessOutcome: "Discovery starts consistently from the app.",
  primaryUserOutcome: "A builder can complete discovery and receive a packet.",
  whyNow: "The app needs a reusable harness entry point before deeper delivery automation.",
  successSignal: "Generated packet data validates as Product Discovery content.",
  nonGoalSummary: "No delivery task creation or arbitrary transcript-to-document conversion.",
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
    actor: "root builder",
    situation: "starting a new product request",
    motivation: "use guided Product Discovery",
    outcome: "produce a valid Product Discovery packet",
  },
  useCases: [
    {
      id: "UC-001",
      actor: "root builder",
      statement: "Start discovery from the app chat panel.",
      successOutcome: "A packet data object can be rendered and validated.",
    },
  ],
  capabilityBreakdown: [
    {
      id: "CAP-001",
      capability: "generateDiscoveryPacketData",
      rationale: "The chat adapter must preserve Product Discovery packet semantics.",
      downstreamSignal: "DEV:platform-seam",
    },
  ],
  technicalSteeringHandoff: {
    handoffStatus: "ready-for-technical-steering",
    architectureSignals: ["platform harness adapter"],
    riskFlags: ["permission-sensitive generated artifact"],
    packagedQuestions: ["How should later runtime failure state be persisted?"],
  },
};

describe("Product Discovery packet adapter", () => {
  it("creates canonical packet data and renders Product Discovery packet structure", () => {
    const data = createProductDiscoveryPacketData(validInput);
    const markdown = renderProductDiscoveryPacketMarkdown(data);

    expect(data.packetHeading).toBe("# Product Discovery Packet: Chat Interface For Layer One Product Discovery");
    expect(markdown).toContain("## Product Intent");
    expect(markdown).toContain("## Technical Steering Handoff");
    expect(validateProductDiscoveryContent(markdown)).toEqual({
      status: "PASS",
      errors: [],
    });
  });

  it("rejects ready handoff when Product Discovery confidence is below the handoff threshold", () => {
    expect(() =>
      createProductDiscoveryPacketData({
        ...validInput,
        confidencePercent: 94,
      }),
    ).toThrow("ready-for-technical-steering requires confidencePercent >= 95.");
  });

  it("rejects empty packet inputs instead of inventing fallback Product Discovery data", () => {
    expect(() =>
      createProductDiscoveryPacketData({
        ...validInput,
        originalRequest: " ",
      }),
    ).toThrow("originalRequest is required for Product Discovery packet data.");
  });

  it("validates all Product Discovery packets in a directory", () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "product-discovery-validate-"));
    try {
      const markdown = renderProductDiscoveryPacketMarkdown(createProductDiscoveryPacketData(validInput));
      writeFileSync(path.join(tempDir, "2026-05-07-valid.md"), markdown);
      writeFileSync(path.join(tempDir, "README.md"), "# Product Discovery README\n");

      expect(validateAllProductDiscoveryPackets(tempDir)).toEqual([
        {
          packetPath: path.join(tempDir, "2026-05-07-valid.md"),
          result: {
            status: "PASS",
            errors: [],
          },
        },
      ]);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
