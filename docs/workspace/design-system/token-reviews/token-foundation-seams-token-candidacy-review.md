# Token Foundation Seams Token Candidacy Review

## Scope

- Family: `token-foundation-seams`
- Review date: 2026-05-23
- Current promotion state: `system-ready`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/token-foundation-seams-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/token-foundation-seams-reference-pack.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/token-foundation-seams-pattern.md`

## Eligibility Check

- Reference-backed and behavior-locked: yes.
- Rendered evidence captured: yes, through user sign-off on live token routes
  and targeted executable coverage.
- Playwright or equivalent parity gate exists: partial. Filter-panel behavior
  has dedicated visual coverage; route and shell tests cover the broader token
  route family.
- At least one other family or planned consumer can reuse the decision: yes.
- Token extraction is needed before app adoption: yes for background,
  container, typography, icon button, tooltip, and structural foundations.

## Candidate Decisions

| Candidate | Semantic Meaning | Decision | Rationale |
| --- | --- | --- | --- |
| Background wash/glow/corner variables | Page environmental foundation | Promote to token seam | Shared page structures and shells need one approved environmental layer |
| Container surface/background/border state variables | Grouped page and section surfaces | Promote to token seam | Repeated app regions should share container language |
| Container-section surface variables | Interior grouped regions | Promote to token seam | Needed where containers hold repeated subregions |
| Colour semantic scale | Shared semantic colour language | Promote to token seam | Multiple controls, text states, and containers depend on the same colour meanings |
| Paragraph scale and semantic ink | Body, label, and status text | Promote to token seam | Typography must be shared across structures and controls |
| Header scale and theme ink | Heading hierarchy | Promote to token seam | Page, section, and card headers need stable hierarchy |
| Icon-button sizing and state treatment | Icon-only command affordance | Promote to primitive seam | Reuse depends on structure, accessible naming, and state behavior, not only CSS values |
| Tooltip surface variables | Lightweight explanatory overlay | Promote to primitive seam | Reuse depends on layer, trigger behavior, placement, and typography |
| Entity-page structure columns and resize bounds | Entity record foundation | Promote to primitive seam | Geometry and resize behavior should remain structural, not token-only |
| Nested entity record frame sizing and resize affordances | Nested entity review container | Promote to primitive seam | Frame behavior and embedded entity body are structural |
| Filter panel width/title/scroll-stack structure | Overlay filter foundation | Promote to primitive seam | Reuse depends on overlay, sticky title, mobile behavior, and scroll containment |

## Output

- New semantic tokens approved: background, container, container-section,
  colours, paragraph, and header token seams.
- Primitive candidates identified: icon-button, tooltip,
  entity-page-structure, nested-entity-record, and filter-panel-structure.
- Local-only decisions intentionally retained: token-route specimen spacing and
  source-drawer explanatory copy.
- Deferred candidates: generated canonical render routes for each token family.
- Follow-up artifacts to update: first-consumer adoption notes when real app
  surfaces consume a seam.

## Follow-Up

- Pattern artifact updated: yes.
- Component artifact updated: yes.
- Reference pack impact: aggregate token foundation reference pack created.
- Verification checklist impact: aggregate token foundation checklist created.
- App adoption impact: app adoption may begin only through the adoption
  contract and parity proof.
