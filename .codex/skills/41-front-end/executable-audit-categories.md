# Executable Audit Categories

This file defines the future executable audit posture for the `41-front-end`
harness.

The audit goal is not to catch only the mistakes already observed. The goal is
to enforce broad ownership categories so new wrong-layer decisions are caught
before they become accepted design-system behavior.

## Principle

Every downstream implementation decision must be classified before code, and
every runtime value, behavior, rendered child, proof control, and import path
must have an owning seam.

Examples from prior work should become seed fixtures for audits, not the full
audit scope.

## Audit Categories

### Runtime CSS Value Provenance

Audit governed layer CSS so runtime declarations are classified as one of:

- consumed from a signed Layer 2 token seam
- emitted by a governed primitive or child pattern seam
- browser-native semantic behavior
- explicitly inherited from a containing governed seam
- proof-only diagnostic pressure that is not downstream-consumable

The audit should fail unclassified runtime CSS values in governed layers, not
only known bad properties such as `scrollbar-*`.

### Interactive Affordance Provenance

Audit rendered Layer 4+ pattern output so focusable controls, triggers,
selection controls, resize handles, disclosure controls, item controls, and
other interactive affordances are consumed from governed primitive seams unless
they are explicitly browser-native structural behavior.

The audit should fail local interactive markup in patterns even when the
markup is visually small.

### Rendered Child Classification

Audit pattern contracts and runtime seams so every rendered child in a pattern
is classified as one of:

- governed primitive
- governed child pattern
- browser-native wrapper
- inherited later-layer contract
- proof-only wrapper

The audit should fail unclassified children, because an unclassified child can
hide a skipped primitive or wrong-layer composition decision.

### Proof Control Evidence

Audit rendered proof routes so every proof control has focused browser
evidence showing that changing the control changes rendered output, changes
state or event behavior, preserves promised behavior under pressure, or exposes
a blocked/not-applicable reason.

The audit should fail inert controls across all proof categories, not only the
specific controls already observed.

### Source-Material Decision Ledger

Audit source-material-derived changes so route, screenshot, template,
canonical, app-like review surface, or visible-defect work includes a preflight
decision ledger before implementation.

The audit should fail missing ledgers because source material can hide token,
primitive, pattern, component, demo, canonical, or app-layer decisions behind a
single visual request.

### Layer Seam Import Boundary

Audit downstream governed runtime code so later layers consume `layers/*`
runtime seams instead of `systems/*` proof internals, route-local markup,
copied CSS, screenshots, or governance prose when a governed seam exists.

The audit should fail construction from review artifacts.

## Seed Fixtures From May 2026

Use these observed mistakes as first fixtures for the category audits:

- header primitive skipped and rendered in the pattern
- header separator added without a signed token
- tooltip shown when text was not truncated
- supporting text styled without a signed text-style token
- current indicator marker invented before token signoff
- scrollbar skin inherited without a scrollbar token
- mobile page-scroll/internal-scroll proof control lacked clear scroll-owner evidence
- secondary index list floated below the header because composition alignment was unverified

These fixtures are examples of category failures. They must not become the
outer boundary of the audits.
