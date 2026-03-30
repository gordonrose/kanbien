# Archival / Retention / Purge Model

## Current Status

- `missing`

## What This Layer Should Do

- define how long data is retained and when it is archived or purged
- support compliance, legal, customer, and operational lifecycle needs
- distinguish active, archived, retained, and deleted states clearly

## Implemented To Date

- entity-local lifecycle handling exists in some areas such as soft delete and
  anonymization
- no cross-platform retention model yet

## Still Missing / Next Steps

- define retention classes and policy ownership
- define purge, archive, and legal-hold rules
- connect retention policy to audit, privacy, and analytics layers
