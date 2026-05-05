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

Health check:

- `npm run data:compliance-health`

The health check summarizes whether entity pages include the compliance
classification/governance and enforcement trace sections, and whether trace
rows expose missing or manual-review evidence posture.
