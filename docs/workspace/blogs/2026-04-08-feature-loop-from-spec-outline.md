# Blog Outline: From Feature Loop To Build-From-Spec

## Working Title

From “Ship The Code” To “Ship The Artifact Chain”

## Audience

- engineering leads
- platform teams
- senior backend engineers

## Core Thesis

Good delivery discipline is not bureaucracy. It is what makes a codebase
recoverable, reviewable, and safe to evolve.

## Outline

### 1. The Problem With Implementation-Only Progress

- code lands
- context stays in chat or people’s heads
- docs become lagging indicators
- the next iteration starts from partial memory

### 2. The Shift: Every Meaningful Slice Gets A Loop

- capability matrix
- PRD
- ADR where needed
- PRD-derived test cases
- implementation blueprint
- implementation
- verification
- close-out review

### 3. Why The Loop Matters More For Shared Seams

- token library example
- notification delivery example
- risks of letting “small shared utility” changes skip process

### 4. The Missing Piece We Discovered Late

- implementation can still leave maintained docs stale
- standards snapshots can drift
- older test-case docs can keep saying “not implemented yet”

### 5. The Guardrail We Added

- maintained-artifacts sweep before close-out
- update loop skills, templates, and standards requirements
- treat repo truth maintenance as part of shipping

### 6. Build-From-Spec As The Endgame

- not byte-for-byte reconstruction
- enough to rebuild business behavior, NFRs, and compliance posture
- why this is a practical bar for serious teams

### 7. Closing

- disciplined artifacts create momentum rather than slowing teams down
- the result is a repo that is easier to trust, audit, and extend

## Supporting Repo References

- `docs/standards/change-artifact-requirements.md`
- `docs/architecture/recoverability-and-build-from-spec.md`
- `docs/workspace/implementation-blueprints/*`
- `.codex/skills/00-orchestration/change-loop-orchestrator/SKILL.md`

## Suggested Call To Action

- audit one recent feature in your own repo
- ask which parts of its design and verification live only in code or chat
- build a tighter loop from there
