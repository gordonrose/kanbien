# ListPageStructure Verification Checklist

Before treating a `ListPageStructure` change as accepted, verify:

- the token route loads inside the standard design-system page shell
- breadcrumb reads `Home / Token Layer / List Page Structure`
- first header renders 24 desktop columns
- first header renders only one visible mobile column
- second header supports 6, 12, 18, and 24 columns
- second header uses static half-width rails on desktop overflow states
- second header scrolls between the rails, not including the rails
- second header shows one mobile column at a time
- display drawer can hide and show each header independently
- desktop `full` layout exposes the full primary foundation region
- desktop `1:4 split` exposes side, resize line, and primary regions
- desktop resize updates the side/main relationship by pointer or mouse
- keyboard arrows adjust the resize relationship
- mobile `full` layout exposes one primary column only
- mobile `1:4 split` exposes the four-column primary region and hides the side
  region behind it
- mobile resize control is unavailable
- no record, filter, entity, or drawer payload semantics appear in the
  foundation placeholders

Current scoped checks:

- `node --check src/frontend/designSystem/assets/listPageStructure.mjs`
- `node --check src/frontend/designSystem/assets/app.mjs`
- `npx vitest run tests/integration/designSystem/route.test.ts`
