# Token Foundation Seams Pattern

## Purpose

Token foundation seams provide the reusable visual and structural substrate for
future governed app surfaces. They let app work consume approved design
decisions for backgrounds, containers, typography, controls, tooltips, and
empty structural page frames without rebuilding those decisions locally.

## Pattern Families

| Family | Pattern Role |
| --- | --- |
| `background` | Environmental page layer and foundation surface |
| `container` | Outer grouped surface |
| `container-section` | Interior repeated or grouped surface |
| `colours` | Semantic colour scale |
| `paragraph` | Body, label, and status text treatment |
| `header` | Heading hierarchy |
| `icon-button` | Icon-only command affordance |
| `tooltip` | Shared lightweight explanatory overlay |
| `entity-page-structure` | Foundation entity record page anatomy |
| `nested-entity-record` | Entity record structure inside a bounded nested frame |
| `filter-panel-structure` | Overlay filter panel foundation with fixed title and scroll stack |

## Composition Rules

- Visual tokens may be composed into structures, but structures must not
  redefine the visual token values locally.
- Structure seams may include empty slots and region labels, but not app domain
  content.
- Controls may depend on typography and tooltip seams, but must keep accessible
  names independent from tooltip-only text.
- App pages must consume these seams from the design-system source of truth,
  not by copying route-local review markup.

## State Model

- Resting/default states are required for every family.
- Theme states are required where the route exposes normal, dark, or desert
  variants.
- Status states are required for semantic text and container colors where the
  route exposes success, warning, or error variants.
- Interactive states are required for `icon-button`, `tooltip`, resizable
  entity structures, and the filter panel display setting.
- Mobile and compact states are required for structure families.

## Ownership

The design-system token routes own visual truth for these seams until generated
canonical render pages are introduced. First app consumers own parity evidence
against the signed-off token route and any product-specific copy or data
adapter.
