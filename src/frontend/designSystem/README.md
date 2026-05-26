# Frontend Design-System Source Topology

This directory contains both the new governed design-system harness and older
review inventory.

Use these folders as the governed source of truth:

- `layers/` stores numbered reusable runtime seams owned by the frontend
  harness, such as Layer 2 tokens, Layer 3 primitives, and Layer 4 pattern
  contracts.
- `systems/` stores implementation-specific proof routes, assets, manifests,
  and rendered review surfaces for a selected design system.
- `shared/` stores reusable renderer and shell infrastructure that is not owned
  by a single design system.
- `registry/` stores registered design systems and lookup wiring.

Treat these folders as legacy or pre-governed inventory unless a governed
artifact explicitly promotes a seam into `layers/` or `systems/`:

- `assets/`
- `tokens/`
- `patterns/`
- `components/`
- `templates/`
- `canonicals/`
- `canonical-renderings/`
- `exploration/`

Do not add new governed token, primitive, pattern, component, template, or app
adoption seams to the legacy folders. New governed work must use the numbered
layer structure and the selected design-system proof namespace.
