# QA Evidence: Chat Interface Packet PDF

## Scope

- Story/task:
  S-008 / T-S008-03
- Journey ID:
  JY-CHAT-L1-PACKET-PDF-001
- Evidence date:
  2026-05-08

## Evidence Captured

| Evidence Target | Result | Evidence |
| --- | --- | --- |
| Protected PDF route | pass | `tests/integration/harnessChat/router.test.ts` proves `GET /v1/root-admin/harness-chat/packet-revisions/:packetRevisionId/pdf` returns `application/pdf` bytes. |
| Server-side actor binding | pass | The router test proves PDF rendering receives the server root user id, not browser context or query data. |
| Missing capability denial | pass | `tests/security/harnessChat/routerAuthz.test.ts` proves missing `harness-chat.root.packet.downloadPdf` returns `403 FORBIDDEN` and never calls `renderPacketPdf`. |
| Browser download request posture | pass | `tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts` proves the browser fetches only `/v1/root-admin/harness-chat/packet-revisions/:id/pdf` and does not append URL replay parameters. |

## Mock Honesty

The PDF proof uses a minimal PDF byte fixture only to prove protected delivery
plumbing. It does not claim final packet rendering quality, renderer retry
semantics, or production document formatting.

Residual gap: renderer failure, retry, timeout threshold, and persisted PDF
attempt-row evidence are not yet covered by executable tests in this slice.

