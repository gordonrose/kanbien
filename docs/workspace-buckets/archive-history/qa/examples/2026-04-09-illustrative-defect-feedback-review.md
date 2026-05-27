# Illustrative Defect Feedback Review

This is an illustrative example showing how the defect-feedback review should
be written. It is not recording a real production escape.

## Metadata

- Defect or incident reference:
  illustrative-example-tenant-auth-race
- Scope:
  tenant-auth bootstrap and one-time proof consumption
- Owner:
  engineering
- Date:
  2026-04-09
- Related feature or release:
  tenant-auth foundation

## Defect Summary

- What happened:
  A hypothetical production incident allowed the same bootstrap proof to be
  submitted concurrently, creating inconsistent bootstrap-side effects.
- Customer or operational impact:
  User onboarding truth could become inconsistent and support diagnosis would
  be harder than it should be.
- Severity:
  high
- Escaped to:
  production

## Root Cause

- Technical root cause:
  Proof consumption was modeled as a check-then-mark-used flow instead of one
  atomic durable operation.
- Process root cause:
  The earlier test plan covered normal bootstrap behavior but did not yet
  require explicit contention-oriented proof for one-time bootstrap proofs.
- Why existing checks did not prevent it:
  Unit and integration coverage proved nominal correctness, but no
  concurrency-oriented or persistence-backed race proof existed for this path.

## Coverage Gap Analysis

- Which layer should have caught this:
  concurrency / persistence / exploratory
- Was the layer missing, weak, flaky, or mis-scoped:
  missing
- Which `TC-*` or `JY-*` artifacts were affected:
  tenant-auth bootstrap and onboarding test inventory should have carried an
  explicit race-condition proof requirement.

## Required Improvement

- New or strengthened executable test:
  Add a Postgres-backed contention test proving exactly one concurrent bootstrap
  proof consumption succeeds.
- New or strengthened exploratory QA:
  Add explicit review of concurrent onboarding and one-time-proof mutation
  behavior in high-risk auth slices.
- Change to coverage matrix or release-gate rule:
  None required if the repo already classifies auth/session workflows as
  concurrency-sensitive; otherwise add that clarification.
- Change to journey inventory or PRD test cases:
  Record bootstrap-proof race coverage explicitly rather than assuming it is
  covered by generic onboarding tests.

## Closure Rule

- [x] Improvement has been implemented or explicitly scheduled with owner/date.
- [x] Related artifacts were updated.
- [x] The defect is not being treated as an isolated one-off when it exposed a reusable QA gap.

## Notes

- Additional context:
  This example mirrors the kind of escaped-defect analysis the repo now expects
  when a real miss reveals a reusable gap in the QA model.
