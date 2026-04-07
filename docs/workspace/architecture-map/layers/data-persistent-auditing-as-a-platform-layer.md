# Persistent Auditing As A Platform Layer

## Current Status

- `partial`

## What This Layer Should Do

- provide durable audit coverage beyond authentication only
- cover business actions, admin actions, operator actions, and sensitive
  system changes
- support evidence, review, and forensic analysis across the platform

## Implemented To Date

- strong auth-focused audit persistence exists
- root-role mutations and privileged denial visibility are now durable too
- standards and docs now explicitly value audit expectations in the artifact
  chain

## Still Missing / Next Steps

- define generalized audit-event taxonomy and ownership model
- define what must always be audited and at what granularity
- extend audit persistence beyond auth and root-operator actions into broader
  business and tenant layers
