# AI And Standards Review

## Scope

- Change:
  `notificationDelivery` email foundation with durable outbound-email records,
  attempt history, root-admin routes, and an initial `Resend` provider adapter
- Review date:
  2026-04-08

## Human Owner

- Owner:
  Gordon Rose
- Acceptance responsibility:
  the human owner remains accountable for accepting the architecture,
  provider-selection trade-offs, durable metadata model, and verification
  evidence for this slice

## AI Assistance Disclosure

- Material AI assistance:
  yes
- Assisted artifacts:
  - capability matrix refinement
  - PRD drafting and production-pitfall refinement
  - ADR drafting support
  - PRD-derived test-case drafting support
  - implementation blueprint drafting support
  - feature implementation, persistence model, and executable test drafting
  - OpenAPI, Postman, feature-doc, and data-dictionary follow-through

## Model / Tool / Version

- Tool:
  OpenAI Codex coding agent session
- Model family:
  GPT-5
- Version / exact model metadata:
  exact dated model/version metadata was not exposed in the repo-local session
  artifacts available during this change
- Evidence availability note:
  this note records the available tool and model-family evidence only; future
  workflow tooling should capture exact version metadata automatically when the
  session surface exposes it

## Source Of Truth Used

- `AGENTS.md`
- relevant architecture docs and ADRs, including
  [system-overview.md](/home/gordon/kanbien/docs/architecture/system-overview.md)
  and
  [0018-add-a-notification-delivery-feature-with-provider-agnostic-email-delivery-and-durable-attempt-history.md](/home/gordon/kanbien/docs/architecture/adr/0018-add-a-notification-delivery-feature-with-provider-agnostic-email-delivery-and-durable-attempt-history.md)
- relevant PRD and PRD test-case doc:
  [2026-04-08-0008-notification-delivery-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-08-0008-notification-delivery-foundation.md)
  and
  [2026-04-08-0008-notification-delivery-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-08-0008-notification-delivery-foundation-test-cases.md)
- implementation blueprint:
  [2026-04-08-notification-delivery-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-08-notification-delivery-foundation.md)
- scoped source files under
  [src/features/notificationDelivery](/home/gordon/kanbien/src/features/notificationDelivery)
- scoped executable tests under
  [tests/unit/notificationDelivery](/home/gordon/kanbien/tests/unit/notificationDelivery),
  [tests/integration/notificationDelivery](/home/gordon/kanbien/tests/integration/notificationDelivery),
  [tests/security/notificationDelivery](/home/gordon/kanbien/tests/security/notificationDelivery),
  and
  [tests/audit/notificationDelivery](/home/gordon/kanbien/tests/audit/notificationDelivery)

## Prompt And Data Handling

- Secrets or production credentials in prompts:
  one temporary Resend API key was pasted into chat during setup and then
  immediately revoked before implementation continued; the replacement key was
  kept in local env only and not reused in prompts
- Sensitive personal/customer/confidential data in prompts:
  none beyond repo-local architecture, code, and synthetic example addresses
- Minimization note:
  the change otherwise relied on repo-local specs, docs, source, and tests
  only; no production inbox contents, customer data, or long-lived live
  secrets were used in prompts

## Independent Verification

- Commands run:
  - `npm run typecheck`
  - `npx vitest run tests/unit/notificationDelivery/service.test.ts tests/integration/notificationDelivery/flow.test.ts tests/security/notificationDelivery/security.test.ts tests/audit/notificationDelivery/audit.test.ts`
  - `npm run test:traceability`
  - `npm run test:persistence`
  - `npm test`
- Deterministic evidence summary:
  - repo typecheck passed
  - focused notificationDelivery unit, integration, security, and audit tests
    passed
  - traceability passed with `NOTIFICATION-DELIVERY: 17/17 traceable`
  - Postgres-backed notificationDelivery persistence tests passed
  - full repo test suite passed, including the second persistence phase after
    the new persistence file was added to the shared test runner

## Dependency / Snippet Provenance

- New package or service introduced:
  `Resend` as the first live outbound email provider, consumed through a
  feature-owned provider adapter and configured through env only
- External snippet/copied-pattern provenance note:
  no third-party code snippet or new npm dependency was adopted; the adapter
  uses the runtime `fetch` surface and the vendor's documented HTTP API shape
  through repo-authored code

## Expert Review Note

- High-risk change classification:
  yes; this slice introduces a new durable communications feature, external
  provider integration, root-only sending controls, PII-bearing metadata, and
  audit-relevant resend behavior
- Human security/compliance review note:
  the design was reviewed against the repo's metadata-first, provider-agnostic,
  no-live-secret-link-storage, and future-enterprise-hardening rules before
  acceptance; retry, suppression, bounce handling, retention automation, and
  failover were explicitly deferred rather than implied

## Standards Gate Summary

- `NIST SSDF`:
  moderate for this slice; design discipline, deterministic verification, and
  explicit provider-seam ownership are strong, broader platform ops maturity
  remains partial
- `OWASP ASVS`:
  moderate for this slice; root-only authorization, secret-link redaction,
  duplicate-send guardrails, and durable attempt truthfulness are covered
- `NIST CSF 2.0`:
  low-to-moderate for this slice; governance and protective controls improved,
  detect/respond/recover gaps remain platform-wide
- `ISO 27001 / 27002`:
  moderate for this slice; artifact traceability and security-sensitive change
  discipline are strong, retention automation and operational controls remain
  partial
- `GDPR / Data Transfer`:
  applicable and partial; this slice introduces a third-party email processor
  and PII-bearing metadata, but the current design minimizes stored content and
  reserves retention/purge hardening for follow-on work
- `EU AI Act`:
  not applicable; no AI product capability was introduced
- `AI-Assisted Development`:
  partial; this note closes the main provenance gap for the slice, but exact
  model-version traceability remains limited by current session metadata

## Known Limits / Follow-Up

- Remaining evidence gaps:
  exact model/version metadata is still unavailable to record more precisely,
  and the enterprise-grade email hardening slice remains outstanding
- Follow-up action if needed:
  implement the later notification-delivery hardening slice for background
  retry, bounce/complaint handling, suppression, retention/purge, failover,
  scheduled sending, and delivery observability before treating the email
  platform as production-complete
