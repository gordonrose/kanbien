# Bad Canonical Scenarios Later-Layer Output

This is bad because it defines canonical implementation from Layer 1.

> Create `filter-panel-dark-error.spec.ts` with mocked fallback data and assert `.filter-panel-error` is visible.

Problems:

- Chooses test file and selector before Layer 7.
- Uses mock fallback data without production honesty.
- Skips demo and seam prerequisites.
