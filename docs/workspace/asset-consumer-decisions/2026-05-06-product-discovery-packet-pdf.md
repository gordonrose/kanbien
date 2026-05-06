# Asset Consumer Decision Record: Product Discovery Packet PDF

## Summary

- Date:
  2026-05-06
- Owning feature:
  future chat or harness-chat feature, Product Discovery packet generation seam
- Asset use case:
  server-generated Product Discovery packet PDF for the root-admin Build chat
  MVP
- First consumer route or workflow:
  root-admin Build chat packet download
- Decision status:
  approved
- Approver:
  requester approved transient generated download and simple structured export
  in chat on 2026-05-06; requester also confirmed the generation behavior
  should be usable by other features in future

## Business Decision

- What entity owns this asset relationship?
  The Product Discovery packet record owns the export relationship. The rendered
  PDF is generated from durable packet data and is not the durable source of
  truth.
- Why does the product need this asset?
  Root builders need a simple structured Product Discovery packet export they
  can download from the MVP instead of continuing into the later build loop.
- Is the asset required for core product behavior, branding, support, export,
  user-generated content, or another purpose?
  Export.
- Who may upload, replace, read, download, delete, or publish this asset?
  No actor may upload, replace, delete, or publish the PDF in the MVP. An
  authenticated root builder may download an authorized packet PDF through the
  consuming feature's authorization rule.
- Is this a narrow approved use case or a generic asset-library/file-hosting
  surface?
  Narrow approved use case only. This is not a generic asset library or file
  hosting surface.

## Architecture Boundary

- Should this be a one-off Product Discovery renderer or a reusable generated
  document seam?
  The MVP should implement Product Discovery as the first consumer of a reusable
  generated-document boundary. It must not become a broad document-generation
  platform in the MVP, but the internal boundary should keep packet data,
  document rendering, delivery, audit, and authorization concerns separable so
  future features can adopt the generation path without copying Product
  Discovery-specific code.
- First consumer:
  Product Discovery packet PDF.
- Future consumers:
  Other feature-owned simple structured exports, subject to their own
  Product Discovery, Technical Steering, asset/download decision review,
  authorization, retention, and data contracts.
- MVP boundary rule:
  Product Discovery owns the packet data contract and packet-specific section
  mapping. The reusable generated-document seam owns generic structured-document
  rendering primitives, output metadata, deterministic rendering behavior,
  delivery handoff shape, and render failure reporting.
- Anti-corner rule:
  Do not hard-code Product Discovery packet fields into a generic renderer API.
  Do not expose a generic document API directly to app pages. Feature-owned
  services should call a narrow server-side rendering seam after the owning
  feature has authorized the actor and selected durable source data.
- Deferred platform behavior:
  WYSIWYG templates, customer-editable templates, stored rendered files, public
  document delivery, rich branding, arbitrary HTML-to-PDF input, uploaded
  documents, and cross-feature document catalogs.

## Architecture Interview Status

- Interview status:
  complete for MVP implementation planning
- Answered so far:
  transient regenerated download, simple structured export, and future-usable
  generated-document boundary. Typical generation/download should complete in
  under 3 seconds, with a preparing-download fallback for larger packets,
  transient load, or slower renderer cases. The MVP should use an Option 2
  light posture: a moderate shared export seam with bounded concurrency,
  timeouts, and fallback behavior, while preserving a migration path to a
  high-volume asynchronous export pipeline later. PDF generation may render
  only from approved Product Discovery packet data; raw chat transcript and
  conversation history are not approved PDF source content for the MVP.
  Approved packet versions are immutable. Material changes must move back up
  the loop through a change request or review path and create a new approved
  packet version. Superseded approved versions remain accessible and
  downloadable to authorized root builders as history, with explicit previous
  and next packet-version links. If PDF generation fails for a transient
  rendering or delivery reason, the user may retry immediately from the same
  approved packet version. The preferred MVP renderer is self-hosted
  Playwright/Chromium behind a provider-neutral generated-document seam.
  Long packet content may paginate naturally, but the PDF layout must avoid
  cutting images or table rows across page boundaries. Broad tables must use a
  layout posture that fits more content on the page, such as approved landscape
  or fit-to-width table rendering, rather than clipping content. The generated
  PDF must include a header page with compact packet metadata before the packet
  body. User-visible cancellation is out of scope for the MVP; cancellation is
  handled through server-side timeout and cleanup behavior. Every generation
  failure must create audit and metrics evidence; alerting should trigger on
  the approved MVP thresholds named below. Support/root-builder diagnostics may
  expose safe failure reason categories, but not stack traces or renderer
  internals. The
  renderer contract should carry locale context now, while MVP PDF content is
  English-only until the planned localization layer exists. Migration and
  reversibility are handled by keeping Playwright/Chromium behind the
  provider-neutral generated-document seam; a second renderer fallback is not
  implemented or tested in the MVP. Product Discovery owns packet data and maps
  approved packet versions into a renderer-neutral document shape; the generic
  renderer seam must not accept Product Discovery-specific fields directly. MVP
  numeric limits are approved as conservative defaults: 250 KB maximum
  structured packet source data, 750 KB maximum rendered HTML, 5 MB maximum PDF
  output with warning at 3 MB, 10-second soft timeout, 20-second hard timeout,
  one active render per root or future tenant context, three active renders
  platform-wide, five generations per actor per 10 minutes, three generations
  per conversation per 10 minutes, 30 generations per root/platform context per
  hour, one automatic retry only for renderer startup/crash/timeout failures,
  and alerts for failure rate above 10 percent over 30 minutes, any hard
  timeout, or a full platform render queue lasting more than 5 minutes.
- Still requiring explicit review before implementation planning treats this
  as complete:
  no remaining PDF architecture questions for the root-admin MVP. Broader
  tenant/customer rollout, stored PDFs, public delivery, customer-shareable
  exports, or substantially higher-volume document generation require a
  refreshed decision.
- Explicitly deferred with owner:
  tenant/package-specific overrides, dynamic quotas, paid-tier limits, and
  asynchronous export queue tuning are deferred to a future configuration
  owner. The MVP may start with fixed configuration defaults, but
  implementation must keep the values named and centralized so they can move
  behind tenant-level or package-level configuration without changing route
  contracts.
- Current blocker posture:
  The delivery/storage/rendering direction and numeric MVP thresholds are
  approved for implementation blueprinting. The remaining chat-interface
  blockers live outside this PDF decision, especially permission mapping, API
  contract, data dictionary, root-admin parity proof, runtime evidence, and the
  implementation blueprint itself.

## Asset Class

- Allowed asset kind:
  document
- Exact MIME allowlist:
  `application/pdf`
- Maximum file size:
  5 MB generated response cap for MVP. A rendered PDF at or above 3 MB should
  record a warning metric so the team can watch for packets that are becoming
  too large for the simple export path.
- Maximum count or storage footprint:
  Rendered PDF bytes are not stored as durable assets in the MVP. Packet data,
  packet versions, and download audit events are retained by the owning feature.
- Packet versioning and historical access:
  approved packet versions are immutable durable history. Regenerated PDFs
  render the approved packet version being downloaded, not a mutable latest
  packet shape. Later changes create a new approved packet version through the
  loop and mark earlier versions as superseded without removing their
  authorized historical downloadability. Packet versions must retain a clear
  chain to previous and next approved versions when those links exist.
- Generation retry behavior:
  transient rendering or delivery failures may be retried immediately by the
  user from the same approved packet version. Each failed attempt must be
  recorded. Permission failures, inaccessible packet data, and data-integrity
  failures are not normal retry states and must remain denied or escalated
  through support/admin review.
- Cancellation behavior:
  explicit user-visible cancellation is out of scope for the MVP. Generation
  work should be cancelled only through server-side timeout, request abort,
  cleanup, or future worker lifecycle behavior. Users see normal preparing,
  success, failed, and retry states rather than a cancel action.
- Renderer/runtime:
  self-hosted Playwright/Chromium is the preferred MVP renderer. The renderer
  must run server-side, accept approved structured packet data through the
  generated-document seam, reject arbitrary user HTML/document input, and
  return an authenticated attachment PDF through the approved delivery path.
  The seam must stay provider-neutral enough to move rendering to a worker,
  another self-hosted renderer, or a paid provider later without changing the
  Product Discovery packet contract.
- Pagination and wide-content behavior:
  natural multi-page pagination is approved for MVP packet PDFs. Rendering must
  avoid splitting images or individual table rows at page boundaries where the
  content can fit intact on a page. Tables that are too broad for the default
  page width must use an approved wider or fit layout, such as landscape table
  sections, fit-to-width scaling, or another governed table layout that
  preserves readability without clipping columns.
- Header page metadata:
  the generated PDF must start with a compact header page before the Product
  Discovery packet body. The header page must identify the packet version,
  generated timestamp, generating actor, packet approval status, and previous
  and next packet-version links when those links exist. The header page should
  make the exported packet self-explaining when viewed outside the app without
  adding raw chat transcript or internal notes. It should not include a visible
  explanatory note that the PDF was generated from approved packet data only.
- Approved PDF source content:
  approved Product Discovery packet data only. Raw chat transcript, working
  conversation history, support notes, and internal review notes are excluded
  from the generated PDF unless a later product and architecture decision
  explicitly promotes them into the export contract.
- Scale and concurrency posture:
  Option 2 light. The generated-document seam should be reusable by future
  features and should enforce explicit concurrency, timeout, fallback, and
  rate-limit controls. MVP defaults are one active render per root or future
  tenant context and three active renders platform-wide.
- MVP size, timeout, and rate defaults:
  These are conservative implementation defaults, not permanent business tier
  limits. Maximum structured packet source data is 250 KB. Maximum rendered
  HTML is 750 KB. Maximum PDF output is 5 MB, with a 3 MB warning metric. The
  soft render timeout is 10 seconds. The hard render timeout is 20 seconds.
  Rate limits are five PDF generations per actor per 10 minutes, three PDF
  generations per conversation per 10 minutes, and 30 PDF generations per
  root/platform context per hour.
- Retry and non-retry defaults:
  One automatic retry is allowed only for renderer startup, renderer crash, or
  render timeout before the hard timeout. Do not automatically retry
  authorization denials, invalid packet state, oversized packet data, unsafe
  input, inaccessible packet data, or data-integrity failures.
- Configuration posture:
  The first implementation may ship these as central static configuration
  defaults. Do not scatter the values as route-local literals. The
  implementation blueprint should name the configuration keys or module that
  owns them and preserve a future path to tenant-level, package-level, or
  platform-level overrides after a separate configuration decision.
- Future async posture:
  A high-volume asynchronous export pipeline is explicitly deferred but should
  remain compatible with the MVP seam. The MVP should not require a rewrite to
  move slower or larger exports into background jobs later.
- SVG allowed?
  no
- If SVG is allowed, what sanitizer/validator and disallowed SVG features
  apply?
  not applicable
- Inline browser rendering allowed?
  no
- Attachment/download-only delivery required?
  yes
- Public visibility allowed?
  no
- If public visibility is allowed, what explicit business reason approves it?
  not applicable

## Accessibility Metadata

- Does this asset use case require alt text, captions, transcripts, subtitles,
  audio descriptions, or another accessibility companion?
  No separate accessibility companion is required for the MVP because the
  export is a simple generated text document. The PDF generator should preserve
  readable text order, section headings, labels, and document metadata where
  practical.
- Is the accessibility text intrinsic to the asset or contextual to this
  entity/use case?
  Intrinsic to the generated document structure.
- Required annotation types:
  other: generated document structure, readable text order, title metadata.
- Locale requirements:
  Use the requester/session locale if a later product decision introduces
  localization. MVP may use the platform default locale.
- Who may create or update the accessibility metadata?
  The server-side PDF generation seam.
- Can the asset be considered ready without the required accessibility
  metadata?
  MVP readiness requires readable generated text and a document title. Broader
  customer or tenant rollout requires a renewed accessibility review.
- If the asset is decorative, what records that decision?
  not applicable

## Ownership And Authorization

- Capability boundary:
  root
- Current tenant context rule:
  The MVP is root-admin only and runs outside tenant authorization. Future
  tenant-builder downloads must evaluate exactly one current tenant context per
  request before activation.
- Cross-tenant deny rule:
  Cross-tenant access is denied by default. Page/module starter context and URL
  state must not grant download access.
- Owning feature's entity-relationship authorization rule:
  The consuming chat or harness-chat feature must authorize the actor against
  the packet's conversation, creator/root-builder review visibility, and
  platform-or-tenant scope before PDF generation or download.
- Required `assets` capability key:
  Not applicable for the MVP because rendered PDF bytes are transient and are
  not stored through the asset foundation. If a later version stores rendered
  PDFs, this record must be revised to name the required `assets` capability.
- Required consuming-feature capability key:
  to be named in the permission mapping; expected keys include packet
  generation, packet download, and discovery history read capabilities.
- Does any actor receive access through public delivery rather than
  authenticated authorization?
  no
- If yes, what constrains that access?
  not applicable

## Upload Safety

- Upload-intent expiry:
  not applicable
- Upload intent is single-use:
  not applicable
- Upload intent is bound to actor:
  not applicable
- Upload intent is bound to root or tenant scope:
  not applicable
- Upload intent is bound to exact generated storage key:
  not applicable
- Checksum required?
  no, because no upload occurs and rendered PDF bytes are not stored as durable
  objects in the MVP.
- Provider-side checksum verification required?
  not applicable
- Backend-streamed checksum verification required?
  not applicable
- Claimed MIME type accepted only as allowlist input?
  not applicable
- Actual-byte verification required before `ready`?
  not applicable
- For SVG, is XML parsing and sanitizer verification required before `ready`?
  not applicable

## Processing And Scanning

- Is processing required before read or display?
  Yes. The PDF is generated from authorized packet data before download.
- Expected generation speed:
  Typical Product Discovery packet PDF generation and download start should
  complete in under 3 seconds. If the renderer cannot meet that target for a
  larger packet, transient load, or slow renderer case, the user should see a
  preparing-download state rather than a hanging request.
- Synchronous versus asynchronous posture:
  Prefer synchronous generation for the typical under-3-second path. The API and
  UI contract must include a fallback preparing-download state for cases that
  exceed the target and may need asynchronous completion.
- Is malware scanning required before read or display?
  no. The MVP PDF is generated server-side from platform packet data, not
  uploaded by a user or fetched from an external source.
- Is EXIF stripping, transcoding, preview generation, or metadata extraction
  required?
  no
- Can the asset be served while processing is pending?
  no
- If processing is deferred, why is the asset class safe enough for v1?
  not applicable
- Which future job or worker seam owns processing?
  The packet-rendering seam named by the future PRD/API contract. MVP rendering
  should produce a simple structured export of the Product Discovery packet,
  not a polished branded document. The renderer should be shaped as the first
  consumer of a reusable generated-document boundary. A background job may be
  introduced later if synchronous generation is too slow.

## Delivery Safety

- Delivery mode:
  attachment only, same-origin authenticated response
- Required response headers:
  `Content-Type: application/pdf`,
  `Content-Disposition: attachment; filename="<safe-generated-name>.pdf"`,
  `X-Content-Type-Options: nosniff`, and the repo-standard authenticated
  browser response headers.
- `X-Content-Type-Options: nosniff` required?
  yes
- Content-Disposition:
  attachment
- Maximum read URL TTL if signed URLs are used:
  not applicable. Signed URLs are not approved for the MVP.
- Is raw bucket URL exposure prohibited?
  yes

## Abuse And Cost Controls

- Per-actor rate limit:
  5 packet PDF generations per 10 minutes. Downloads of an already generated
  response are transient in the MVP and should still be audited; if a future
  cached or stored response exists, download-specific limits must be revisited.
- Per-tenant rate limit:
  not applicable for active tenant workflows in the root-admin MVP. The
  generated-document seam should still support one active render per future
  tenant context and a tenant-level override path before tenant rollout.
- Per-conversation rate limit:
  3 packet PDF generations per 10 minutes.
- Per-root/platform context rate limit:
  30 packet PDF generations per hour.
- Per-tenant storage quota:
  not applicable for transient rendered PDFs.
- Pending upload limit:
  not applicable
- Daily upload byte limit:
  not applicable
- Transfer or bandwidth limit:
  Use the same authenticated API transfer controls as other root-admin
  downloads; alert on unusual repeated generation failures or high-frequency
  downloads.
- Cleanup policy for expired intents:
  not applicable
- Cleanup policy for orphaned objects:
  not applicable because rendered PDF bytes are not stored.
- Alerting or operational signal for abuse:
  Audit repeated denied downloads, repeated generation failures, and
  rate-limited actors.
- Operational signal for generation failures:
  every generation failure must produce audit and metrics evidence. Alert if
  PDF generation failure rate exceeds 10 percent over a rolling 30-minute
  window, if any render reaches the 20-second hard timeout, or if the
  platform-wide render queue remains full for more than 5 minutes.
- Support diagnostics:
  support/root-builder views may show safe failure reason categories for failed
  PDF generation, such as `render_timeout`, `packet_unavailable`,
  `permission_denied`, `data_integrity_failure`, or `renderer_unavailable`.
  Stack traces, renderer internals, raw payloads, storage paths, session
  identifiers, and infrastructure details must remain internal-only.
- Localization posture:
  the generated-document renderer contract should include locale context now so
  future localized PDFs can use the same seam. MVP Product Discovery packet PDFs
  are English-only. Translation, localized copy management, locale-specific
  formatting rules, and fallback-language behavior are deferred to the planned
  repo localization layer and must be revisited before non-English PDF output
  is enabled.
- Migration and reversibility posture:
  MVP reversibility is seam-only. Playwright/Chromium remains behind the
  provider-neutral generated-document seam, and Product Discovery depends on
  the seam contract rather than renderer-specific APIs. A second renderer
  fallback is not implemented or tested in the MVP. Future replacement may move
  rendering to a worker, another self-hosted renderer, or a paid provider
  without changing the Product Discovery packet contract.
- Source schema boundary:
  Product Discovery owns the approved packet data contract and the mapper from
  packet data into the renderer-neutral document shape. The generated-document
  seam accepts only generic rendering primitives, metadata, locale context, and
  delivery options. It must not accept Product Discovery-specific fields
  directly.

## Lifecycle And Retention

- Can the asset be replaced?
  Rendered PDF bytes are regenerated from the selected approved packet version.
  Packet versions may be superseded by later approved packets from the same
  conversation, but superseded versions remain accessible and downloadable to
  authorized root builders as history.
- Is replacement versioned?
  Packet data is versioned; rendered PDF bytes are not versioned in storage for
  the MVP.
- What happens to prior bytes?
  Prior rendered bytes are not retained by the platform. Prior approved packet
  versions remain in packet history and may be regenerated if authorized.
  Superseded packet versions must keep explicit previous and next version links
  where those links exist.
- Soft-delete behavior:
  To be defined on the packet/conversation data model. Soft-deleted or
  inaccessible packet data must not be downloadable through normal paths.
- Hard-delete eligibility:
  Deferred until retention, export, and legal-hold policy exists.
- Retention, legal-hold, export, or compliance requirement:
  Packet data and download audit events are retained indefinitely until a
  broader retention policy exists. Legal-hold/export posture must be revisited
  before customer-facing or tenant-builder rollout.

## Audit And Privacy

- Required audit events:
  packet data generated, packet PDF download requested, packet PDF download
  succeeded, packet PDF download denied, packet PDF generation failed, packet
  superseded.
- Personal or customer data classification:
  Product request content may include product, customer, employee, tenant, or
  operational context supplied by the requester.
- May the asset contain PII?
  yes
- PII classification:
  possible
- Compliance tooling tags required:
  discovery-packet, generated-document, root-admin, possible-pii.
- Forbidden logged fields:
  PDF bytes, full packet body, chat transcript body, session identifiers,
  credentials, bearer tokens, CSRF tokens, and raw authorization headers.
- Privacy note required?
  yes
- Runbook required?
  yes, before production rollout of the generation/download route.

## Stop Conditions Checked

Confirm whether any of these are true.

- New asset kind introduced:
  yes. Generated PDF document delivery is introduced for this narrow use case.
- Public visibility introduced:
  no
- Documents, audio, or video introduced:
  yes. Generated PDF document delivery is introduced.
- User-uploaded content rendered inline:
  no
- Checksum skipped for sensitive assets:
  no. No upload or durable rendered object is created in the MVP.
- Malware scanning skipped for customer-shareable files:
  no. The PDF is generated server-side from packet data and is not approved for
  public or customer-shareable file hosting.
- Generic asset-library or file-hosting behavior introduced:
  no
- Storage provider assumption changed:
  no
- Shared-cross-tenant asset behavior introduced:
  no
- Entity access depends only on asset ownership:
  no

If any item is true, record the explicit approval decision and rationale before
implementation continues.

Approval status:
Approved for the root-admin MVP. The requester explicitly accepted transient
generated download from durable packet data and simple structured export in
chat on 2026-05-06, and accepted conservative configurable MVP numeric
threshold defaults on 2026-05-07.

## Final Decision

- Approved scope:
  Root-admin MVP Product Discovery packet PDFs are generated on demand from
  durable packet data and returned as same-origin authenticated attachment
  downloads. The platform stores packet data, packet versions, lifecycle state,
  and download audit events, not rendered PDF bytes. The rendered PDF is a
  simple structured export of the Product Discovery packet, using clear section
  headings and packet fields rather than a branded or highly designed document.
- Explicitly deferred protections:
  Stored rendered PDF lifecycle, object-storage delivery, signed URLs, public
  delivery, generic document upload, malware scanning for uploaded documents,
  tenant-builder/customer rollout, full PDF accessibility certification,
  branded cover pages, designed section layouts, headers/footers beyond a
  simple generated title, and custom presentation rules.
- Required follow-up before broader rollout:
  Refresh this decision if rendered PDFs are stored, if signed URLs or object
  storage are used, if tenant builders or customers can download packets, if
  arbitrary document uploads are allowed, or if packets become customer-
  shareable outside authenticated root-admin workflows. Also refresh this
  decision if the product asks for polished branded PDFs, customer-facing
  presentation quality, custom templates, advanced accessibility guarantees, or
  a generic document-generation platform.
- Residual risk statement:
  The MVP still carries privacy and authorization risk because generated packet
  content may contain sensitive product or customer context. The approved
  controls are authenticated same-origin delivery, server-side authorization,
  audit events, denied public delivery, and avoiding stored rendered PDF bytes
  as durable assets.
