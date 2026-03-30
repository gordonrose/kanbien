# Testing And Verification Guide

## Purpose

Explain how the repo turns PRD intent into executable proof without silent
coverage drift.

## Source Of Truth

The current testing model uses:

- PRDs for scope and requirements
- PRD-derived test-case docs for explicit planned coverage
- executable tests for proof
- traceability checks to ensure documented `TC-*` IDs stay mapped
- lifecycle review to prevent silent test-intent drift

## Test Layers

Features should use the layers appropriate to their risk and shape:

- unit
- integration
- security
- audit
- edge
- frontend
- persistence-backed verification when durable storage behavior matters

## Persistence Modes

The current persistence-backed test model is:

- normal mode: reset-first for deterministic isolation
- preserve/debug mode: optional delayed cleanup and forensic inspection

Manifest cleanup applies only to preserved durable workflows that actually
register run-scoped data.

## Anti-Drift Expectations

- PRD-derived test-case docs are the primary planned coverage record.
- Executable tests should carry stable `TC-*` references.
- Only active/current test intent should run in the normal loop.
- Superseded or archived test intent must be proposed and reviewed explicitly.

## Recoverability Rule

To rebuild tests from specs, the repo should describe:

- required test layers by capability type
- harness expectations
- persistence-test rules
- traceability rules
- lifecycle status rules
- standards and repo-health review expectations for material changes
