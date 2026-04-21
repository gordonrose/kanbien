# Page-Shell Planning Feature Template

Use this template when defining a feature seam that plans a new governed page
 shell before template-specific population work begins.

## Purpose

- What planning problem does this seam solve?
- What durable output does it produce?
- What downstream loop consumes that output?

## Scope

- Feature name:
  ``
- Primary output:
  ``
- Supported planning posture:
  ``
- Explicitly out of scope:
  ``

## Feature Boundary

This seam owns:

- ``

This seam must not:

- ``

## Planning Loop Placement

1. ``
2. ``
3. ``

## Capabilities

- ``
- ``

## Persistence Model

### Main Plan Table

- Table name:
  ``
- Required fields:
  ``

### Junction Tables

- Table name:
  ``
- Required fields:
  ``

## Catalog Dependencies

### Repo-Sourced Catalogs

| Catalog | Purpose | Stable key | Notes |
| --- | --- | --- | --- |
| `` | `` | `` | `` |

### Runtime-Sourced Catalogs

| Catalog | Purpose | Stable key | Notes |
| --- | --- | --- | --- |
| `` | `` | `` | `` |

### Derived Values

| Value | Derivation rule |
| --- | --- |
| `` | `` |

## CSV Export Contract

### Filename

- ``

### Columns

```csv

```

### Column Definitions

| Column | Rule |
| --- | --- |
| `` | `` |

### Export Rules

- ``

## Validation Rules

Validation must fail when:

- ``

Validation may warn when:

- ``

## Lifecycle Ownership Rules

- Which capability creates a new plan, and in which initial status?
- Which capability may move a plan into export-ready or superseded states?
- Which capability owns the transition into exported state?
- Which fields are always system-managed and never client-supplied?

## Field Definition Contract

Every field should define:

- field key
- label
- placeholder
- explanatory text
- approved form child seam
- source design-system artifact
- required or optional status
- data source
- validation notes

### Form Governance Rule

Every approved form child seam must reference a signed-off design-system
 pattern or component that is an approved child seam of the governing form
 template.

### Field Definition Table

| Field key | Label | Placeholder | Explanatory text | Approved form child seam | Source design-system artifact | Required | Data source | Validation notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `` | `` | `` | `` | `` | `` | `` | `` | `` |

## Blockers And Follow-Up

- ``
