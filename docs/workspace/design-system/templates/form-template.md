# Form Template

## Scope

- Template name:
  `Form Template`
- Status:
  signed-off parent baseline
- Owner:
  Codex with user sign-off
- Current governed surface:
  `/design-system/templates/form`
- Parent behavior lock:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Parent reference pack:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Parent fallback note:
  `docs/workspace/design-system/templates/form-template-fallback-note.md`

## Intent

- What user or operator need does this template serve?
  Provide a reusable editing canvas for configuration-heavy workflows that need
  grouped fields, inline guidance, stable primary actions, and richer picker
  or drawer controls without leaving the page.
- Why should this remain a parent template rather than becoming one giant component?
  The page-level rhythm, section framing, self-contained guidance posture, and
  action zoning need to stay reusable across multiple admin-style forms, while
  child seams such as picker, select, and choice-control families can be
  extracted independently as they stabilize.

## Parent Anatomy

- Required parts:
  shared shell chrome, page title/status band, grouped form sections, primary
  form card, bottom action rail
- Optional parts:
  preview-state toggles, inline picker overlays, drawer selectors,
  section-level helper copy
- Layout structure:
  single primary editor card with grouped internal sections, remaining
  one-column under both desktop and constrained review while field density and
  action posture adapt inside the card itself

## Parent State Model

- Default:
  one self-contained editing canvas with grouped sections, inline help text,
  closed picker overlays, closed selection drawers, and hidden validation
  messages
- Error review:
  review controls expose inline field and group errors without changing the
  overall page rhythm or action placement
- Disabled review:
  controls and actions demonstrate a disabled state without collapsing section
  hierarchy or removing helper text
- Mobile review:
  the template compresses into a single-column mobile-friendly stack while
  preserving access to the same field families and action posture
- Picker open:
  date and time controls may open local panels anchored to the field while
  preserving the surrounding form context
- Drawer-select open:
  larger selectable sets open a dedicated side drawer with search,
  `Selected`, and `Available` stacks inside the same parent form flow
- Magnified or direction-adjusted review:
  display-settings controls can change magnification, accent, theme, and
  document direction so the parent template can be inspected under stress

## Extraction Order

1. `Simple Select`
   This is the narrowest current child seam and now has a dedicated
   behavior-lock, reference-pack, and verification chain while still
   inheriting the parent field framing from the form template.
2. `Date Picker`
   This seam now has its own child chain for staged date selection, jump
   controls, range normalization, and the composed outer summary boundary.
3. `Time Picker`
   This seam is now a signed-off child family with its own canonical launcher,
   dedicated child render surface, and locked quick-pick, close, focus-return,
   nested-overlap, mobile, and RTL stress behavior.
4. `Drawer Select`
   This remains a larger separate seam because the repeated selection drawer
   chassis carries search, selected-stack, and broader overlay behavior that
   should not be folded into simple select or date-picker.
5. `Choice Group`
   This seam now has an exploratory child artifact chain, but it remains
   deferred from child canonical extraction until grouped-choice behavior is
   proven beyond this one parent route or gains stronger child-owned proof.

## First Child Decision

- Recommended first child:
  `Simple Select`
- Why this seam first?
  It has the smallest honest interaction boundary to extract next:
  trigger, anchored listbox, single selected-option reflection, and owned
  close/focus behavior without broader drawer semantics.
- Assessed but deferred child candidate:
  `Choice Group`
- Why it is deferred:
  the seam is currently only proven inside one parent composition; it now has
  a documented child boundary, but its shared-statement checkbox variant is
  still too tied to the parent release-checklist example to promote without
  flattening an important distinction.
- What stays parent-owned for now?
  page title/status framing, section cadence, header/footer action zoning, and
  the overall form-page mobile stacking behavior, plus grouped-choice placement
  and the shared-statement checklist's parent-specific framing
  date-grid staging, range summary guidance, and range `Done` completion also
  stay date-picker-owned rather than moving into the time-picker child seam

## Governed Child Artifacts Started In This Loop

- `Simple Select`
  `docs/workspace/design-system/behavior-locks/simple-select-behavior-lock.md`
  `docs/workspace/design-system/reference-packs/simple-select-reference-pack.md`
  `docs/workspace/design-system/verification/simple-select-verification-checklist.md`
  This child seam keeps the lightweight anchored-listbox contract separate
  from the broader `Drawer Select` overlay family.
- `Date Picker`
  `docs/workspace/design-system/behavior-locks/date-picker-behavior-lock.md`
  `docs/workspace/design-system/reference-packs/date-picker-reference-pack.md`
  `docs/workspace/design-system/verification/date-picker-verification-checklist.md`
  This child seam now owns the staged range state machine, anchored month/year
  jumps, mobile full-screen overlay posture, and the composed
  range-with-time summary boundary while preserving the signed-off
  `Time Picker` child seam inside nested overlap states.
- `Time Picker`
  `docs/workspace/design-system/behavior-locks/time-picker-behavior-lock.md`
  `docs/workspace/design-system/reference-packs/time-picker-reference-pack.md`
  `docs/workspace/design-system/verification/time-picker-verification-checklist.md`
  This child seam now owns quick hour/minute selection, minute-completion
  close behavior, seam-owned focus return, nested overlap inside
  `date range with time`, mobile open-panel posture, and RTL mirrored
  alignment for its child-owned surfaces.
- `Choice Group`
  `docs/workspace/design-system/behavior-locks/choice-group-behavior-lock.md`
  `docs/workspace/design-system/reference-packs/choice-group-reference-pack.md`
  `docs/workspace/design-system/verification/choice-group-verification-checklist.md`
  This child-seam candidate now has an explicit boundary and parent-hosted
  proof, but it remains exploratory until it earns direct child-owned proof
  beyond the current `Form Template` host route.
- `Drawer Select`
  `docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md`
  `docs/workspace/design-system/reference-packs/drawer-select-reference-pack.md`
  `docs/workspace/design-system/verification/drawer-select-verification-checklist.md`
  This child seam now owns trigger summary, drawer open behavior, search,
  `Selected` / `Available` stacks, toggle and remove behavior, honest empty
  states, and modal-like keyboard containment while inheriting parent framing
  from `form-template`.

## Source Of Truth

- Parent implementation:
  `src/frontend/designSystem/templates/form/index.html`
- Parent interaction controller:
  `src/frontend/designSystem/assets/app.mjs`
- Parent regression coverage:
  `tests/visual/designSystem/formTemplate.spec.ts`
- Current composition note:
  the parent route currently proves grouped text fields, select-like controls,
  date and time pickers, drawer-based multi-select variants, choice groups,
  toggle posture, and self-contained form guidance inside one reusable
  form-page canvas

## Fallback Posture

- If a later replacement or first-consumer adoption drifts from the approved
  parent composition, fall back to the governed parent route and `FTR-*`
  reference set rather than to the earlier loose prototype memory.
- Use
  `docs/workspace/design-system/templates/form-template-fallback-note.md`
  as the rollback note for parent framing, section cadence, and action zoning.
