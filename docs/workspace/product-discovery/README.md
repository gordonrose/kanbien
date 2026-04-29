# Product Discovery Workspace

This workspace holds retained Layer 1 Product Discovery artifacts.

Product Discovery turns raw user requests and post-iteration feedback into a
source-independent packet before Technical Steering, PRD, capability matrix, or
implementation planning begins.

## Contents

- `taxonomy.md`
  Reusable classification language for product discovery. Taxonomy values flag
  questions, likely downstream gates, and reuse paths; they do not decide
  implementation architecture.
- `templates/`
  Reusable product discovery presets. The generic template is the fallback when
  no more specific product template exists.
- retained product discovery packets
  Durable discovery outputs for material changes when the packet needs to feed
  later PRD, capability matrix, Technical Steering, or feedback work.
- feedback notes
  Post-iteration signals that may revise product intent.

## Lifecycle

1. Start from the user request, feedback note, or prior product artifact.
2. Classify the request with the taxonomy.
3. Use a product template when one fits, otherwise use the generic template.
4. Produce or update a Product Discovery packet using
   `docs/templates/product-discovery-packet-template.md`.
5. Stop if the packet status is not `ready-for-technical-steering`.
6. Hand the packet to Technical Steering when product intent is ready.

## Boundaries

Product Discovery feeds PRDs, capability matrices, Technical Steering, and
implementation blueprints. It does not replace them.

Feedback must not jump directly from user signal to implementation scope. When
feedback changes product intent, update the discovery packet or add a feedback
note first, then revisit Technical Steering and downstream artifacts as needed.
