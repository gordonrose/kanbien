# Frontend Architecture Classification Model

## Purpose

Layer 2 Technical Steering owns frontend architecture classification before
Story Breakdown, Task Breakdown, or Delivery split frontend work into tasks.

Layer 4 may package, split, and enforce these decisions. It must not invent
route family, product placement, topology, locator, authority, state,
shell-governance, design-system, materialization, browser-security, or artifact
posture.

## Placement Fields

Use these fields together to describe where frontend work belongs.

| Field | Meaning |
| --- | --- |
| `route_family` | Browser/runtime family such as `design-system`, `root-admin`, `login`, or a new family. |
| `product_module` | Major product or navigation domain, such as `web-app-hierarchy`, `marketing`, or `sales`. |
| `journey_group` | Related workflow group inside a product module, such as `app-surface-configuration` or `email-campaign-management`. |
| `route_visibility` | Whether the surface belongs in primary navigation, context navigation, deep-link-only space, support-only space, hidden/internal space, or no route visibility. |
| `actor_scope` | Primary actor context such as root operator, tenant actor, public pre-auth user, support/operator, or not applicable. |
| `source_placement` | Where implementation code belongs: shell bootstrap, shell route registry, module/journey files, design-system family files, support route files, generated output, or not applicable. |

Frontend shell entry files are coordinators, not module containers.

For `rootAdminShell`, `assets/app.mjs` should own bootstrap, session
coordination, route resolution, shell registry, and shell composition. New page,
module, and journey behavior should move into module/journey files keyed by
`product_module` and `journey_group`, then be mounted by the shell. This keeps
the shell from becoming one large file for every business domain.

Target root-admin shape:

```text
src/frontend/rootAdminShell/assets/
  app.mjs
  shell/
    controller.mjs
    routes.mjs
    session.mjs
    navigation.mjs
  modules/
    webAppHierarchy/
      appSurfaceConfiguration/
        page.mjs
        api.mjs
        state.mjs
    rootUsers/
      directoryManagement/
        page.mjs
        api.mjs
        state.mjs
```

## Runtime And Surface Fields

| Field | Meaning |
| --- | --- |
| `runtime_shape` | How the surface runs or is served: file-routed reference, app shell, support route, generated route, static asset, or browser workflow. |
| `surface_class` | What kind of surface it is: page, journey, canonical, pattern, template, support, app adoption, or generated materialization. |
| `topology_class` | Whether it is durable topology, journey state, UI state, support-only, or not topology. |
| `locator_type` | How it is addressed: path, hash-state, no locator, or locator migration. |
| `canonical_locator` | Canonical URL/path when one exists. Use a concrete `not-applicable:` rationale otherwise. |
| `compatibility_locators` | Legacy or compatibility aliases, especially during path/hash migration. Use a concrete `not-applicable:` rationale otherwise. |

Default topology posture:

- `durable-page` and `durable-subroute` belong in durable topology.
- `journey-state` and `ui-state` stay feature-local or UI-local by default.
- `support-only` may have a route but is not normal product topology.
- existing root-admin hash suite locators are compatibility/migration posture,
  not current canonical route truth.

## Authority And State Fields

| Field | Meaning |
| --- | --- |
| `topology_authority` | Current source of truth for the surface or topology fact. |
| `target_topology_authority` | Desired long-term authority when the current authority is transitional. |
| `authority_transition_posture` | Whether the current authority is already target truth, transitional, requires migration, or blocks implementation. |
| `state_owner` | Owner of relevant state: curated topology, page settings, feature-local state machine, UI-local state, server-backed snapshot, never-serialize, or not applicable. |
| `materialization_model` | How files/routes become real: preview/apply, manual file route, shell registry update, support route only, or none. |

Current root-admin manual shell registries are transitional. Technical Steering
should say so explicitly rather than treating manually declared shell routes as
the long-term authority for governed app pages.

## Governance Fields

| Field | Meaning |
| --- | --- |
| `shell_governance` | Whether a DS-owned shell is required, a local legacy shell is accepted, an exception is approved, or no shell applies. |
| `design_system_prerequisite` | Whether a signed-off seam exists, a DS task is required, an exception is approved, or the surface is not governed. |
| `browser_security_posture` | Required security table for session/cookie, CSP/assets, privileged helpers, CSRF/mutation, URL/replay state, sensitive rendering, and asset delivery. |
| `artifact_obligations` | Required artifact bill for ADRs, frontend overview, topology docs, adoption contracts, visual proof, discovery/hierarchy sync, asset decisions, and related maintained artifacts. |
| `implementation_readiness` | Final Layer 2 verdict: ready or blocked on architecture, design system, security, artifacts, or topology transition. |

Browser security posture and artifact obligations are gates, not suggestions.

## Surface-Class Guardrail Defaults

| Surface Class | Default Guardrail |
| --- | --- |
| `page` | Must have placement, route/topology, actor, shell, DS, security, and artifact posture before implementation. |
| `journey` | Do not promote workflow steps into durable topology unless Layer 2 explicitly approves promotion. |
| `canonical` | Belongs to design-system proof; app adoption still needs a consumable seam, not only a canonical route. |
| `pattern` | Must name owned behavior, accessibility, evidence, and adoption limits before real-app use. |
| `template` | Must state whether it is reference-only or app-consumable and which shell/page slots are owned. |
| `support` | Must not be added to normal product topology or navigation; security/download/helper posture is primary. |
| `app-adoption` | Must consume signed-off DS render/controller/accessibility/style seams or record a bounded approved exception. |
| `generated-materialization` | Must use the owning preview/apply or materialization seam instead of hand-editing generated output. |

## Layer Responsibilities

- Layer 2 decides the classification and blocks unresolved architecture,
  security, DS, artifact, or authority-transition gaps.
- Layer 3 preserves the approved decisions in story handoff snapshots.
- Layer 4 reconciles tasks against those decisions and blocks delivery when a
  queued task would need to invent architecture.
- Layer 5 implements within the approved write envelope and reports the proof
  and artifact evidence.
