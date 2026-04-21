# Page-Shell Banner Behavior Lock

## Purpose

Lock the first governed behavior rules for shell-level banner messaging before
extracting a reusable page-shell controller seam or migrating the behavior into
`rootAdminShell`.

This artifact is intentionally about shell feedback behavior, not page-local
error handling. It exists to stop the repo from treating banners as whatever
the current page happens to write into shared shell state.

## Review Status Legend

- `approved`:
  behavior should be preserved in the first signed-off reference pack
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior needs more iteration or clarification before being locked

## Scope

- Family:
  `page-shell-banner`
- Current source surface:
  `/design-system/templates/page-shell`
- Host shell family:
  `docs/architecture/adr/0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md`
- Related downstream artifacts:
  `docs/workspace/design-system/patterns/page-shell-banner-pattern.md`
  `docs/workspace/design-system/reference-packs/page-shell-banner-reference-pack.md`
  `docs/workspace/design-system/verification/page-shell-banner-verification-checklist.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `PSB-001` | Shell banners must live in a shell-owned feedback zone above the page content rather than appearing as page-body copy or ad hoc inline markup. | Keeps banner behavior governed at the page-shell layer instead of letting each page improvise its own feedback posture. | The current demo renders a dedicated banner stack above the page-shell content header on `/design-system/templates/page-shell`. | `approved` | Banner behavior belongs to the shell, not an individual page. |
| `PSB-002` | Banner messages should preserve visible breathing room between the feedback zone and the page content below it. | Prevents the shell from feeling visually crushed and keeps page content readable after feedback appears. | The current demo adds dedicated bottom spacing below the banner stack instead of pinning content directly to the banner edge. | `approved` | There needs to be breathing room because the old banner felt squashed at its base. |
| `PSB-003` | Every shell banner must expose a visible close affordance. | Makes dismissal reliable and prevents users from being trapped with stale or irrelevant shell feedback. | The current demo gives every banner state a visible circular close `X`. | `approved` | There always needs to be an `X` to close the message. |
| `PSB-004` | The first governed shell banner set should cover at least informational, success, warning, and danger/error states. | Gives later consumers one clear baseline state grammar instead of inventing tones route by route. | The current design-system demo exposes four states in one governed stack. | `approved` | The first pass should show the various banner states for approval. |
| `PSB-005` | Banner dismissal must be state-local: closing one banner should not collapse unrelated banner states in the same review batch. | Lets the family prove close behavior honestly and avoids turning dismissal into a hidden global reset. | The current demo hides only the dismissed state while leaving the remaining states visible. | `approved` | Close behavior should feel direct and predictable. |
| `PSB-006` | Shell banner visibility should be controllable from the governed display-settings review surface while the family is still in template-hosted demo mode. | Creates an honest approval loop inside the page shell before shared controller extraction is finalized. | The current demo is launched from the page-shell display-settings drawer through `Show banners` and `Hide banners`. | `approved` | Use a drawer toggle as the first demo pass to get approval. |
| `PSB-007` | The governed shell banner family must not rely on indefinite stale shared state as its default behavior. | Prevents the root-admin drift where messages survive too long, survive route changes unintentionally, and lack a clear reset path. | The current shared runtime controller clears page-scoped root-admin banners on navigation, auto-dismisses only high-signal `info` / `success` cases that remain allowed, and leaves `warning` / `danger` dismissible until replaced or manually closed. | `approved` | The old shell behavior was not page-scoped, did not auto-dismiss, did not clear on navigation, and had no explicit clear path. |
| `PSB-009` | Shell banners should not narrate routine navigation, open-state changes, cancellation flows, or expected search refreshes. | Keeps shell feedback high-signal so banners remain meaningful instead of becoming ambient narration. | The shared runtime seam now exposes explicit policy buckets, and the current root-admin consumer uses only `blocked-action`, `error`, and `mutation-success` while suppressing open/navigation/cancel chatter. | `approved` | The banner policy felt too trigger-happy and granular. |
| `PSB-008` | The current signed-off pass is a shell-pattern approval, not yet the full reusable runtime contract for app adoption. | Keeps the repo honest about what is approved today versus what still needs extraction and adoption work. | The family now runs through a shared design-system render/controller seam on the template host, dedicated canonical render surface, and `rootAdminShell`, but wider multi-consumer runtime policy still needs validation before the API broadens. | `approved` | Push this through the design-system loop first so it can eventually inform the reusable shell controller contract for `rootAdminShell`. |

## Exit Criteria For This Step

This behavior-lock step is complete when each listed behavior is marked:

- `approved`
- `rejected`
- or `undecided` with an explicit follow-up action

Do not broaden the shared runtime API beyond the current first-consumer policy
until a second governed consumer confirms the same seam.
