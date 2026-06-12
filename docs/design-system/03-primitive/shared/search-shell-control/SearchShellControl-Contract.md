# Search Shell Control Primitive Contract

Behavior rule: `docs/design-system/01-behavior-rule/shared/search-shell/SearchShell-Behaviour.md`

`search-shell-control` is the governed secondary-chrome search shell primitive.

It owns the centered bounded shell posture, visible scope guidance, optional
Enter hint, native search input composition, and full-width mobile state. It
composes `search-field-control` for the native `<input type="search">` and
must not rebuild input semantics locally.

## Token And Primitive Dependencies

- `standard-page-shell-frame`
- `search-field-control`

`search-field-control` consumes `text-control-frame`,
`field-value-text-style`, `focus-ring`, and `minimum-target-size`.

## Behavior Boundary

- Desktop and compressed states remain centered and bounded by the signed shell
  search max width.
- Mobile state fills the available sub-navigation width.
- Enter hint appears in active-capable desktop and compressed states, mirrors
  with the input padding in RTL, and remains hidden in mobile state.
- Search submit intent emits a primitive event; result rendering and backend
  search remain later-layer work.
- Consumers must not recreate native input semantics, bounded shell behavior,
  hint behavior, or app-local CSS.

## Rendered Proof

Default proof route:
`/design-system/default/primitives/search-shell-control`
