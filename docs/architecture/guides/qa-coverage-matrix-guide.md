# QA Coverage Matrix Guide

## Purpose

Define how the repo selects required verification layers for a change class so
coverage decisions are deterministic and reviewer-independent.

This guide complements:

- [Testing And Verification Guide](./testing-and-verification-guide.md)
- [End-To-End Journey Testing Guide](./end-to-end-journey-testing-guide.md)
- [QA Release Gate](../../standards/QA-RELEASE-GATE.md)

## Core Rule

Do not choose test layers ad hoc.

For each feature or change, classify the change across the coverage matrix
dimensions below and require the corresponding verification layers.

## Coverage Matrix

| Change class | Minimum required layers | Additional required checks |
| --- | --- | --- |
| Pure domain or validation logic | unit; integration when cross-module behavior exists | edge cases |
| Auth, session, credential, or recovery flow | unit; integration; end-to-end; security; audit; persistence-backed when durable state matters | structured exploratory QA |
| Authorization, tenant isolation, or permission model | unit; integration; end-to-end; security; audit | deny coverage; structured exploratory QA |
| Persistence schema or migration change | unit where applicable; integration; persistence-backed; end-to-end when user-visible workflow changes | migration safety review |
| External provider or integration boundary | unit; integration; end-to-end when workflow changes; compatibility/contract | higher-environment validation if repo-local proof is insufficient |
| Billing-critical or irreversible workflow | unit; integration; end-to-end; audit; persistence-backed | structured exploratory QA; failure-path review |
| Compliance/privacy/retention/deletion workflow | unit; integration; end-to-end; security when access rules apply; audit; persistence-backed | structured exploratory QA |
| Concurrency-, retry-, or idempotency-sensitive workflow | unit; integration; concurrency/idempotency; end-to-end when user-visible workflow changes | resilience/failure-injection where relevant |
| Performance-sensitive or high-volume workflow | unit; integration; performance | resilience when degraded dependency behavior matters |
| Frontend user experience change | frontend; integration; end-to-end when workflow changes | accessibility; compatibility as applicable |
| Shared platform seam or middleware change | unit; integration; affected end-to-end; security and audit when the seam affects them | widened impact analysis required |

## Non-Functional Coverage Classes

The repo should treat these as first-class QA coverage classes when triggered:

- `performance`
  latency, throughput, or resource behavior matters
- `resilience`
  degraded dependency behavior, retries, backoff, or failure injection matters
- `concurrency/idempotency`
  duplicate submission, race conditions, replay, or concurrent mutation matters
- `compatibility/contract`
  external provider, client, schema, or browser/API boundary can drift
- `accessibility`
  frontend surface is introduced or materially changed

## Widening Rules

If any of the following change, widen the required suite set automatically:

- shared auth/session middleware
- shared permission or tenant-context evaluation
- migration order, shared persistence harness, or durable table ownership
- API contract shared by multiple consumers
- external provider contract or adapter
- rate limiting, abuse protection, or other shared security control

When in doubt, widen rather than narrow.

## Risk Triggers For Structured Exploratory QA

Require structured exploratory QA when the change is:

- hard to model completely with deterministic automation
- high-risk for user trust or compliance
- likely to have state-machine complexity or ambiguous failure messaging
- dependent on multiple feature seams interacting

## Minimal Feature-Loop Output

Every material feature loop should record:

- change-class classification
- required layers from this matrix
- chosen executable suites
- any intentionally deferred layer and why it is acceptable

## Anti-Drift Rule

If an escaped defect reveals that the current matrix under-classified a change
type, update this guide rather than treating the miss as feature-local only.
