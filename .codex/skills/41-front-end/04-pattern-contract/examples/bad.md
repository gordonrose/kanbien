# Bad PatternContractArtifact Example

This fails because it treats a legacy route as a governed pattern source:

> Use the markup from `src/frontend/designSystem/patterns/context-nav/index.html`
> and copy the same classes into the app.

Why it fails:

- Legacy top-level `patterns/` routes are pre-governed inventory unless
  explicitly promoted.
- Copying route markup is not a runtime seam.
- The artifact does not name accepted primitive dependencies.
- The artifact skips accessibility and state ownership.
- The artifact smuggles app adoption into Layer 4.
