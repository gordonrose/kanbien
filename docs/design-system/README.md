# Design-System Governance Docs

This directory separates shared contracts from design-system implementations.

Shared docs define behavior, accessibility, token, or primitive contracts that
must remain stable across design systems.

System docs define how one design system proves or implements a shared
contract.

Current structure:

```text
01-behavior-rule/
  shared/

02-token/
  shared/
  systems/<system-key>/
  token-readiness-index.md

03-primitive/
  shared/
  systems/<system-key>/
  primitive-readiness-index.md
```

Do not place design-system-specific values in `shared/`.

Do not treat a system implementation as consumable unless the matching shared
contract and system row are marked ready in the readiness index.

Governance docs are review and readiness sources, not construction APIs.
Downstream source may consult these docs to know what is allowed, but must
consume governed runtime seams when those seams exist.

Runtime source follows the same split:

```text
src/frontend/designSystem/layers/<layer-number>/
```

is the governed import path for later layers.

```text
src/frontend/designSystem/systems/<system-key>/
```

owns system-specific proof pages, assets, and rendered review surfaces.
