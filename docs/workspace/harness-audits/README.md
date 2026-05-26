# Harness Audits

This folder stores audit, reconciliation, and investigation notes about the
repo harness itself.

Use it for:

- temporary or dated harness audits
- reconciliation notes that explain why harness behavior changed
- investigation notes about artifact drift, repo split boundaries, or guardrail
  gaps
- cleanup plans that must remain visible before they are promoted elsewhere

Do not use it as the long-term home for:

- active Product Discovery or Product Request templates
- reusable examples that future requests should copy
- enduring standards or repo constitution rules
- architecture decisions that should live under `docs/architecture/`
- executable harness contracts that belong in scripts, tests, or skills

When an audit note produces reusable guidance, promote that guidance to the
owning artifact family instead of leaving it only here. Common destinations are:

- `docs/standards/` for durable repo rules
- `.codex/skills/` for assistant workflow behavior
- `docs/templates/` for maintained templates
- `docs/architecture/` for enduring architecture decisions
- the relevant `docs/workspace/` artifact folder for active planning records

Existing files in this folder may be active, historical, or superseded. Do not
treat a dated audit note as current source truth without checking newer
standards, skills, templates, scripts, tests, and architecture docs.

Do not move existing files out of this folder without a separate compatibility
pass for references from docs, skills, scripts, tests, and current planning
artifacts.
