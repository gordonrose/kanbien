# Chat Workspace Canonical Index Link Gap

Date: 2026-05-17

## Summary

The `/design-system/canonical-renderings` index did not show a link to the
Chat Workspace Shell canonical renderings, even though the dedicated
`/design-system/canonical-renderings/chat-workspace-shell` surface existed.

## Root Cause

The top-level canonical-renderings index renders families returned by the live
public canonical families API. The Chat Workspace Shell canonical surface and
frontend render states existed, but the vertical slice was incomplete because
the `design_system_canonical_families` and
`design_system_canonical_references` source-of-truth records had not been
seeded.

## Why The Feature Loop Missed It

Existing coverage verified the Chat Workspace Shell family route and render
states, but did not require the persisted canonical family API to own the
family. That left a navigation/discoverability gap between frontend canonical
truth and the persisted launcher catalog.

## Reconciliation Changes

- A corrective migration now seeds the Chat Workspace Shell canonical family
  and all twenty `CWS-R-*` references into the persistence-backed canonical
  catalog.
- The generated canonical-renderings index visual regression coverage now
  includes the Chat Workspace Shell family so the top-level link remains
  discoverable.

## Coverage Lesson

Family-route coverage is not enough for generated canonical surfaces. The
index that humans use to discover those families must be backed by the same
persistence records as the rest of the generated canonical catalog.

## Follow-Up Watch Items

- Watch for any future canonical surface that adds frontend routes without
  adding the matching persisted family and reference records.
