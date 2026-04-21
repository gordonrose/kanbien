# Architecture Decision Records

ADRs capture architectural decisions that should remain visible as the system
evolves.

## Rules

- Create a new ADR instead of rewriting history.
- Mark older ADRs as superseded when a later ADR replaces them.
- Keep ADRs focused on one decision each.
- Link ADRs from related docs when they materially shape the platform.

## Index

- `0001-use-architecture-decision-records.md`
- `0002-use-feature-bundle-architecture.md`
- `0003-use-explicit-feature-registration-at-the-platform-router.md`
- `0004-use-feature-scoped-sql-migrations-with-shared-runner.md`
- `0005-standardize-json-error-handling-contracts.md`
- `0006-standardize-feature-internal-module-conventions.md`
- `0007-standardize-cross-feature-api-and-entity-behavior-defaults.md`
- `0008-standardize-searchable-field-storage-and-query-rules.md`
- `0009-separate-authentication-from-business-features.md`
- `0010-use-shared-platform-security-middleware.md`
- `0011-adopt-prd-driven-traceable-test-coverage.md`
- `0012-use-run-scoped-manifest-based-cleanup-for-persistent-test-data.md`
- `0013-add-a-same-origin-root-admin-browser-auth-shell.md`
- `0014-use-a-local-ssh-signing-helper-for-root-user-browser-auth.md`
- `0015-version-prd-test-case-lifecycle-to-reduce-drift.md`
- `0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`
- `0017-add-a-shared-one-time-token-library-for-feature-owned-verification-flows.md`
- `0018-add-a-notification-delivery-feature-with-provider-agnostic-email-delivery-and-durable-attempt-history.md`
- `0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md`
- `0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md`
- `0021-add-a-versioned-entity-definition-foundation-with-derived-export-seams.md`
- `0022-add-a-web-app-surface-discovery-foundation-with-explicit-provider-seams-and-reconcile-links.md`
- `0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md`
- `0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md`
- `0025-adopt-a-security-first-page-state-replay-model.md`
- `0026-separate-durable-page-settings-from-curated-frontend-topology.md`
- `0027-use-approved-design-system-shared-asset-entrypoints-for-governed-app-page-adoption.md`
- `0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md`
- `0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md`
