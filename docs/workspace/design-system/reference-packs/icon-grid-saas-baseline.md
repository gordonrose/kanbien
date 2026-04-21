# Icon Grid SaaS Baseline

## Purpose

Define a durable 50-icon topic baseline for the in-repo design-system icon
catalog based on common SaaS product surfaces.

This is a planning and governance artifact, not a promise that every icon is
already drawn in the runtime today.

## Scope

- Family:
  `icon-grid`
- Intended consumer:
  shared design-system icon catalog used by governed app settings, navigation,
  dashboards, and admin/product configuration surfaces
- Current runtime source:
  `src/frontend/designSystem/assets/app.mjs`

## Baseline Selection Rule

Prioritize icons that are:

- common across multi-tenant SaaS products
- durable across settings, navigation, analytics, billing, and admin surfaces
- distinct enough to avoid semantic overlap
- simple enough to keep the current 24x24 in-repo icon style calm and legible

## Baseline 50

| # | Topic | Suggested key | Common SaaS meaning |
| --- | --- | --- | --- |
| 1 | Home | `home` | Product home or overview landing |
| 2 | Dashboard | `dashboard` | Summary metrics and quick actions |
| 3 | Search | `search` | Find records, pages, or settings |
| 4 | Filter | `filter` | Narrow lists or reports |
| 5 | Sort | `sort` | Reorder list or table results |
| 6 | Grid | `grid` | Catalog or multi-tile browsing |
| 7 | List | `list` | Row-based browsing |
| 8 | Form | `form` | Data entry or settings editor |
| 9 | Calendar | `calendar` | Date-based planning or scheduling |
| 10 | Clock | `clock` | Time-based action or duration |
| 11 | Message | `message` | In-app messages or chat |
| 12 | Email | `email` | Email delivery or notifications |
| 13 | Notification | `notification` | Alerts, reminders, notices |
| 14 | Help | `help` | Guidance, docs, support entry |
| 15 | Settings | `settings` | Configuration and preferences |
| 16 | User | `user` | One person or profile |
| 17 | Users | `users` | Team members or user groups |
| 18 | Tenant | `tenant` | Customer workspace or organization |
| 19 | Workspace | `workspace` | Active product environment |
| 20 | Building | `building` | Company, organization, business unit |
| 21 | Shield | `shield` | Security or protected state |
| 22 | Lock | `lock` | Permission gate or private state |
| 23 | Key | `key` | Access key, credential, token |
| 24 | Eye | `eye` | Visibility, preview, view state |
| 25 | Eye Off | `eye-off` | Hidden or masked state |
| 26 | Analytics | `analytics` | Product insights or KPIs |
| 27 | Chart Bar | `chart-bar` | Reporting and counts |
| 28 | Chart Line | `chart-line` | Trends and time-series change |
| 29 | Report | `report` | Generated report or audit export |
| 30 | File | `file` | Document or record artifact |
| 31 | Folder | `folder` | Grouped saved assets or collections |
| 32 | Database | `database` | Stored data or persistence layer |
| 33 | Link | `link` | Connection or related resource |
| 34 | Integration | `integration` | External system connection |
| 35 | API | `api` | Developer-facing system seam |
| 36 | Code | `code` | Engineering or technical settings |
| 37 | Spark | `spark` | Automation, magic, smart assist |
| 38 | Workflow | `workflow` | Sequence, routing, orchestration |
| 39 | Checklist | `checklist` | Tasks, setup, completion steps |
| 40 | Check Badge | `check-badge` | Verified, approved, healthy |
| 41 | Billing | `billing` | Payment ownership or account charges |
| 42 | Credit Card | `credit-card` | Payment method |
| 43 | Receipt | `receipt` | Invoice, receipt, charge evidence |
| 44 | Wallet | `wallet` | Balance, funds, account money |
| 45 | Refresh | `refresh` | Sync, renew, or subscription cycle |
| 46 | Support | `support` | Human help or customer support |
| 47 | Book | `book` | Documentation or knowledge base |
| 48 | Download | `download` | Export or file retrieval |
| 49 | Upload | `upload` | Import or file submission |
| 50 | Monitor | `monitor` | Display, preview, device, runtime screen |

## Recommended First Implementation Order

The most broadly useful first 20 for a general SaaS admin/product shell are:

1. `home`
2. `dashboard`
3. `search`
4. `filter`
5. `grid`
6. `list`
7. `form`
8. `calendar`
9. `clock`
10. `message`
11. `settings`
12. `user`
13. `users`
14. `tenant`
15. `workspace`
16. `shield`
17. `analytics`
18. `file`
19. `spark`
20. `checklist`

## Governance Notes

- Additions to the shared icon catalog should prefer this baseline before
  inventing narrower one-off metaphors.
- If a requested icon falls outside this baseline, document why the product
  surface needs a new metaphor rather than reusing an existing one.
- Where two topics are close, prefer the calmer and more reusable metaphor.
