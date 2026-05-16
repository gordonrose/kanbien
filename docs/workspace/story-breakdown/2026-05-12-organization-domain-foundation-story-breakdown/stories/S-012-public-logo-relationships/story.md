# Story Breakdown Story: Manage Public Logo Relationships

## Story Detail

- Story ID:
  `S-012`
- Title:
  Manage public logo relationships
- Context:
  This is needed because public logos touch uploaded files, public delivery, replacement, and export inclusion.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:vertical-slice`
- Job To Be Done:
  As an admin, I need to manage the primary organization logo that public places can display safely.
- Actor / System Perspective:
  admin and public reader
- Outcome:
  Logo relationships use approved assets, app-controlled URLs, replacement safety, removal placeholders, and export inclusion.
- Non-goals:
  No generic asset library and no raw bucket URL exposure.

## Story Narrative

**Situation**
Organizations need real logo images that can appear publicly after they are
accepted as safe and usable.

**Goal**
Admins can upload, replace, remove, and export the primary logo while public
places show approved image URLs or deterministic initials placeholders.

**Decisions Needed**
No new product choice is expected, but this story remains blocked until public
logo technical signoff is complete.

**Work That Follows**
Source work can create logo relationships, asset integration, replacement
behavior, public delivery behavior, alt text defaults, and export inclusion.

**Evidence Of Success**
Reviewers can prove old images remain active until replacement is ready, raw
storage links are never exposed, removed logos fall back to initials, and
Organization authority still controls the relationship.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Data dictionary | actual | `docs/data-dictionary/organization-logo-relationship.md` | Defines logo relationship fields, lifecycle, public read, export read, and cleanup posture. |
| Public logo technical signoff | actual | `docs/workspace/asset-consumer-decisions/2026-05-15-organization-public-logo-technical-signoff.md` | Must be carried into tasks before implementation. |
| Permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Defines Organization relationship authorization before asset access. |
| Source task breakdown | actual | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-012-public-logo-relationships/task-breakdown.md` | Carries v1 primary logo implementation and proof obligations. |
| Backend source | actual | `src/features/organizationBrandingReferences` | Implements v1 primary logo relationship management and public delivery foundation. |
| Feature documentation | actual | `docs/features/organization-public-logo.md` | Records implemented backend posture, authority, and proof commands. |
