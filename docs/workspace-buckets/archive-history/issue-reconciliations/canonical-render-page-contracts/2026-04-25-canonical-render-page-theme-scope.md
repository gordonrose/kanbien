# 2026-04-25 Canonical Render Page Theme Scope

> Archived on 2026-05-27 during the workspace QA and issue-reconciliation
> cleanup. The prevention lesson is now promoted into canonical-render-page
> theme-scope checks, current template/reference-pack authority, and active
> visual/integration tests.

## Symptom

During localhost review of generated canonical rendering routes, dark and
desert theme states could affect the top page container and render-page intro
chrome instead of staying limited to the rendering/specimen container.

This contradicted the current canonical-rendering process, where the outer
page shell remains stable review chrome and only the reviewed rendering surface
may receive the canonical state theme.

## Root Cause

The shared design-system controller in `app.mjs` still applied
`data-theme-scope` to `.canonical-render-layout` for top-nav, sub-nav, and
context-nav canonical surfaces. That layout wraps both the render-page intro
container and the specimen frame, so applying theme there allowed dark/desert
tokens to cascade into page chrome.

Newer generated child controllers had already learned to delete
`data-theme-scope` from `.canonical-render-layout` and apply theme directly to
the preview frame, but the older shared navigation controller still contained
the pre-fix behavior. That split explains why this class of issue kept
recurring family by family.

## Why The Existing Loop Missed It

Existing route tests verified that theme did not reach `documentElement`, but
some still expected `.canonical-render-layout` to carry the theme. That made
the tests bless the exact page-template-level leak the newer process now
forbids.

Coverage also focused on individual family fixes instead of asserting the
architecture-level rule: render-page chrome must not have an ancestor with
`data-theme-scope`; only the specimen surface should.

## Reconciliation Changes

- Removed `.canonical-render-layout` as a local appearance-scope fallback in
  the shared navigation controller.
- Stopped applying `data-theme-scope` to top-nav, sub-nav, and context-nav
  canonical render layouts.
- Updated top-nav, sub-nav, and context-nav tests so `documentElement`, the
  render intro, and `.canonical-render-layout` must remain unthemed while the
  specimen canvas/shell receives the requested theme.
- Added canonical-render-page template coverage proving dark and desert render
  controls theme only the specimen lane, not the top nav or intro chrome.

## Coverage Lesson

Theme-scope checks must assert both sides of the boundary:

- forbidden scope: document, top page chrome, render intro, and
  `.canonical-render-layout`
- allowed scope: the specific specimen frame, canvas, or shell

Checking only that document-level theme is absent is not enough.

## Follow-Up Watch Items

- Consider extracting a shared visual-test helper for canonical render theme
  containment once the next family touches this seam.
- Continue auditing older family controllers for direct writes to broad wrapper
  nodes before treating all canonical renderings as fully template-governed.
- Keep final resolution open until the user confirms the visible top container
  no longer changes on the affected localhost routes.
