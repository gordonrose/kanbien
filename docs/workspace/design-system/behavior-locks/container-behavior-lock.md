# Container Behavior Lock

## Scope

`Container` is the reusable outer grouped surface token for app and
design-system regions.

## Behavior Contract

- `CON-001`: The container surface is fully opaque in the normal theme.
- `CON-002`: The normal container background defaults to the shared container
  background token.
- `CON-003`: The container carries only the approved bottom and right border
  treatment from the primary border token.
- `CON-004`: Success, warning, and error container treatments use semantic
  state background tokens.
- `CON-005`: Container corners stay square unless a future component seam
  explicitly adds radius.
- `CON-006`: Theme, accent, direction, and magnification are inherited from the
  shell rather than recomputed locally.
- `CON-007`: The container token does not imply card anatomy, record content,
  drawer content, or app-specific section meaning.
- `CON-008`: Source output must expose the approved background and border token
  relationship.

## Adoption Rule

App containers must use the semantic container token relationship instead of
raw background and border literals.
