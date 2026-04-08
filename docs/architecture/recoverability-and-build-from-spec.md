# Recoverability And Build-From-Spec Coverage

## Purpose

Track the documentation layers required for the repo to be buildable from
filled-in specs, templates, and change-loop artifacts rather than from existing
source code alone.

The target is reliable reconstruction of business behavior, NFRs, architecture
constraints, and compliance expectations, not byte-for-byte reproduction of the
original source tree.

## Recovery Gap Coverage Map

| Gap | Primary Home | Current Coverage |
|---|---|---|
| Platform seam specs | `docs/architecture/guides/platform-seams-and-bootstrapping.md` | Added |
| Runnable bootstrap and helper specs | `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md` | Added |
| Feature seam contracts | `docs/architecture/guides/feature-seams-and-public-contracts.md` | Added |
| API contract manifests/templates | `docs/templates/api-contract-template.md` | Added |
| Permission model spec | `docs/architecture/guides/auth-and-authorization-guide.md` plus permission mappings and dedicated PRD/ADR | Partial: current root capability boundary and root-operated tenant lifecycle are documented; tenant-scoped membership and object authorization remain architectural |
| Persistence model specs | `docs/architecture/guides/persistence-and-migrations-guide.md` | Added |
| Frontend implementation spec | `docs/architecture/guides/frontend-implementation-guide.md` | Added |
| Test harness and verification model | `docs/architecture/guides/testing-and-verification-guide.md` | Added |
| Test harness internals | `docs/architecture/guides/test-harness-and-fixture-internals-guide.md` | Added |
| Script and helper behavior specs | `docs/architecture/guides/script-and-helper-behavior-guide.md` | Added |
| Verification matrix rules | `docs/standards/change-artifact-requirements.md` and templates | Added |
| Documentation update rules | `docs/standards/change-artifact-requirements.md` | Added |
| Standards mapping rules | `docs/standards/change-artifact-requirements.md` | Added |
| Interchangeable tool and provider questionnaire | `docs/architecture/build-from-spec-reconstruction-questionnaire.md` | Added |

## What Still Needs Enduring Decisions

The repo still needs future design work for:

- whether API contracts should remain Markdown-first or gain a machine-readable
  manifest layer
- whether implementation blueprints should become mandatory for full vertical
  slices

These should be handled through normal change-loop discipline rather than being
assumed implicitly by the guides.
