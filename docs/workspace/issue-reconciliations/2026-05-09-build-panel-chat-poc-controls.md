# Build Panel Chat POC Control Gaps

## Summary

The root-admin Build work panel POC exposed multiple user-visible chat control
gaps after the persistence-backed conversation flow became usable:

- new chat, copy, archive, rename, and inline edit controls rendered but did
  not perform their expected actions
- Enter did not submit the composer
- rerendering after send/reply could leave the transcript at the wrong scroll
  position
- downloaded packet state was not persisted back into the conversation, so the
  download banner reappeared after navigating away and back

## Root Cause

The design-system conversation panel exposed UI affordances before the
root-admin consumer had durable handlers and backend mutation seams for the
same behaviors. Packet PDF download also recorded a PDF attempt but did not
mark the packet revision as downloaded, leaving the UI to infer packet state
only from `latestPacketRevisionId`.

## Why The Loop Missed It

Existing coverage focused on initial panel render, protected API authority,
packet generation, and PDF validity. It did not cover the control lifecycle
after the POC became interactive: keyboard submit, copy, edit/regenerate,
archive, rename, new-chat reset, or persisted download completion.

## Reconciliation Changes

- Added harness-chat mutation seams for conversation title/state updates.
- Added author-only user message edit with downstream message removal and
  assistant regeneration.
- Added persisted packet download state via packet revision `downloaded`.
- Wired root-admin Build panel handlers for new chat, copy, rename, archive,
  inline edit save/cancel, send-on-Enter, and post-render transcript scrolling.
- Extended focused unit/integration/security coverage for the updated service
  and router contracts.

## Coverage Lesson

Visible controls in governed UI canonicals need at least one consumer-level
interaction proof once adopted in the real app. Render parity alone is not
enough for a POC that includes actionable chat controls.

## Follow-Up Watch Items

- Add browser-level regression coverage for each Build panel control once the
  root-admin shell auth/session visual test blocker is cleared.
- Replace `window.prompt` chat rename with a governed design-system edit state
  before treating rename as production-ready.
- Decide whether edit/regenerate should preserve prior downstream versions for
  audit/history before the POC becomes a durable product feature.
