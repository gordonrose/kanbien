# ADR-0048: Separate Design-System Contracts From System Implementations

- Status: Accepted
- Date: 2026-05-24
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

The design-system governance loop needs to support multiple design systems
that share the same token, primitive, pattern, and component names and
contracts while allowing different visual appearance.

The first Layer 2 token proof mixed default-system token implementation files
into the shared `/design-system/assets` space. That made the default design
system look like shared design-system infrastructure and would make future
systems inherit or copy the wrong files.

The repository already treats governed design-system seams as durable adoption
boundaries. App pages must consume signed-off design-system seams rather than
copying CSS, markup, or controller behavior.

## Decision

Separate design-system contracts from design-system implementations.

The frontend design-system source tree uses these boundaries:

- `src/frontend/designSystem/layers/` stores governed runtime seams by harness
  layer. Later governed layers consume earlier layers through this numbered
  source tree, such as `layers/02-token/` and `layers/03-primitive/`.
  Executable contract modules live beside the numbered layer seam that owns
  them, such as `layers/02-token/<token-key>/contract.mjs`.
- `src/frontend/designSystem/shared/` stores reusable renderer, shell,
  validation, and explorer infrastructure that is not owned by any one design
  system.
- `src/frontend/designSystem/systems/<system-key>/` stores each design
  system's implementation namespace: assets, manifest, proof modules, rendered
  review routes, and system-specific visual support.
- `src/frontend/designSystem/registry/` stores the known design systems and
  their contract-to-implementation lookup.

Routes for switchable design-system review surfaces include the system key:

- `/design-system/<system-key>/` when the registered system provides
  `systems/<system-key>/index.html`
- `/design-system/default/tokens/<token-key>`
- `/design-system/<system-key>/tokens/<token-key>`
- equivalent future paths for primitives, patterns, and components.

The same contract names and consumer-facing contracts must be preserved across
systems. System implementations may change values, tone, density, typography,
color, shape, and other visual decisions only behind those contracts.

## Rules

- Shared renderer code must live under `shared/`, not under a specific
  system's implementation folder.
- System-specific CSS and token values must live under
  `systems/<system-key>/`, not top-level `assets/`.
- System-specific overview pages may live at
  `systems/<system-key>/index.html` and are served only for registered system
  keys.
- Token proof modules for a selected system live under
  `systems/<system-key>/tokens/proofs/`.
- Governed runtime token seams consumed by primitives and later layers live
  under `layers/02-token/`.
- Executable Layer 2 token contract modules live under
  `layers/02-token/<token-key>/contract.mjs`, not under a separate
  top-level contract folder.
- Governed primitive runtime seams live under `layers/03-primitive/`.
- Later governed layers must not import directly from
  `systems/<system-key>/` when a numbered layer seam exists.
- Top-level `assets/`, `tokens/`, `patterns`, `components/`, `templates/`,
  `canonicals/`, `canonical-renderings/`, and `exploration/` remain legacy or
  pre-governed inventory until a governed artifact explicitly promotes a seam
  into `layers/` or a system proof namespace.
- A system implementation must not silently change a contract's token names,
  required variant fields, accessibility obligations, or allowed consumer
  rules.
- Downstream primitives, patterns, components, demos, canonicals, and apps must
  consume the contract-approved implementation seam rather than copying values
  or route-local markup.
- New Layer 2 token artifacts must name the shared contract artifact, governed
  runtime seam, system proof module, and rendered proof route support.

## Consequences

### Positive

- Multiple design systems can share token, primitive, pattern, and component
  contracts while rendering different appearances.
- Default-system token work no longer pollutes the existing top-level asset
  space.
- Future contract tests can run the same scenario matrix against every design
  system implementation.
- App adoption can depend on stable contract names instead of a single visual
  system.

### Negative

- The design-system explorer now has one more routing and asset boundary to
  maintain.
- Existing v1 routes still need compatibility treatment until they are migrated
  into `systems/v1/` or formally left as legacy shared surfaces.

### Neutral / Follow-up

- Add contract validation that checks every registered design system exposes
  the required contract implementations.
- Migrate existing top-level token pages into a named `v1` or legacy system
  only after the compatibility plan is approved.
- Extend the route resolver and discovery index when primitives, patterns, and
  components receive switchable-system implementations.
