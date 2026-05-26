# Capability Matrices

This folder stores capability matrices and related notes while the repo still
uses the legacy workspace layout.

Capability matrices are cross-bucket handoff artifacts. Classify each matrix by
the subject it governs, not by this folder name.

Common owners include:

- `platform` for backend/runtime/product capability matrices
- `discovery-harness` for Product Discovery or planning-harness capability
  matrices
- `frontend-harness` for design-system, topology, visual, or governed frontend
  capability matrices
- `shared-governance-kernel` for repo workflow, standards, or harness
  capability matrices
- `archive/history` for superseded or historical matrix drafts

Before using a matrix as current implementation authority, reconcile it with
current PRDs, Technical Steering, Story Breakdown, Task Breakdown, API
contracts, permission mappings, data dictionaries, feature manifests, generated
artifacts, and source implementation.

Do not move individual matrices into bucket folders until references, skill
lookup expectations, validation commands, and downstream planning links have
been checked.
