# Story Breakdown Story: Tenant dashboard governed branding consumption

## Story Detail

- Story ID:
  `S-008`
- Title:
  Tenant dashboard governed branding consumption
- Context:
  This is its own story because the customer-facing dashboard is where branding value becomes visible to tenant users.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:frontend`
- Job To Be Done:
  As a tenant user, I need the tenant dashboard shell to apply branding from the authenticated projection after login or reload with explicit fallback states.
- Actor / System Perspective:
  tenant user
- Outcome:
  Tenant users see configured branding or approved fallback using signed-off dashboard seams.
- Non-goals:
  not-applicable: inherits epic non-goals and story queue dependency boundary
- Blocks / Depends On:
  Depends on S-002, S-005, and S-006 delivery order

Story titles and context must be readable by non-engineering stakeholders.

- `Title` is the recognizable user, business, or planning moment.
- `Context` explains why this story is meaningful on its own in everyday product or business language.
- For planning or control stories, explain the planning purpose directly, such as breaking the epic into capabilities or helping plan implementation more accurately.
- Avoid vague planning shorthand such as promises or visual work.

## Story Narrative

**Situation**
This is its own story because the customer-facing dashboard is where branding value becomes visible to tenant users.

**Goal**
Reviewers can understand what should be true afterward: Tenant users see configured branding or approved fallback using signed-off dashboard seams.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Tenant dashboard governed branding consumption into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S008-01 | S-008 | Tenant dashboard shell consumes the approved projection and signed-off design-system seams to render configured display name, primary colour, ready logo, and accessibility posture after login or reload. | rendered-browser | browser visual; accessibility; projection integration | frontend scenarios; design-system adoption artifact |
| AC-S008-02 | S-008 | Tenant dashboard shell renders approved fallback states for missing branding, partial branding, invalid or not-ready logo, missing accessibility metadata, and cross-tenant-denied logo access. | rendered-browser | browser state matrix; accessibility; authz deny | frontend scenarios; PRD fallback table |
| AC-S008-03 | S-008 | Dashboard branding rendering does not infer asset authority from asset ownership alone and uses tenant branding authorization before asset content is requested. | mixed | authz integration; browser/API integration | permission mapping; API contract; capability matrix |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-008 | AC-S008-01 | tenant-branding.dashboard.read; tenant-branding.logo.read | tenant dashboard frontend | create-or-refresh-required | Browser proof must consume projection. |
| S-008 | AC-S008-02 | tenant-branding.dashboard.read; tenant-branding.fallback.read | tenant dashboard frontend | create-or-refresh-required | Fallback states need explicit coverage. |
| S-008 | AC-S008-03 | tenant-branding.dashboard.read; asset.content.read | cross-feature authz | create-or-refresh-required | Authorization order must be explicit. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-016 | S-008 / AC-S008-01 | tenant dashboard shell route and projection consumer | frontend-topology-route | existing or changed | Frontend contract names dashboard surface scope. | Browser integration tests cover login or reload consumption. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-008 | tenant user | tenant dashboard branding read; logo read | current tenant; reload; next login; already-open dashboard | complete branding; partial branding; absent branding; denied logo; not-ready logo | display name rendering; primary colour token; logo URL/null; alt/decorative posture | login; reload; no live update while open | projection failure; asset content read denial; stale cache | accessibility; rendered-browser; privacy; compatibility |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S008-01 | tenant user; current tenant; reload; next login; already-open dashboard; complete branding; partial branding; absent branding; denied logo; not-ready logo | tenant-branding.dashboard.read; tenant-branding.logo.read | rendered-browser | TC obligation: cover browser visual; accessibility; projection integration for Tenant dashboard shell consumes the approved projection and signed-off design-system seams to render configured display name, primary colour, ready logo, and accessibility posture after login or reload. | yes |
| AC-S008-02 | tenant user; current tenant; reload; next login; already-open dashboard; complete branding; partial branding; absent branding; denied logo; not-ready logo | tenant-branding.dashboard.read; tenant-branding.fallback.read | rendered-browser | TC obligation: cover browser state matrix; accessibility; authz deny for Tenant dashboard shell renders approved fallback states for missing branding, partial branding, invalid or not-ready logo, missing accessibility metadata, and cross-tenant-denied logo access. | yes |
| AC-S008-03 | tenant user; current tenant; reload; next login; already-open dashboard; complete branding; partial branding; absent branding; denied logo; not-ready logo | tenant-branding.dashboard.read; asset.content.read | mixed | TC obligation: cover authz integration; browser/API integration for Dashboard branding rendering does not infer asset authority from asset ownership alone and uses tenant branding authorization before asset content is requested. | yes |
