# Issue Summary

The `sub-nav` canonical review loop surfaced a cluster of escaped frontend
issues around canonical honesty, RTL transition states, breadcrumb reduction,
and truncated-label tooltip behavior. The most time-consuming defect was that
truncated breadcrumb labels in the canonical renderer did not show tooltip
reveal even though the working `/design-system` surface had previously shown
the behavior correctly.

# Root Cause

This was not one isolated defect. The loop exposed several interacting causes:

- the canonical renderer was sharing too much behavior with the exploratory
  surface without enforcing deterministic first-open rendering
- the canonical page width clamp meant some "wide" canonicals were not actually
  receiving the width their routes claimed
- tooltip debugging spent too long on CSS guesses even though the real failure
  eventually proved to be an ordering bug in the canonical render path:
  `syncOverflowTooltip(...)` intentionally clears tooltip data while the
  canonical surface is marked `settling`, and the canonical path was not
  assigning `renderStatus="ready"` until after the tooltip-assignment logic had
  already run
- because the tooltip data never survived the settling phase, later work on
  z-index, positioning, and hover selectors could not solve the defect

# Why The Loop Missed It

The misses came from both product coverage and process coverage gaps.

## Coverage Gap

The repo had good source-level checks for design-system breadcrumb overflow and
canonical route wiring, but it did not have browser-backed proof for the new
canonical states that were being introduced during this loop. That allowed:

- canonical width dishonesty
- first-open render drift
- RTL transition regressions
- tooltip data being cleared during canonical settling

to survive while source-only audits still passed.

## Process Gap

The design-system loop did not previously force escalation to browser-level
inspection after a repeated UI miss. That led to too many iterations of
patching symptoms:

- CSS stacking guesses
- tooltip-specific workaround paths
- canonical-only behavior patches

instead of inspecting the live rendered page directly after the first failed
attempt.

# Reconciliation Changes Added

The loop was tightened in several places:

- the exploratory surface and canonical renderer were separated so canonical
  links are deterministic rather than sharing the interactive state-driver path
- canonical metadata and stepping were added so individual `SNR-*`, `BCR-*`,
  and `SSR-*` states can be reviewed intentionally
- RTL transition canonicals were added because one full-width RTL state was not
  enough to protect mirrored reduction behavior
- explicit truncation canonicals were added for LTR and RTL so ellipsis and
  tooltip behavior can be reviewed directly
- the canonical width clamp was removed as the source of false "full-width"
  review states
- the canonical tooltip assignment ordering bug was fixed by marking the
  canonical surface `ready` before tooltip-assignment logic runs
- the design-system loop guidance and skill guidance now require escalation to
  browser-level inspection when a user-reported UI issue survives the first fix
  attempt and has to be reported again

# Prevention-Layer Lesson

For this repo, UI bugs that involve any of the following should escalate to
browser inspection on the second pass:

- tooltips
- layering
- clipping
- overlap
- RTL ordering
- compact/reduced/mobile transitions
- canonical renderer truth versus exploration truth

Source inspection remains useful, but it is not an honest closure layer for
those classes of defects once the first attempted fix misses.

# Verification Added

- updated design-system skill guidance:
  `.codex/skills/40-frontend/frontend-design-system-loop-maintainer/SKILL.md`
- updated durable loop guidance:
  `docs/architecture/guides/design-system-loop-harness.md`
- updated breadcrumb, sub-nav, and search-shell reference artifacts to capture
  the current canonical learnings
- updated breadcrumb verification artifact to record that the current canonical
  set is the accepted working rendered reference
- kept focused executable checks on:
  - `tests/audit/designSystem/breadcrumbOverflow.test.ts`
  - `tests/audit/designSystem/subNavCanonicalCoverage.test.ts`

# Resolution Status

`confirmed resolved by user`

The user explicitly accepted the canonicals in their current state after the
browser-level debugging pass and requested that the loop learn from this cycle.

# Residual Risk

The current risk is no longer "we do not know what went wrong." The remaining
risk is that future UI work could drift back into source-only debugging if the
new browser-escalation rule is ignored. The updated loop guidance reduces that
risk, but only if future turns actually follow it.
