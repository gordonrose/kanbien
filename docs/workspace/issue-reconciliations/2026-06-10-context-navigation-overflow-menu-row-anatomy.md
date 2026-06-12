# Context Navigation Overflow Menu Row Anatomy Harness Gap

Date: 2026-06-10

## Summary

The context-navigation mobile More menu became visible after the bottom-bar
overflow clipping was corrected, but the rendered panel used invented
context-navigation item rows instead of the existing source `.menu-item`
anatomy. The result was a technically interactive menu whose items did not
match the source More menu from `src/frontend/designSystem/assets/app.mjs` and
`src/frontend/designSystem/assets/styles.css`.

## Root Cause

The overflow-menu primitive reused `context-navigation-item-control` markup for
panel items and then attempted to adapt that child primitive with local panel
CSS. That was still not the source pattern. The source More menu renders plain
`.menu-item` anchors for destination overflow items and plain
`.menu-item.menu-item-button` buttons for overflow utility actions.

The shared primitive contract also allowed the mistake because it described
panel items as context-navigation item controls rather than limiting
`context-navigation-item-control` to the More trigger.

## Why The Harness Missed It

- Existing unit tests proved that the More trigger, `role="menu"`,
  `role="menuitem"`, labels, and activation events existed.
- Existing visual tests proved that the menu opened, closed, and activated an
  item, but did not assert source `.menu-item` anatomy or absence of context
  navigation icons inside the panel.
- The primitive contract lacked a negative rule forbidding
  `context-navigation-item-control` markup inside the overflow panel.
- The pattern route did not assert the combined mobile state where the bottom
  bar, overflow panel, and excess utility items must work together.
- The host Playwright browser install could not provide browser evidence in
  this environment because bundled Chromium is unsupported for the current OS
  image. The visual specs can run through the matching Playwright Docker image.

## Reconciliation Changes

- `context-navigation-overflow-menu` now limits
  `context-navigation-item-control` usage to the More trigger.
- Overflow panel destination items render as plain `.menu-item` anchors with
  `role="menuitem"`.
- Overflow panel utility items render as plain `.menu-item.menu-item-button`
  buttons with `role="menuitem"` and emit the context-navigation utility
  activation event shape.
- The primitive contract now states that panel rows must use source `.menu-item`
  anatomy and must not render context-navigation icons, context-navigation item
  labels, stacked mobile bottom-bar anatomy, or context-navigation item-control
  markup inside the panel.
- Unit coverage now asserts source `.menu-item` presentation and rejects stale
  overflow-panel icon row CSS.
- Visual primitive coverage now asserts open menu items have `.menu-item`
  classes and no context-navigation item icon or label descendants.
- Visual pattern coverage now asserts the open mobile More menu is anchored
  above the bottom bar and panel items are block `.menu-item` rows with no
  context-navigation item-control icon/label descendants.
- Browser proof captured
  `/tmp/context-navigation-overflow-source-menu-v3.png`; DOM evidence from the
  same run reported `panelIconCount: 0`, `panelLabelClassCount: 0`, and
  `.menu-item`/`.menu-item.menu-item-button` rows for the overflow panel.

## Coverage Lesson

For governed design-system primitives, proving semantic roles and activation
is not enough when the visible defect is presentation anatomy. If a source menu
already defines `.menu-item` rows, a later 41 primitive must consume or match
that source anatomy directly rather than inventing an adapted child-primitive
presentation that only appears systematic.

## Follow-Up Watch Items

- Keep the matching Playwright Docker image path available for local browser
  evidence while the host OS remains unsupported by Playwright's bundled
  Chromium installer.
- Add the same "hosted child primitive anatomy" question to future 41
  primitive and pattern checklist work where a primitive is reused inside a
  drawer, menu, popover, table row, card, or bottom bar.
- Prefer browser geometry assertions for menu, drawer, popover, and bottom-bar
  states where clipping, stacking, or attachment can look broken while roles
  and click behavior still pass.

## Resolution Status

Implemented and browser-verified through the matching Playwright Docker image.
Focused context-navigation visual specs pass, the source-material guard passes,
and the full static gate passed after the source-style overflow menu correction.
Human visual signoff remains separate from executable proof.
