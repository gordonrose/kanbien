# Layer 6 Use-Case Page Behavior Bucket

Use this bucket when the ask is to compose accepted component seams into a
governed page-family proof.

## Recognition Test

The ask is for a design-system page-family review surface, such as entity list
page or entity record page, not for proving one component seam in isolation
and not for adopting the page into the app.

## Information Needed

- Use-case page family
- Component seams to compose
- Layer 5 render proof for each component seam
- Representative feature projection or fixtures
- Page states
- Viewport requirements
- Theme and direction requirements
- Interaction and accessibility evidence needed

## Things That Do Not Belong

Source-of-truth behavior, component receptor definitions, app-specific data
handling, backend query semantics, durable route topology, copied component
render-proof markup, route-local behavior absent from the seams, or broad
exploratory playground controls.

## Behavior Rule Output Needed

Record the use-case page ask as a later-layer dependency or next step. Name
missing information as a blocker. Do not define use-case routes, controls,
fixtures, or visual proof cases inside the behavior rule.
