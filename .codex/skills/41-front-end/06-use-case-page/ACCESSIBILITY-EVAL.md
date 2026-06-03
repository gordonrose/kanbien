# Use-Case Page Accessibility Eval

Use this eval with the shared WCAG 2.2 AA default:

- `../accessibility/WCAG-2.2-AA-DEFAULT.md`

Layer 6 owns rendered proof that accepted component seams preserve
accessibility when composed into a page-family use case.

Pass only when the use-case page artifact names the inherited accessibility
requirements and the rendered evidence needed to prove them across the page
composition.

Required checks:

- every composed component keeps its accessible name, role, state, keyboard
  operation, focus behavior, and live feedback obligations
- page-level composition does not create focus traps, tab-order surprises,
  duplicate labels, ambiguous regions, or hidden interactive content
- proof-only controls are reachable, named, and clearly separate from the
  governed page surface
- responsive, zoom, overflow, direction, and reduced-motion contexts preserve
  the component accessibility contracts
- any page-local state change has enough assistive-technology feedback for a
  non-visual user to understand what changed

Use `accessibility-pass` only when no unapproved WCAG 2.2 A or AA issue
remains.
