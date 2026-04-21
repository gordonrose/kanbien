# ADR 0026: Separate Durable Page Settings From Curated Frontend Topology

- Status: Accepted
- Date: 2026-04-20
- Deciders: Kanbien engineering
- Supersedes: N/A
- Superseded by: N/A

## Context

ADR 0024 established that curated frontend topology is the authoritative source
of truth for durable app places and that discovered frontend truth remains
separate from curated hierarchy truth.

That decision is already reflected in the current platform split between:

- `webAppHierarchyBuilder`
  for curated root-family, module, page, locator, and materialization truth
- `webAppSurfaceDiscovery`
  for discovered implementation truth

The first real operator surface at `/root-admin#web-app-hierarchy` has now
proven that the hierarchy route is useful for more than tree editing alone.
The same workspace is expected to grow into the operator home for configuring
durable app surfaces, including:

- what a page is called
- what icon it uses
- which pages appear in its context navigation
- whether it appears in the top navigation
- which page template it uses

If those concerns are absorbed directly into `webAppHierarchyBuilder`, the
feature would stop being primarily about durable place and safe topology
changes. It would become a mixed feature that owns both:

- structural truth about where a page exists and how it is addressed
- presentation and shell-configuration truth attached to that page

That would make later materialization, shell rendering, and settings workflows
harder to reason about and would blur the distinction between:

- topology truth
- settings truth
- observed implementation truth
- preview/apply truth

The platform also needs one explicit exception: modules remain structural
containers in v1, but a module still needs a deterministic landing-page rule
for module-path entry.

## Decision

Adopt this ownership model for governed app-surface administration:

- `webAppHierarchyBuilder` remains authoritative for curated topology truth
- a future sibling feature will own durable page-settings truth keyed to a
  curated page
- the root-admin hierarchy route remains one operator workspace that composes
  those feature families without collapsing them into one backend feature

### Topology Truth Stays In `webAppHierarchyBuilder`

`webAppHierarchyBuilder` continues to own durable structural truth, including:

- root families, modules, and pages
- page identity and placement in the curated tree
- route segments, resolved paths, and active locators
- topology state such as `proposed` versus `applied`
- page movement and orphan posture
- discovery-link and drift comparison records
- deterministic preview/apply materialization rules

This feature remains the authoritative answer to:

- what durable place exists
- where it sits in the app hierarchy
- how it is reached
- whether a structural change is additive, compatibility-sensitive, blocked, or
  invalid

### Page Settings Become A Sibling Truth Layer

A future sibling feature, expected to be modeled as `webAppPageSettings`,
should own durable page-attached configuration such as:

- icon selection
- context-navigation membership
- top-navigation visibility
- page-template selection

This feature is the authoritative answer to:

- how an existing durable page should be presented in governed shell surfaces
- which other pages it intentionally links to through context navigation
- whether it participates in top navigation
- which approved template contract it should use

### Canonical Label Posture

For this phase:

- `displayLabel` remains the canonical page name
- page settings do not introduce separate label overrides by default

If later work requires distinct navigation or title labels, those should be
introduced as additive settings-owned overrides rather than by moving canonical
page naming out of topology truth.

### Context Navigation Modeling Rule

Context navigation is not modeled as one simple enum.

Instead:

- each page may have a manually curated set of context-navigation target pages
- the operator UI should manage that set through a multi-select drawer backed
  by available curated pages
- the default fallback is a self-only context navigation containing one item
  that points back to the page itself

This keeps context navigation as intentional page-to-page configuration rather
than as inferred topology.

### Icon Modeling Rule

Icon selection must use a governed icon catalog:

- page settings store a stable `iconKey`
- if no icon is selected, the system falls back to one approved default icon
- arbitrary uploaded or inline custom icon payloads are out of scope for this
  decision

If the design system needs a dedicated selection surface, later work may add an
icon-grid variant of the approved choice/select family without changing the
durable ownership model here.

### Template Ownership Rule

Long-term template intent belongs with page settings.

Compatibility posture:

- the current `design-system` materialization slice may continue to use
  topology-owned `templateKey` while the platform migrates to the broader
  page-settings model
- future general page-template intent should be represented as settings truth,
  not as core topology identity

### Module Landing Page Rule

Modules remain structural containers in v1.

However:

- a module may declare one landing page for module-path entry
- that landing page must be a direct child page of the module
- landing-page selection remains topology truth in
  `webAppHierarchyBuilder`, not page-settings truth

This rule is structural because it affects how module entry resolves within the
durable page tree.

### Root-Admin Workspace Composition Rule

`/root-admin#web-app-hierarchy` remains one operator workspace route for now.

Inside that route, the operator-facing workspace groupings are:

- `Hierarchy`
- `Page Settings`
- `Observed App`
- `Preview & Apply`

These labels are workspace sections, not backend feature names.

Ownership remains separate:

- `Hierarchy`
  composes topology-owned capabilities from `webAppHierarchyBuilder`
- `Page Settings`
  composes settings-owned capabilities from the future sibling feature
- `Observed App`
  composes discovered truth from `webAppSurfaceDiscovery`
- `Preview & Apply`
  composes materialization and apply-readiness workflows from the governing
  topology or materializer seams

## Consequences

### Positive

- durable place truth stays separate from page presentation truth
- the hierarchy feature can keep owning compatibility-sensitive structural
  rules without absorbing unrelated shell configuration
- the operator workspace can feel unified without forcing a single backend
  feature to own all concerns
- module landing behavior remains explicit and structural
- context navigation and icon rules gain durable ownership without pretending
  they are discovered or inferred topology

### Negative

- the platform will need one more feature seam and one more durable entity set
- some transitional compatibility work will be needed because `templateKey`
  currently exists inside `webAppHierarchyBuilder`
- the root-admin workspace must coordinate multiple backend seams honestly
  instead of relying on one oversized route-specific feature

### Neutral / Follow-up

- later work should define the first `webAppPageSettings` entity model and API
  surface
- later work should decide whether top-navigation ordering needs a dedicated
  durable sort seam beyond a simple visibility flag
- later work should define the approved icon catalog and any required
  design-system icon-picker surface
- later work should define whether the root-admin workspace keeps one route
  with section switching or promotes some sections into dedicated sibling
  routes after the domain boundaries are implemented
