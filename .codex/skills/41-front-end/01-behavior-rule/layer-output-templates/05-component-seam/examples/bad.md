# Bad Component Seam Later-Layer Output

This is bad because it defines the seam implementation inside the behavior rule.

> Export `createFilterPanelController()` from `src/frontend/designSystem/filterPanel.ts` and pass `{ filters, onChange }`.

Problems:

- Defines export path and API before Layer 5.
- Assumes controller shape without pattern contract.
- Lets Layer 1 decide runtime structure.
