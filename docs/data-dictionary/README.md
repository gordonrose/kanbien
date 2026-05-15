# Data Dictionary

This folder is the home for repository-backed entity documentation.

The data dictionary is intended to serve two purposes:

- a compliance-oriented reference for durable entity behavior
- a rebuild-from-spec reference for persistence-backed features

That means entity pages should capture not only descriptive field information
but also the persistence contract that would matter if feature code were lost.

Expected contents:

- `index.md` for the entity inventory
- one Markdown file per entity

Canonical template:

- [`docs/templates/data-dictionary-entity-template.md`](../templates/data-dictionary-entity-template.md)

Migration mapping standard:

- [`docs/standards/data-dictionary-registry-migration-map.md`](../standards/data-dictionary-registry-migration-map.md)

These files are intended to be maintained with the repo-local
`data-dictionary-maintainer` skill.

Workflow:

1. inspect architecture and source ownership
2. compare current code to existing dictionary files
3. summarize detected changes
4. ask before updating the dictionary

For persistence-backed entities, pages should include as appropriate:

- storage model
- columns or fields
- indexes and constraints
- normalization and uniqueness rules
- lifecycle semantics
- mutation semantics
- migration compatibility notes
- cross-feature read seams
- compliance classification and governance notes
- compliance and enforcement trace rows that link repo rules, enforcement
  posture, and evidence

## DB-Backed Entity Registry Readiness

The Markdown dictionary is now treated as a bridge toward future DB-backed
entity management, not as free-form prose that must be interpreted later.

New or materially refreshed entity pages should use structured tables for facts
that a future registry, API, script, LLM proposal workflow, or design-system
entity-management UI would need to read deterministically.

Use prose only for short human context. Use tables for:

- entity registry header fields such as `entityKey`, ownership, current status,
  source authority, and source table or record
- source authority, precedence, current repo source of truth, future runtime
  persistence owner, future entity-registry owner, Markdown posture, and
  migration trigger
- storage model, versioning, tenant boundary, soft-delete, archive, generated
  artifact, and migration posture
- capability inventory and capability family rules, including non-CRUD
  operations such as lifecycle, relationship control, governance, evidence,
  generation/sync, automation, import/export, security, retention, cleanup,
  and support operations
- attribute inventory
- attribute category rules
- status and lifecycle model
- parent, child, sibling, supersession, replacement, dependency, and evidence
  relationships
- indexes, constraints, normalization, search, filter, and sort behavior
- mutation semantics
- retention, cleanup, export, delete, purge, and legal-hold posture
- authorization and tenant-boundary rules
- API, UI, and design-system posture
- compliance classification, enforcement trace, errors, and evidence links

Default repo-wide entity statuses for dictionary records are:

- `draft`: exists but is not current/default truth yet
- `active`: current/default truth for normal reads
- `superseded`: replaced by a newer current record or version
- `archived`: retained but removed from ordinary current work
- `deleted`: soft-deleted or unavailable under explicit delete policy

Entity-specific business lifecycle states may be added only when these generic
statuses are not expressive enough. When they are added, map them back to the
repo-wide status model so frontend, API, retention, and generated-doc behavior
do not need to guess.

Default attribute categories for dictionary records are:

- `identity`
- `core`
- `secondary`
- `metadata`
- `lifecycle`
- `relationship`
- `evidence`
- `security`
- `privacy`
- `system`

These categories are intended to become the bridge between data dictionary
truth and a future design-system entity-management preset. They should drive
default display prominence, editability, confirmation posture, search/filter
treatment, and generated documentation placement.

Relationship modeling should be explicit. If an entity can be reached,
controlled, blocked, superseded, archived, deleted, exported, or understood
through another entity, record that link in the relationship inventory rather
than burying it in prose.

Health check:

- `npm run data:compliance-health`

The health check summarizes whether entity pages include the compliance
classification/governance and enforcement trace sections, and whether trace
rows expose missing or manual-review evidence posture.
