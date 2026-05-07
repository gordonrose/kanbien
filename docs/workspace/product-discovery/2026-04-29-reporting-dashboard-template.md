# Product Discovery Packet: Reporting Dashboard Template

## Status

- Discovery status: `ready-for-technical-steering`
- Draft posture: `governed-discovery`
- Original request:
  "I want to build a template in our design system, that can be used to build reporting dashboards.

  I should be able to add rows to the page and columns to the rows creating 'containers'.

  Each container i should then be able to populate with a common reporting dashboard widget type:

  * number (with tile and subnumber)
  * pie chart
  * histogram
  * line chart
  * bar chart
  * box plot

  These widgets should be interactive so that if I hover over them i see the data in an info box and if I click on them i have the ability to use the category i clicked on as a filter for the rest of the dashboard.

  i'm just interested in the design system page template at athe moment - but will want this to become a pattern that can be reused by my application by building a reporting dashboard page and hooking it up to internal apis that link to my data and anlytics repo"
- Plain-language request summary:
  Create a governed design-system page template for reporting dashboards. A dashboard author can use an actual in-browser experience to add rows, add columns within rows, create containers, and place common reporting widgets in those containers. Widgets show hover details and category-based visualizations can emit one-at-a-time click-to-filter intent that later application dashboards can bind to internal reporting or analytics APIs. Dashboard-level controls should live in a context-nav drawer.
- Packet date: 2026-04-29
- Owner / requester: requester
- Related product template: `docs/product-discovery/templates/generic-feature-template.md`
- Product template posture: `generic-template-used`
- Taxonomy version: `2026-04-29.3`
- Prior packet or feedback reference: none

Canonical Layer 1 stop condition:

- This packet stops before PRD, capability matrix, Technical Steering plan, implementation blueprint, route, schema, persistence, migration, API contract, data dictionary, permission mapping, executable verification design, chart library selection, or product code.
- The first product outcome is the design-system page template only. Application dashboard pages, internal API contracts, analytics repository integration, durable dashboard definitions, and production data binding are downstream.
- The design-system template should demonstrate the actual in-browser composition experience using browser memory. Durable saved dashboard definitions are a future requirement, not part of the first design-system slice.
- The request fits existing taxonomy values for `reporting / analytics`, `dashboard / report`, `builder / canvas`, `reporting aggregate`, and governed frontend/design-system extension. No taxonomy mutation is required.

## Discovery Interview Summary

- Initial understanding shared with requester:
  The requester wants the design system to define a reusable reporting dashboard template first, with row/column layout containers and interactive metric/chart widgets, before application teams build real dashboards against internal APIs.
- Question groups covered:
  - product intent: reusable reporting dashboard template in the design system.
  - actors and governance: design-system maintainers define the pattern; application builders later consume it; dashboard viewers eventually interact with charts.
  - journeys and jobs: compose rows and columns in an actual in-browser experience, populate containers, inspect hover details, click a chart category to filter the rest of the dashboard, and use dashboard-level controls in a context-nav drawer.
  - important situations and state changes: empty containers, incompatible widget/data shapes, selected filters, cleared filters, responsive layout changes, and future app adoption.
  - context variation: design-system canonical view now; application dashboard consumption later.
  - unhappy paths: no data, partial data, too many categories, conflicting filters, inaccessible hover-only details, and unsupported widget choices.
  - scope boundaries: no real app page, no API binding, no analytics repository integration, and no dashboard persistence decision in this packet.
  - Technical Steering deferrals: chart rendering approach, design-system seam shape, data contract, filter event contract, accessibility behavior, responsive rules, and app adoption contract.
- Assumptions confirmed by requester:
  The first slice is only the design-system page template. The template should provide an actual in-browser memory-backed experience, not just a static preview. Layouts should become user-configurable in the future. The first filter model can support one active filter at a time. Filtering applies to category-based visualizations, not every widget. The template should serve both admin/operator and tenant-facing dashboards. Dashboard-level controls should live in a context-nav drawer. The template should be reusable later by application dashboards that connect to internal APIs and analytics data.
- Assumptions explicitly deferred:
  Whether row/column definitions are persisted in the first application consumer; exact chart library; exact data schema; exact category payload shape; visual design direction for the chart family until screenshots/canonicals are compared.
- Questions still blocking packet confidence: none for Layer 1 handoff.
- Questions safe to defer to Technical Steering:
  How to expose the governed design-system render/controller seams, how to model dashboard data inputs, how future app pages should bind internal API responses to the template, and how to choose the chart rendering approach after visual confirmation.
- Confidence for chosen status: `high`

## Known Questions Gate

- Plain-language summary shown before drafting:
  Create a governed design-system page template for reporting dashboards with configurable layout containers, common reporting widgets, hover detail behavior, and one-at-a-time category filter intent.
- First one question asked before drafting:
  Historical packet predates the current one-question gate; discovery summary records the requester-confirmed first-slice scope.
- Requester answered, corrected, or explicitly deferred first question:
  `yes`
- Known important product questions left unasked:
  none for Layer 1 handoff
- For each unasked business question, requester signoff for "deferred until
  later":
  charting library, durable dashboard persistence, data contract, and app adoption details are deferred to Technical Steering or downstream planning.
- Technical questions not asked of business owner and packaged for technical
  stakeholder:
  chart rendering approach, design-system seam shape, data contract, filter event contract, accessibility behavior, responsive rules, and app adoption contract.
- If any known question was not asked, why was it safe to defer or package:
  Remaining questions are implementation and architecture questions for Technical Steering, not Layer 1 product-intent blockers.
- Packet status allowed:
  `yes`

## Product Intent

- Problem to solve:
  Reporting dashboards need a reusable page pattern instead of one-off layouts and bespoke chart behavior.
- Business outcome:
  Future application dashboards can be built from a governed design-system pattern, reducing UI drift while leaving data/API integration decisions to later planning.
- Primary user outcome:
  A dashboard author can compose a reporting dashboard layout from rows, columns, containers, and approved widget types in browser memory, while a dashboard viewer can inspect chart data and use one selected category value as the dashboard filter.
- Why now:
  Product Discovery Layer 1 is ready to capture the reusable pattern before implementation planning starts.
- Success signal:
  The next planning step can evaluate a design-system template that clearly defines the in-browser composition experience, supported widget types, hover detail behavior, one-at-a-time category filter intent, context-nav drawer controls, empty/error states, responsive expectations, and app-adoption boundaries.
- Non-goal summary:
  This packet does not define production dashboard persistence, internal analytics APIs, export behavior, tenant-specific reporting permissions, charting library implementation, final visual style without screenshot confirmation, or any real app dashboard page.

## Taxonomy Classification

Reference: `docs/product-discovery/taxonomy.md`.

- Product feature type: `reporting / analytics`, `settings / configuration`
- UX pattern(s): `dashboard / report`, `builder / canvas`
- Data ownership shape: `derived / projection-only`, `reporting aggregate`
- Surface / management location: `surfaced in many modules, managed centrally`
- Actor and permission shape: `root operator`, `tenant admin`, `tenant member`, `system / job actor`
- Relationship shape: `one-to-many owned children`, `ordered list`, `derived relationship`
- Reporting / read model shape: `operational dashboard`, `aggregate metrics`, `cross-feature rollup`
- Lifecycle shape: `draft / published`, `configuration changed`
- Integration / externality shape: `internal-only`
- Evidence / compliance sensitivity: `normal product workflow`, `permission-sensitive`, `privacy-sensitive`, `user-visible runtime-sensitive`
- New taxonomy value needed: no
- New taxonomy axis needed: no

## Feature Family / Product Template Fit

- Existing feature family:
  Design-system templates and reporting/analytics presentation patterns.
- Reusable product template used:
  `generic-feature`
- Template overrides:
  The generic packet is used with stronger emphasis on governed frontend/design-system extension, reusable template behavior, reporting read-model questions, and future app adoption.
- New family or template needed:
  No new Product Discovery template is needed. A new design-system pattern or template may be needed downstream.
- Reuse rationale:
  Existing taxonomy covers reporting dashboards and builder-like composition. Product Discovery can hand off with a design-system extension signal rather than adding a new taxonomy value.
- Existing families/templates considered:
  Generic feature, design-system template family, reporting/analytics feature family.
- Why rejected:
  No specialized reporting dashboard Product Discovery template exists yet, and the request is still clear enough for generic discovery handoff.

## New Family Candidate

- New family candidate needed:
  No new Product Discovery family candidate is required.
- Proposed family name: N/A
- Business problem it exists to solve: N/A
- Why existing taxonomy values/templates do not fit: N/A
- Reusable user/job pattern: N/A
- Expected journeys: N/A
- Expected capability groups: N/A
- Expected actors / permissions: N/A
- Expected data ownership shape: N/A
- Expected relationship shape: N/A
- Expected reporting / read model shape: N/A
- Expected lifecycle shape: N/A
- Product-template candidate needed: no
- Approval needed before requirements lock: no

## UX / Design-System Extension Signal

- Existing signed-off UX family appears sufficient:
  Unknown. Existing design-system templates should be checked before implementation planning.
- Existing UX pattern likely needs extension:
  Yes. Row/column dashboard containers, chart widgets, chart tooltips, and click-to-filter interactions are not assumed to be covered by existing signed-off families.
- New UX pattern may be needed:
  Yes. A governed `reporting dashboard template` pattern may be needed.
- Design-system extension may be needed:
  Yes.
- Affected surfaces:
  `/design-system` template preview/canonical route first; later application reporting dashboard pages.
- User workflow reason:
  Dashboard layouts need consistent composition and chart interaction behavior before real app pages consume the pattern.
- Product constraints:
  The template must support rows, columns, containers, number tiles with subnumbers, pie charts, histograms, line charts, bar charts, and box plots. Hover details must not be the only accessible way to inspect data. Click-to-filter must support one active category filter at a time for category-based visualizations, with clear selected-filter state and a clear way to remove filters. Dashboard-level controls should be presented in a context-nav drawer.
- Existing design-system references checked:
  Product Discovery found existing design-system template and behavior-lock areas, but did not verify whether a dashboard template already exists.
- Must stop before app UI implementation:
  Yes. Real app dashboard implementation should wait for design-system signoff and a consumable shared render/controller seam, unless an explicit exception is approved.
- Technical Steering / design-system questions:
  What design-system-owned seam renders the dashboard template? What behavior lock owns row/column/container composition? What chart interaction contract is shared with application consumers? What canonical responsive states must be signed off? What chart visual approach wins after rendered comparison across representative data states?

## Users, Actors, And Context

- Primary actor:
  Design-system maintainer or dashboard template author defining the reusable template.
- Secondary actors:
  Application builder who later consumes the template; dashboard viewer who later interacts with populated dashboards.
- Configuration / governance actors:
  Design-system maintainer, product/design reviewer, and future app owner.
- Support / root / operator actors:
  Root/operator actors may eventually view or configure reporting dashboards depending on the consuming application surface.
- System or external-provider actors:
  Future internal reporting APIs and analytics repository integration. These are out of scope for the first design-system template.
- Affected modules / surfaces:
  Design-system template/canonical surface first; future reporting dashboard app pages later.
- Root / tenant / public posture:
  Design-system template is internal/governed. Future dashboard pages are expected to support both admin/operator and tenant-facing uses, with the consuming feature classifying the exact root or tenant boundary.
- Permission-sensitive decisions still open:
  Future data filtering and dashboard visibility by actor/tenant are deferred to the application dashboard requirement.
- Current context:
  The product is defining a reusable design-system template before implementation.
- Trigger event:
  A team needs to create a reporting dashboard page without inventing layout and chart interactions locally.

## User Journey Flow

### Primary Journey

1. User starts from:
   The design-system reporting dashboard template surface.
2. User wants to:
   Compose a dashboard layout from rows, columns, and containers in an actual browser-memory experience, then place reporting widgets in those containers.
3. System helps by:
   Providing governed layout rules, add/remove composition behavior, supported widget types, sample data states, hover detail behavior, one-at-a-time selected-filter behavior, context-nav drawer controls, empty/error states, and responsive examples.
4. User completes when:
   The template demonstrates a reusable dashboard pattern that can later be consumed by an application page without local UI reinvention.

### Alternate / Edge Journeys

- A row has one column, many columns, or columns with different width weights.
- A container is empty, populated, loading, has no data, or has an incompatible widget/data pairing.
- A number widget shows a primary value, title, and subnumber or comparison value.
- A pie/bar/histogram/line/box-plot widget shows hover detail for the focused mark.
- A user clicks a category-based chart target as a filter.
- A selected filter changes the rest of the dashboard and is visibly removable.
- A user applies a new category filter while another filter is active; the new filter replaces the prior filter.
- Dashboard-level controls are opened and adjusted in a context-nav drawer.
- A chart has too many categories, very long labels, negative values, null values, or outliers.
- The dashboard collapses or stacks containers on narrow screens.

### Denied, Empty, Failed, Or Degraded States

- Empty dashboard with no rows.
- Empty row with no columns.
- Empty container with no widget.
- Widget selected but no data available.
- Widget selected with incompatible data shape.
- Loading data placeholder.
- Data error or unavailable analytics source.
- Hover unavailable on touch devices.
- Click-to-filter unavailable for a widget or datum.
- Selected filter returns no results.
- Context-nav drawer controls are unavailable, loading, or invalid.
- Responsive layout cannot preserve all side-by-side columns.

## Job-To-Be-Done Bridge

### Actor Perspective Map

| Perspective | Actor | Product responsibility | Included? | Why / why not |
| --- | --- | --- | --- | --- |
| End user journey | Dashboard viewer | completes the product journey | yes | They inspect values and use chart interactions to filter dashboard context. |
| Admin / configuration | Dashboard template author or app builder | configures or governs rules | yes | They define rows, columns, containers, widget choices, and future bindings. |
| Support / root / governance | Design-system maintainer | supports, overrides, audits, or governs | yes | They own the reusable template and prevent app-page drift. |
| System / external provider | Future internal reporting APIs and analytics repository | affects behavior, availability, or policy | yes | The future app pattern depends on API data, freshness, and filter semantics, but this is deferred. |

### JTBD Statements

| JTBD ID | Actor perspective | User type | Needs to | So they can | Trigger / context | Success looks like |
| --- | --- | --- | --- | --- | --- | --- |
| JTBD-001 | admin / configuration | Dashboard template author | compose rows, columns, and containers in browser memory | create reusable dashboard layouts without bespoke UI | defining a reporting dashboard pattern | layout rules and composition interactions are clear and reusable |
| JTBD-002 | admin / configuration | Dashboard template author | choose approved widget types for containers | represent common metric and chart needs consistently | adding dashboard content | each widget has clear data, empty, hover, and filter states |
| JTBD-003 | end user journey | Dashboard viewer | inspect values behind chart marks | understand what the dashboard is showing | hovering, focusing, or touching a widget | detail is visible and accessible |
| JTBD-004 | end user journey | Dashboard viewer | click a chart category as a filter | narrow the rest of the dashboard to the selected context | exploring dashboard data | one selected filter state is visible, applied, replaceable, and removable |
| JTBD-005 | support / root / governance | Design-system maintainer | define a signed-off template seam | allow future app pages to adopt the pattern without copying local CSS or behavior | preparing app reuse | downstream pages consume the shared source of truth |
| JTBD-006 | system / external provider | Future reporting data provider | supply dashboard-ready aggregates | let widgets render trustworthy data and filter updates | later application integration | data contracts support widget and one-at-a-time category filter behavior |
| JTBD-007 | admin / configuration | Dashboard viewer or author | use dashboard-level controls in a context-nav drawer | adjust dashboard scope without crowding the canvas | changing dashboard context | controls are discoverable, accessible, and consistent with the page shell |

### Epic-Level Job Summary

- User type:
  Dashboard template author and future dashboard viewer.
- Needs to:
  Define and use a reusable reporting dashboard layout with an in-browser composition experience, context-nav drawer controls, and consistent widget interactions.
- So they can:
  Build reporting dashboards faster while preserving design-system governance and future data-binding clarity.
- Current context:
  The first requirement is design-system-only; app/API work follows later.
- Trigger event:
  A new dashboard page is needed.
- Desired outcome:
  A signed-off design-system dashboard template that future app pages can consume.
- Success looks like:
  Layout composition, widget, hover, one-at-a-time category filter, context-nav drawer control, responsive, empty, and error behaviors are clear before implementation planning.

### Current Satisfaction

They are currently happy with:

- The design-system already has governed template and canonical concepts to build on.

They are currently unhappy with:

- Reporting dashboards do not yet have a reusable governed template or shared chart interaction pattern.

### Proposed Product Idea

Their idea would:

- Add a design-system reporting dashboard template with composable layout containers and common interactive reporting widgets.
- Use screenshot-driven visual confirmation before locking the chart style or charting approach.

### Examples / Evidence

Examples involve:

- Number tiles with subnumbers, pie charts, histograms, line charts, bar charts, and box plots.
- Hover detail boxes and one-at-a-time category click-to-filter interactions that affect the rest of the dashboard.
- Dashboard-level controls in a context-nav drawer.

## Use Case Statements

| Use case | Derived from JTBD | User type | Action type | Goal | Example evidence | Product implication |
| --- | --- | --- | --- | --- | --- | --- |
| UC-001 | JTBD-001 | Dashboard template author | configure | Add rows and columns to create dashboard containers | user asked for rows and columns creating containers | template needs governed layout composition behavior |
| UC-002 | JTBD-002 | Dashboard template author | configure | Populate a container with an approved widget type | user listed six widget types | template needs widget selection and state coverage |
| UC-003 | JTBD-003 | Dashboard viewer | inspect | See details for chart data on hover/focus | user asked for info box on hover | hover/focus/touch detail behavior must be defined |
| UC-004 | JTBD-004 | Dashboard viewer | filter | Apply one clicked data category as the dashboard filter | requester confirmed one active filter is fine for now | template needs selected filter state and replacement semantics |
| UC-005 | JTBD-005 | Design-system maintainer | govern | Provide a reusable source of truth for future app dashboards | user wants this to become a reusable pattern | design-system signoff and adoption contract are downstream flags |
| UC-006 | JTBD-006 | Future app/data provider | integrate | Bind widgets to internal APIs and analytics data | user wants later API and analytics repository hookup | reporting/API contract is downstream, not first-slice scope |
| UC-007 | JTBD-007 | Dashboard viewer or author | configure | Use dashboard-level controls in a context-nav drawer | requester wants controls in a context-nav drawer | template needs drawer control behavior and responsive state coverage |

## State-Based Journey Matrix

### State Inventory

| Entity / object | States considered | Notes |
| --- | --- | --- |
| Dashboard template | empty, composed in browser memory, previewed, signed off, consumed by app, future saved configuration | Product Discovery covers intent only; signoff is downstream. Durable saved configuration is future scope. |
| Row | absent, present, reordered, removed | In-browser add/remove behavior is in scope; persistence is future scope. |
| Column/container | empty, populated, loading, error, no data, incompatible data | Needed for realistic canonical examples. |
| Widget | unselected, selected, configured, disabled/unsupported, interactive | Widget type support must be explicit. |
| Filter | none, one selected category, replaced, cleared, no-result | First slice supports one active category filter at a time. |
| Context-nav drawer controls | closed, open, changed, invalid, loading | Dashboard-level controls belong in this drawer. |
| Data source | sample data, live API data, stale, unavailable, permission-filtered | Live API data is downstream. |

### Journey Permutations

| Journey ID | Actor | Actor state | Object | Object state | Action | Outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JY-STATE-001 | Template author | defining template | Dashboard template | empty | add first row and container in browser memory | dashboard has a place to receive widgets | ready-for-signoff |
| JY-STATE-002 | Template author | defining template | Container | empty | choose widget type | container shows widget shell and expected data contract | ready-for-signoff |
| JY-STATE-003 | Template author | defining template | Widget | incompatible data | preview widget | template shows honest incompatible-data state | defer-to-technical-steering |
| JY-STATE-004 | Dashboard viewer | inspecting | Widget mark/value | available data | hover, focus, or touch detail target | detail box or equivalent accessible detail appears | ready-for-signoff |
| JY-STATE-005 | Dashboard viewer | exploring | Widget category | available filter target | click data target | one dashboard category filter becomes selected and visible | ready-for-signoff |
| JY-STATE-006 | Dashboard viewer | exploring | Filter | selected | clear selected filter | dashboard returns to unfiltered state | ready-for-signoff |
| JY-STATE-007 | Dashboard viewer | exploring | Filter | selected | apply another category filter | prior filter is replaced by the new selected category | ready-for-signoff |
| JY-STATE-008 | App builder | future consumption | Dashboard template | signed off | bind app data | app consumes governed seam rather than copying local UI | defer-to-technical-steering |
| JY-STATE-009 | Dashboard viewer or author | adjusting dashboard | Context-nav drawer controls | closed | open drawer and change controls | dashboard-level control state is visible without crowding the dashboard canvas | ready-for-signoff |

### State Transitions

| Transition ID | Actor | From state | To state | Object affected | Trigger | Expected outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ST-001 | Template author | empty | composed in browser memory | Dashboard template | rows/columns added | layout containers exist | ready-for-signoff |
| ST-002 | Template author | empty | populated | Container | widget chosen | approved widget renders with sample data state | ready-for-signoff |
| ST-003 | Dashboard viewer | no filter | selected category filter | Dashboard filter state | chart category clicked | rest of dashboard receives filter intent | ready-for-signoff |
| ST-004 | Dashboard viewer | selected filter | no filter | Dashboard filter state | filter cleared | dashboard resets filter intent | ready-for-signoff |
| ST-005 | App builder | design-system template | app-consumed pattern | Application dashboard | future adoption starts | governed adoption contract is required | defer-to-technical-steering |
| ST-006 | Dashboard viewer or author | controls closed | controls open | Context-nav drawer controls | drawer opened | dashboard controls are available in the governed shell pattern | ready-for-signoff |

## Context Variation And Unhappy Path Coverage

| Variation / unhappy path | Product posture | Blocking before packet status? | Notes |
| --- | --- | --- | --- |
| Static design-system canonical with sample data | in-scope | no | Needed for visual confirmation, but not sufficient alone. |
| Interactive row/column authoring controls | in-scope | no | Requester confirmed actual in-browser memory-backed experience. |
| Real app dashboard page | out-of-scope | no | Future work. |
| Internal API and analytics repository binding | out-of-scope | no | Future work, but flagged for reporting/read-model steering. |
| Widget hover details | in-scope | no | Must include keyboard/touch-accessible equivalent. |
| Click-to-filter | in-scope | no | At template level this is one active category filter intent, not live API filtering. |
| Multiple simultaneous filters | out-of-scope | no | Requester confirmed one at a time is fine for now. |
| Context-nav drawer dashboard controls | in-scope | no | Requester wants dashboard-level controls in this drawer. |
| Visual confirmation before chart approach lock | in-scope | no | Use rendered canonicals/screenshots with representative data states before choosing style/library approach. |
| Exporting dashboards or reports | out-of-scope | no | Not requested. |
| User-customized saved dashboards | out-of-scope | no | Not requested; would need persistence and permission planning. |
| Permission-filtered analytics data | defer-to-technical-steering | no | Required for future app integration, not design-system-only template. |

## Specialized Product Template / Checklist Reference

- Specialized template/checklist used:
  None.
- Required because:
  Not applicable.
- Checklist posture: `not-applicable`
- Product answers imported into this packet:
  None.
- Deferred checklist items and reason:
  Reporting dashboard specialization may be worth adding later if this becomes a recurring Product Discovery request type.
- Reference:
  N/A

## Product Capability Breakdown

| Capability | Derived from JTBD/use case | Derived from state journey / transition | User outcome | Actor | Surface | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Compose dashboard layout containers | JTBD-001, UC-001 | JY-STATE-001, ST-001 | rows, columns, and containers can be represented through actual in-browser interactions | Template author | Design system | Browser-memory first; saved layouts are future scope. |
| Populate containers with approved widgets | JTBD-002, UC-002 | JY-STATE-002, ST-002 | common reporting widget types are available | Template author | Design system | Includes number, pie, histogram, line, bar, box plot. |
| Show widget data details | JTBD-003, UC-003 | JY-STATE-004 | users can inspect values behind marks | Dashboard viewer | Design system and future app | Must not rely only on mouse hover. |
| Emit filter intent from widgets | JTBD-004, UC-004 | JY-STATE-005, ST-003 | clicked category data can filter dashboard context | Dashboard viewer | Design system and future app | One active category filter only for first slice. |
| Clear and communicate selected filters | JTBD-004, UC-004 | JY-STATE-006, ST-004 | users know what is filtered and can undo it | Dashboard viewer | Design system and future app | Includes replacement and no-result states. |
| Provide dashboard-level controls | JTBD-007, UC-007 | JY-STATE-009, ST-006 | users can adjust dashboard scope from a context-nav drawer | Dashboard viewer or author | Design system and future app | Exact controls are downstream, but drawer placement is locked. |
| Govern future app adoption | JTBD-005, UC-005 | JY-STATE-008, ST-005 | app dashboards reuse design-system source of truth | Design-system maintainer | Design system and future app | Requires downstream adoption contract. |
| Prepare future reporting data binding | JTBD-006, UC-006 | JY-STATE-008 | internal APIs can later provide widget data | Future app/data provider | Future app/API | Out of scope for first design-system template. |
| Validate chart visual approach | JTBD-005, UC-005 | JY-STATE-004 | chart style is selected using rendered evidence | Design-system maintainer | Design system | Requires visual confirmation before locking. |

## Business Questions Before Requirements Lock

| Question | Why it matters | Required before steering? | Current answer / owner |
| --- | --- | --- | --- |
| Is the first design-system artifact an interactive builder, a static template canonical, or both? | Determines whether row/column add controls are product behavior or illustrative configuration. | yes | Answered: actual in-browser memory-backed experience, with canonicals still needed for signoff. |
| Should filter selection support one active filter, multiple filters, or grouped filters? | Affects dashboard interaction model and selected-filter UI. | no | Answered: one active filter at a time is fine for now. |
| Does click-to-filter apply to every widget type, including number tiles and box plots? | Prevents inconsistent interaction promises. | no | Answered: category-based visualizations only. |
| What sample data domains should canonicals use? | Canonical examples need realistic labels, outliers, and no-data states without implying production data contracts. | no | Defer to design-system planning. |
| Must the template support saved dashboard definitions? | Would turn the request into persistence-backed configuration rather than design-system-only. | no | Answered: future user-configurable layout is desired, but first slice uses browser memory only. |
| Which future application actor owns dashboard data permissions? | Future API/dashboard integration may be tenant-boundary and permission-sensitive. | no | Answered at product level: both admin/operator and tenant-facing dashboards are expected; exact consuming-feature permissions are future scope. |
| How should chart style and rendering approach be selected? | Abstract discussion will miss density, label, hover, and responsive issues. | yes | Recommendation: compare rendered design-system variants with realistic sample data, screenshots, responsive states, dark/light themes, and accessibility checks before choosing. |

## Explicitly Out Of Scope

- Real application dashboard pages.
- Internal API contracts or analytics repository integration.
- Durable saved dashboard definitions.
- User-customized saved dashboards in the first slice.
- Dashboard sharing, exporting, scheduled reports, or subscriptions.
- Production permission filtering.
- Data freshness guarantees.
- Charting library or implementation architecture.
- Final chart visual style without rendered comparison.
- App-page CSS or app-local dashboard implementation.

## Ambiguity And Assumption Ledger

| Item | Assumption | Confidence | Risk if wrong | Decision needed |
| --- | --- | --- | --- | --- |
| First slice boundary | Design-system template only, with no app/API binding. | high | Scope could balloon into app and analytics architecture. | no |
| Layout authoring | Rows/columns/containers must be composed through actual in-browser memory-backed interactions. | high | A static canonical alone would miss the requested experience. | no |
| Widget set | The six listed widget types are required. | high | Missing widget type would make the template incomplete for the requester. | no |
| Hover details | Hover behavior also needs keyboard/touch accessible equivalent. | high | Mouse-only behavior would be inaccessible and fragile on touch devices. | no |
| Click-to-filter | Template should define one active category filter intent and selected state, not production data filtering. | high | Implementation might accidentally hard-code app-specific filtering or overbuild multi-filter behavior. | no |
| Dashboard controls | Dashboard-level controls should live in a context-nav drawer. | high | Controls may crowd the dashboard or drift from shell patterns. | no |
| Chart recommendation | Choose chart style/rendering approach only after visual confirmation with rendered variants. | high | A library/style may look acceptable in theory but fail with labels, density, themes, responsiveness, or interactions. | no |
| Future data source | Internal APIs and analytics repository are future integration sources. | medium | Data contracts may require a separate reporting/read-model design. | no |

## Discovery Feedback Loop

- Feedback status: `incorporated`
- First iteration reference:
  This is the first Product Discovery packet for this requirement.
- Feedback sources:
  - user interview: initial requester prompt on 2026-04-29.
  - user interview: follow-up answers on 2026-04-29 covering in-browser memory, future configurable layout, one active filter, category-based filtering, admin and tenant use, context-nav drawer controls, and visual-confirmation decision process.
  - support issue: none.
  - analytics / usage signal: none.
  - runtime defect: none.
  - sales / stakeholder input: none.
  - internal operator note: none.
- Feedback review date:
  Not scheduled.
- Decision owner:
  Requester/product owner.

| Feedback ID | Source | Observation | Affects JTBD / journey / capability / out-of-scope / assumption? | Decision | Follow-up |
| --- | --- | --- | --- | --- | --- |
| FDBK-001 | user interview | Need reporting dashboard design-system template before app/API work. | JTBD, journey, capability, out-of-scope | accept | Hand off to Technical Steering/design-system governance. |
| FDBK-002 | user interview | Template must be an actual in-browser memory-backed experience; future layout should become user-configurable. | journey, capability, assumption | accept | Lock first-slice authoring posture and defer persistence. |
| FDBK-003 | user interview | First filter model can be one active filter at a time and only category-based visualizations filter. | journey, capability, out-of-scope | accept | Update filter state model and widget interaction scope. |
| FDBK-004 | user interview | Dashboard serves both admin/operator and tenant-facing use cases. | actors, assumption | accept | Flag future permission/tenant-boundary planning. |
| FDBK-005 | user interview | Dashboard-level controls belong in a context-nav drawer. | journey, capability | accept | Add context-nav drawer controls to product scope. |
| FDBK-006 | user interview | Chart approach needs recommendation and visual confirmation. | assumption, downstream handoff | accept | Require rendered variant comparison before chart approach lock. |

## Discovery Revision Ledger

| Revision | Changed because | Product discovery impact | Downstream artifacts to revisit |
| --- | --- | --- | --- |
| R1 | Initial packet created from requester prompt. | Establishes product intent and handoff flags for reporting dashboard template. | Technical Steering, PRD, capability matrix, design-system behavior lock, canonical verification, adoption contract. |
| R2 | Requester answered follow-up discovery questions. | Locks in-browser memory-backed composition, future user-configurable layout direction, one active category filter, admin and tenant usage, context-nav drawer controls, and visual confirmation before chart approach selection. | Technical Steering, design-system behavior lock, canonical verification, PRD, capability matrix. |

## Technical Steering Handoff

- Product decisions locked:
  The first outcome is a design-system reporting dashboard template with actual browser-memory composition. It must support rows, columns, containers, number tiles with subnumbers, pie charts, histograms, line charts, bar charts, box plots, hover/detail inspection, one-at-a-time category click-to-filter intent, selected filter state, dashboard-level controls in a context-nav drawer, empty/loading/error/no-data states, admin/operator and tenant-facing future use, and future app reuse.
- Product decisions intentionally deferred:
  Exact chart library; exact data schema; persistence of dashboard definitions; future API contracts; tenant/root app permission model; data freshness; export/report scheduling; final chart visual style until rendered variant comparison is complete.
- Risk flags for Technical Steering:
  - permission-sensitive: yes, for future app data binding.
  - tenant-boundary: yes, for future app dashboards if tenant-scoped data is shown.
  - state-based journey matrix: included at product level.
  - governed frontend: yes.
  - new UX pattern: yes, possible reporting dashboard template pattern.
  - design-system extension: yes.
  - asset/user file: no.
  - reporting/read model: yes.
  - migration/persistence: no for first template; possible later if saved dashboard definitions are introduced.
  - async/job: no for first template; possible later for analytics refresh.
  - external provider: no.
  - privacy/compliance: possible later depending on dashboard data.
- Recommended next artifact:
  Technical Steering packet for design-system reporting dashboard template, followed by a design-system visual confirmation loop with rendered chart/layout variants, then PRD/capability matrix if steering approves the pattern path.
- Stop condition triggered:
  Ready for the next planning step. Do not implement real app UI until design-system governance confirms the signed-off pattern and consumable adoption seam.
