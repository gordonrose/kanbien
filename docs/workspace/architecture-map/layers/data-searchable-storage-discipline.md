# Searchable Storage Discipline

## Current Status

- `partial`

## What This Layer Should Do

- ensure searchable attributes have explicit storage and index strategy
- avoid ad hoc search fields that will not scale or remain correct
- keep search behavior aligned across contract, persistence, and docs

## Implemented To Date

- strong rules exist in `AGENTS.md` for searchable storage
- root-user normalized search columns and indexes are implemented
- persistence docs now capture search-related storage choices

## Still Missing / Next Steps

- define broader platform search patterns beyond current root-user fields
- decide how search evolves for multi-entity and tenant-aware use cases
