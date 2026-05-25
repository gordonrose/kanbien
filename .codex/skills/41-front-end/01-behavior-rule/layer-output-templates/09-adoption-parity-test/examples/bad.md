# Bad Adoption Parity Test Later-Layer Output

This is bad because it defines a test before the adoption exists.

> Run Playwright against `/root-admin/users` and compare the DOM to the demo page using `.filter-panel`.

Problems:

- Assumes app adoption exists.
- Chooses selector and comparison method too early.
- Risks demo-route markup becoming source truth.
