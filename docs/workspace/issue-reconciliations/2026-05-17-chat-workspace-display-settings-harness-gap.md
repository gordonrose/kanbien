# Chat Workspace Display Settings Harness Gap

Date: 2026-05-17

## Summary

The chat workspace pattern added a display settings control, but the first
implementation mounted the launcher in page content and rendered the drawer as
a floating demo panel. The expected design-system contract was already
established elsewhere: display settings launch from the context nav and render
through the side-panel display-settings drawer chassis.

## Root Cause

The implementation followed nearby demo mechanics instead of the governed
display-settings/context-nav contract. Existing checks could prove that the
new control opened, changed theme, changed zoom, and changed direction, but
they did not prove that the control used the required host chrome or drawer
chassis.

## Why The Harness Missed It

- The browser regression originally asserted behavior and state changes, not
  placement or chassis ownership.
- The artifact audit checked that display-settings artifacts existed, but did
  not reject page-local launchers.
- No negative guard failed a `data-*-settings-open` launcher outside
  `.context-nav`.
- No negative guard failed a display settings drawer using a floating demo
  drawer class instead of the side-panel chassis.
- The harness allowed a visually obvious contract drift because it lacked a
  repo-wide invariant for this family.

## Reconciliation Changes

- `tests/audit/designSystem/displaySettingsArtifacts.test.ts` now walks
  design-system HTML and fails display/settings launchers unless they are
  mounted inside `.context-nav` and use `.context-nav-item`.
- `tests/audit/designSystem/displaySettingsArtifacts.test.ts` now fails
  display/settings drawers unless they use the side-panel chassis and do not
  use the floating build-work-panel demo drawer class.
- `tests/visual/designSystem/patterns/chatWorkspacePattern.spec.ts` now
  asserts the chat workspace display launcher is context-nav hosted and the
  rendered drawer attaches to the context-nav edge without overlapping the
  chat panel.
- The chat workspace and build-work-panel demo surfaces now use the
  context-nav launcher and side-panel display-settings drawer posture.
- `tests/audit/designSystem/contextNavDrawerArtifacts.test.ts` now also
  checks context-nav hosted `drawer`/`panel` launchers across design-system
  HTML and fails them unless the launcher is a context-nav item and the
  controlled surface uses the side-panel chassis.

## Coverage Lesson

For governed frontend families, a passing interaction test is not enough.
The harness must include negative structural assertions for the family owner:
where the control is allowed to live, which chassis is allowed to render, and
which nearby implementation shortcuts are forbidden.

## Follow-Up Watch Items

- Continue extending negative ownership guards for governed shell controls
  beyond drawer/panel launchers, especially menus and shared shell controls
  where demo-local implementations can look functional while violating
  ownership.
- Prefer invariant-first visual tests for design-system work: launcher
  location, drawer chassis, layer/edge attachment, and overlap should be
  asserted before control behavior.
- Treat existing demo-specific classes as unsafe to reuse for governed
  cross-pattern controls unless an artifact explicitly approves that reuse.

## Resolution Status

Candidate fix awaiting user confirmation.
