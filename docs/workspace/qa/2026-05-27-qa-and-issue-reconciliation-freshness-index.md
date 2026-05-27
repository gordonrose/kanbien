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
| `docs/workspace/qa/2026-04-09-illustrative-defect-feedback-review.md` | `historical-evidence` | Marked as illustrative and describes example follow-up testing behavior. | Archived with breadcrumb on 2026-05-27 because it is training/example provenance, not active QA authority. |
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

## Ninth Recheck: Context-Nav Canonical And Adoption Drift

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-16-context-nav-canonical-frame-geometry-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-16-context-nav-canonical-sub-nav-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-16-context-nav-overlap-lane-reservation.md`
- `docs/workspace/issue-reconciliations/2026-04-16-context-nav-ref-state-precedence-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-16-design-system-context-nav-item-invention.md`
- `docs/workspace/issue-reconciliations/2026-04-16-root-admin-context-nav-signoff-order-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-16-root-admin-context-nav-tooltip-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-16-unapproved-top-level-context-nav-ia.md`
- `docs/workspace/issue-reconciliations/2026-04-21-root-admin-web-hierarchy-context-nav-shell-key-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-22-root-admin-context-nav-host-seam-correction.md`
- `docs/workspace/issue-reconciliations/2026-04-22-root-admin-context-nav-mobile-more-seam-correction.md`
- `docs/workspace/issue-reconciliations/2026-04-25-context-nav-canonical-theme-rtl-cleanup.md`
- `docs/workspace/issue-reconciliations/2026-04-28-context-nav-parent-owner-feature-loop-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-28-form-template-context-nav-shell-scope.md`
- `docs/workspace/issue-reconciliations/2026-04-28-root-admin-context-nav-icons-links.md`

Current evidence found:

- `docs/workspace/design-system/component-inventory.md` marks `context-nav` as
  `system-ready` with signed-off `CNR-001` through `CNR-010`, while keeping
  first-consumer parity as the next honest adoption gate.
- `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`,
  `docs/workspace/design-system/reference-packs/context-nav-reference-pack.md`,
  `docs/workspace/design-system/patterns/context-nav-pattern.md`, and
  `docs/workspace/design-system/verification/context-nav-verification-checklist.md`
  now carry the active design-system contract.
- `docs/workspace/design-system/adoption/root-admin-shell-context-nav-adoption-contract.md`
  records the current root-admin first-consumer boundary and states that
  `rootAdminShell` consumes the DS-owned context-nav host and item-render seams.
- `tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts`,
  `contextNavHostRoutes.spec.ts`, and
  `tests/visual/designSystem/support/helpers/contextNavShellAttachment.ts`
  cover canonical frame, host route, attachment, theme, direction, and
  state-precedence behavior.
- `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts` and
  `rootAdminShellParity.spec.ts` cover the real root-admin consumer, including
  mobile `More`, tooltip behavior, display-settings launch, and parity checks.
- `tests/audit/designSystem/contextNavDrawerArtifacts.test.ts` and
  `tests/audit/designSystem/contextNavResponsive.test.ts` protect related
  artifact and responsive seams.

Freshness posture:

- lane: `promoted-lesson` plus `active-adoption-caveat`
- reason: the older context-nav design-system, host-seam, mobile-more,
  tooltip, IA, shell-key, and parent-owner lessons have current homes in the
  design-system artifact chain, root-admin adoption contract, and executable
  tests. The one record left active is
  `2026-04-28-root-admin-context-nav-icons-links.md` because it still says the
  user's original live browser/data state requires confirmation.
- cleanup implication: archived the promoted records with breadcrumbs. Do not
  treat the archive as saying context-nav has no active obligations; use the
  component inventory, context-nav verification checklist, root-admin adoption
  contract, and the remaining active icons/links issue note for current risk.

## Tenth Recheck: QA Example And Context-Nav QA Evidence

Sampled records:

- `docs/workspace/qa/2026-04-09-illustrative-defect-feedback-review.md`
- `docs/workspace/qa/2026-04-09-illustrative-qa-waiver-or-quarantine.md`
- `docs/workspace/qa/2026-04-28-context-nav-parent-owner-settings-qa-checklist.md`

Current evidence found:

- The two April 9 QA files explicitly identify themselves as illustrative
  examples, not real production escapes or current waivers.
- The context-nav parent-owner QA checklist is point-in-time evidence for the
  same feature-loop lesson archived in the ninth recheck. Current authority
  lives in the related tests, traceability evidence, feature-loop artifact
  requirements, and the archived full note.

Freshness posture:

- lane: `historical-evidence`
- reason: these records remain useful provenance or training material, but
  they are not active QA operating authority.
- cleanup implication: archived with breadcrumbs. Leave unresolved waivers,
  security matrices, root-admin test backlogs, and current freshness indexes in
  `docs/workspace/qa/`.

## Eleventh Recheck: Generated Canonical Routing Guardrails

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-21-generated-canonical-launcher-breadcrumb-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-22-canonical-renderings-batch-3-visible-routing-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-generated-canonical-index-launcher-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-24-generated-canonical-render-route-fallback.md`

Current evidence found:

- `docs/workspace/design-system/component-inventory.md` marks `launcher` and
  `canonical-render-page` as `system-ready` and requires generated launcher
  publication to stay coupled to persisted registry truth, render-surface
  proof, specimen markers, fallback absence, theme scope, responsive width, and
  overlay containment.
- `docs/architecture/guides/design-system-loop-harness.md` now records the
  generated canonical launcher and render-route contract, including direct
  child render surfaces and the rule that launcher wiring must prove the full
  click chain.
- `src/frontend/designSystem/router.ts` contains the generated canonical
  render route handling and fails unregistered design-system routes with `404`
  rather than treating the overview shell as success.
- `tests/integration/frontend/designSystemCanonicalRouting.test.ts` and
  generated canonical visual specs cover direct generated route resolution,
  launcher/index click-through, and exact render-surface truth.

Freshness posture:

- lane: `promoted-lesson`
- reason: these records describe generated routing/index/launcher classes that
  now have maintained architecture guidance, router behavior, integration
  tests, and visual route-chain proof.
- cleanup implication: archived with breadcrumbs. Generated canonical records
  that still name open localhost/user-confirmation or theme-scope caveats were
  left active for later family review.

## Twelfth Recheck: Tenant Auth QA Evidence

Sampled records:

- `docs/workspace/qa/2026-04-09-tenant-auth-foundation-exploratory-qa-note.md`
- `docs/workspace/qa/2026-04-09-tenant-auth-foundation-qa-checklist.md`
- `docs/workspace/qa/2026-04-10-tenant-auth-policy-foundation-exploratory-qa-note.md`
- `docs/workspace/qa/2026-04-10-tenant-auth-policy-foundation-qa-checklist.md`
- `docs/workspace/qa/2026-04-13-tenant-auth-policy-session-expiry-exploratory-qa-note.md`
- `docs/workspace/qa/2026-04-13-tenant-auth-policy-session-expiry-qa-checklist.md`

Current evidence found:

- Current tenant-auth architecture authority lives in ADR-0019 and the
  authentication/authorization guides.
- Current planning authority lives in the related PRDs, journey inventories,
  test-case docs, and implementation blueprints.
- Current verification authority lives in the test summaries and executable
  tenant-auth, tenant-auth-policy, security, audit, persistence, and E2E tests.
- The QA files themselves are completed point-in-time exploratory notes and
  checklists rather than active waivers or current test backlogs.

Freshness posture:

- lane: `historical-evidence`
- reason: these records are useful release/provenance evidence, but they do not
  carry current operating obligations once the test summaries, architecture
  docs, source, and executable tests are the maintained authorities.
- cleanup implication: archived with breadcrumbs. Unresolved waivers and active
  QA operating records remain in `docs/workspace/qa/`.

## Thirteenth Recheck: Completed Backend QA Checklists

Sampled records:

- `docs/workspace/qa/2026-04-14-tenant-admin-onboarding-restart-qa-checklist.md`
- `docs/workspace/qa/2026-04-22-capability-contract-catalog-foundation-qa-checklist.md`
- `docs/workspace/qa/2026-04-25-job-processing-foundation-qa-checklist.md`

Current evidence found:

- Tenant-admin onboarding restart and capability-contract catalog records are
  completed point-in-time QA checklists with current authority in source,
  PRD/test artifacts, test summaries, and executable tests.
- `docs/workspace/qa/2026-04-25-job-processing-foundation-qa-checklist.md`
  explicitly says the QA decision is `partial` and names Redis/Postgres/full
  release-gate evidence that was not complete in that session.

Freshness posture:

- lane: `historical-evidence` for tenant-admin onboarding restart and
  capability-contract catalog.
- lane: `unresolved-caveat` for job-processing foundation.
- cleanup implication: archived the completed tenant-admin and
  capability-contract catalog records with breadcrumbs. Kept job-processing QA
  active until the provider/persistence/release-gate caveats are resolved or
  superseded.

## Fourteenth Recheck: Asset Foundation QA Caveats

Sampled records:

- `docs/workspace/qa/2026-04-25-asset-foundation-v1-exploratory-qa-note.md`
- `docs/workspace/qa/2026-04-25-asset-foundation-v1-qa-checklist.md`
- `docs/workspace/qa/2026-04-25-asset-foundation-v1-qa-waiver-or-quarantine.md`

Current evidence found:

- The exploratory note says `concerns found` and keeps tenant-route
  integration, expert SVG review, production provider proof, and
  environment-backed Postgres proof as explicit remaining evidence items.
- The QA checklist says the QA decision is `concerns found` and leaves the
  Postgres-backed persistence suite unchecked.
- The waiver/quarantine record is not approved. It says production provider
  rollout and the first customer-facing asset upload UI remain blocked until
  provider contract tests and Postgres-backed persistence proof exist.

Freshness posture:

- lane: `unresolved-caveat`
- reason: these records are not stale historical notes. They still describe
  active safety, provider, persistence, and consumer-readiness gates for the
  assets foundation.
- cleanup implication: keep the asset QA records active in `docs/workspace/qa/`
  until an assets/provider readiness pass proves, supersedes, or reopens the
  caveats.

## Fifteenth Recheck: Tenant-Auth Audit FK Lesson

Sampled record:

- `docs/workspace/issue-reconciliations/2026-04-14-tenant-auth-bootstrap-audit-fk-mismatch.md`

Current evidence found:

- `src/features/tenantAuth/domain/service.ts` still documents that tenant-auth
  events must not populate the root-auth `auth_principal_id` foreign key in
  platform audit storage.
- `tests/integration/tenantAuth/persistence.test.ts` includes
  `TC-TENANT-AUTH-AUD-001`, which persists the bootstrap audit event in
  Postgres and expects `auth_principal_id: null`.
- `tests/audit/tenantAuth/audit.test.ts` keeps tenant-auth bootstrap and
  follow-on auth lifecycle events audit-visible.
- `docs/data-dictionary/auth-audit-event.md` documents the audit entity and
  its root-auth foreign-key ownership.

Freshness posture:

- lane: `promoted-lesson`
- reason: the escaped persistence/audit-seam lesson has active homes in code,
  tests, and maintained data-dictionary documentation.
- cleanup implication: archived with breadcrumb. Keep future tenant-auth audit
  authority in the maintained tenant-auth tests, service seam, and auth-audit
  data dictionary.

## Sixteenth Recheck: List-Page And List-Detail Incident Family

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-17-list-detail-panel-half-page-scroll-flicker.md`
- `docs/workspace/issue-reconciliations/2026-04-17-list-detail-panel-magnified-header-compaction-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-17-list-detail-panel-mobile-header-growth-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-17-list-detail-split-layout-*.md`
- `docs/workspace/issue-reconciliations/2026-04-24-list-detail-split-layout-canonical-ready-before-fit.md`
- `docs/workspace/issue-reconciliations/2026-04-17-list-page-*.md`

Current evidence found:

- `docs/workspace/design-system/component-inventory.md` classifies
  `list-page-structure`, `list-record-card`, `list-detail-panel`, and
  `list-detail-split-layout` as signed-off governed seams with explicit
  second-consumer follow-up before any `system-ready` promotion.
- `docs/workspace/design-system/verification/list-detail-panel-verification-checklist.md`
  records signed-off rendered proof for half-page, mobile, RTL, theme,
  magnification, long-content, local-error, focus-entry, and scroll-stability
  states.
- `docs/workspace/design-system/verification/list-detail-split-layout-verification-checklist.md`
  records dedicated generated render surfaces, ready-after-fit behavior,
  closed/open/mobile/RTL/magnified/squashed states, and overlay containment.
- Current visual and audit coverage exists for list-page and list-detail
  surfaces, including the root-admin first-consumer list-page adoption proof.

Freshness posture:

- lane: `promoted-lesson` plus `active-adoption-caveat`
- reason: the old incident lessons now have active homes in design-system
  behavior locks, reference packs, verification checklists, component
  inventory, render routes, and tests. The remaining obligation is second
  governed-consumer or app-adoption proof, which belongs in those active
  design-system artifacts rather than in old incident notes.
- cleanup implication: archived the list-page/list-detail issue records with
  breadcrumbs. Do not interpret the archive as `system-ready`; use the current
  design-system artifact chain for that decision.

## Seventeenth Recheck: Canonical Render-Page Contract Incidents

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-21-canonical-render-page-pattern-proxy-mismatch.md`
- `docs/workspace/issue-reconciliations/2026-04-21-canonical-render-page-pattern-selector-change-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-canonical-theme-scope-contract-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-canonical-mobile-overlay-containment-contract-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-canonical-renderings-owner-reserve-and-mobile-overlay-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-24-canonical-renderings-shell-and-theme-scope-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-25-canonical-render-page-theme-scope.md`
- `docs/workspace/issue-reconciliations/2026-04-25-canonical-drawer-containment-gap.md`

Current evidence found:

- `docs/workspace/design-system/component-inventory.md` classifies
  `canonical-render-page` as `system-ready` and names generated route coupling,
  specimen markers, fallback absence, theme scope, responsive width, and
  overlay containment as current obligations.
- `docs/workspace/design-system/templates/canonical-render-page-template.md`,
  `docs/workspace/design-system/reference-packs/canonical-render-page-reference-pack.md`,
  and `docs/workspace/design-system/verification/canonical-render-page-verification-checklist.md`
  now carry the active render-page contract.
- `tests/integration/frontend/designSystemCanonicalThemeScopeAudit.test.ts`,
  `tests/integration/frontend/designSystemCanonicalOverlayContainmentAudit.test.ts`,
  `tests/visual/designSystem/support/helpers/canonicalOverlayGuards.ts`, and
  `tests/visual/designSystem/support/helpers/generatedCanonicalGuards.ts`
  now protect the repeated theme-scope and containment lessons.

Freshness posture:

- lane: `promoted-lesson`
- reason: these incidents describe canonical render-page contract gaps that
  now have maintained template/reference/verification artifacts and executable
  coverage.
- cleanup implication: archived with breadcrumbs. The visible-worktree
  verification record stayed active because it is a workflow/runtime
  confirmation lesson, not merely a canonical-render-page contract lesson.

## Eighteenth Recheck: Form-Control Canonical Incidents

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-18-simple-select-*.md`
- `docs/workspace/issue-reconciliations/2026-04-24-simple-select-canonical-ready-before-reserve.md`
- `docs/workspace/issue-reconciliations/2026-04-18-time-picker-canonical-render-surface-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-time-picker-*.md`
- `docs/workspace/issue-reconciliations/2026-04-18-date-picker-canonical-render-surface-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-date-picker-canonical-anchored-panel-reserve-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-24-choice-list-panel-canonical-ready-before-settle.md`
- `docs/workspace/issue-reconciliations/2026-04-24-icon-picker-canonical-modal-ink-and-grid.md`

Current evidence found:

- `docs/workspace/design-system/component-inventory.md` records current
  signed-off or system-ready posture for dropdowns/simple-select, date-picker,
  and time-picker, with second-consumer obligations kept in active design-system
  artifacts.
- The active simple-select, date-picker, time-picker, and related verification
  checklists/reference packs now own the canonical render-surface, route,
  theme, RTL, reserve, overlay, and ready-after-settle contracts.
- `tests/integration/frontend/designSystemCanonicalLauncherLinkAudit.test.ts`,
  `tests/integration/frontend/designSystemCanonicalRouting.test.ts`,
  `tests/integration/frontend/designSystemCanonicalOverlayContainmentAudit.test.ts`,
  and the form-control visual canonical specs cover the promoted lessons.

Freshness posture:

- lane: `promoted-lesson`
- reason: these form-control incident records now duplicate active
  design-system artifact and test authority.
- cleanup implication: archived with breadcrumbs. Drawer-select records were
  left for a separate pass because that family has more adoption-specific
  evidence and references.

## Nineteenth Recheck: Drawer-Select Canonical Incidents

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-canonical-frame-overlay-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-canonical-render-surface-repeat-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-dark-contrast-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-dark-mobile-descriptive-contrast-gap.md`

Current evidence found:

- `docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md`,
  `docs/workspace/design-system/reference-packs/drawer-select-reference-pack.md`,
  and `docs/workspace/design-system/verification/drawer-select-verification-checklist.md`
  now own the active drawer-select child-seam contract.
- The `DSR-001` through `DSR-027` generated canonical matrix covers desktop,
  RTL, mobile, dark, magnified, long-label, localized, disabled, empty, and
  synchronization states.
- `tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts`
  now covers generated launcher routes, direct render surfaces, overlay
  containment, approved host screenshot parity, and the dark contrast cases.

Freshness posture:

- lane: `promoted-lesson`
- reason: these drawer-select incidents now duplicate active behavior-lock,
  reference-pack, verification-checklist, generated-route, and visual-test
  authority.
- cleanup implication: archived with breadcrumbs. The earlier approved-form
  baseline parity note was already archived in the form-child canonical pass.
  Do not treat this archive as `system-ready`; the reference pack still says
  second governed consumer proof is required before that promotion.

## Twentieth Recheck: Page-Shell Governance Incidents

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-16-design-system-page-shell-trio-rule.md`
- `docs/workspace/issue-reconciliations/2026-04-22-root-admin-post-login-page-shell-host-drift.md`

Current evidence found:

- `docs/workspace/design-system/README.md`,
  `docs/architecture/guides/design-system-loop-harness.md`, and
  `docs/workspace/design-system/canonical-and-parity-conventions.md` now carry
  the active design-system page-shell trio rule for public preview, launcher,
  and canonical-render routes.
- `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts` now checks
  every post-login routed surface for the governed page-shell section posture.
- `tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts` now compares
  the root-admin shell and Users page host posture against the signed-off
  design-system source surfaces.

Freshness posture:

- lane: `promoted-lesson`
- reason: these page-shell governance incidents now duplicate maintained
  design-system guidance, root-admin shell parity tests, and governed
  page-host posture tests.
- cleanup implication: archived with breadcrumbs. This archive does not mark
  the broader governed shell migration, page-shell banner wider reuse, or
  second-consumer proof complete.

## Twenty-First Recheck: Display-Settings Incidents

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-17-display-settings-scrollbar-style-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-17-display-settings-selection-close-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-26-display-settings-dark-drawer-ink.md`

Current evidence found:

- `docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md`,
  `docs/workspace/design-system/reference-packs/display-settings-reference-pack.md`,
  `docs/workspace/design-system/verification/display-settings-verification-checklist.md`,
  and `docs/workspace/design-system/adoption/root-admin-display-settings-adoption-contract.md`
  now carry the active display-settings payload authority.
- `docs/workspace/design-system/component-inventory.md` records
  `display-settings` as `signed-off` with the second-consumer obligation still
  active.
- `tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts`
  covers `DSR-002` dark readability, in-drawer setting changes staying open,
  and signed-off scrollbar styling.
- `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts` covers the
  first app subset for open/close, theme, magnification, mobile attachment,
  and RTL localization.

Freshness posture:

- lane: `promoted-lesson`
- reason: these display-settings incidents now duplicate maintained
  design-system artifact and visual-test authority.
- cleanup implication: archived with breadcrumbs. This archive does not mark
  display-settings `system-ready`; the component inventory still requires
  second governed consumer proof.

## Twenty-Second Recheck: Form-Template And Drawer-Form Incidents

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-18-form-mobile-picker-hidden-state-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-18-form-template-drawer-focus-steal.md`
- `docs/workspace/issue-reconciliations/2026-04-20-form-template-route-source-text-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-27-drawer-form-canonical-contract-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-27-drawer-form-canonical-stepper.md`
- `docs/workspace/issue-reconciliations/2026-04-27-drawer-form-render-harness-seam-drift.md`

Current evidence found:

- `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
  now names hidden mobile picker preservation and display-settings focus
  handoff as active parent form-template contract.
- `tests/integration/designSystem/route.test.ts` includes direct
  form-template host-route corruption coverage.
- `tests/integration/frontend/designSystemCanonicalOverlayContainmentAudit.test.ts`
  covers the mobile picker `:not(.hidden)` overlay selector contract.
- `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts` covers the
  display-settings focus handoff regression.
- `docs/workspace/design-system/reference-packs/drawer-form-reference-pack.md`,
  `docs/workspace/design-system/verification/drawer-form-verification-checklist.md`,
  and `tests/visual/designSystem/canonicals/data-display/drawerForm.spec.ts`
  now own the drawer-form generated render-page metadata, stepper, local
  direction/theme scope, parent shell seam consumption, and overlay
  containment lessons.
- The frontend design-system loop skill now carries the generated
  canonical-render-page and child-parent seam adoption gates.

Freshness posture:

- lane: `promoted-lesson`
- reason: these incidents now duplicate maintained form-template,
  drawer-form, generated-canonical, route-smoke, and visual-test authority.
- cleanup implication: archived with breadcrumbs. This archive does not mark
  drawer-form app adoption complete; the active drawer-form reference pack
  still requires app consumers to use the shared drawer shell and form body
  seams or record an explicit approved adapter.

## Twenty-Third Recheck: Design-System Infrastructure And Canonical Incidents

Sampled records:

- `docs/workspace/issue-reconciliations/2026-04-21-design-system-shared-top-nav-scaffold-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-21-design-system-top-nav-page-settings-unwired.md`
- `docs/workspace/issue-reconciliations/2026-04-22-canonical-responsive-width-contract-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-dark-theme-heading-token-audit-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-17-canonical-shell-navigation-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-17-canonical-stage-header-theme-ink-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-19-hierarchy-tree-csp-inline-assets.md`
- `docs/workspace/issue-reconciliations/2026-04-26-hierarchy-tree-render-drawer-containment.md`
- `docs/workspace/issue-reconciliations/2026-04-27-canonical-renderings-tree-sync-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-26-async-activity-waiting-progress-complete.md`
- `docs/workspace/issue-reconciliations/2026-04-16-design-system-breadcrumb-business-logic-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-16-canonical-home-icon-flicker.md`
- `docs/workspace/issue-reconciliations/2026-04-17-sub-nav-breadcrumb-truncation-contract-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-17-sub-nav-canonical-breadcrumb-tooltip-resync-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-17-sub-nav-reduced-canonical-width-truth-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-20-icon-grid-modal-layout-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-21-launcher-template-csp-inline-width-regression.md`

Current evidence found:

- Active top-nav shell runtime, static fallback, component inventory, and
  visual-test authority now own the shared scaffold, page-setting wiring, and
  governed hydration lessons.
- Generated canonical render-page, template, reference, and verification
  artifacts plus `designSystemCanonicalResponsiveWidthAudit`,
  `designSystemTypographyThemeAudit`, `designSystemCanonicalRouting`,
  `canonicalShell.spec`, and `generatedCanonicalRenderingsIndex.spec` now own
  the responsive width, dark heading token, routing, and shell/stage-header
  lessons.
- Hierarchy-tree behavior, reference, verification, and adoption artifacts plus
  `hierarchyTree.spec` and routing tests now own the CSP-safe rendering,
  drawer containment, and generated tree-sync lessons.
- Async activity drawer behavior, reference, verification, component inventory,
  and `asyncActivityDrawer.spec` now own the waiting-progress completion
  lesson.
- Breadcrumb and sub-nav reference packs, audits, and `subNav.spec` now own the
  breadcrumb content, truncation, tooltip resync, reduced-width, and home-icon
  settling lessons.
- Icon-grid behavior, reference, verification, and `iconGridCanonical.spec` now
  own the modal layout lesson.
- Launcher-template reference and verification artifacts plus `launcher.spec`
  now own the inline width and geometry lesson.

Freshness posture:

- lane: `promoted-lesson`
- reason: these incidents now duplicate maintained design-system
  infrastructure, canonical, route-smoke, and visual-test authority.
- cleanup implication: archived with breadcrumbs. This archive is limited to
  promoted lessons; live root-admin state, explicit user-review records, app
  adoption governance, and unresolved frontend governance notes remain active.
