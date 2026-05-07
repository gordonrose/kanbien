# Story Breakdown Story: Root-admin governed branding screen

## Story Detail

- Story ID:
  `S-007`
- Title:
  Root-admin governed branding screen
- Context:
  This is its own story because root admins need one clear place to manage branding and understand validation or preview results.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:frontend`
- Job To Be Done:
  As a root admin, I need a governed root-admin surface for branding values, logo status, accessibility metadata, validation, and preview.
- Actor / System Perspective:
  root admin
- Outcome:
  Root-admin users can manage branding through signed-off design-system seams.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-002, S-003, S-004, and S-006 delivery order

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because root admins need one clear place to manage branding and understand validation or preview results.

**Goal**
Reviewers can understand what should be true afterward: Root-admin users can manage branding through signed-off design-system seams.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Root-admin governed branding screen into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S007-01 | S-007 | The root-admin branding screen consumes signed-off design-system render, controller, style, and accessibility seams for form layout, upload status, colour preview, validation, and fallback messaging. | rendered-browser | browser visual; accessibility; governed adoption | design-system adoption artifact; frontend test-case plan |
| AC-S007-02 | S-007 | The root-admin screen supports root-admin read, partial value edits that preserve untouched values, invalid colour feedback, empty display-name rejection, logo pending, ready, rejected, replacement, and consumer-not-ready states. | rendered-browser | browser interaction; validation; state matrix | PRD; capability matrix; frontend scenarios |
| AC-S007-03 | S-007 | The root-admin screen does not add app-page CSS, reconstruct governed markup, or duplicate governed controller behavior unless an explicit exception is recorded. | source-level | governed adoption review; source inspection | design-system adoption artifact |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-007 | AC-S007-01 | root-admin.tenant-branding.manage | governed frontend | create-or-refresh-required | App screen depends on design-system seams. |
| S-007 | AC-S007-02 | root-admin.tenant-branding.read; root-admin.tenant-branding.manage; root-admin.tenant-branding.logo.update | governed frontend | create-or-refresh-required | UI state matrix must map to backend rows. |
| S-007 | AC-S007-03 | Governed frontend adoption compliance | governed frontend | create-or-refresh-required | Compliance criterion is standards-backed. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-015 | S-007 / AC-S007-01 | root-admin path-backed topology | frontend-topology-route | existing or new | Frontend topology decision names canonical route and avoids new hash destination. | Browser route tests cover canonical path and compatibility if alias exists. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-007 | root admin | root-admin branding read/manage/logo update | selected tenant; form loaded; validation failure; save success | active branding; partial values; pending logo; rejected logo; consumer-not-ready logo | display name; hex colour; upload metadata; alt/decorative control | load; edit; save; replace logo; show fallback | API validation failure; upload failure; authz denial; projection stale until reload | accessibility; rendered-browser; governed adoption; mobile and RTL |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S007-01 | root admin; selected tenant; form loaded; validation failure; save success; active branding; partial values; pending logo; rejected logo; consumer-not-ready logo | root-admin.tenant-branding.manage | rendered-browser | TC obligation: cover browser visual; accessibility; governed adoption for The root-admin branding screen consumes signed-off design-system render, controller, style, and accessibility seams for form layout, upload status, colour preview, validation, and fallback messaging. | yes |
| AC-S007-02 | root admin; selected tenant; form loaded; validation failure; save success; active branding; partial values; pending logo; rejected logo; consumer-not-ready logo | root-admin.tenant-branding.read; root-admin.tenant-branding.manage; root-admin.tenant-branding.logo.update | rendered-browser | TC obligation: cover browser interaction; validation; state matrix for The root-admin screen supports root-admin read, partial value edits that preserve untouched values, invalid colour feedback, empty display-name rejection, logo pending, ready, rejected, replacement, and consumer-not-ready states. | yes |
| AC-S007-03 | root admin; selected tenant; form loaded; validation failure; save success; active branding; partial values; pending logo; rejected logo; consumer-not-ready logo | Governed frontend adoption compliance | source-level | TC obligation: cover governed adoption review; source inspection for The root-admin screen does not add app-page CSS, reconstruct governed markup, or duplicate governed controller behavior unless an explicit exception is recorded. | yes |
