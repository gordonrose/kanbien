# Bad Primitive Later-Layer Output

This is bad because it implements the primitive inside the behavior rule.

> The primitive will be a 32px round button with `aria-label`, a `data-action-id` prop, and the `.rowIconButton` CSS class. Apps should import it from `src/frontend/designSystem/primitives/iconButton.ts`.

Problems:

- Chooses size and CSS before token review.
- Defines props and import paths before the component-seam layer.
- Turns the behavior rule into implementation.
