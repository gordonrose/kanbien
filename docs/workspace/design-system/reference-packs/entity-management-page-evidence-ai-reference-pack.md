# Entity Management Page Evidence And AI Reference Pack

## Purpose

Define evidence and AI reference states for the `entity_management_page`
template. Review this pack when inspecting canonical renderings for evidence
mode, AI mode, target affordances, desktop split, mobile overlays, mutual
exclusion, and focus recovery.

## Scope

- Family:
  `entity-management-page`
- Child matrix:
  evidence and AI contract
- Status:
  review-candidate reference pack
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/entity-management-page-evidence-ai-behavior-lock.md`
- Parent index:
  `docs/workspace/design-system/reference-packs/entity-management-page-reference-pack.md`

## Reference State IDs

Use prefix `EMPE-*`.

| Ref ID | State | Route / setup | Why it exists | Evidence status |
| --- | --- | --- | --- | --- |
| `EMPE-001` | Evidence mode off baseline | Desktop Identity | Proves evidence buttons are not visually active by default. | needs evidence |
| `EMPE-002` | Evidence mode on baseline | Desktop Identity, toggle evidence | Proves evidence targets become discoverable. | partially covered |
| `EMPE-003` | Evidence drawer open | Desktop, open Entity name evidence | Proves evidence drawer content and mode state. | partially covered |
| `EMPE-004` | Evidence desktop split geometry | Desktop, evidence drawer open | Proves equal usable split and no detail squashing. | partially covered |
| `EMPE-005` | Evidence close | Close evidence drawer | Proves state clears and selected detail remains stable. | needs evidence |
| `EMPE-006` | Evidence target in Workflows | Workflows, open Workflow name evidence | Proves evidence works after lazy region materialization. | partially covered by smoke |
| `EMPE-007` | Evidence target in Views | Views, open View name evidence | Proves evidence works across another lazy region. | needs evidence |
| `EMPE-008` | Evidence target in Action Models | Action Models, open route/error evidence | Proves long evidence values and model panels. | needs evidence |
| `EMPE-009` | AI mode off baseline | Desktop Identity | Proves AI buttons inactive by default. | needs evidence |
| `EMPE-010` | AI mode on baseline | Desktop Identity, toggle AI | Proves AI targets become discoverable. | needs evidence |
| `EMPE-011` | AI drawer open | Desktop, open Entity name AI | Proves AI guidance drawer content. | needs evidence |
| `EMPE-012` | AI desktop split geometry | Desktop, AI drawer open | Proves equal usable split and no detail squashing. | needs evidence |
| `EMPE-013` | AI close | Close AI drawer | Proves state clears and selected detail remains stable. | needs evidence |
| `EMPE-014` | Evidence to AI mutual exclusion | Evidence open, toggle AI | Proves evidence closes and AI opens cleanly. | needs evidence |
| `EMPE-015` | AI to evidence mutual exclusion | AI open, toggle evidence | Proves AI closes and evidence opens cleanly. | needs evidence |
| `EMPE-016` | Edit to evidence mutual exclusion | Edit mode on, toggle evidence | Proves edit clears and evidence opens. | needs evidence |
| `EMPE-017` | Evidence to edit mutual exclusion | Evidence open, toggle edit | Proves evidence closes and edit opens. | needs evidence |
| `EMPE-018` | Mobile evidence overlay | Mobile Identity, evidence open | Proves overlay posture and underlying content suppression. | needs evidence |
| `EMPE-019` | Mobile AI overlay | Mobile Identity, AI open | Proves AI overlay posture. | needs evidence |
| `EMPE-020` | Mobile evidence close | Mobile evidence open, close | Proves overlay dismissal and scroll recovery. | needs evidence |
| `EMPE-021` | Mobile AI close | Mobile AI open, close | Proves overlay dismissal and scroll recovery. | needs evidence |
| `EMPE-022` | Focus on evidence open | Keyboard-only, open evidence | Proves focus moves predictably into drawer. | needs evidence |
| `EMPE-023` | Focus on evidence close | Keyboard-only, close evidence | Proves focus return path. | needs evidence |
| `EMPE-024` | Focus on AI open/close | Keyboard-only AI flow | Proves AI focus choreography. | needs evidence |
| `EMPE-025` | Long evidence values | Evidence drawer with long values/URLs | Proves wrapping and no horizontal overflow. | needs fixture |
| `EMPE-026` | Dark theme evidence | Dark theme, evidence open | Proves contrast and split geometry. | partially covered |
| `EMPE-027` | Dark theme AI | Dark theme, AI open | Proves contrast and guidance panel readability. | needs evidence |
| `EMPE-028` | RTL evidence split | RTL desktop, evidence open | Proves split placement and content alignment. | needs evidence |
| `EMPE-029` | RTL mobile evidence overlay | RTL mobile, evidence open | Proves overlay and close affordance alignment. | needs evidence |
| `EMPE-030` | Zoomed evidence/AI | 200% zoom, evidence and AI | Proves panel reflow and focus not obscured. | needs evidence |

## High-Risk Batch

Review first:

- `EMPE-003`
- `EMPE-004`
- `EMPE-011`
- `EMPE-012`
- `EMPE-014`
- `EMPE-018`
- `EMPE-022`
- `EMPE-025`
- `EMPE-030`

