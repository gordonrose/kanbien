# Design System Canonicals API Contract

## Scope

- Contract name: `design-system-canonicals`
- Feature: `designSystemCanonicals`
- Route family or capability group:
  protected canonical-governance routes plus public generated canonical
  projection routes
- In-scope routes:
  - `POST /v1/design-system-canonicals/families`
  - `GET /v1/design-system-canonicals/families/{canonicalFamilyId}`
  - `PUT /v1/design-system-canonicals/families/{canonicalFamilyId}`
  - `POST /v1/design-system-canonicals/families/{canonicalFamilyId}/references`
  - `GET /v1/design-system-canonicals/references/{canonicalReferenceId}`
  - `PUT /v1/design-system-canonicals/references/{canonicalReferenceId}`
  - `GET /v1/design-system-canonicals/public/families`
  - `GET /v1/design-system-canonicals/public/families/{familyKey}/launcher`
  - `GET /v1/design-system-canonicals/public/families/{familyKey}/references/{referenceId}`

## Capability

- Feature: `designSystemCanonicals`
- Capability:
  manage durable design-system canonical family and reference truth, then expose
  lifecycle-gated public launcher and render projections for generated
  canonical-review routes

## Authentication

- Protected governance routes:
  authenticated root-user session is required through the shared root authz
  capability middleware.
- Public projection routes:
  no authenticated browser session is required.
- Session transport for protected routes:
  - `Authorization: Bearer <sessionId>`
  - same-origin root-admin browser session cookie where shared middleware has
    populated root session context before capability evaluation

## Authorization

- Protected family governance:
  `design-system-canonicals.family.manage`
- Protected reference governance:
  `design-system-canonicals.reference.manage`
- Public projections:
  no root capability is required, but public results are lifecycle-gated to
  `live` families and references.

## Middleware And Platform Effects

- Protected route capability failures use the shared root authorization
  middleware and create shared platform security audit events for denied
  attempts.
- Public projection routes are mounted under the v1 router without root-session
  middleware.
- Current v1 mounting does not wrap this route family in the shared
  public-read or authenticated-general rate-limit middleware.

## Request Contract

- Params:
  - `canonicalFamilyId` is required where present and must be an exact UUID
  - `canonicalReferenceId` is required where present and must be an exact UUID
  - `familyKey` is required where present, trimmed, and normalized lowercase
  - `referenceId` is required where present and must be non-empty
- Create family body:
  `{ familyKey, displayLabel, familyKind, launcherTitle, launcherDescription, launcherCategory?, generatedLauncherRoutePath, generatedRootRoutePath, legacyLauncherRoutePath?, sourceSurfaceRoutePath?, status?, sortOrder?, featured? }`
- Update family body:
  at least one mutable family field from the create body except `familyKey`
- Create reference body:
  `{ referenceId, displayLabel, description, renderRoutePath, legacyRenderRoutePath?, viewport?, width?, height?, theme?, direction?, zoom?, localeFixture?, labelDensityFixture?, stateVariantKey?, specimenPayload?, status?, sortOrder?, featured? }`
- Update reference body:
  at least one mutable reference field from the create body except
  `referenceId`
- Validation rules:
  - request bodies and params are strict; unexpected fields are rejected
  - lifecycle status is one of `draft`, `review`, `live`, or `inactive`
  - family kind is one of `component`, `pattern`, or `template`
  - `sortOrder` must be a non-negative integer
  - `zoom` must be an integer from `-100` through `100`
  - `width` and `height`, when supplied, must be positive integers
  - clients must not supply identifiers or timestamps

## Response Contract

- Canonical family response:
  `{ canonicalFamilyId, familyKey, displayLabel, familyKind, launcherTitle, launcherDescription, launcherCategory, launcherTemplateKey, renderTemplateKey, generatedLauncherRoutePath, generatedRootRoutePath, legacyLauncherRoutePath, sourceSurfaceRoutePath, status, sortOrder, featured, createdAt, updatedAt }`
- Canonical reference response:
  `{ canonicalReferenceId, canonicalFamilyId, familyKey, referenceId, displayLabel, description, renderRoutePath, legacyRenderRoutePath, viewport, width, height, theme, direction, zoom, localeFixture, labelDensityFixture, stateVariantKey, specimenPayload, status, sortOrder, featured, createdAt, updatedAt }`
- Public family list response:
  `{ items }`
- Public launcher response:
  `{ family, references }`
- Public rendering response:
  `{ family, reference }`
- Status codes:
  - `201` for successful protected creates
  - `200` for successful reads and updates

## Error Contract

- Feature-local error codes:
  - `INVALID_REQUEST`
  - `CANONICAL_FAMILY_NOT_FOUND`
  - `CANONICAL_REFERENCE_NOT_FOUND`
  - `CANONICAL_FAMILY_CONFLICT`
  - `CANONICAL_REFERENCE_CONFLICT`
- Shared middleware errors:
  - `UNAUTHORIZED`
  - `INVALID_SESSION`
  - `FORBIDDEN`
  - `RATE_LIMITED`

## Persistence / Side Effects

- Durable writes:
  - family create/update mutates `design_system_canonical_families`
  - reference create/update mutates `design_system_canonical_references`
  - public reads do not mutate registry truth
- System-managed fields:
  - ids are generated by the service
  - timestamps are generated and refreshed by persistence
- Uniqueness:
  - normalized family keys are unique
  - generated family launcher and root route paths are unique
  - normalized reference ids are unique within one family
  - generated reference render route paths are unique

## Approved Cross-Feature Reads

- `webAppHierarchyBuilder` consumes the public `designSystemCanonicals` seam to
  list live canonical hierarchy nodes for
  `POST /v1/web-app-hierarchy/design-system/canonical-renderings/sync`.
- `webAppPageSettings` does not read canonical registry persistence. It only
  validates the `canonical-rendering` template key through its own catalog.
- Public frontend generated routes consume public projection APIs and render
  deterministic family/ref states.

## Compatibility / Lifecycle Notes

- Generated canonical routes are additive alongside legacy
  `/design-system/canonicals/*` routes.
- Legacy `/design-system/canonicals/*` routes are compatibility-only launcher
  and parity-review surfaces. New generated canonical families should publish
  through `/design-system/canonical-renderings`, not through the legacy
  launcher tree.
- Public projections expose only `live` families and references.
- Generated render paths are exact family/ref paths; query params are not
  canonical state authority.
- Template intent is fixed:
  - family launcher routes use `launcher`
  - reference render routes use `canonical-rendering`
- Family-by-family promotion remains a separate design-system signoff decision;
  a live registry row does not by itself mean the family is `system-ready`.
