export const layer4TaskTypes = [
  "DEV:backend",
  "DEV:frontend",
  "DEV:vertical-slice",
  "DOC:docs-artifact",
  "TEST:test-only",
  "TEST:test-suite-alignment",
  "DECISION:refactor-first",
  "DECISION:architecture-foundation",
  "DOC:standards-compliance",
  "GOV:standards-update",
  "GOV:architecture-update",
  "DEV:platform-seam",
  "DEV:migration-persistence",
  "GOV:design-system",
  "DOC:api-contract",
  "DOC:permission-mapping",
  "DOC:data-dictionary",
  "EVIDENCE:qa-evidence",
] as const;

export const layer4TaskStatuses = ["draft", "blocked", "queued-for-delivery", "superseded"] as const;

export const layer4CapabilityCoverageStatuses = [
  "approved",
  "not-capability-backed",
  "blocked-missing-row",
] as const;

export const layer4FoundationBlockerTypes = ["DECISION:refactor-first", "DECISION:architecture-foundation"] as const;

export const layer4FoundationTaskTypes = ["DECISION:refactor-first", "DECISION:architecture-foundation"] as const;

export const layer4ImplementationTaskTypes = [
  "DEV:backend",
  "DEV:frontend",
  "DEV:vertical-slice",
  "DEV:migration-persistence",
  "GOV:design-system",
  "DEV:platform-seam",
] as const;

export const layer4GuardrailReferenceByTaskType = {
  "DEV:backend": "backend-task-guardrail.md",
  "DEV:frontend": "frontend-task-guardrail.md",
  "DEV:vertical-slice": "vertical-slice-task-guardrail.md",
  "DOC:docs-artifact": "docs-artifact-task-guardrail.md",
  "TEST:test-only": "test-only-task-guardrail.md",
  "TEST:test-suite-alignment": "test-suite-alignment-task-guardrail.md",
  "DECISION:refactor-first": "refactor-first-task-guardrail.md",
  "DECISION:architecture-foundation": "architecture-foundation-task-guardrail.md",
  "DOC:standards-compliance": "standards-compliance-task-guardrail.md",
  "GOV:standards-update": "standards-update-task-guardrail.md",
  "GOV:architecture-update": "architecture-update-task-guardrail.md",
  "DEV:platform-seam": "platform-seam-task-guardrail.md",
  "DEV:migration-persistence": "migration-persistence-task-guardrail.md",
  "GOV:design-system": "design-system-task-guardrail.md",
  "DOC:api-contract": "api-contract-task-guardrail.md",
  "DOC:permission-mapping": "permission-mapping-task-guardrail.md",
  "DOC:data-dictionary": "data-dictionary-task-guardrail.md",
  "EVIDENCE:qa-evidence": "qa-evidence-task-guardrail.md",
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

export const layer4DocsArtifactClasses = [
  "feature-doc-refresh",
  "readme-index-sync",
  "runbook-update",
  "implementation-status-note",
  "workspace-summary-artifact",
  "stale-artifact-sweep",
  "template-or-example-sync",
] as const;

export const layer4StandardsUpdateClasses = [
  "enforced-now",
  "template-required",
  "script-reported-debt",
  "advisory-approved-debt",
  "artifact-invalidation-sweep",
] as const;

export const layer4ArchitectureUpdateClasses = [
  "adr-create",
  "adr-amendment",
  "system-overview-update",
  "frontend-topology-authority",
  "architecture-template-update",
  "architecture-map-update",
] as const;

export const layer4ApiContractClasses = [
  "no-wire-change-refresh",
  "additive-route-contract",
  "compatibility-sensitive-contract",
  "openapi-postman-sync",
  "generated-docs-sync",
] as const;

export const layer4PermissionMappingClasses = [
  "runtime-enforced-row",
  "documentation-only-row",
  "grant-source-row",
  "future-authz-model-row",
  "ui-eligibility-review",
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

export const layer4PlatformSeamKinds = [
  "router-route-mounting",
  "middleware-auth-request-context",
  "scheduler-job-runtime",
  "bootstrap-runtime",
  "generated-artifact-materialization",
  "tooling-harness",
  "shared-runtime-helper",
  "cross-feature-seam-infrastructure",
] as const;

export const layer4PlatformCompatibilityModes = [
  "no-behavior-change",
  "additive-compatible",
  "dual-path-rollout",
  "compatibility-sensitive-blocked",
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

export const layer4FrontendTaskTypes = ["DEV:frontend", "GOV:design-system", "DEV:vertical-slice"] as const;

export const layer4DesignSystemSeamPostures = [
  "not-applicable",
  "produces-consumable-seam",
  "refines-existing-seam",
  "proves-existing-seam",
  "consumes-existing-seam",
  "approved-exception",
  "blocks-on-missing-seam",
] as const;

export const layer4DesignSystemSeamClasses = [
  "render-structure-seam",
  "behavior-controller-seam",
  "accessibility-semantics-seam",
  "style-css-seam",
  "fixture-data-contract",
  "canonical-evidence-update",
] as const;

export const layer4BackendCapabilityFileStrategies = [
  "new-capability-file",
  "existing-capability-file",
  "service-composition-only",
  "transport-only",
  "not-applicable-with-rationale",
] as const;

export const layer4BackendChangeClasses = [
  "domain-behavior",
  "contract-schema",
  "transport-route",
  "repository-consumer",
  "persistence-adapter",
  "feature-wiring",
  "integration-dependency",
  "manifest-public-seam",
  "authz-enforcement",
  "lifecycle-behavior",
  "audit-event",
  "error-resilience",
  "transaction-consistency",
  "projection-read-model",
  "background-job-handler",
  "observability-event",
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
  "DEV:backend": [
    "backend-source-authority",
    "backend-change-class",
    "backend-owning-feature",
    "backend-exact-write-envelope",
    "backend-layer-responsibilities",
    "backend-cross-feature-seams",
    "backend-authz-tenant-lifecycle",
    "backend-api-contract-boundary",
    "backend-persistence-migration-boundary",
    "backend-scripted-scaffold-posture",
    "backend-artifact-obligations",
    "backend-split-routing",
    "backend-proof-commands",
  ],
  "DEV:frontend": [
    "frontend-architecture-classification",
    "frontend-change-class",
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
  "DEV:vertical-slice": [
    "vertical-inseparable-journey",
    "vertical-backend-seam",
    "vertical-frontend-seam",
    "vertical-api-data-shape",
    "vertical-browser-workflow",
    "vertical-split-pressure",
    "vertical-security-evidence",
    "vertical-permission-rendering",
    "vertical-runtime-data-mock-honesty",
    "vertical-mock-honesty",
    "vertical-artifacts",
    "vertical-proof-commands",
  ],
  "DOC:docs-artifact": [
    "docs-source-truth-reviewed",
    "docs-artifact-class",
    "docs-scriptable-source-inventory",
    "docs-stale-artifact-sweep",
    "docs-status-posture",
    "docs-validation-command",
    "docs-specialized-routing",
  ],
  "TEST:test-only": [
    "test-source-authority",
    "test-change-class",
    "test-traceability",
    "test-proof-layer",
    "test-permission-state-matrix",
    "test-mock-honesty",
    "test-no-behavior-change",
    "test-sensitive-state-coverage",
    "test-focused-command",
    "test-coverage-strength",
    "test-split-boundary",
  ],
  "TEST:test-suite-alignment": [
    "test-alignment-source-authority",
    "test-alignment-source-map",
    "test-alignment-mismatch-class",
    "test-alignment-edit-envelope",
    "test-alignment-no-production-change",
    "test-alignment-split-new-proof",
    "test-alignment-traceability-command",
    "test-alignment-coverage-strength",
    "test-alignment-source-truth-boundary",
  ],
  "DECISION:refactor-first": [
    "refactor-trigger",
    "refactor-type",
    "refactor-target-inventory",
    "refactor-detection-hints",
    "refactor-existing-behavior",
    "refactor-affected-consumers",
    "refactor-compatibility-proof",
    "refactor-downstream-unblocker",
    "refactor-no-product-change",
    "refactor-human-review-boundary",
    "refactor-routing-check",
  ],
  "DECISION:architecture-foundation": [
    "architecture-concern-area",
    "architecture-trigger",
    "architecture-question",
    "architecture-decision-provenance",
    "architecture-adrs-reviewed",
    "architecture-decision-source-inventory",
    "architecture-decision-analysis-checklist",
    "architecture-decision-owner",
    "architecture-output-path",
    "architecture-downstream-block",
    "architecture-compatibility",
    "architecture-final-authority-route",
    "architecture-human-review-boundary",
  ],
  "DOC:standards-compliance": [
    "standards-gate-named",
    "standards-source-path",
    "standards-control-evidence-inventory",
    "standards-posture-recorded",
    "standards-command",
    "standards-coverage-summary",
    "standards-status-artifact",
    "standards-follow-up-routing",
  ],
  "GOV:standards-update": [
    "standards-approved-change-source",
    "standards-update-class",
    "standards-change-owner",
    "standards-rationale",
    "standards-affected-surfaces",
    "standards-invalidation-sweep",
    "standards-enforcement-plan",
    "standards-rollout-compatibility",
    "standards-validation",
  ],
  "GOV:architecture-update": [
    "architecture-approved-decision-source",
    "architecture-update-class",
    "architecture-authority-reviewed",
    "architecture-change-owner",
    "architecture-output-artifact",
    "architecture-consistency-inventory",
    "architecture-downstream-impact",
    "architecture-validation",
  ],
  "DEV:platform-seam": [
    "platform-source-authority",
    "platform-seam-kind",
    "platform-seam-class",
    "platform-seam-owner",
    "platform-seam-source-inventory",
    "platform-not-feature-local",
    "platform-exact-write-envelope",
    "platform-consumer-inventory",
    "platform-compatibility-mode",
    "platform-compatibility-contract",
    "platform-representative-consumer-proof",
    "platform-runtime-restart-impact",
    "platform-rollout-backout",
    "platform-artifact-materialization",
    "platform-expected-output",
    "platform-architecture-boundary",
    "platform-split-routing",
    "platform-proof-commands",
    "platform-human-review-boundary",
  ],
  "DEV:migration-persistence": [
    "migration-source-authority",
    "migration-change-class",
    "migration-live-schema",
    "migration-storage-decision-boundary",
    "migration-source-data-shape",
    "migration-per-row-eligibility",
    "migration-rejected-row-behavior",
    "migration-compatibility-repair",
    "migration-applied-file-safety",
    "migration-index-normalization-uniqueness",
    "migration-security-tenant-proof",
    "migration-read-write-proof",
    "migration-postgres-harness",
  ],
  "GOV:design-system": [
    "design-system-family",
    "design-system-behavior-lock",
    "design-system-seam-class",
    "design-system-consumable-seam",
    "design-system-render-behavior",
    "design-system-visual-proof",
    "design-system-security-evidence",
    "design-system-runtime-data-mock-honesty",
    "design-system-adoption-path",
  ],
  "DOC:api-contract": [
    "api-route-family",
    "api-contract-class",
    "api-contract-source",
    "api-request-response",
    "api-authz-validation",
    "api-compatibility",
    "api-maintained-artifact-inventory",
    "api-maintained-artifacts",
    "api-split-routing",
    "api-validation-command",
  ],
  "DOC:permission-mapping": [
    "permission-authz-model-source",
    "permission-mapping-class",
    "permission-capability-rows",
    "permission-boundary",
    "permission-grant-source-ui",
    "permission-mapping-row-posture",
    "permission-denial-audit",
    "permission-allow-deny",
    "permission-evidence-inventory",
    "permission-grants-migration",
    "permission-split-routing",
    "permission-authz-proof",
  ],
  "DOC:data-dictionary": [
    "data-entity-table",
    "data-source-reviewed",
    "data-field-index-lifecycle",
    "data-durable-facts",
    "data-classification-compliance",
    "data-standards-control-trace",
    "data-enforcement-trace",
    "data-enforcement-evidence",
    "data-test-evidence-trace",
    "data-split-routing",
    "data-compliance-health",
    "data-validation-proof",
  ],
  "EVIDENCE:qa-evidence": [
    "qa-proof-target",
    "qa-command-plan",
    "qa-evidence-class",
    "qa-evidence-source-inventory",
    "qa-evidence-instruments",
    "qa-runtime-evidence",
    "qa-mock-honesty",
    "qa-expected-output",
    "qa-evidence-status",
    "qa-coverage-strength-summary",
    "qa-human-review-boundary",
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
