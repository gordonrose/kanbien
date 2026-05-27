# Root-Admin Context-Nav Signoff Order Drift

## Summary

The first real `context-nav` utility-action loop in `rootAdminShell` was
implemented and browser-tested before the usual governance chain was refreshed.

The UI work itself stayed within the intended scope, but the loop treated app
implementation plus tests as if that were equivalent to sign-off.

That skipped the required order:

1. refresh the behavior lock
2. refresh the reference/canonical truth
3. refresh the adoption contract
4. then treat the app consumer as signed off against that chain

## Root Cause

The loop over-weighted rendered runtime proof and under-weighted the design
system’s artifact-order rule.

Once the real app implementation passed browser tests, the change was
described as delivered before the lock/reference chain had been updated to
capture the approved app-versus-preview boundary.

## Why The Loop Missed It

This escaped because the current local checks validated:

- implementation behavior
- browser runtime geometry
- close behavior and focus return

They did not validate whether the signed-off artifact chain had been refreshed
before the app loop was treated as complete.

## Classification

- process drift
- wrong-order governance
- prevention-layer gap

## Reconciliation Changes

- refreshed the `context-nav` behavior lock with:
  - the preview-versus-app drawer-boundary rule
  - the explicit signoff-order rule
- refreshed the `context-nav` reference pack to state that app implementation
  and tests are not sign-off on their own
- refreshed the root-admin adoption contract so the first utility-action slice
  is grounded in the governed chain
- refreshed the verification note to record the narrower real-app control
  surface

## Coverage Lesson

For governed design-system adoption, browser proof is necessary but not
sufficient.

We also need a loop-completeness check that asks:

- did the lock change?
- did the reference/canonical truth change?
- did the adoption artifact change?
- are we calling this signed off before those artifacts are honest?

## Follow-Up

When a design-system consumer loop changes approved app-versus-preview truth,
do not describe the work as signed off until the lock, reference pack,
canonicals, and adoption contract are refreshed in the same turn.
