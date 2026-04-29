# Frontend Task Guardrail

Use for task type: `frontend`

## Must Preserve

- governed app UI consumes signed-off design-system render and behavior seams
- no app-page CSS for governed pages
- no copied design-system markup, ARIA, state behavior, or controller logic
- accessibility, permission-aware rendering, and browser-visible proof
- served asset/runtime evidence when the task changes visible runtime behavior

## Approval Evidence

- signed-off design-system seam or explicit approved exception
- affected route/surface and allowed write set
- accessibility and state proof
- visual/rendered proof command
- artifact obligations for topology, adoption, or frontend docs

## Required Check IDs

- `frontend-design-system-seam`
- `frontend-no-app-css`
- `frontend-no-copied-behavior`
- `frontend-accessibility-state`
- `frontend-rendered-proof`
- `frontend-runtime-evidence`
- `frontend-artifacts`
