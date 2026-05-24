# ContainerSection Behavior Lock

## Scope

`ContainerSection` is the reusable interior surface token for grouped sections
inside a container or page-header seam.

## Behavior Contract

- `CNS-001`: The container-section surface uses the shared container-section
  background token.
- `CNS-002`: The section carries a border on all four sides.
- `CNS-003`: The section keeps square corners for exact structural filling.
- `CNS-004`: Success, warning, and error section treatments use semantic state
  background tokens.
- `CNS-005`: The section is designed to sit inside page header without
  adding app content semantics.
- `CNS-006`: Theme, accent, direction, and magnification are inherited from the
  shell and parent container.
- `CNS-007`: Source output must expose the approved background and border token
  relationship.
- `CNS-008`: The section token does not define cards, rows, form fields,
  drawers, or record payloads.

## Adoption Rule

Repeated grouped regions inside governed containers must use this token seam
unless a component-specific section surface has been separately signed off.
