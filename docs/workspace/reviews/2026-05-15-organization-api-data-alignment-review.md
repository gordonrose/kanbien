# Organization API And Data Alignment Review

## Scope

- Review date:
  2026-05-15
- Story unblock:
  `ART-ORG-004`
- Related stories:
  `S-004` through `S-010`
- Purpose:
  Confirm that the Organization API contracts, data dictionaries, and
  permission mapping are aligned enough for Task Breakdown to begin for the
  active backend entity stories.

## Sources Checked

| Source | Path | Checked For |
| --- | --- | --- |
| Root-admin API contract | `docs/api-contracts/organization-root-admin.md` | root selected-tenant posture, route groups, request/response/error alignment |
| Tenant-admin API contract | `docs/api-contracts/organization-tenant-admin.md` | current tenant/account posture, route groups, request/response/error alignment |
| Organization dictionary | `docs/data-dictionary/organization.md` | hierarchy, lifecycle, uniqueness, tenant boundary |
| Legal profile dictionary | `docs/data-dictionary/organization-legal-profile.md` | one-active rule, optional tax/VAT, registered address |
| Location dictionary | `docs/data-dictionary/organization-location.md` | geocoordinates, head-office flags, lifecycle |
| Weekly hours dictionary | `docs/data-dictionary/organization-weekly-opening-hours.md` | weekday slots, slot order, non-overlap, same-day v1 |
| Opening-hours exception dictionary | `docs/data-dictionary/organization-opening-hours-exception.md` | exception types and precedence |
| Business-unit dictionary | `docs/data-dictionary/organization-business-unit.md` | unit hierarchy, child projection, branch archive/reassignment |
| Membership dictionary | `docs/data-dictionary/organization-business-unit-membership.md` | real individual/business-unit targets and participation labels |
| Reference-value dictionary | `docs/data-dictionary/organization-reference-value.md` | root-managed values, tenant read/use, retained used values |
| Permission mapping | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | root, tenant, object, public, worker, and denial posture |

## Corrections Made

| Area | Correction | Reason |
| --- | --- | --- |
| Integration deferral | Root and tenant API related-record sections now state integration records are not v1 child resources and must re-enter discovery if revived. | Prevents deferred integration records from becoming active route or task scope. |
| Integration errors | Removed active child-route error wording for rejected secret-like integration fields. | Secret rejection remains a future revival rule, not active v1 child-route behavior. |
| Reference values | Root and tenant API examples no longer list integration type as an active v1 value; they point future integration-type values to revived integration scope. | Keeps active catalogue work aligned to v1 Organization records. |
| Export routes | Root and tenant API in-scope route lists now include cancel, retry, and PIN routes already defined in the private export route sections. | Keeps top-level contract inventory aligned with route-group details. |
| Logo type scope | PRD, API contracts, data dictionary, and story text now describe v1 as primary-logo only; future icon/light/dark variants require expansion. | Matches the current product decision that one v1 logo type is enough. |

## Active Entity Alignment

| Story | Entity / Record | Alignment Result |
| --- | --- | --- |
| `S-004` | Organization | API and data dictionary align on tenant-level normalized name uniqueness, hierarchy depth 10, cycle denial, branch archive, child reassignment, lifecycle, and tenant/object boundary. |
| `S-005` | Organization Legal Profile | API and data dictionary align on one active profile, optional tax/VAT, optional registered address, retained/archived visibility, and same-tenant ownership. |
| `S-006` | Organization Location | API and data dictionary align on many locations, optional geocoordinates, descriptive head-office flags, lifecycle, search/export, and tenant ownership. |
| `S-007` | Weekly Opening-Hour Slot and Opening-Hour Exception | API and data dictionaries align on weekday slots, same-day v1, slot order, non-overlap, exception records, and precedence. |
| `S-008` | Business Unit | API and data dictionary align on hierarchy depth 10, cycle denial, child projection, branch archive, child reassignment, and same-tenant ownership. |
| `S-009` | Business Unit Membership | API and data dictionary align on real individual or business-unit targets, fixed owner/manager/member/viewer labels, no placeholder targets, and tenant/object authority. |
| `S-010` | Organization Reference Value | API and data dictionary align on root-only mutation, tenant read/use, label updates, archive/deprecate/replace behavior, and retained used values. |

## Remaining Blockers Not Resolved Here

| Blocker | Status |
| --- | --- |
| Public logo implementation | Still blocked before implementation until logo signoff/runbook/task evidence is carried forward. |
| Private export implementation | Still blocked before implementation until secure generated export technical steering is complete. |
| Shared admin screens | Still blocked/deferred until design-system screen behavior references exist. |
| Integration records | Still deferred with owner and excluded from active v1 route, persistence, search, export, UI, and source tasks. |

## Conclusion

`ART-ORG-004` is resolved for `S-004` through `S-010`.

The active backend entity stories have aligned API/data/permission sources for
Task Breakdown. Later logo, export, screen, and integration work still carries
its own blockers and must not be treated as unblocked by this review.
