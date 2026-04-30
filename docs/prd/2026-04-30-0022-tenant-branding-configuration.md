# Tenant Branding Configuration Specification

## Implementation Status

- Status:
  planned first slice as of 2026-04-30
- Implemented already in related foundations:
  - object-storage-backed `assets` foundation
  - approved tenant branding logo asset consumer decision record
  - root-admin path-backed suite migration posture
  - governed design-system form, upload, image-card, list-page, page-shell,
    drawer, and context-nav primitives
- Not yet implemented in this slice:
  - `tenantBranding` feature bundle
  - durable tenant branding persistence
  - root-admin tenant branding routes
  - tenant-dashboard branding projection routes
  - root-admin branding app surface
  - tenant dashboard branding consumption
  - API contracts, data dictionary, permission mapping, implementation
    blueprint, and PRD-derived test cases

## Purpose

Root admins need a governed way to configure a tenant-owned logo, branding
display name, and primary colour so tenant users see the approved branding in
the tenant dashboard after login or page reload.

This slice establishes tenant branding as a narrow, root-managed feature that:

- owns durable branding facts separately from the canonical tenant record
- links a current tenant logo through the approved `assets` feature seams
- projects safe branding values to one current tenant dashboard context
- preserves private same-origin logo delivery in v1
- keeps broad portal theming, tenant-admin self-service, public logo delivery,
  and live update promises out of scope

## Scope

This phase includes:

- a new narrow `tenantBranding` feature boundary
- durable tenant branding record for one tenant
- durable branding display name and primary colour facts
- a current logo relationship to a ready asset
- contextual logo alt text or explicit decorative posture
- root-admin read and save behavior for exactly one selected tenant
- root-admin logo upload, replacement, readiness, and relationship behavior
- tenant-dashboard branding projection for exactly one current tenant context
- explicit fallback behavior for missing, partial, invalid, not-ready, or
  denied branding states
- audit events for successful, denied, failed, and cleanup-sensitive branding
  and logo operations
- lifecycle and cleanup posture for expired, abandoned, rejected, orphaned, and
  failed-cleanup logo states
- design-system-owned composition/adoption for the root-admin branding form
  and tenant-dashboard branding consumption

This phase does **not** include:

- tenant-admin branding self-service
- public logo delivery or public CDN delivery
- generic asset library or file-hosting behavior
- live updates to already-open dashboards
- broad tenant portal theming beyond the dashboard shell
- marketing-site or public-site branding
- multilingual branding or locale-specific logo alt variants
- logo clear/remove in v1
- changing the approved tenant-logo MIME, SVG, scanning, checksum, or storage
  assumptions without a new asset decision

## Core Concepts

### Tenant branding

Tenant branding is a durable child configuration owned by the tenant branding
feature. It stores presentation facts for one tenant:

- branding display name
- primary colour
- current logo relationship
- fallback posture
- audit and lifecycle timestamps

Branding display name is not the canonical tenant name. The canonical tenant
name may be used as a fallback display value when branding display name is
missing, but saving branding must not mutate canonical tenant identity.

### Logo relationship

Tenant branding owns the relationship between a tenant and its current logo.
The reusable `assets` feature owns uploaded file lifecycle, storage policy,
MIME and byte verification, SVG sanitizer readiness, and content delivery
invariants.

The logo relationship becomes consumer-ready only when:

- the asset exists and is ready
- tenant branding has authorized the relationship for the selected tenant
- the asset tenant scope matches the tenant branding owner
- lifecycle state allows consumption
- contextual alt text or decorative posture is recorded

### Dashboard projection

The tenant dashboard consumes a projection, not raw branding persistence. The
projection returns safe display facts for the authenticated current tenant:

- display name
- primary colour
- logo URL or null
- logo accessibility posture
- fallback indicators
- timing metadata showing that v1 applies changes on next login or reload

The tenant dashboard must authorize tenant branding access before requesting
asset content. Asset ownership alone is not sufficient authority.

## Decisions

| Decision | Position | Rationale |
| --- | --- | --- |
| Feature boundary | Create a new narrow `tenantBranding` feature bundle. | Branding owns durable logo/name/colour relationship and projection behavior without overloading tenants or tenant configuration. |
| Branding display name | Store separately from canonical tenant name. | Product discovery explicitly separated branding from canonical tenant identity. |
| Primary colour | Accept approved hex values and consume through design-system colour behavior. | Avoids app-page CSS and one-off theme logic. |
| Logo clear | Replacement-only in v1. | Clear/remove needs explicit retention, audit, fallback, and UX behavior; defer until separately approved. |
| Logo accessibility | Root admin must provide explicit alt text or mark the logo decorative per relationship. | Accessibility metadata is contextual to tenant branding and cannot be assumed from the asset alone. |
| Dashboard surface | Dashboard shell only in v1. | Prevents accidental broad tenant portal theming. |
| Apply timing | Next login or dashboard reload. | Avoids live update infrastructure and matches product discovery. |
| Fallback display name | Use canonical tenant name when branding display name is missing. | Safe durable fallback without mutating tenant identity. |
| Fallback primary colour | Use platform default primary colour when missing or invalid. | Keeps rendering predictable. |
| Fallback logo | Return no logo for missing, not-ready, metadata-incomplete, or cross-tenant-denied logo states. | Avoids unsafe or invented logo display. |
| Logo delivery | Same-origin authenticated streaming only. | Public delivery and raw bucket URLs are not approved in v1. |
| Pending or failed-cleanup quota | Pending and failed-cleanup records continue to count until cleanup succeeds or a later retention policy says otherwise. | Keeps abuse and cost accounting conservative. |

## Functional Requirements

### Root-Admin Branding Read

- Root-admin read returns exactly one selected tenant branding record or the
  approved absence state.
- Normal reads exclude soft-deleted branding records.
- The read response includes durable branding values, current logo relationship
  summary, logo consumer-readiness status, fallback indicators, audit-safe
  timestamps, and validation metadata.

### Root-Admin Branding Save

- Save requires root authorization and exactly one selected tenant.
- Save rejects client-supplied system-managed fields.
- Save rejects empty display names rather than converting them to null.
- Save accepts only approved hex primary colour values.
- Successful save persists durable branding display name and primary colour,
  refreshes `updatedAt`, and records audit evidence.
- Save must not overwrite the canonical tenant name.

### Logo Upload And Replacement

- Logo upload and replacement use short-lived, single-use, actor-bound,
  scope-bound, storage-key-bound upload intents.
- Allowed MIME types and sizes remain:
  - `image/png`, `image/jpeg`, and `image/webp` up to 5 MB
  - `image/svg+xml` up to 1 MB
- Uploaded SVG must pass sanitizer readiness before display and must never be
  injected directly into the DOM.
- Replacement creates a new asset or version with a new storage key.
- Prior logo bytes remain governed by approved retention, cleanup, quota, and
  audit behavior.
- Logo clearing is out of scope for v1.

### Tenant Dashboard Projection

- Projection evaluates exactly one current tenant context.
- Projection denies reads when the current tenant does not match the branding
  owner and asset tenant.
- Projection returns display name, primary colour, logo URL or null,
  accessibility posture, fallback indicators, and reload/login timing metadata.
- Branding changes are visible after next login or dashboard reload.
- V1 does not promise live update to already-open dashboards.

### Authorization, Audit, And Lifecycle

- Permission mapping must define:
  - root-admin tenant branding read
  - root-admin tenant branding manage
  - tenant dashboard branding read
  - required asset capabilities
  - cross-tenant deny rules
- Audit evidence covers:
  - branding create and update
  - read deny
  - logo intent creation
  - upload completion
  - mismatch or failure
  - link or replacement
  - delete if later approved
  - cleanup failure
  - quota denial
  - cross-tenant denial
- Expired, abandoned, rejected, orphaned, and failed-cleanup logo states must
  have ownership, retry, quota, cost, and operational visibility semantics.

## Design-System Requirements

The v1 UX should compose existing governed primitives where possible:

- `form-template` for branding display name, primary colour, and accessibility
  metadata controls
- `upload-file` and `form-image-card` for logo upload, status, preview, and
  rejected/not-ready states
- `choice-group` or `simple-select` for alt text versus decorative posture
- `drawer-form`, `list-page`, `page-shell`, and `context-nav` as host framing
  when appropriate

This slice should create a narrow tenant-branding composition/adoption
artifact. It should add new primitives only if the composition audit proves a
real gap.

App-page CSS, copied governed markup, and duplicated controller behavior are
not allowed unless an explicit exception is approved.

## Required Downstream Artifacts

Before Task Breakdown can hand delivery stories to Layer 5, create or refresh:

- capability matrix
- API contract docs
- maintained OpenAPI/Postman artifacts
- data dictionary entries
- permission mappings
- asset alignment note
- design-system behavior/reference/verification/adoption artifacts
- runbook/privacy note for cleanup and forbidden logged fields
- implementation blueprint
- PRD-derived test cases
- feature manifests and generated dependency graph if public seams change

## Acceptance And Verification

The first delivery plan must prove:

- root-admin allow and deny behavior
- exact selected tenant handling
- current tenant dashboard read and cross-tenant deny
- display-name and primary-colour validation
- system-managed field rejection
- durable persistence and `updatedAt` refresh
- logo upload-intent binding and limits
- SVG sanitizer readiness posture
- logo relationship readiness and accessibility metadata
- same-origin logo content read with `nosniff`
- fallback projection states
- audit events and forbidden-field privacy posture
- cleanup/quota retry semantics
- governed design-system adoption without app-page CSS or copied behavior

