# Readiness Status Control Default Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| System key | default |
| Primitive | readiness-status-control |
| Shared contract | `docs/design-system/03-primitive/shared/readiness-status-control/ReadinessStatusControl-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/readiness-status-control/index.mjs#readinessStatusControlPrimitive` |
| Rendered proof route | `/design-system/default/primitives/readiness-status-control` |
| Proof status | review-ready |

## Proof Scope

The default proof renders the four approved states as text-backed status
indicators. It demonstrates that status meaning is carried by visible text and
programmatic status semantics, not by colour, icon, fill, border, or badge
shape.

The primitive may compress as a single-line text disclosure only when a
governed constrained header owns the parent overflow and hide behavior. The
entity page header pattern supplies the constrained-width browser evidence for
that composition.

## Token Evidence

| Token | Evidence |
| --- | --- |
| `label-text-style` | The primitive resolves the signed short-label variant and applies its typography through primitive-owned CSS variables. |

## Accessibility Evidence

The proof route must show `Ready`, `Needs review`, `Blocked`, and `Unknown`
states. Runtime markup uses `role="status"` and a composed accessible label
for each state.

The primitive is non-interactive, so keyboard activation and focus are not
applicable. Later header patterns must keep this primitive reachable in reading
order and must not replace the visible text with colour-only or icon-only
meaning.

## Consumer Boundary

Later layers consume the runtime seam. They must not copy proof route markup,
invent local badge CSS, duplicate status clipping, or infer additional states
from the proof fixture.
