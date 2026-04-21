# Page-Shell Planning Feature Spec

## Purpose

Define a dedicated feature seam for planning a new governed frontend page shell
 before template-specific population work begins.

This feature exists to:

- persist page-shell plans in durable storage
- validate plans against current repo-aware and runtime-aware option catalogs
- export a deterministic CSV artifact that Codex can consume in the frontend
  implementation loop
- define the field contract that a future planning UI must follow

This feature does not define template-specific content mapping such as list
 card field bindings, drawer actions, or child-seam
 population.

## Scope

- Feature name:
  `pageShellPlanning`
- Primary output:
  `new-page-shell-matrix.csv`
- Initial use case:
  planning one new governed page at a time
- Supported planning posture:
  new page shell only
- Explicitly out of scope:
  existing-page mutation
  template-specific field mapping
  child-component population
  page-local action mapping

## Feature Boundary

This seam owns:

- selecting an existing feature area or owning module
- selecting an existing page hierarchy location
- selecting a signed-off page template family
- selecting existing allowed root-role keys
- defining route, page name, page purpose, and nav posture
- deriving the canonical design-system source from the chosen template family
- exporting the page-shell plan as deterministic CSV

This seam must not:

- ask template-specific mapping questions
- infer unsupported permissions or broaden visibility contracts
- accept exploratory or unsigned design-system templates
- allow arbitrary local form controls outside approved design-system form child
  seams

## Planning Loop Placement

The intended upstream and downstream loop is:

1. Sync or query selectable catalogs.
2. Create or edit a page-shell plan.
3. Validate whether the plan is export-ready.
4. Export the plan into `new-page-shell-matrix.csv`.
5. Commit the CSV into the repo.
6. Hand off to a template-specific planning seam.
7. Generate the downstream frontend implementation contract and verification
   work from the exported artifact.

## Capabilities

The initial feature capabilities are:

- `createPageShellPlan`
- `updatePageShellPlan`
- `getPageShellPlan`
- `listPageShellPlans`
- `listAvailablePageShellTemplates`
- `listAvailablePageShellRoles`
- `listAvailablePageHierarchyNodes`
- `listAvailablePageShellFeatureAreas`
- `validatePageShellPlan`
- `exportPageShellPlanCsv`

These catalog capabilities are part of the feature contract, not just hidden
 dependencies.

The planner must expose current selectable values for every field that relies
 on repo-sourced or runtime-sourced option truth.

An aggregated catalog bootstrap endpoint may exist later as a convenience, but
 it should be understood as a transport convenience over explicit catalog
 capabilities rather than as the only contract surface.

## Persistence Model

### Main Plan Table

Recommended durable table:

- `frontend_page_shell_plans`

Recommended fields:

- `page_shell_plan_id`
- `page_id`
- `page_name`
- `page_hierarchy_id`
- `feature_area_id`
- `route`
- `shell_context_id`
- `page_purpose`
- `template_family_id`
- `secondary_nav_label` nullable
- `status`
- `notes` nullable
- `created_at`
- `updated_at`
- `exported_at` nullable
- `superseded_at` nullable

### Allowed Roles Junction

Use a normalized junction table rather than storing role keys in a
 comma-separated column.

Recommended durable table:

- `frontend_page_shell_plan_roles`

Recommended fields:

- `page_shell_plan_role_id`
- `page_shell_plan_id`
- `role_key`
- `created_at`

## Catalog Dependencies

### Repo-Sourced Catalogs

These catalogs should reflect current repo truth and be synchronized into
 planner-readable tables or read models.

| Catalog | Purpose | Stable key | Notes |
| --- | --- | --- | --- |
| `template_family` | signed-off selectable page templates | `template_family_id` | only signed-off families may be selected |
| `feature_area` | owning module or feature | `feature_area_id` | must already exist in current app hierarchy |
| `page_hierarchy` | allowed page placement | `page_hierarchy_id` | drives shell placement and nav posture |
| `shell_context` | shell family | `shell_context_id` | should usually derive from hierarchy |

### Runtime-Sourced Catalogs

These catalogs should reflect current persisted application truth.

| Catalog | Purpose | Stable key | Notes |
| --- | --- | --- | --- |
| `allowed_role_keys` | visibility and audience gate | `role_key` | source from existing roles capability |

### Derived Values

These values must not be user-entered.

| Value | Derivation rule |
| --- | --- |
| `canonical_design_system_source` | derive from selected `template_family_id` |
| `shell_context_id` | derive from `page_hierarchy_id` when hierarchy truth is sufficient; otherwise validate the explicit value against the hierarchy |
| `secondary_nav_group` | derive from selected `page_hierarchy_id` and current shell posture |
| `secondary_nav_icon` | derive from selected `page_hierarchy_id` and current shell posture |

## Catalog Sync Rule

Repo-derived catalogs should not be hand-maintained in the planning feature.

Use the following ownership rule:

- repo artifacts remain the source of truth for design-system and architecture
  catalogs
- runtime tables remain the source of truth for persisted roles
- planner-facing catalog tables or read models may cache normalized values for
  fast querying and UI composition
- sync should mark stale rows inactive instead of silently deleting them

## CSV Export Contract

### Filename

- `new-page-shell-matrix.csv`

### Columns

```csv
page_id,page_name,page_hierarchy_id,feature_area,route,shell_context,page_purpose,template_family_id,secondary_nav_label,allowed_role_keys,canonical_design_system_source,status,notes
```

### Column Definitions

| Column | Rule |
| --- | --- |
| `page_id` | required stable machine id; lowercase snake_case; unique per row |
| `page_name` | required human-readable page name |
| `page_hierarchy_id` | required existing hierarchy location |
| `feature_area` | required existing owning module or feature |
| `route` | required intended route or route fragment; unique within shell context |
| `shell_context` | required shell family; preferably derived from hierarchy |
| `page_purpose` | required one-sentence purpose statement |
| `template_family_id` | required signed-off template family id |
| `secondary_nav_label` | required when the page participates in secondary nav |
| `allowed_role_keys` | required pipe-delimited existing role keys |
| `canonical_design_system_source` | derived from `template_family_id`; never manually entered |
| `status` | required lifecycle value: `draft`, `ready_for_export`, `exported`, or `superseded` |
| `notes` | optional non-authoritative notes only |

### Export Rules

- one row represents one page-shell plan
- export order should be deterministic
- only plans in `ready_for_export` or `exported` status may be exported
- `allowed_role_keys` should be sorted and pipe-delimited in stable order
- template-specific mapping data must not appear in this CSV

## Validation Rules

Validation must fail when:

- `template_family_id` is not a signed-off template
- `canonical_design_system_source` does not match the selected template
- any role key in `allowed_role_keys` does not exist
- `feature_area` is incompatible with the chosen `page_hierarchy_id`
- `route` collides with an active page in the same shell context
- required nav fields are missing for a nav-participating hierarchy location
- an input field references a non-approved form child seam

Validation may warn, but not necessarily fail, when:

- notes attempt to carry behavior that should become structured data

## Lifecycle Ownership Rules

The page-shell planning lifecycle must stay explicit.

- `createPageShellPlan` creates new plans in `draft` status
- `updatePageShellPlan` may move a plan between `draft`,
  `ready_for_export`, and `superseded` when the transition is allowed by the
  current plan state
- `exportPageShellPlanCsv` owns the transition into `exported` and the
  stamping of `exported_at`
- clients must not set `exported_at`, `created_at`, `updated_at`, or
  `superseded_at` directly
- clients must not set `canonical_design_system_source` or `shell_context_id`
  directly

The planning API should describe accepted client fields separately from
 rejected system-managed fields.

## Field Definition Contract

Every editable or derived field in this feature must define:

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

The `approved form child seam` must always reference a signed-off design-system
 pattern or component that is an approved child seam of the governing form
 template.

This means:

- the planning UI may only compose from approved form child seams
- local ad hoc control inventions are not allowed by default
- if a needed control does not exist as a signed-off child seam, that is a
  design-system gap that should be resolved upstream before implementation

### Approved Form Child Seams In Scope Today

Current viable form child seams should come from the signed-off `Form Template`
 chain and its child seams, such as:

- `Simple Select`
- `Drawer Select`
- text-field or text-area child seams once they are explicitly governed
- read-only summary or field-display seams once they are explicitly governed

If a required field currently lacks an approved child seam, record that as a
 blocker instead of silently choosing a local substitute.

### Field Definition Table

| Field key | Label | Placeholder | Explanatory text | Approved form child seam | Source design-system artifact | Required | Data source | Validation notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `page_id` | `Page ID` | `root_admin_root_users` | Stable machine-readable identifier for export and downstream automation. | `Text Input` | `docs/workspace/design-system/templates/form-template.md` plus future text-input child seam | yes | user-entered | lowercase snake_case; unique |
| `page_name` | `Page name` | `Root Users` | Human-readable page name for planning and export artifacts. | `Text Input` | `docs/workspace/design-system/templates/form-template.md` plus future text-input child seam | yes | user-entered | non-empty |
| `page_hierarchy_id` | `Page hierarchy` | `Select a page location` | Choose the existing hierarchy location where this page belongs. | `Drawer Select` | `docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md` | yes | repo-synced catalog | must exist and be active |
| `feature_area` | `Feature area` | `Select an owning feature` | Choose the existing feature or module that owns this page. | `Simple Select` | `docs/workspace/design-system/behavior-locks/simple-select-behavior-lock.md` | yes | repo-synced catalog | must be compatible with selected hierarchy |
| `route` | `Route` | `/root-admin#users` | Define the intended route or route fragment for the page. | `Text Input` | `docs/workspace/design-system/templates/form-template.md` plus future text-input child seam | yes | user-entered | must be unique within shell context |
| `shell_context` | `Shell context` | `Auto-derived from hierarchy` | The shell family that frames this page. | `Read-Only Field` | `docs/workspace/design-system/templates/form-template.md` plus future read-only field seam | yes | derived | auto-derive when possible |
| `page_purpose` | `Page purpose` | `Browse and inspect visible root-user records.` | One-sentence description of what this page is for. | `Text Area` | `docs/workspace/design-system/templates/form-template.md` plus future text-area child seam | yes | user-entered | concise sentence, not a full spec |
| `template_family_id` | `Page template` | `Select a signed-off template` | Choose the signed-off page template this page shell will adopt. | `Drawer Select` | `docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md` | yes | repo-synced catalog | must be signed off |
| `secondary_nav_label` | `Secondary nav label` | `Users` | Label shown in the shell’s secondary navigation. | `Text Input` | `docs/workspace/design-system/templates/form-template.md` plus future text-input child seam | conditional | user-entered | required when page appears in secondary nav |
| `allowed_role_keys` | `Allowed roles` | `Select one or more roles` | Users holding these existing roles should be able to use this page. | `Drawer Select` | `docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md` | yes | runtime catalog | every selected role must exist and remain active |
| `canonical_design_system_source` | `Canonical design-system source` | `Auto-populated from selected template` | The signed-off design-system source route or artifact for the chosen template family. | `Read-Only Field` | `docs/workspace/design-system/templates/form-template.md` plus future read-only field seam | yes | derived | must match template family |
| `status` | `Plan status` | `Select a status` | Lifecycle status for the planning record. | `Simple Select` | `docs/workspace/design-system/behavior-locks/simple-select-behavior-lock.md` | yes | controlled enum | only valid lifecycle values allowed |
| `notes` | `Notes` | `Optional short implementation notes` | Short non-authoritative notes for context that does not yet justify a structured field. | `Text Area` | `docs/workspace/design-system/templates/form-template.md` plus future text-area child seam | no | user-entered | must not carry hidden contract decisions |

## Initial Blockers And Follow-Up

This seam still needs a few upstream design-system clarifications before the
 future planning UI is fully governed:

- explicit governed text-input child seam
- explicit governed text-area child seam
- explicit governed read-only field or field-summary seam

Until those seams are promoted or confirmed, this feature spec should still be
 used as the source of truth for backend planning and CSV export design.
