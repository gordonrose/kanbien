# Canonical Home Icon Flicker

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/sub-nav-breadcrumb/`
after the canonical breadcrumb settling lesson was found in active breadcrumb
overflow audit coverage.

## Symptom

On the locked sub-nav canonical renderer, the collapsed home icon could appear
briefly and then disappear while the canonical state settled, even when the
final approved breadcrumb structure did not require the home item to collapse.

## Root Cause

The home-icon toggle lives inside the generic breadcrumb tooltip/overflow sync
path. That sync was still running for preview breadcrumb nodes while the
canonical surface was marked `settling`, so the home crumb could briefly be
classified as truncated against pre-settle geometry and then be corrected after
the final render pass.

## Why The Loop Missed It

- Existing coverage checked that the home icon fallback existed, but not that
  canonical surfaces suppress transient pre-settle icon state.
- Earlier debugging focused on width, reduction order, and RTL anchoring, which
  were also real issues and masked this smaller rendering artifact.

## Prevention Added

- Canonical preview breadcrumb tooltip/icon sync now suppresses home-icon
  collapse decisions until the canonical surface reports `renderStatus=ready`.
- Breadcrumb audit coverage now checks for this canonical settling guard.
