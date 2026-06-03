# Branch Stack Reconciliation

- Branch: codex/layer4-index-nav-label-pattern
- Head Commit: 467e772e5e42
- Disposition: intentionally-parked
- Accounted By: 996d22d55cc6 design-system foundation promotion

This branch carries older Layer 4 index-nav harness work that is not reachable
from the current promotion branch. It is intentionally parked so the current
design-system foundation stack can be promoted without folding an older
index-nav workstream into this push.

Expected resolution: revisit after the current promotion lands, compare against
the promoted index-nav and entity-panel contracts, then either cherry-pick the
remaining valid behavior changes, supersede them with a new governed slice, or
retire the branch with explicit approval.

Owner: Gordon/Codex design-system follow-up.
