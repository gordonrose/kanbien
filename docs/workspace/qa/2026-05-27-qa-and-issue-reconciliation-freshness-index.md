# QA And Issue-Reconciliation Freshness Index

Date: 2026-05-27

Repo bucket classification: `shared-governance-kernel`.

Purpose: record a sampled freshness pass across QA operating records and
issue-reconciliation notes before any physical folder movement.

This is a cleanup index, not a replacement for the source records. It only
classifies the sampled records below.

## Freshness Lanes

- `promoted-lesson`: the record names a prevention lesson that appears to have
  been promoted into tests, helpers, skills, standards, templates, or runtime
  guardrails.
- `unresolved-caveat`: the record still names required evidence, approval, or
  production-readiness work.
- `needs-recheck`: the record names a candidate fix, watch item, or old proof
  that should be checked against current source/tests before closure.
- `historical-evidence`: the record is useful provenance but does not appear to
  carry current operating obligations.

## Sampled Records

| Record | Freshness lane | Evidence inspected | Cleanup implication |
| --- | --- | --- | --- |
| `docs/workspace/issue-reconciliations/2026-04-18-frontend-human-review-guard-hook-gap.md` | `promoted-lesson` | Names `tests/visual/designSystem/support/helpers/humanReviewGuards.ts`, design-system visual spec updates, and skill updates. Resolution status still says candidate fix awaiting user confirmation. | Keep active as learning evidence until the folder policy decides whether promoted prevention lessons should become superseded/archive records. |
| `docs/workspace/qa/2026-04-25-asset-foundation-v1-qa-waiver-or-quarantine.md` | `unresolved-caveat` | Names provider contract tests and Postgres-backed persistence proof as required before production provider rollout or customer-facing asset upload UI. Approval is `no`. | Keep visible until an assets/provider readiness pass proves, supersedes, or reopens the caveat. |
| `docs/workspace/issue-reconciliations/2026-04-15-design-system-primary-nav-overflow-menu-drift.md` | `promoted-lesson` plus `needs-recheck` | Names direct test hardening in `tests/audit/designSystem/contextNavResponsive.test.ts` and follow-up watch items. | Keep as design-system prevention evidence; recheck against current navigation tests before closure or archive. |
| `docs/workspace/issue-reconciliations/2026-05-23-count-card-route-alias-fallback.md` | `promoted-lesson` | Distinguishes source/test changes from the active user-facing process and records the runtime-process freshness lesson. | Keep available as runtime verification guardrail input. |
| `docs/workspace/qa/2026-04-09-illustrative-defect-feedback-review.md` | `historical-evidence` | Marked as illustrative and describes example follow-up testing behavior. | Retain as training/example material unless replaced by a maintained template example. |
| `docs/workspace/issue-reconciliations/2026-04-27-root-admin-profile-picture-upload-failed-message.md` | `promoted-lesson` plus `unresolved-caveat` | Names app-level degraded-state visual regressions for stale upload routes, oversized profile pictures, preview rendering, and decorative save behavior. Resolution status still says candidate fix awaiting user confirmation. | Keep active near asset/root-admin upload evidence until a targeted asset-upload audit decides whether it is superseded. |
| `docs/workspace/issue-reconciliations/2026-04-21-root-admin-breadcrumb-pressure-drift.md` | `promoted-lesson` | Names shared page-shell breadcrumb controller adoption and a desktop-width browser regression for breadcrumb/search collision. | Keep as governed app-adoption prevention evidence; future archive depends on confirming the shared page-shell seam remains current. |
| `docs/workspace/issue-reconciliations/2026-04-24-generated-canonical-render-route-fallback.md` | `promoted-lesson` | Names generated canonical render route registry, loud `404` behavior for unregistered routes, integration coverage, and launcher-chain proof. | Keep as frontend-harness routing guardrail evidence. |
| `docs/workspace/issue-reconciliations/2026-04-14-tenant-auth-bootstrap-audit-fk-mismatch.md` | `promoted-lesson` | Names the tenant-auth audit FK root cause, service fix, audit expectation refresh, and Postgres-backed regression. | Keep as backend shared-seam/persistence guardrail evidence. |
| `docs/workspace/qa/root-admin-security-matrix.md` | `promoted-lesson` | Names `tests/security/rootAdmin/permissionMatrix.test.ts` as executable proof and defines the update rule for new protected root-admin routes. | Treat as active QA/security operating artifact, not archive/history. |

## Group-Level Findings

Issue-reconciliation inventory inspected on 2026-05-27:

- 146 non-README issue-reconciliation records.
- Largest filename families by rough prefix:
  - `root-admin`: 31
  - `design-system`: 13
  - `list-detail`: 11
  - `context-nav`: 8
  - `sub-nav`: 6
  - `drawer-select`: 5
  - `canonical-renderings`: 5
- 15 records explicitly contain `candidate fix awaiting user confirmation`.

QA inventory inspected on 2026-05-27:

- 17 non-README QA records.
- These include feature QA checklists, exploratory notes, waiver/quarantine
  records, root-admin security matrix/backlog records, and illustrative
  examples.

Cleanup meaning:

- `root-admin` and design-system issue records are too large and too active to
  bulk archive. They should be grouped by governed surface and checked against
  current shared seams, visual tests, and app-adoption rules.
- Candidate-fix records should not be closed or archived until user-confirmation
  posture is reviewed or explicitly superseded.
- QA waiver/quarantine records should be checked before production-readiness
  work, especially asset/provider and persistence-backed caveats.
- Security matrices and proof backlogs should stay active when they name
  executable suites and update rules.

## Candidate Confirmation Queue

These issue-reconciliation records explicitly still contain
`candidate fix awaiting user confirmation` and should not be archived as closed
without a current recheck or explicit supersession:

- `docs/workspace/issue-reconciliations/2026-04-17-canonical-host-surface-isolation-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-17-context-nav-canonical-attachment-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-17-context-nav-magnification-offset-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-17-design-system-shell-parity-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-18-date-picker-canonical-render-surface-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-approved-form-baseline-parity-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-canonical-frame-overlay-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-canonical-render-surface-repeat-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-dark-contrast-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-frontend-human-review-guard-hook-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-simple-select-canonical-breadcrumb-chain-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-time-picker-canonical-render-surface-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-time-picker-canonical-surface-scope-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-time-picker-mobile-canonical-frame-overlay-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-27-root-admin-profile-picture-upload-failed-message.md`

Candidate queue triage:

- governed design-system canonical/control records: 14
- root-admin app asset-upload record: 1

The design-system records should be reviewed by family, not only by date:

- shell/canonical host:
  canonical host surface isolation, design-system shell parity
- context navigation:
  context-nav canonical attachment, context-nav magnification offset
- form controls:
  date picker, time picker, simple select, and drawer select records
- human-visible regression practice:
  frontend human review guard hook gap

Several current artifacts suggest these lessons may already have been promoted
into active harness behavior, including:

- `docs/workspace/design-system/component-inventory.md`
- `tests/visual/designSystem/support/helpers/humanReviewGuards.ts`
- `tests/visual/designSystem/support/helpers/canonicalOverlayGuards.ts`
- `tests/integration/frontend/designSystemCanonicalOverlayContainmentAudit.test.ts`
- `tests/integration/frontend/designSystemCanonicalRouting.test.ts`
- `.codex/skills/40-frontend/frontend-design-system-loop-maintainer/SKILL.md`
- `.codex/skills/30-testing-and-reconciliation/issue-reconciliation-maintainer/SKILL.md`

This was enough to justify a family-by-family recheck, but not enough to close
the records automatically. On 2026-05-27, the candidate source records were
given supersession notes, moved to `archive/history`, and replaced at their old
paths with breadcrumbs.

## First Family Recheck: Shell And Canonical Host

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-17-canonical-host-surface-isolation-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-17-design-system-shell-parity-drift.md`

Current evidence found:

- `docs/workspace/design-system/verification/canonical-host-surface-isolation-audit.md`
  exists as the broader follow-on audit named by the original record.
- `docs/workspace/design-system/verification/top-nav-verification-checklist.md`,
  `sub-nav-row-verification-checklist.md`, and
  `context-nav-verification-checklist.md` reference the canonical host/surface
  isolation posture.
- `tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts`
  exists and still covers shell/canonical frame behavior.
- Current design-system routes and canonicals consistently render inside
  `.design-system-shell`.

Freshness posture:

- lane: `promoted-lesson` plus `needs-recheck`
- reason: the original prevention lesson appears to have been promoted into
  verification artifacts and visual tests, but the source notes still name
  residual risks around shared document hosting, broader shell parity, and user
  confirmation.
- cleanup implication: archived with breadcrumbs after adding supersession
  notes. Keep future design-system shell authority in current verification
  artifacts, not these historical records.

## Second Family Recheck: Context Navigation Attachment And Magnification

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-17-context-nav-canonical-attachment-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-17-context-nav-magnification-offset-drift.md`

Current evidence found:

- `docs/workspace/design-system/component-inventory.md` marks `context-nav` as
  `system-ready` with signed-off `CNR-001` through `CNR-010`.
- `docs/workspace/design-system/component-inventory.md` marks `drawer` as
  `signed-off` with signed-off `CDR-*` chassis states.
- `docs/workspace/design-system/reference-packs/context-nav-drawer-reference-pack.md`
  records the `CDR-*` state set and says browser verification is complete for
  `CDR-001` through `CDR-006`, including `CDR-005` dark theme with
  magnification.
- `docs/workspace/design-system/verification/context-nav-verification-checklist.md`
  says the full `CNR-*` set was browser-reviewed and user-approved, and points
  at `tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts`.
- `tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts`
  still covers `CDR-001` through `CDR-006`, including attachment and
  magnification states.
- `tests/visual/designSystem/canonicals/shell/contextNavHostRoutes.spec.ts`
  and
  `tests/visual/designSystem/support/helpers/contextNavShellAttachment.ts`
  exist for host context-nav shell attachment checks.

Freshness posture:

- lane: `promoted-lesson` plus `needs-recheck`
- reason: the exact context-nav drawer attachment and magnification lessons
  appear to have been promoted into reference packs, verification checklists,
  and visual coverage, but the source records still require user confirmation
  and the magnification record names a reusable risk for future zoom plus
  absolute attachment math.
- cleanup implication: archived with breadcrumbs after adding supersession
  notes. Keep future context-nav/drawer authority in current reference packs,
  verification artifacts, and tests.

## Third Family Recheck: Form Child Canonical Render Surfaces

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-18-date-picker-canonical-render-surface-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-time-picker-canonical-render-surface-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-simple-select-canonical-breadcrumb-chain-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-approved-form-baseline-parity-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-canonical-frame-overlay-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-canonical-render-surface-repeat-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-dark-contrast-gap.md`

Current evidence found:

- `docs/workspace/design-system/component-inventory.md` marks `date-picker`,
  `drawer-select`, and `time-picker` as `signed-off`, with dedicated generated
  launcher and render states under `/design-system/canonical-renderings/...`.
- `docs/workspace/design-system/verification/canonical-launcher-checklist.md`
  now defines the child canonical launcher contract that the original issue
  records said was missing.
- `.codex/skills/40-frontend/frontend-design-system-loop-maintainer/SKILL.md`
  and `docs/architecture/guides/design-system-loop-harness.md` now require
  child launchers to target dedicated child render routes rather than parent
  host pages.
- Dedicated render surfaces and canonical drivers exist for `simple-select`,
  `date-picker`, `time-picker`, and `drawer-select` under
  `src/frontend/designSystem/components/` and
  `src/frontend/designSystem/assets/`.
- Current visual tests exist for the child canonical families and shared shell
  coverage:
  `datePickerCanonical.spec.ts`, `timePickerCanonical.spec.ts`,
  `simpleSelectCanonical.spec.ts`, `drawerSelectCanonical.spec.ts`, and
  `canonicalShell.spec.ts`.
- The current verification checklists for these child seams name dedicated
  launcher and render surfaces, route-level browser proof, and remaining
  adoption limits before real-app consumption.

Freshness posture:

- lane: mostly `promoted-lesson`, with selective `needs-recheck`
- reason: the repeated child-render-surface and launcher-truth lessons have
  clearly been promoted into active harness rules, design-system verification,
  and visual coverage. However, the older issue records still contain
  candidate-fix wording, and the current checklists preserve some unresolved
  limits such as second-consumer proof, direct review of some launcher sets,
  and future parity expansion.
- cleanup implication: archived with breadcrumbs after adding supersession
  notes. Keep future form child-canonical authority in the current launcher
  checklist, design-system loop skill, verification artifacts, and tests.

## Fourth Recheck: Frontend Human Review Guard Hook

Sampled record:

- `docs/workspace/issue-reconciliations/2026-04-18-frontend-human-review-guard-hook-gap.md`

Current evidence found:

- `tests/visual/designSystem/support/helpers/humanReviewGuards.ts` exists and
  provides shared helpers for containment, vertical stacking, computed
  foreground color, and named human-review guard steps.
- `.codex/skills/40-frontend/frontend-design-system-loop-maintainer/SKILL.md`
  now explicitly requires direct human-visible regression guards after escaped
  visual issues.
- `.codex/skills/30-testing-and-reconciliation/issue-reconciliation-maintainer/SKILL.md`
  is referenced by the original fix path as part of the same prevention rule.
- Current design-system verification artifacts still distinguish automated
  proof, human sign-off, and real-app adoption instead of collapsing them into
  one generic “tested” status.

Freshness posture:

- lane: `promoted-lesson`
- reason: the prevention lesson is now represented as reusable test helper
  code and skill guidance rather than remaining only in the historical issue
  note.
- cleanup implication: archived with a breadcrumb after adding a supersession
  note. Keep future human-visible regression authority in the helper and skill
  guidance.

## Fifth Recheck: Root Admin Profile Picture Upload Degraded States

Sampled record:

- `docs/workspace/issue-reconciliations/2026-04-27-root-admin-profile-picture-upload-failed-message.md`

Current evidence found:

- `docs/workspace/asset-consumer-decisions/2026-04-26-admin-profile-pictures.md`
  records the approved private profile-picture asset use case, including
  ownership, MIME and size limits, alt/decorative metadata, authorization,
  delivery safety, and lifecycle posture.
- `tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts` includes
  regression coverage for successful upload/link, decorative save after a
  previous alt-text validation miss, stale upload route messaging, and
  oversized profile-picture rejection before upload-intent creation.
- `docs/workspace/test-run-summaries/2026-04-27-root-admin-profile-picture-upload-test-summary.md`
  records the focused verification pass and explicitly calls out the
  stale-route, oversized-file, preview-rendering, and decorative-validation
  guards.
- `docs/workspace/reviews/2026-04-27-root-admin-profile-picture-upload-ai-and-standards-review.md`
  classifies the change as high-risk because it touches user-managed asset
  upload, PII-capable profile images, route contracts, private storage
  delivery, and privileged root-admin UI behavior.

Freshness posture:

- lane: `promoted-lesson` plus `unresolved-caveat`
- reason: the exact degraded-state lessons appear to be covered by current
  root-admin visual/app tests and supporting asset governance artifacts. The
  slice still carries high-risk asset/security posture, and the original issue
  note reserved final confidence for user confirmation and fresh runtime
  evidence if the stale-route symptom reappears.
- cleanup implication: archived with a breadcrumb after adding a supersession
  note that preserves the asset/security caveat. Future upload changes still
  need the asset decision gate and runtime evidence rules.

## Sixth Recheck: Time Picker Canonical Scope And Mobile Overlay

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-22-time-picker-canonical-surface-scope-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-time-picker-mobile-canonical-frame-overlay-gap.md`

Current evidence found:

- `tests/visual/designSystem/canonicals/forms/timePickerCanonical.spec.ts`
  now asserts that `TPR-006` and `TPR-007` keep the mobile overlay local to
  the dedicated canonical frame.
- The same spec now asserts that `TPR-008` and `TPR-009` scope theme,
  direction, and magnification to the render surface instead of leaking those
  stress states to the whole page.
- `docs/workspace/design-system/verification/time-picker-verification-checklist.md`
  records direct child-route proof for mobile overlay geometry, dark-theme and
  magnified open-panel stress, shared canonical overlay containment, and
  owner-reserve readiness synchronization.
- `docs/workspace/design-system/reference-packs/time-picker-reference-pack.md`
  records `TPR-006`, `TPR-007`, and `TPR-009` as dedicated child render states.

Freshness posture:

- lane: `promoted-lesson` plus `needs-recheck`
- reason: current test and verification artifacts directly cover the two
  escaped failure modes, but the historical records themselves still say local
  browser verification was pending and candidate user confirmation was needed.
- cleanup implication: archived with breadcrumbs after adding supersession
  notes. Keep future time-picker authority in current verification artifacts
  and tests.

## Folder Finding

Do not bulk-archive `docs/workspace/qa/` or
`docs/workspace/issue-reconciliations/` yet.

The sampled records show a mixed folder:

- some records already promoted lessons into executable tests or skills
- some still carry explicit unresolved production-readiness caveats
- some remain useful examples or historical evidence
- many older visual issue notes likely need closure-status recheck before being
  moved or declared current

## Next Safe Cleanup

The candidate confirmation queue has now been worked by family, updated with
source-record supersession notes, moved to `archive/history`, and replaced at
old paths with breadcrumbs.

The next safe cleanup step is to continue sampling the broader
issue-reconciliation folder by family. Do not bulk-archive records that still
carry unresolved production-readiness caveats, asset/security posture, or
current operating obligations. If closure cannot be proven without human
confirmation or explicit supersession, leave the source record unchanged and
record `needs-recheck` rather than inventing certainty.

## Seventh Recheck: Breadcrumb And Sub-Nav Canonical Drift

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-15-design-system-breadcrumb-compact-cascade-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-16-breadcrumb-reduction-order-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-16-breadcrumb-rtl-collapsed-middle-ordering-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-16-breadcrumb-rtl-menu-anchoring-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-16-breadcrumb-rtl-compact-lane-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-16-breadcrumb-rtl-lane-collapse.md`
- `docs/workspace/issue-reconciliations/2026-04-16-breadcrumb-rtl-compact-row-split.md`
- `docs/workspace/issue-reconciliations/2026-04-16-sub-nav-canonical-rendering-approach-retrospective.md`
- `docs/workspace/issue-reconciliations/2026-04-16-sub-nav-canonical-initial-render-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-16-sub-nav-canonical-tooltip-and-browser-escalation-learning.md`

Current evidence found:

- `tests/audit/designSystem/breadcrumbOverflow.test.ts` now checks breadcrumb
  overflow, RTL ordering, compact-row behavior, and reduction-order drift.
- `tests/audit/designSystem/subNavCanonicalCoverage.test.ts` now checks
  deterministic sub-nav canonical coverage, canonical launcher coverage,
  render-status readiness, and named `SNR-*` and `BCR-*` states.
- `tests/visual/designSystem/canonicals/navigation/subNav.spec.ts` provides
  browser-backed visual coverage for the canonical navigation surface.
- `docs/workspace/design-system/reference-packs/breadcrumb-reference-pack.md`
  and `docs/workspace/design-system/reference-packs/sub-nav-row-reference-pack.md`
  now hold the current review states.
- `docs/workspace/design-system/behavior-locks/breadcrumb-behavior-lock.md`
  and `docs/workspace/design-system/behavior-locks/sub-nav-row-behavior-lock.md`
  now hold the active behavior contracts.
- `.codex/skills/40-frontend/frontend-design-system-loop-maintainer/SKILL.md`
  and `docs/architecture/guides/design-system-loop-harness.md` now carry the
  browser-escalation lesson for repeated UI misses.

Freshness posture:

- lane: `promoted-lesson`
- reason: the issue notes are now historical evidence. The active design-system
  behavior, reference, verification, and test artifacts are the maintained
  authority for breadcrumb and sub-nav canonical work.
- cleanup implication: archived with breadcrumbs after adding supersession
  notes. Keep future breadcrumb/sub-nav decisions in the active design-system
  artifact chain rather than in old incident records.

## Eighth Recheck: April 15 Top-Nav And Primary-Nav Drift

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-15-design-system-header-brand-geometry-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-primary-nav-overflow-menu-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-primary-nav-slot-measurement-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-top-nav-layering-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-top-nav-preview-magnification-threshold-regression.md`

Current evidence found:

- `docs/workspace/design-system/verification/top-nav-verification-checklist.md`
  now names brand geometry, overflow/menu behavior, layering over sub-nav,
  magnification, and long-label stress as top-nav verification obligations.
- `docs/workspace/design-system/component-inventory.md` still classifies
  `top-nav` as `adopted` rather than archived or fully extracted. It also keeps
  app-vs-reference parity review and shared-seam extraction as follow-up work.
- The April 15 records themselves include follow-up watch items for constrained
  desktop visual coverage, overflow behavior, geometry-sensitive preview
  controls, and fixed-shape identity elements.

Freshness posture:

- lane: `promoted-lesson` plus `active-adoption-caveat`
- reason: the escaped-defect lessons have been promoted into the current
  top-nav verification checklist, `TRP-*` canonical visual suite, source
  audits, and root-admin shell parity evidence. The remaining open obligation
  is top-nav adoption/parity and shared-seam extraction, which is tracked in
  current top-nav design-system artifacts rather than these old issue notes.
- cleanup implication: archived with breadcrumbs after adding supersession
  notes. Do not treat the archive as saying top-nav is fully done; use the
  component inventory, verification checklist, adoption note, and component
  artifact for current top-nav obligations.
