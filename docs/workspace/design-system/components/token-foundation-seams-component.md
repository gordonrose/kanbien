# Token Foundation Seams Component

## Scope

- Component name: `TokenFoundationSeams`
- Status: active
- Owner: design-system
- Source pattern artifact:
  `docs/workspace/design-system/patterns/token-foundation-seams-pattern.md`
- Consuming surfaces: future governed app pages, page structures, filter
  panels, entity record pages, and shared controls

## Purpose

`TokenFoundationSeams` is the reusable seam group for the signed-off token
routes under `/design-system/tokens`. It gives future app work an approved
source for foundational CSS variables, review classes, and small controller
seams before app-specific content is introduced.

## Public API

- Required inputs: the consuming surface must name the token or structure
  family it consumes.
- Optional inputs: approved display settings for the specific family, such as
  count card count, theme, direction, magnification, or structure visibility.
- Supported variants: only the variants visible on the signed-off token route
  or documented in the behavior lock.
- Unsupported variants: app-local geometry, app-local color aliases, and copied
  token-route HTML that bypasses the shared seam.

## Implementation Seams

- `PageBackground`: `src/frontend/designSystem/assets/pageBackground.mjs`
- Background token review: `src/frontend/designSystem/assets/tokenBackground.mjs`
- Colour token review: `src/frontend/designSystem/assets/tokenColours.mjs`
- Paragraph token render model:
  `src/frontend/designSystem/assets/tokenParagraphModel.mjs`
- Header token render model:
  `src/frontend/designSystem/assets/tokenHeaderModel.mjs`
- Entity record body and nested frame:
  `src/frontend/designSystem/assets/entityRecordStructure.mjs`
- Foundation structure controllers:
  `src/frontend/designSystem/assets/foundationStructure.mjs`
- Filter panel controller:
  `src/frontend/designSystem/assets/filterPanelStructure.mjs`
- Token source drawer support:
  `src/frontend/designSystem/assets/sourceDrawer.mjs`
- Shared styling:
  `src/frontend/designSystem/assets/styles.css`

## Behavior

- Default behavior follows the token route defaults.
- Interactive states must keep display controls and ARIA pressed/value state in
  sync.
- Resizable structures must preserve bounded resize behavior and disable
  unsupported mobile resize.
- Filter panel card structures must be generated from the controller count and
  scroll only inside the card stack.

## Accessibility Contract

- Icon-only controls require accessible names.
- Resize handles require orientation and value semantics where they represent a
  bounded split.
- Structural regions require labels that identify review anatomy.
- Tooltip triggers must remain reachable when the represented production
  trigger is focusable.

## Adoption And Migration

- First consumers: future list-style pages, entity record pages, collection
  filter panels, and shared tokenized controls.
- Existing local implementations to replace: app-local background, container,
  typography, icon-button, tooltip, filter-panel, and entity-page structural
  CSS that duplicates these token routes.
- Migration risk: copying token route markup into app pages would create drift.
  Consumers must use the shared seam or a documented adapter.

## Verification

- Route and shell serving coverage:
  `tests/integration/designSystem/route.test.ts`
- Paragraph model coverage:
  `tests/unit/designSystem/tokenParagraphModel.test.ts`
- Filter panel visual and responsive coverage:
  `tests/visual/designSystem/canonicals/data-display/filterPanelStructure.spec.ts`
- Shared design-system shell coverage:
  `tests/visual/designSystem/canonicals/shell/designSystemPageShellContract.spec.ts`

## Traceability

- Behavior lock:
  `docs/workspace/design-system/behavior-locks/token-foundation-seams-behavior-lock.md`
- Reference pack:
  `docs/workspace/design-system/reference-packs/token-foundation-seams-reference-pack.md`
- Verification checklist:
  `docs/workspace/design-system/verification/token-foundation-seams-verification-checklist.md`
- Adoption contract:
  `docs/workspace/design-system/adoption/token-foundation-seams-adoption-contract.md`
