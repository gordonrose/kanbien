# Story Breakdown Story: Define Shared Admin Screen Behavior

## Story Detail

- Story ID:
  `S-016`
- Title:
  Define shared admin screen behavior
- Context:
  This is needed because Organization screens should use approved shared behavior before real pages are built.
- Value Type:
  `harness-value`
- Delivery Shape:
  `GOV:design-system`
- Job To Be Done:
  As the screen standards owner, I need approved shared screen references for Organization management.
- Actor / System Perspective:
  screen standards owner
- Outcome:
  Shared references cover lists, details, search, branch choices, logo management, export status, and attention badges.
- Non-goals:
  No real app page implementation and no page-local styling.

## Story Narrative

**Situation**
Admins need management areas for organizations, legal profiles, locations,
opening hours, units, memberships, reference values, logos, search, and
exports. Those screens should not invent one-off behavior.

**Goal**
Shared screen references should define how the admin experience behaves before
real app pages consume it.

**Decisions Needed**
The screen work must settle lists, detail editing, grouped search, branch
archive or move-child choices, logo management, export status, async attention
badges, and accessibility behavior.

**Work That Follows**
Root-admin and tenant-admin pages can adopt the approved shared behavior.

**Evidence Of Success**
Reviewers can inspect approved shared screen references before app pages are
built.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Shared screen behavior lock | placeholder | `placeholder: shared Organization admin screen behavior lock` | Must define shared list, detail, search, logo, export, and attention behavior before app pages. |
| Rendered references | placeholder | `placeholder: design-system rendered references for Organization admin screens` | Required before governed app UI adoption. |
| Story packet blocker | actual | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/epic.md` | `U-ORG-S016` records design-system governance as deferred with owner. |
| Frontend governance source | actual | `AGENTS.md Design-System Signoff Before App UI` | Repo rule blocks governed app UI before design-system signoff. |
