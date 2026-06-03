# Bad Component Seam Artifact Summary

This is bad because it looks like a component API while pushing governed
behavior back into app pages.

## Bad Shape

- Exposes `className`, `rowHtml`, `onPrimitiveMove`, and `detailSelector` as
  public inputs.
- Lets the app decide how to wire resize and reorder events.
- Accepts raw backend records and asks the component to infer durable domain
  facts from labels.
- Says "accessibility handled by consumers."
- Defines route-specific filter behavior and API query construction inside
  the component contract.

## Why It Fails

The seam no longer prevents drift. Consumers still need to recreate markup,
controller behavior, event mapping, and accessibility feedback locally, while
the component layer has also crossed into backend and app-workflow decisions.
