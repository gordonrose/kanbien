# Chat Branch Bootstrap - Top Nav Generated Route Proof

## Scope

Add generated `/design-system/canonical-renderings/top-nav/:ref` proof for the
top-nav canonical set, including optional-shell variants where mobile navigation
or profile elements may be absent, and refresh top-nav docs to name generated
routes as first-class review truth.

## Base

- Base ref: `origin/main`
- Base commit: `82620aa423abb91c2e51e7fe6e0b53e1b0209331`
- Source branch at bootstrap: `main`

## Branch And Worktree

- Dedicated branch: `codex/top-nav-generated-route-proof`
- Worktree path: `/tmp/kanbien-top-nav-generated-proof`

## Intended Write Set

- `tests/visual/designSystem/canonicals/navigation/topNav.spec.ts`
- `docs/workspace/design-system/reference-packs/top-nav-reference-pack.md`
- `docs/workspace/design-system/verification/top-nav-verification-checklist.md`
- `docs/workspace/chat-bootstraps/`

## Shared Seams

- Generated canonical-rendering router
- Top-nav canonical render surface
- Optional top-nav shell controls:
  - mobile navigation/menu control may be absent
  - profile trigger/profile element may be absent

## Notes

The main `/home/gordon/kanbien` worktree still has the completion-audit artifact
uncommitted on `codex/canonical-renderings-completion-audit`. This worktree is
separate so the top-nav implementation can proceed from a clean pushed base.
