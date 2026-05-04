import { describe, expect, it } from "vitest";

import { validateTechnicalSteeringContent } from "../../../src/scripts/technicalSteeringValidate";

const validPacket = `# Technical Steering Packet: Tenant Branding

## Status

- Packet status:
  \`ready-for-story-breakdown\`

## Product Handoff

- Product Discovery status:
  ready-for-technical-steering
- Product intent preserved:
  yes

## Architecture Classification

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Rationale | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- | --- |
| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | The change is owned by tenantConfiguration feature behavior. | DEV:backend |
| CLS-002 | tenant branding API contract | feature-local | docs/api-contracts/tenantConfiguration.md | approved | Route contract documentation must move with the DEV:backend task. | DOC:api-contract |
| CLS-003 | tenant branding permission mapping | feature-local | docs/permission-mapping/tenantConfiguration.md | approved | Root-only capability mapping must be preserved. | DOC:permission-mapping |
| CLS-004 | tenant branding source-independent docs | feature-local | docs/api-contracts and docs/permission-mapping | approved | Maintained docs must move with the feature-local DEV:backend change. | DOC:docs-artifact |

## Architecture Risk Flags

| Risk Area | Present | Evidence | Required Layer 3 Signal | Required Layer 4 Task Type |
| --- | --- | --- | --- | --- |
| API route or contract change | yes | Root admin update route contract changes. | API route or contract change | DOC:api-contract |

## Architecture Decision Analysis

| Decision ID | Concern Area | Architecture Question | Analysis Status | Options Considered | Industry / Best-Practice Baseline | Local Repo Constraints | Trade-Offs | Risk Review | Cost / Delivery Impact | Security / Privacy / Compliance Impact | Operability Impact | Migration / Compatibility Impact | Testability / Evidence Impact | Reversibility | Recommended Option | Rejected Alternatives | Decision Owner / Signoff | Durable Authority Target |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEC-001 | ownership-boundary | Should tenant branding backend behavior remain feature-local? | approved | Feature-local tenantConfiguration owner; platform seam; shared library. | Feature-owned behavior stays with the owning domain unless cross-feature reuse or platform authority is proven. | Existing tenantConfiguration feature owns branding behavior and no shared runtime seam is needed. | Feature-local keeps scope narrow; platform seam would add unnecessary authority. | Low risk because no shared seam or migration is introduced. | Low delivery cost; avoids broader platform work. | Root-only capability and permission mapping remain explicit. | Existing operational model unchanged. | Backwards-compatible additive route behavior; no migration required. | Persistence and contract tests cover the decision. | Reversible by later architecture-foundation and GOV:architecture-update if reuse emerges. | Keep tenant branding DEV:backend feature-local. | Platform seam and shared-lib alternatives rejected until reuse or authority need exists. | Technical Steering approval in this packet. | docs/workspace/technical-steering/tenant-branding.md |

## Frontend Architecture Classification

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend feature | not-applicable: DEV:backend feature | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Backend-only steering has no rendered DEV:frontend surface. |

## Browser Security Posture

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| not-applicable | no | Backend-only steering does not change browser runtime behavior. | not-applicable | no |

## Artifact Obligations

| Artifact | Required Action | Owner Layer | Blocks Handoff | Notes |
| --- | --- | --- | --- | --- |
| API contract | update | Layer 4 | yes | Route contract artifact must move with the DEV:backend task. |

## Deterministic Signal Checks

| Trigger ID | Trigger Question | Trigger Status | Evidence | Required Classification | Required Layer 4 Task Type | Exception / Decision |
| --- | --- | --- | --- | --- | --- | --- |
| TSIG-PLATFORM-SEAM | Does the change touch shared router, middleware, session/auth platform, job/scheduler, scripts, harness, generated-artifact tooling, or other shared runtime machinery? | no | Feature-local route work only. | platform-seam | DEV:platform-seam | not-applicable |
| TSIG-API-CONTRACT | Does the change add or alter route contract, request/response shape, status codes, validation, pagination, sorting, or API auth behavior? | yes | Root admin route contract changes. | feature-local | DOC:api-contract | not-applicable |
| TSIG-PERSISTENCE | Does the change alter schema, indexes, query semantics, normalization, uniqueness, lifecycle fields, soft delete, migrations, or persistence harness behavior? | no | Existing table and query semantics are preserved. | feature-local | DEV:migration-persistence | not-applicable |
| TSIG-PERMISSION | Does the change add or alter authz capability keys, grants, deny rules, tenant context, object-level permissions, or protected route access? | yes | Root-only capability mapping is required. | feature-local | DOC:permission-mapping | not-applicable |
| TSIG-GOVERNED-FRONTEND | Does the change add or alter governed app UI, shell chrome, navigation, drawers, dialogs, reusable controls, page chrome, app-page CSS, or design-system-owned behavior? | no | Backend-only story. | design-system-seam | GOV:design-system | not-applicable |
| TSIG-FRONTEND-SURFACE | Does the change add or alter a rendered DEV:frontend surface, browser workflow, DEV:frontend route, or served asset behavior? | no | Backend-only story. | feature-local | DEV:frontend | not-applicable |
| TSIG-SHARED-CODE | Does the change reuse, move, extract, or generalize logic across features or into src/lib? | no | No reusable extraction proposed. | shared-lib-candidate | DECISION:refactor-first | not-applicable |
| TSIG-DATA-DICTIONARY | Does the change alter durable entity facts, fields, lifecycle, retention, searchable storage, indexes, or source-independent persistence truth? | no | Existing durable entity shape is unchanged. | feature-local | DOC:data-dictionary | not-applicable |
| TSIG-QA-RUNTIME | Does the change require runtime/browser/live-data/mock-honesty evidence or change QA release-gate posture? | no | Persistence and contract proof are sufficient for the scoped DEV:backend story. | feature-local | EVIDENCE:qa-evidence | not-applicable |
| TSIG-DOCS-ARTIFACT | Does the change alter source-independent docs, maintained artifacts, standards snapshots, reconstruction docs, bootstrap docs, or template/skill contracts? | yes | API contract and permission mapping artifacts must be refreshed. | feature-local | DOC:docs-artifact | not-applicable |

## Steering Decisions

| Decision ID | Decision | Rationale | Compatibility / Migration Strategy | Downstream Owner |
| --- | --- | --- | --- | --- |
| DEC-001 | Keep tenant branding DEV:backend feature-local. | No platform seam is required. | Backwards-compatible additive route behavior. | Story Breakdown |

## Blockers

| Blocker ID | Blocks | Blocker Type | Required Output | Owner |
| --- | --- | --- | --- | --- |

## Layer 3 Handoff

| Story Scope Element | Handoff Status | Required Classification IDs | Notes |
| --- | --- | --- | --- |
| tenant branding DEV:backend update | ready-for-story-breakdown | CLS-001, CLS-002, CLS-003, CLS-004 | Ready for Story Breakdown. |
`;

describe("technical steering validation", () => {
  it("passes a steering packet with deterministic signal checks and matching classifications", () => {
    expect(validateTechnicalSteeringContent(validPacket)).toEqual({
      status: "PASS",
      errors: [],
    });
  });

  it("blocks missing deterministic signal checks", () => {
    const result = validateTechnicalSteeringContent(
      validPacket.replace(
        "| TSIG-SHARED-CODE | Does the change reuse, move, extract, or generalize logic across features or into src/lib? | no | No reusable extraction proposed. | shared-lib-candidate | DECISION:refactor-first | not-applicable |\n",
        "",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("missing deterministic signal check: TSIG-SHARED-CODE");
  });

  it("blocks yes triggers without a matching classification or approved exception", () => {
    const result = validateTechnicalSteeringContent(
      validPacket
        .replace(
          "| CLS-002 | tenant branding API contract | feature-local | docs/api-contracts/tenantConfiguration.md | approved | Route contract documentation must move with the DEV:backend task. | DOC:api-contract |\n",
          "",
        )
        .replace(
          "| TSIG-API-CONTRACT | Does the change add or alter route contract, request/response shape, status codes, validation, pagination, sorting, or API auth behavior? | yes | Root admin route contract changes. | feature-local | DOC:api-contract | not-applicable |",
          "| TSIG-API-CONTRACT | Does the change add or alter route contract, request/response shape, status codes, validation, pagination, sorting, or API auth behavior? | yes | Root admin route contract changes. | feature-local | DOC:api-contract | not-applicable |",
        ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("TSIG-API-CONTRACT is yes but no classification row or approved exception maps to DOC:api-contract");
  });

  it("blocks ready handoff when a referenced classification is blocked", () => {
    const result = validateTechnicalSteeringContent(
      validPacket.replace(
        "| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | The change is owned by tenantConfiguration feature behavior. | DEV:backend |",
        "| CLS-001 | tenant branding DEV:backend update | blocked | src/features/tenantConfiguration | blocked | Owner undecided. | DEV:backend |",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("CLS-001 architecture classification is blocked");
    expect(result.errors).toContain("tenant branding DEV:backend update is ready while CLS-001 is blocked");
  });

  it("blocks vague steering language", () => {
    const result = validateTechnicalSteeringContent(
      validPacket.replace("Feature-local route work only.", "Probably feature-local, figure out later."),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("vague phrase found: figure out later");
    expect(result.errors).toContain("vague phrase found: probably feature-local");
  });

  it("blocks approved architecture steering without decision analysis", () => {
    const result = validateTechnicalSteeringContent(
      validPacket.replace(
        "## Architecture Decision Analysis\n\n| Decision ID | Concern Area | Architecture Question | Analysis Status | Options Considered | Industry / Best-Practice Baseline | Local Repo Constraints | Trade-Offs | Risk Review | Cost / Delivery Impact | Security / Privacy / Compliance Impact | Operability Impact | Migration / Compatibility Impact | Testability / Evidence Impact | Reversibility | Recommended Option | Rejected Alternatives | Decision Owner / Signoff | Durable Authority Target |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| DEC-001 | ownership-boundary | Should tenant branding backend behavior remain feature-local? | approved | Feature-local tenantConfiguration owner; platform seam; shared library. | Feature-owned behavior stays with the owning domain unless cross-feature reuse or platform authority is proven. | Existing tenantConfiguration feature owns branding behavior and no shared runtime seam is needed. | Feature-local keeps scope narrow; platform seam would add unnecessary authority. | Low risk because no shared seam or migration is introduced. | Low delivery cost; avoids broader platform work. | Root-only capability and permission mapping remain explicit. | Existing operational model unchanged. | Backwards-compatible additive route behavior; no migration required. | Persistence and contract tests cover the decision. | Reversible by later architecture-foundation and GOV:architecture-update if reuse emerges. | Keep tenant branding DEV:backend feature-local. | Platform seam and shared-lib alternatives rejected until reuse or authority need exists. | Technical Steering approval in this packet. | docs/workspace/technical-steering/tenant-branding.md |\n\n",
        "## Architecture Decision Analysis\n\n| Decision ID | Concern Area | Architecture Question | Analysis Status | Options Considered | Industry / Best-Practice Baseline | Local Repo Constraints | Trade-Offs | Risk Review | Cost / Delivery Impact | Security / Privacy / Compliance Impact | Operability Impact | Migration / Compatibility Impact | Testability / Evidence Impact | Reversibility | Recommended Option | Rejected Alternatives | Decision Owner / Signoff | Durable Authority Target |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n\n",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("Architecture Decision Analysis is required for architecture-sensitive steering");
  });

  it("blocks incomplete architecture decision analysis", () => {
    const result = validateTechnicalSteeringContent(
      validPacket.replace(
        "| DEC-001 | ownership-boundary | Should tenant branding backend behavior remain feature-local? | approved |",
        "| DEC-001 | ownership-boundary | Should tenant branding backend behavior remain feature-local? | incomplete |",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("Architecture Decision Analysis must include approved or not-required-with-rationale analysis");
    expect(result.errors).toContain("DEC-001 Architecture Decision Analysis is incomplete");
  });

  it("blocks frontend-affecting steering without DEV:frontend architecture rows", () => {
    const result = validateTechnicalSteeringContent(
      validPacket
        .replace(
          "| tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend feature | not-applicable: DEV:backend feature | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Backend-only steering has no rendered DEV:frontend surface. |\n",
          "",
        )
        .replace(
          "| TSIG-FRONTEND-SURFACE | Does the change add or alter a rendered DEV:frontend surface, browser workflow, DEV:frontend route, or served asset behavior? | no | Backend-only story. | feature-local | DEV:frontend | not-applicable |",
          "| TSIG-FRONTEND-SURFACE | Does the change add or alter a rendered DEV:frontend surface, browser workflow, DEV:frontend route, or served asset behavior? | yes | Root admin branding page changes. | feature-local | DEV:frontend | not-applicable |",
        ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("frontend-affecting steering requires Frontend Architecture Classification rows");
  });

  it("blocks invalid DEV:frontend classification enum values", () => {
    const result = validateTechnicalSteeringContent(
      validPacket.replace(
        "| tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend feature | not-applicable: DEV:backend feature | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Backend-only steering has no rendered DEV:frontend surface. |",
        "| tenant branding DEV:backend update | vibes-app | not-applicable: DEV:backend feature | not-applicable: DEV:backend feature | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Backend-only steering has no rendered DEV:frontend surface. |",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("tenant branding DEV:backend update has invalid Route Family: vibes-app");
  });

  it("blocks asset-delivery security posture without blocking asset decision artifact", () => {
    const result = validateTechnicalSteeringContent(
      validPacket.replace(
        "| not-applicable | no | Backend-only steering does not change browser runtime behavior. | not-applicable | no |",
        "| asset-delivery | yes | Tenant logo upload and inline display are introduced. | asset decision record / DEV:platform-seam | yes |",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("asset-delivery browser security posture requires a blocking asset consumer decision record obligation");
  });
});
