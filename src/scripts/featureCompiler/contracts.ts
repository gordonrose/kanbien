export const layer4TaskTypes = [
  "backend",
  "frontend",
  "vertical-slice",
  "docs-artifact",
  "test-only",
  "test-suite-alignment",
  "refactor-first",
  "architecture-foundation",
  "standards-compliance",
  "platform-seam",
  "migration/persistence",
  "design-system",
  "API-contract",
  "permission-mapping",
  "data-dictionary",
  "QA/evidence",
] as const;

export const layer4TaskStatuses = ["draft", "blocked", "queued-for-delivery", "superseded"] as const;

export const layer4CapabilityCoverageStatuses = [
  "approved",
  "not-capability-backed",
  "blocked-missing-row",
] as const;

export const layer4FoundationBlockerTypes = ["refactor-first", "architecture-foundation"] as const;

export const layer4FoundationTaskTypes = ["refactor-first", "architecture-foundation"] as const;

export const layer4ImplementationTaskTypes = [
  "backend",
  "frontend",
  "vertical-slice",
  "migration/persistence",
  "design-system",
  "platform-seam",
] as const;

export const layer4GuardrailReferenceByTaskType = {
  backend: "backend-task-guardrail.md",
  frontend: "frontend-task-guardrail.md",
  "vertical-slice": "vertical-slice-task-guardrail.md",
  "docs-artifact": "docs-artifact-task-guardrail.md",
  "test-only": "test-only-task-guardrail.md",
  "test-suite-alignment": "test-suite-alignment-task-guardrail.md",
  "refactor-first": "refactor-first-task-guardrail.md",
  "architecture-foundation": "architecture-foundation-task-guardrail.md",
  "standards-compliance": "standards-compliance-task-guardrail.md",
  "platform-seam": "platform-seam-task-guardrail.md",
  "migration/persistence": "migration-persistence-task-guardrail.md",
  "design-system": "design-system-task-guardrail.md",
  "API-contract": "api-contract-task-guardrail.md",
  "permission-mapping": "permission-mapping-task-guardrail.md",
  "data-dictionary": "data-dictionary-task-guardrail.md",
  "QA/evidence": "qa-evidence-task-guardrail.md",
} as const satisfies Record<Layer4TaskType, string>;

export const layer4PlacementDecisions = [
  "feature-local",
  "platform-seam",
  "shared-lib",
  "stay-put",
  "blocked",
] as const;

export const layer4GuardrailEvidenceStatuses = ["pass", "blocked"] as const;

export const layer4WriteClasses = [
  "feature-local",
  "platform-seam",
  "test",
  "docs-artifact",
  "generated-artifact",
  "config-script",
  "blocked",
] as const;

export const layer4TaskGrainClassifications = [
  "single-behavior",
  "single-decision",
  "single-proof-target",
  "inseparable-two-ac-slice",
  "split-required",
  "coarse-blocked",
] as const;

export const layer4StopConditionTriggerTypes = [
  "none-known",
  "human-decision",
  "technical-steering-revisit",
  "design-system-seam-gap",
  "product-decision",
  "architecture-decision",
  "source-truth-mismatch",
  "proof-gap",
] as const;

export const layer4ProceedIfTriggerHitValues = ["yes", "no"] as const;

export const layer4WriteEnvelopeClasses = [
  "exact-files",
  "narrow-pattern",
  "broad-pattern-justified",
  "broad-pattern-blocked",
] as const;

export const layer4ProofSpecificityStatuses = [
  "task-specific",
  "broad-with-rationale",
  "blocked",
] as const;

export const layer4FrontendDesignSystemSubStandards = [
  "not-applicable",
  "fixture-data-contract",
  "visual-rendering",
  "interaction-behavior",
  "accessibility-semantics",
  "evidence-sweep",
] as const;

export const layer4FrontendPerformancePostures = [
  "static-low-risk",
  "interactive-low-risk",
  "data-list-or-table",
  "route-initialization",
  "large-dom-or-canvas",
  "asset-heavy",
  "animation-or-transition-heavy",
  "not-applicable",
  "unknown-blocked",
] as const;

export const layer4FrontendTaskTypes = ["frontend", "design-system", "vertical-slice"] as const;

export const layer4DesignSystemSeamPostures = [
  "not-applicable",
  "produces-consumable-seam",
  "refines-existing-seam",
  "proves-existing-seam",
  "consumes-existing-seam",
  "approved-exception",
  "blocks-on-missing-seam",
] as const;

export const layer4BackendCapabilityFileStrategies = [
  "new-capability-file",
  "existing-capability-file",
  "service-composition-only",
  "transport-only",
  "not-applicable-with-rationale",
] as const;

export const layer4MigrationPersistenceChangeTypes = [
  "live-schema-inspection",
  "new-migration",
  "corrective-migration",
  "repository-query-semantics",
  "index-or-constraint",
  "normalization-or-uniqueness",
  "postgres-harness-update",
  "not-applicable-with-rationale",
] as const;

export const layer4SuspiciousCoarseScopePhrases = [
  "all states",
  "full component family",
  "complete feature",
  "end-to-end implementation",
  "everything needed",
  "interactions and evidence",
  "visual and accessibility and interaction",
] as const;

export const layer4RequiredCheckIdsByTaskType = {
  backend: [
    "backend-owning-feature",
    "backend-feature-structure",
    "backend-cross-feature-seams",
    "backend-authz-tenant",
    "backend-persistence-migration",
    "backend-artifacts",
    "backend-proof-commands",
  ],
  frontend: [
    "frontend-architecture-classification",
    "frontend-source-placement",
    "frontend-state-owner",
    "frontend-route-topology",
    "frontend-design-system-seam",
    "frontend-adoption-contract",
    "frontend-no-app-css",
    "frontend-no-copied-behavior",
    "frontend-accessibility-state",
    "frontend-rendered-proof",
    "frontend-security-evidence",
    "frontend-permission-rendering",
    "frontend-runtime-data-mock-honesty",
    "frontend-runtime-evidence",
    "frontend-artifacts",
  ],
  "vertical-slice": [
    "vertical-inseparable-journey",
    "vertical-backend-seam",
    "vertical-frontend-seam",
    "vertical-api-data-shape",
    "vertical-browser-workflow",
    "vertical-security-evidence",
    "vertical-permission-rendering",
    "vertical-runtime-data-mock-honesty",
    "vertical-mock-honesty",
    "vertical-artifacts",
    "vertical-proof-commands",
  ],
  "docs-artifact": [
    "docs-source-truth-reviewed",
    "docs-stale-artifact-sweep",
    "docs-status-posture",
    "docs-validation-command",
  ],
  "test-only": [
    "test-traceability",
    "test-proof-layer",
    "test-permission-state-matrix",
    "test-mock-honesty",
    "test-no-behavior-change",
    "test-command",
  ],
  "test-suite-alignment": [
    "test-alignment-source-map",
    "test-alignment-mismatch-class",
    "test-alignment-edit-envelope",
    "test-alignment-no-production-change",
    "test-alignment-split-new-proof",
    "test-alignment-traceability-command",
  ],
  "refactor-first": [
    "refactor-existing-behavior",
    "refactor-affected-consumers",
    "refactor-compatibility-proof",
    "refactor-downstream-unblocker",
    "refactor-no-product-change",
  ],
  "architecture-foundation": [
    "architecture-adrs-reviewed",
    "architecture-decision-owner",
    "architecture-output-path",
    "architecture-downstream-block",
    "architecture-compatibility",
  ],
  "standards-compliance": [
    "standards-gate-named",
    "standards-posture-recorded",
    "standards-command",
    "standards-status-artifact",
  ],
  "platform-seam": [
    "platform-seam-owner",
    "platform-not-feature-local",
    "platform-consumers",
    "platform-compatibility-proof",
    "platform-artifact-impact",
    "platform-architecture-impact",
  ],
  "migration/persistence": [
    "migration-live-schema",
    "migration-source-data-shape",
    "migration-per-row-eligibility",
    "migration-rejected-row-behavior",
    "migration-applied-file-safety",
    "migration-index-normalization",
    "migration-read-write-proof",
    "migration-postgres-harness",
  ],
  "design-system": [
    "design-system-family",
    "design-system-behavior-lock",
    "design-system-consumable-seam",
    "design-system-render-behavior",
    "design-system-visual-proof",
    "design-system-security-evidence",
    "design-system-runtime-data-mock-honesty",
    "design-system-adoption-path",
  ],
  "API-contract": [
    "api-route-family",
    "api-request-response",
    "api-authz-validation",
    "api-compatibility",
    "api-maintained-artifacts",
    "api-validation-command",
  ],
  "permission-mapping": [
    "permission-capability-rows",
    "permission-boundary",
    "permission-allow-deny",
    "permission-grants-migration",
    "permission-authz-proof",
  ],
  "data-dictionary": [
    "data-entity-table",
    "data-source-reviewed",
    "data-field-index-lifecycle",
    "data-durable-facts",
    "data-validation-proof",
  ],
  "QA/evidence": [
    "qa-proof-target",
    "qa-command-plan",
    "qa-runtime-evidence",
    "qa-mock-honesty",
    "qa-evidence-status",
  ],
} as const satisfies Record<Layer4TaskType, readonly string[]>;

export const layer4SharedCodePlacementCheckIds = [
  "shared-code-current-owner",
  "shared-code-proposed-owner",
  "shared-code-location-rationale",
  "shared-code-existing-consumers",
  "shared-code-compatibility-proof",
  "shared-code-extraction-task",
] as const;

export const frontendRouteFamilies = [
  "design-system",
  "root-admin",
  "login",
  "new-family",
  "not-applicable",
] as const;

export const frontendRuntimeShapes = [
  "file-routed-reference",
  "app-shell",
  "support-route",
  "generated-route",
  "static-asset",
  "browser-workflow",
  "not-applicable",
] as const;

export const frontendSurfaceClasses = [
  "page",
  "journey",
  "canonical",
  "pattern",
  "template",
  "support",
  "app-adoption",
  "generated-materialization",
  "not-applicable",
] as const;

export const frontendTopologyClasses = [
  "durable-page",
  "durable-subroute",
  "journey-state",
  "ui-state",
  "support-only",
  "not-topology",
] as const;

export const frontendLocatorTypes = [
  "path",
  "hash-state",
  "none",
  "migration",
] as const;

export const frontendTopologyAuthorities = [
  "curated-webAppHierarchyBuilder",
  "discovered-webAppSurfaceDiscovery",
  "design-system-file-route",
  "manual-shell-registry",
  "generated-materializer",
  "support-only",
  "not-applicable",
] as const;

export const frontendAuthorityTransitionPostures = [
  "not-applicable",
  "target-authority-current",
  "transitional-accepted",
  "transition-required",
  "blocked-until-transition",
] as const;

export const frontendStateOwners = [
  "curated-topology",
  "page-settings",
  "feature-local-state-machine",
  "ui-local",
  "server-backed-snapshot",
  "never-serialize",
  "not-applicable",
] as const;

export const frontendShellGovernancePostures = [
  "DS-owned-shell-required",
  "local-legacy-shell",
  "exception-approved",
  "not-applicable",
] as const;

export const frontendDesignSystemPrerequisites = [
  "signed-off-seam-exists",
  "DS-task-required",
  "approved-exception",
  "not-governed",
] as const;

export const frontendMaterializationModels = [
  "preview-apply-required",
  "manual-file-route",
  "shell-registry-update",
  "support-route-only",
  "none",
] as const;

export const frontendRouteVisibilities = [
  "primary-nav",
  "context-nav",
  "deep-link-only",
  "support-only",
  "hidden/internal",
  "not-applicable",
] as const;

export const frontendActorScopes = [
  "root-operator",
  "tenant-actor",
  "public-pre-auth",
  "support/operator",
  "not-applicable",
] as const;

export const frontendImplementationReadiness = [
  "ready",
  "blocked-on-architecture",
  "blocked-on-design-system",
  "blocked-on-security",
  "blocked-on-artifacts",
  "blocked-on-topology-transition",
  "not-applicable",
] as const;

export const frontendSourcePlacements = [
  "shell-bootstrap",
  "shell-route-registry",
  "module-journey-files",
  "design-system-family-files",
  "support-route-files",
  "generated-output",
  "not-applicable",
] as const;

export const frontendBrowserSecurityAreas = [
  "session-cookie",
  "csp-assets",
  "privileged-helper",
  "csrf-mutation",
  "url-replay-state",
  "sensitive-rendering",
  "asset-delivery",
  "not-applicable",
] as const;

export const frontendArtifactObligationActions = [
  "create",
  "update",
  "prove-current",
  "defer-approved",
  "not-applicable",
] as const;

export const frontendArtifactBlockingPostures = ["yes", "no"] as const;

export const featureCompilerRefinementLayers = [
  "layer-1-product-discovery",
  "layer-2-technical-steering",
  "layer-3-story-breakdown",
  "layer-4-task-breakdown",
  "layer-5-delivery",
  "repo-wide-governance",
] as const;

export const featureCompilerRefinementSurfaces = [
  "registry",
  "template",
  "validator",
  "skill",
  "task-type-reference",
  "standards-doc",
  "architecture-doc",
  "fixture-or-test",
  "readme",
  "delivery-conformance",
] as const;

export type Layer4TaskType = (typeof layer4TaskTypes)[number];
export type FeatureCompilerRefinementLayer = (typeof featureCompilerRefinementLayers)[number];
export type FeatureCompilerRefinementSurface = (typeof featureCompilerRefinementSurfaces)[number];
