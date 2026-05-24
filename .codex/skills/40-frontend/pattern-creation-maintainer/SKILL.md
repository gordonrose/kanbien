---
name: pattern-creation-maintainer
description: Use when turning existing signed-off design-system tokens into reusable pattern demo surfaces or feature-consumable pattern seams. Best for composing `/design-system/tokens/*` primitives into `/design-system/patterns/*` pages, recording the emerging contract, and preventing token diagnostic scaffolding, clipped geometry, unreadable cards, or shallow hydration-only verification from being mistaken for a usable pattern.
---

# Pattern Creation Maintainer

Use this skill when creating or rebuilding a design-system pattern from existing token seams.

The goal is to produce a truthful pattern demo first, then let class inventory,
behavior rules, and feature-facing contract language emerge from the rendered
page. Do not start by inventing a broad TypeScript contract.

## Required Posture

- Treat the first pattern route as a provisional demo, not signed-off truth.
- Compose existing signed-off token seams before creating new pattern rules.
- Keep token diagnostic scaffolding out of the demo surface unless explicitly
  labeled as diagnostic. Grid numbers, dashed measurement cells, and token maps
  must not leak into a pattern that is meant to be judged as UX.
- Add pattern CSS only inside the design-system pattern context, and only to
  compose token-owned seams into a usable demo. If a primitive decision is
  missing, stop and name the token gap instead of faking it locally.
- Never call a pattern healthy because the route served, hydration ran, or
  selectors exist. Rendered geometry and readability are the evidence.

## Workflow

1. Read the token pages and token assets named by the requester.
2. Identify which classes are diagnostic-only, which classes are consumable
   seams, and which classes are render helpers.
3. Build the smallest provisional route under `/design-system/patterns/<name>`.
4. Populate it with placeholder content that matches the intended density, not
   toy content that hides overflow.
5. Verify in the browser before declaring the first pass ready for review.
6. Fix only composition mistakes in the pattern. If the failure belongs to a
   token seam, stop and report the token-level change needed.
7. After the demo is visually usable, start recording behavior and contract one
   region at a time.

## Composition Rules

- The pattern owns orchestration between token seams; tokens own primitive
  geometry, styling, responsive behavior, and control semantics.
- Prefer token renderers and mount attributes over copied markup when they
  exist, such as count/list/card hydration seams.
- Do not place full-sized controls into token rows whose height cannot contain
  them. If a header token is diagnostic and too short for real dropdowns, use a
  pattern header composition that references the token placement rules while
  keeping the actual controls readable.
- Do not nest a token structure inside a host in a way that creates a narrow
  unusable strip or competing scroll containers.
- Avoid multiple nested scrollbars in the same visible panel unless the token
  behavior explicitly requires them.
- Avoid using count-card/list-card variants in slots whose dimensions are too
  small for their intrinsic content. If the compact variant does not exist,
  record that as a token gap.
- Keep placeholder labels long enough to test truncation, but verify truncation
  is deliberate and readable.

## Pattern Demo Acceptance Checks

Before saying the demo is ready for user review, run browser checks that prove:

- Header controls are fully visible and recognizable.
- Diagnostic grid labels or measurement cells are not visible in the UX demo.
- Dropdown triggers are readable, focusable, and not clipped.
- Primary action icon buttons are recognizable buttons, not dots or cropped
  glyphs.
- Count cards fit their row and truncate only where the token says they should.
- Filter panel content has a usable width and exactly the intended scroll
  containers.
- List cards occupy the intended result region and are visible above the fold.
- No text overlaps, escapes its card, or becomes unreadable at normal, dark,
  RTL, and largest exposed magnification states.
- The page has no accidental document-level horizontal overflow.
- Browser console and page errors are clean.

Use geometry assertions, screenshots, or both. Selector counts are supporting
evidence only.

## If The Demo Fails

Classify failures before patching:

- **Composition failure**: pattern nested the token incorrectly, used the wrong
  slot, gave the slot impossible dimensions, or exposed diagnostic markup.
- **Token gap**: the needed compact row/card/control variant or structure does
  not exist.
- **Token defect**: the signed-off token cannot satisfy its own stated behavior.
- **Contract gap**: the demo is visually fine but cannot yet explain what a
  feature must provide.

Patch composition failures in the pattern. For token gaps or token defects,
stop and ask whether to run the token loop.

## Contract Recording Order

Only after the rendered demo is usable:

1. Capture the region inventory: header controls, selectors, subheader cards,
   filter sections, result cards, empty/loading/error states.
2. Record the class and data-attribute seams actually present on the page.
3. Record one behavior rule at a time, tied to the rendered region.
4. Add a contract panel or artifact that maps feature attributes and
   capabilities into those regions.
5. Keep backend/domain language out of the pattern until the visual and
   interaction contract is clear.
