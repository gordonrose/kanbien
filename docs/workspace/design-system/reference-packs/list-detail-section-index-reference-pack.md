# List Detail Section Index Reference Pack

## Purpose

Freeze the named reference states for the `list-detail-section-index` child
seam so app consumers can reuse indexed list-detail drawers without inventing
local section navigation.

## Scope

- Family:
  `list-detail-section-index`
- Status:
  signed-off reference baseline
- Source surface:
  `/design-system/templates/list-page?drawerVariant=indexed`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-detail-section-index-behavior-lock.md`
- First app consumer:
  `/root-admin/users`
- Existing executable verification:
  `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts`
  `tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts`

## Quality Gate Profile

- Complexity: `simple`
- Minimum reference states required by harness: `8`
- Required posture: every behavior lock ID must map to at least one
  deterministic reference state, and every production-relevant design dimension
  must be covered or explicitly marked not applicable.
- Harness:
  `tests/audit/designSystem/artifactQualityGate.test.ts`

## Required Dimensions

| Dimension | Coverage posture | Reference states |
| --- | --- | --- |
| responsive | Covered through parent list-page desktop and mobile drawer states. | `LDSI-R-001`, `LDSI-R-007` |
| theme | Covered through dark indexed drawer review. | `LDSI-R-004` |
| direction | Covered through RTL indexed drawer review. | `LDSI-R-004` |
| magnification | Covered through magnified indexed drawer review. | `LDSI-R-004` |
| density | Covered through compact label-only rows and first-consumer section count. | `LDSI-R-001`, `LDSI-R-005` |
| overflow | Covered through long body and constrained drawer review. | `LDSI-R-003`, `LDSI-R-008` |
| interaction | Covered through section switching without record-selection changes. | `LDSI-R-002`, `LDSI-R-003`, `LDSI-R-006` |
| accessibility | Covered through selectable row state and one-visible-panel behavior. | `LDSI-R-001`, `LDSI-R-002` |
| keyboard | Covered by inherited list drawer focus and selectable row semantics. | `LDSI-R-001`, `LDSI-R-002` |
| focus | Covered by parent drawer focus containment while section rows switch panels. | `LDSI-R-001`, `LDSI-R-007` |
| attention | N/A; the section index does not define attention badges or alert states. | `LDSI-R-001` |
| disabled | N/A; the current signed-off seam has no disabled section row contract. | `LDSI-R-001` |

## Behavior Coverage Matrix

| Behavior ID | Covered by reference states | Verification expectation |
| --- | --- | --- |
| `LDSI-001` | `LDSI-R-001`, `LDSI-R-007` | Section index stays inside the parent list detail drawer. |
| `LDSI-002` | `LDSI-R-001`, `LDSI-R-005` | Rows remain label-only without checkbox, helper paragraph, or bold-only treatment. |
| `LDSI-003` | `LDSI-R-001`, `LDSI-R-002`, `LDSI-R-003` | Exactly one section panel is visible at a time. |
| `LDSI-004` | `LDSI-R-002`, `LDSI-R-003`, `LDSI-R-006` | Switching sections does not change the selected list record. |
| `LDSI-005` | `LDSI-R-005`, `LDSI-R-006` | Consumers supply section labels while shared anatomy remains governed. |
| `LDSI-006` | `LDSI-R-004`, `LDSI-R-007`, `LDSI-R-008` | RTL, themed, magnified, mobile, and overflow states remain usable. |
| `LDSI-007` | `LDSI-R-005`, `LDSI-R-006` | First app consumer uses the shared renderer instead of copied local rows. |
| `LDSI-008` | `LDSI-R-006`, `LDSI-R-008` | Optional unavailable data is stated honestly instead of inferred. |

## Required Reference States

| Ref ID | Surface | State | Why it exists | Evidence status |
| --- | --- | --- | --- | --- |
| `LDSI-R-001` | `/design-system/templates/list-page?drawerVariant=indexed` | Details selected | Proves the baseline label-only index row and default active panel. | covered |
| `LDSI-R-002` | `/design-system/templates/list-page?drawerVariant=indexed` | Picture selected | Proves section switching without changing the selected record. | covered |
| `LDSI-R-003` | `/design-system/templates/list-page?drawerVariant=indexed` | Description selected | Proves long-form body content moves behind a section row. | covered |
| `LDSI-R-004` | `/design-system/templates/list-page?drawerVariant=indexed&theme=dark&dir=rtl&zoom=100` | RTL, dark, magnified indexed drawer | Proves containment and row readability under high-pressure review. | covered |
| `LDSI-R-005` | `/design-system/templates/list-page?drawerVariant=indexed&consumer=root-users-profile` | Root-users profile section | Proves first-consumer use with `Profile` as an app-supplied label. | covered |
| `LDSI-R-006` | `/design-system/templates/list-page?drawerVariant=indexed&consumer=root-users-session` | Root-users session information section | Proves first-consumer use with `Session information` as an app-supplied label. | covered |
| `LDSI-R-007` | `/design-system/templates/list-page?drawerVariant=indexed&viewport=mobile` | Mobile indexed drawer containment | Proves the child index stays inside the inherited mobile drawer shell. | covered |
| `LDSI-R-008` | `/design-system/templates/list-page?drawerVariant=indexed&profilePicture=missing` | Root-users honest missing-data posture | Proves optional section data and profile media fallbacks do not invent values. | covered |

## Row Anatomy

Reference rows must keep:

- a visible selectable row boundary
- a plain label
- active-row visual distinction
- no checkbox marker
- no helper paragraph
- no bold-only dependency for the label

## Consumer Mapping

Root-users maps:

- `Profile` to durable root-user profile details already available in the
  visible list payload
- `Session information` to current session posture only when it is available
  for the selected root user; otherwise it honestly states that selected-user
  session records are not loaded in this list view

## Parity Rule

A future app consumer matches this pack only when it imports the shared
renderer and supplies feature-specific section labels/content through the
section contract rather than copying the index rows locally.
