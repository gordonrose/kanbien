# EU AI Act Platform Status

Source gate: [`EU-AI-ACT-GATE.md`](/home/gordon/kanbien/docs/standards/EU-AI-ACT-GATE.md)

## Overall

- Current status: `Partial`
- Summary:
  The repo now includes a root-admin Product Discovery chat MVP with an
  optional OpenAI-backed conversation adapter behind server-side configuration.
  The prior "no AI/model integrations" status is no longer accurate. Current
  posture is partial because the AI use case is internal, advisory, and
  root-admin scoped, but the EU AI Act scope, intended-purpose, provider/model,
  transparency, monitoring, rollback, and ownership records need a refreshed
  dedicated review before production reliance.

## 1. Scope And Classification

- `Partial` The team has explicitly determined whether the change is in scope for the EU AI Act.
  The current source includes an AI/model-backed workflow, so formal scope
  determination is now required.
- `Partial` The role of the organization is understood: provider, deployer, importer, distributor, or product integrator as applicable.
  The adapter consumes an external model provider from an internal root-admin
  workflow; exact legal role still needs review.
- `Partial` The use case has been screened for prohibited practices risk.
  The documented use case is internal Product Discovery assistance, but a
  recorded prohibited-practices screen is not yet present.
- `Partial` The use case has been screened for high-risk classification risk.
  The MVP is advisory and not documented as making eligibility, access,
  employment, education, credit, safety, or rights decisions, but formal
  classification evidence is still missing.
- `Partial` General-purpose AI model dependency is identified where relevant.
  The runtime adapter documents `OPENAI_API_KEY` and `OPENAI_MODEL`, but the
  maintained status record does not yet name the approved provider/model
  posture.

## 2. Use-Case Risk Understanding

- `Partial` The intended purpose of the AI feature is documented.
  The chat-interface API contract documents the root-admin Layer 1 Discovery
  assistant, but the status gate needs a dedicated intended-purpose record.
- `Partial` The system boundaries are documented: model, prompts, tools, data sources, automations, outputs, and human decision points.
  The adapter and API contract document server-side model use and credential
  boundaries, but the full boundary record is incomplete.
- `Fail` A misuse/abuse analysis exists.
  No dedicated misuse/abuse analysis was found in this status refresh.
- `Partial` Human impact is understood, especially if the output influences eligibility, ranking, access, employment, education, credit, safety, or rights.
  The current workflow is framed as advisory Product Discovery support, but the
  human-impact classification is not yet recorded as a maintained artifact.

## 3. Human Oversight And Control

- `Partial` Human oversight is defined where required by the use case.
  Packet generation remains rooted in Product Discovery readiness, but formal
  oversight language is incomplete.
- `Partial` The design makes clear what is automated versus advisory.
  The API contract describes generated turns and packet generation, but the UI
  and operating docs still need explicit advisory-boundary wording.
- `Partial` Operators can identify, challenge, or override outputs where required.
  Conversation history and packet revisions are durable, but challenge/override
  workflow is not yet a maintained operational record.
- `Fail` Escalation paths exist for harmful or clearly wrong AI outputs.
  No dedicated escalation path was found in this status refresh.

## 4. Transparency And Disclosure

- `Partial` The user-facing behavior makes clear when AI is being used where disclosure is required or appropriate.
  Needs UI/operational review for clear disclosure in root-admin Build chat.
- `Partial` The boundaries of the system are not misleadingly represented.
  Server-side credential boundaries are documented; legal/compliance disclosure
  posture is not complete.
- `Partial` Records exist for key prompts, inputs, outputs, or decisions where needed for review and accountability.
  Durable conversation, message, usage-attempt, and packet-revision records
  exist, but prompt/model governance evidence is incomplete.
- `Partial` Documentation exists describing intended purpose, constraints, and known limitations.
  API and data docs exist; the maintained platform-status review remains
  incomplete.

## 5. Data And Model Governance

- `Partial` Input data sources and major dependencies are identified.
  Conversation transcript and surface context are used; complete data-source
  classification still needs review.
- `Partial` Material model/provider dependencies are documented.
  OpenAI runtime configuration exists, but approved provider/model status is
  not yet a maintained decision record.
- `Fail` Safety, bias, or reliability concerns have been considered for the use case.
  No dedicated safety/reliability review was found in this status refresh.
- `Fail` Evaluation and monitoring plans exist for model-driven behavior.
  Usage limits exist, but evaluation and monitoring plans are not complete.
- `Partial` Changes to prompts, models, tools, or routing are treated as controlled changes when they materially affect behavior.
  The adapter is source-controlled; formal controlled-change expectations for
  model/prompt changes still need to be added to the artifact set.

## 6. Operational Readiness

- `Fail` Incident response considerations exist for harmful, unsafe, or non-compliant model behavior.
  Not yet documented.
- `Partial` Logging and monitoring are sufficient to investigate significant failures.
  Durable usage/persistence records exist, but monitoring posture is incomplete.
- `Partial` Rollback or disablement exists for the AI capability.
  `OPENAI_ENABLED` and missing-key fallback can disable model calls, but
  operational rollback guidance is incomplete.
- `Fail` The organization knows who owns the AI behavior in production.
  Production ownership is not yet recorded.

## 7. Legal And Policy Alignment

- `Fail` The change has been checked against internal AI-use policy if one exists.
  No dedicated policy check was found in this status refresh.
- `Fail` Contractual, privacy, IP, and regulatory implications have been considered for the specific AI use case.
  Not yet recorded.
- `Fail` AI literacy or training implications have been considered for staff using or operating the system.
  Not yet recorded.

## Main Gaps To Close

- complete EU AI Act scope and role classification for the root-admin Product
  Discovery chat MVP
- record provider/model dependency approval and prompt/data-source boundaries
- add misuse/abuse, safety, reliability, transparency, monitoring, rollback,
  and incident-response posture
- name the owner for production AI behavior before production reliance
