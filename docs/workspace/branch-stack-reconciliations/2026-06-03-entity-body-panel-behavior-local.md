# Branch Stack Reconciliation

- Branch: codex/entity-body-panel-behavior
- Head Commit: ea451fdb60ba
- Disposition: intentionally-parked
- Accounted By: 996d22d55cc6 design-system foundation promotion

This branch carries older entity-body-panel behavior work that is not reachable
from the current promotion branch. It is intentionally parked so the current
design-system foundation stack can be promoted without silently discarding or
mixing in a separate workstream.

Expected resolution: revisit after the current promotion lands, compare against
the promoted entity-panel and body-region work, then either cherry-pick the
remaining valid behavior changes, supersede them with a new governed slice, or
retire the branch with explicit approval.

Owner: Gordon/Codex design-system follow-up.
