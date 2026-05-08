# QA Evidence: Chat Interface Browser And Design-System Adoption

## Scope

- Story/task:
  S-008 / T-S008-04
- Journey IDs:
  JY-CHAT-L1-ROOT-BUILD-001, JY-CHAT-L1-DS-ADOPTION-001
- Evidence date:
  2026-05-08

## Evidence Captured

| Evidence Target | Result | Evidence |
| --- | --- | --- |
| Shared design-system seam adoption | pass | `npx playwright test tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts --grep "root-admin Build panel"` passed 3 browser tests. |
| No app-local CSS drift | pass | The browser proof checks the root-admin page serves `/design-system/assets/conversationPanel.css` and rejects root-admin app stylesheet entrypoints. |
| Desktop panel usability | pass | Browser geometry proof verifies the Build panel stays inside the shell mount and does not move the main root-admin content when opened/closed. |
| Mobile action path | pass | Browser proof verifies the mobile floating action can close and reopen the Build panel and keep the message input reachable. |
| Context-not-authority browser path | pass | Browser proof mutates URL query/hash with tenant-like values and verifies protected conversation/PDF requests do not use them as authority. |
| Live Build panel assistant path | pass | Headless browser proof authenticated into `/root-admin`, submitted a real Build panel message through the shared conversation panel, waited for the OpenAI-backed assistant response to render, and verified the matching persisted usage attempt succeeded. |

## Mock Honesty

The browser route mocks record protected API request bodies and URLs, then
assert against those captured requests. They do not infer success from visual
copy alone, and they do not invent URL authority or download scope.

Residual gap: this is Playwright-served browser evidence, not a manually
captured production-like deployment screenshot set.
