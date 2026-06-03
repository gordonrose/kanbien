# Pattern Contract Eval

Assume the PatternContractArtifact is premature, too broad, or smuggling later
layers until each check passes.

## Required Input Checks

Pass only if the UI family name is explicit.

Pass only if the pattern name is explicit.

Pass only if a behavior rule path is named.

Pass only if the named behavior rule is the narrowest governed behavior rule
for the pattern family. A broad parent behavior rule is not enough when the
pattern owns a distinct family such as index navigation, filter lists, panel
headers, resizing, page-shell composition, or add-action composition.

Pass only if every required primitive is listed as consumable for the selected
system in `docs/design-system/03-primitive/primitive-readiness-index.md`.

Pass only if the pattern inventory was compared against the source material
that motivated the work, including any referenced design-system route,
template, token page, canonical, or app-like review surface. The inventory must
state which observed pieces are governed child patterns, required primitives,
required tokens, blocked lower-layer work, or intentionally out of scope.

Pass only if source-material-derived or visible-defect pattern work includes a
preflight decision ledger from `../layer-work-preflight.md` showing that every
pattern decision is owned by Layer 4.

Pass only if every interactive affordance rendered by the pattern is consumed
from a governed primitive. This includes icon-only buttons, text buttons,
resize handles, menu triggers, tooltip triggers, list items, tabs, switches,
checkboxes, radios, and field controls.

Pass only if every visible text child that can be constrained, clipped, or
truncated is rendered through `truncating-label` or another approved
text-disclosure primitive, or the pattern provides browser evidence that the
text cannot truncate in every reviewed state.

Pass only if every direct token dependency is listed as consumable for the
selected system in `docs/design-system/02-token/token-readiness-index.md`, or
the artifact states that no direct token dependency exists.

Pass only if the pattern inventory was checked or the artifact is marked
`blocked` or `draft`.

Pass only if `docs/design-system/04-pattern-contract/pattern-readiness-index.md`
will be updated in the same change when the pattern becomes consumable.

Pass only if expected consumers are named or the missing consumer decision is
recorded as blocking approval.

Pass only if representative data shape is recorded when the pattern displays or
arranges externally meaningful data.

Pass only if responsive behavior names the scroll owner for each reviewed
viewport or placement mode. For each mode, the artifact must say whether the
page, proof container, pattern container, panel, list, or child primitive owns
scrolling.

## Required Output Checks

Pass only if the PatternContractArtifact uses the fixed lean template sections.

Pass only if the output governs one reusable composition job.

Pass only if `Upstream Gates` records behavior-rule status, token readiness,
primitive readiness, and inventory.

Pass only if `Primitive Dependencies` names primitive contract path, system
proof, runtime seam, pattern decision supported, and status.

Pass only if direct token dependencies are named only when the pattern consumes
tokens itself rather than through a primitive.

Pass only if `Composition Contract` describes observable pattern composition
without component props, app wrappers, page-specific layout, or product workflow.

Pass only if `Preflight Decision Ledger` is complete for route-derived,
screenshot-derived, template-derived, canonical-derived, or visible-defect
pattern work, or explicitly states `not applicable`.

Pass only if `Composition Ledger` classifies every rendered child as a
governed primitive, governed child pattern, browser-native wrapper, inherited
later-layer contract, or proof-only wrapper.

Pass only if `Primitive Reconstruction Check` proves every low-level button,
icon button, close control, trigger, option, row action, drag handle, resize
handle, tooltip, label, or text-disclosure child is consumed from a governed
primitive or child pattern, or explicitly states `not applicable`.

Pass only if `Text Overflow Disclosure` lists every composed visible text area
that can be constrained and names the child primitive that owns full-text
disclosure.

Pass only if `Accessibility Contract` names concrete composition
responsibilities rather than saying only "accessible" or "WCAG compliant."

Pass only if `Tactile Interaction Contract` is completed for pattern-level
drag/drop, reorder, resize, drawer/menu open-close, dismiss, expand/collapse,
or selection-changing behavior, or explicitly states `not applicable`.

Pass only if `Responsive Collapse Contract` names desktop, narrow, and mobile
structure, hidden or collapsed items, overlay or stack rules, minimum size or
ratio source, scroll owner, and evidence.

Pass only if `Public Consumption Boundary` prevents consumers from copying
legacy route markup, local CSS, screenshots, or primitive behavior.

Pass only if `Runtime Pattern Seam Policy` states whether the seam is planned,
implemented, blocked, or not applicable and prevents component/app concerns
from becoming the pattern API.

Pass only if `Rendered View` names the exact route to open when a rendered
pattern proof exists, or explicitly states that no rendered view is available.

Pass only if a frontend-visible rendered proof names review controls for any
signed upstream variant, responsive constraint, accessibility-sensitive state,
or consumer-boundary risk that can change the rendered result. If no such
control exists, the artifact must say why.

Pass only if every rendered proof control is backed by browser evidence that
changing the control changes rendered geometry or visual evidence, or preserves
the promised behavior, accessibility attribute, keyboard flow, overflow
posture, or event contract under that pressure.

Pass only if frontend-visible pattern work runs
`npm run check:design-system-text-disclosure` or records the audit as blocked
by existing findings. New or changed pattern truncation must not be hidden
behind existing audit debt.

Pass only if proof-only controls such as constrained slot width, direction,
magnification, fixture count, or diagnostic data are named as review evidence
and are not exposed as downstream consumable runtime values unless a signed
token or explicit pattern contract owns them.

Pass only if `Next Layer` states whether the next layer is allowed, blocked, or
scaffold-only.

## No Fake Determinism Checks

Apply the shared harness quality bar:

- `../harness-quality-bar.md`

Fail if a table, status value, slot, state, data field, or artifact file does
not prevent a specific failure or change the next allowed action.

Fail if the artifact invents a universal pattern taxonomy before real pattern
work has earned it.

Fail if state lists do not affect behavior, accessibility, emitted events, or
consumer obligations.

## Layer Boundary Checks

Fail if the artifact revises behavior-rule meaning instead of routing back to
`01-behavior-rule`.

Fail if the artifact relies on a broad behavior rule while the pattern is
really for a narrower UI family that needs its own Layer 1 rule.

Fail if the artifact defines token values instead of routing back to `02-token`.

Fail if pattern runtime CSS, route code, fixtures, or tests introduce visual,
sizing, spacing, scrolling, surface, shadow, radius, width, height, overflow,
marker, icon, typography, focus, or motion values that are not consumed from a
signed token seam, consumed through a governed primitive or child pattern,
inherited from a containing later-layer contract, browser-native, or explicitly
proof-only.

Fail if a pattern uses local `text-overflow: ellipsis`, `white-space: nowrap`,
visible clipping, `overflow: hidden`, title-only disclosure, or copied tooltip
logic for text instead of consuming an approved text-disclosure primitive.

Fail if the artifact redefines primitive behavior, semantics, state meaning,
controller behavior, or token consumption instead of routing back to
`03-primitive`.

Fail if a rendered pattern contains an interactive affordance that is not a
governed primitive dependency, even if the markup is small, copied from source
material, or visually obvious.

Fail if a pattern locally renders a menu trigger, select trigger, drawer close
button, resize handle, drag handle, row action, icon button, tooltip trigger,
or select option instead of consuming a governed primitive or child pattern.

Fail if manual resize minimum or maximum behavior is not derived from a signed
ratio, token, primitive, or explicit pattern contract.

Fail if mobile drawer, menu, popover, or collapsed tooling behavior stacks
under source content when the behavior contract requires a full overlay.

Fail if title, status, metadata, or context text can escape its owning region,
sit behind actions, or avoid the same truncation/collapse rules as the rest of
the pattern's text region.

Fail if a pattern collapse order is not tied to the behavior rule, signed
structural token, or explicit pattern contract.

Fail if responsive scroll behavior is implemented or asserted without naming
the scroll owner for desktop, mobile, embedded, and proof-container review
contexts that apply to the pattern.

Fail if unequal repeated children can align or overflow differently and the
pattern proof lacks browser evidence for top/start alignment, overflow, or
stable dimensions.

Fail if global CSS inheritance supplies custom scrollbar styling, typography,
surface, marker, separator, spacing, or layout behavior that the pattern has
not classified as signed, inherited, browser-native, or proof-only.

Fail if the artifact defines component props, adapters, or app import paths
before the component-seam layer.

Fail if the artifact defines demo routes, fixtures, or canonical scenarios
before those later layers.

Fail if legacy top-level `src/frontend/designSystem/patterns/` route markup is
treated as a governed Layer 4 source of truth.

## Pass Result

Use `pattern-contract-pass` only when the PatternContractArtifact passes this
eval and `ACCESSIBILITY-EVAL.md`.

Name the next allowed layer.

## Fail Result

Use `pattern-contract-fail` when required input is missing, upstream primitives
or tokens are not consumable, the artifact violates the layer boundary, or it
cannot guide the next layer.

Name the smallest correction needed.
