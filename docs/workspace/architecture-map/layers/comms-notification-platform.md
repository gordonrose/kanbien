# Notification Platform

## Current Status

- `partial`

## What This Layer Should Do

- support in-app and external notifications across channels
- allow product events to reach the right audience at the right time
- support preferences, throttling, audit, and delivery visibility

## Implemented To Date

- `notificationDelivery` now establishes an email-first outbound notification
  delivery foundation for operator and future feature-owned workflows

## Still Missing / Next Steps

- define channel model and audience model
- define notification preference and opt-out rules
- define relationship to workflow, richer email operations, and analytics
  layers
