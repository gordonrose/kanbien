# Story/Task Split Reconciliation Audit

## Status

- Status: `stub-open`
- Date opened: 2026-04-29
- Related design lock:
  `docs/workspace/harness-audits/2026-04-29-story-task-layer-design-lock.md`
- Archive reference:
  `docs/workspace/harness-archives/2026-04-29-pre-story-task-split/`

## Purpose

Track whether the Story Breakdown and Task Breakdown harness changes preserve
the useful parts of the existing harness while reducing vague implementation
work, wrong-layer proof, artifact drift, and expedient shortcutting.

This audit should be completed after the first implementation pass updates the
architecture, standards, templates, skills, and validators.

## Intended Change

Introduce Story Breakdown as the layer that converts approved Technical
Steering into the smallest deliverable and verifiable stories, and Task
Breakdown as the layer that converts approved stories into isolated execution
tasks.

The first implementation pass is expected to add Layer 3 Story Breakdown
artifacts and deterministic validation without rewriting the entire harness.

## Reconciliation Checklist

- Existing guidance retained:
  TBD
- Existing guidance superseded:
  TBD
- Existing guidance moved:
  TBD
- Duplicated stop conditions found:
  TBD
- Conflicts introduced between live skills/templates/docs:
  TBD
- Validator coverage for vague stories:
  TBD
- Validator coverage for missing proof layers:
  TBD
- Validator coverage for missing dependency or seam mapping:
  TBD
- Validator coverage for architecture invention:
  TBD
- Validator coverage for missing capability-matrix posture:
  TBD
- Evidence that Story Breakdown reduces vague delivery work:
  TBD

## Open Risks

- The live harness may temporarily contain both older combined breakdown
  language and newer Story Breakdown language.
- Story Breakdown could become too large if detailed PRD test-case authoring or
  implementation blueprinting is copied into the template.
- Existing skills may need follow-up routing edits so Delivery does not bypass
  Story Breakdown for material steered work.

## Completion Notes

TBD
