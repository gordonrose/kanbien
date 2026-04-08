# AI-Assisted Development Platform Status

Source gate: [`AI-ASSISTED-DEVELOPMENT-GATE.md`](/home/gordon/kanbien/docs/standards/AI-ASSISTED-DEVELOPMENT-GATE.md)

## Overall

- Current status: `Partial`
- Summary:
  The repo now defines an explicit AI-assisted development control model, but
  the current platform evidence is still process-heavy rather than
  enforcement-heavy. Architecture guardrails, deterministic testing
  expectations, and human-review discipline are strong. The repo now also has
  a lightweight provenance-note workflow and template, but provenance logging,
  prompt-handling evidence, and repeatable high-risk traceability are still
  immature beyond the first durable review notes.

## 1. Human Accountability

- `Pass` A named human owner accepts responsibility for every adopted AI-assisted output.
  Repo process and Codex instructions keep human acceptance and ownership
  explicit.
- `Pass` A human reviewer has checked the output against the relevant source of truth rather than trusting the model's explanation.
  The repo's skills and architecture-first workflow require source-backed
  verification.
- `Pass` Decision rights are clear for accepting, rejecting, or reworking AI-produced content.
  Review authority is explicit in the docs and change-loop expectations.
- `Partial` High-risk AI-assisted changes receive reviewer attention appropriate to the risk.
  The rule now exists, but the repo does not yet have a mature evidence trail
  proving repeated application on real changes.

## 2. Provenance And Traceability

- `Partial` The change records whether AI materially contributed to the accepted output.
  The gate now requires it, and the repo now has dated review-note examples
  under `docs/workspace/reviews/`, but there is not yet a broad established
  history of repeated use across many slices.
- `Fail` For high-risk changes, the model, tool, and version used are recorded.
  This is now expected but not yet embedded in the current artifact set.
- `Partial` For high-risk changes, the accepted artifact can be traced back to the review context that justified adoption.
  Some traceability exists through PRDs, ADRs, and test cases, but not yet as
  an explicit AI provenance chain.
- `Fail` Hidden provenance is not allowed for material accepted outputs.
  The policy now says this, and the repo now has a concrete review template and
  helper skill, but there is still no hard enforcement proving consistent use
  on every materially AI-assisted slice.

## 3. Prompt And Data Handling

- `Pass` Secrets, credentials, tokens, private keys, and production secrets are not placed into prompts.
  Repo guidance already strongly discourages secret exposure and hard-coded
  secret handling.
- `Partial` Sensitive personal data, regulated data, customer data, or confidential business data is not placed into prompts without explicit approval and handling controls.
  The expectation is now documented, but there is not yet a standard approval
  artifact or review log for exceptions.
- `Partial` Prompt inputs are minimized to the least sensitive context needed.
  Good default behavior exists, but the repo has no durable prompt-minimization
  evidence process.
- `Fail` Any approved sensitive-context use is documented with owner and rationale.
  No established artifact pattern exists yet for this.

## 4. Independent Verification And Deterministic Evidence

- `Pass` Accepted AI output is independently verified against code, docs, schema, architecture rules, or other primary repo evidence.
  The repo heavily emphasizes source-backed verification.
- `Pass` The change is not accepted only because the model claimed it was correct, compliant, or secure.
  Current repo process rejects unsupported claims in favor of primary evidence.
- `Pass` Behavior-changing output is backed by deterministic tests or equivalent deterministic verification evidence.
  The repo has strong traceable test-planning and executable-test expectations.
- `Pass` Security-critical, persistence-critical, and contract-critical paths are verified with repo-appropriate executable evidence.
  This is a core current repo norm, though coverage maturity still varies by
  slice.

## 5. Dependency, License, And Provenance Review

- `Partial` Generated code, snippets, dependencies, and copied patterns have been reviewed for license, origin, and supply-chain risk.
  Normal dependency review exists in principle, but generated-snippet origin
  review is not yet a mature, explicit practice.
- `Partial` New packages, services, or external tools suggested by the model are reviewed under the normal dependency-governance expectations.
  Architecture and standards reviews provide some control, but the evidence is
  still lightweight.
- `Fail` The team can explain where materially adopted third-party logic came from or why its provenance risk is acceptable.
  No explicit adopted-snippet provenance workflow exists yet.
- `Partial` Unverifiable generated code with unclear origin is not silently shipped into the repo.
  Current review norms help, but there is not yet a dedicated review checklist
  artifact proving this consistently.

## 6. Architecture And Boundary Compliance

- `Pass` AI-assisted output has been checked against `AGENTS.md`, architecture docs, ADRs, and feature-boundary rules.
  This is a strong current repo habit and now an explicit gate rule.
- `Pass` AI-assisted changes do not silently introduce cross-feature coupling, contract drift, migration-risk shortcuts, or shared-seam violations.
  The repo's architecture and change-control docs are explicit about these
  guardrails.
- `Pass` Durable-data, API, routing, persistence, and integration compatibility rules are still met.
  Compatibility expectations are strong and central to the repo's current
  process.
- `Pass` The accepted output reflects repo conventions rather than model-default patterns that conflict with local standards.
  Repo-local skills and architecture-first review make this a relative
  strength.

## 7. High-Risk Change Controls

- `Fail` High-risk changes have model/tool/version traceability when AI materially contributed.
  This requirement is new and not yet shown in existing artifact history.
- `Partial` Authentication, authorization, cryptography, secrets handling, security controls, compliance controls, and incident/monitoring logic are not accepted from AI output without expert human review.
  The repo culture points this way, but the evidence is still implicit rather
  than standardized.
- `Partial` Non-deterministic generation risk has been mitigated by review depth and reproducible verification evidence.
  Deterministic verification is strong; explicit treatment of generation
  variance is still new.
- `Fail` Material model or tool changes that could affect repeated high-risk work are treated as controlled process changes.
  No durable process exists yet for this.

## 8. Operational Learning And Containment

- `Pass` The team knows how to correct or roll back accepted AI-assisted output if later review finds defects.
  Existing change-loop, test, and documentation expectations make rework and
  rollback of ordinary repo changes manageable.
- `Partial` Review notes or artifacts are sufficient to revisit why the output was accepted.
  PRDs, ADRs, and tests help, and the repo now has AI-specific acceptance-note
  examples, but they are not yet routine enough to count as mature evidence.
- `Partial` Known limitations or uncertain areas introduced by AI assistance are called out rather than hidden.
  Repo tone encourages this, but evidence is still informal.
- `Partial` Over-trust in AI-generated output is treated as a review failure, not an acceptable workflow shortcut.
  The norm is strong in practice, but the newly documented control is not yet
  institutionalized through templates or automation.

## Main Gaps To Close

- add high-risk model/tool/version traceability to the change artifact set
- define how approved sensitive prompt-context use is recorded
- add a durable review expectation for generated snippet/license provenance
- make expert-review expectations explicit for AI-assisted security controls
