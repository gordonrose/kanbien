# Recoverability And Build-From-Spec Coverage

## Purpose

Track the documentation layers required for the repo to be buildable from
filled-in specs, templates, and change-loop artifacts rather than from existing
source code alone.

## Recovery Gap Coverage Map

| Gap | Primary Home | Current Coverage |
|---|---|---|
| Platform seam specs | `docs/architecture/guides/platform-seams-and-bootstrapping.md` | Added |
| Feature seam contracts | `docs/architecture/guides/feature-seams-and-public-contracts.md` | Added |
| API contract manifests/templates | `docs/templates/api-contract-template.md` | Added |
| Permission model spec | `docs/architecture/guides/auth-and-authorization-guide.md` plus permission mappings and dedicated PRD/ADR | Partial: current root boundary added; future tenant model still architectural |
| Persistence model specs | `docs/architecture/guides/persistence-and-migrations-guide.md` | Added |
| Frontend implementation spec | `docs/architecture/guides/frontend-implementation-guide.md` | Added |
| Test harness and verification model | `docs/architecture/guides/testing-and-verification-guide.md` | Added |
| Verification matrix rules | `docs/standards/change-artifact-requirements.md` and templates | Added |
| Documentation update rules | `docs/standards/change-artifact-requirements.md` | Added |
| Standards mapping rules | `docs/standards/change-artifact-requirements.md` | Added |

## What Still Needs Enduring Decisions

The repo still needs future design work for:

- whether API contracts should remain Markdown-first or gain a machine-readable
  manifest layer
- whether implementation blueprints should become mandatory for full vertical
  slices

These should be handled through normal change-loop discipline rather than being
assumed implicitly by the guides.
