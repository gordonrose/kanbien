# AI-Assisted Development Gate

## Purpose

Use this supplemental gate to determine whether a proposed architecture
decision, implementation plan, code change, documentation change, test change,
or operational artifact that was materially assisted by generative AI is
acceptable to adopt.

This gate exists to control AI-specific development failure modes that are not
fully covered by the general secure-engineering and operational-risk gates.
Use it alongside:

- `NIST-SSDF-GATE.md`
- `NIST-CSF-2.0-GATE.md`

It is designed to align with the repo's use of NIST secure-development and
cyber-risk controls while adding AI-specific governance, verification,
traceability, and data-handling expectations.

## Important framing

This is not a product-AI feature gate.
It is a development-process gate.

Apply it whenever generative AI materially contributes to:

- source code
- tests
- migrations
- infrastructure or CI/CD configuration
- architecture or security design content
- runbooks, compliance docs, or operational procedures
- threat models, audit logic, or policy-like artifacts

Low-risk spelling or copy-edit assistance may be treated as not applicable.
Material technical output must not be accepted without this review.

## Core rule

AI-assisted development is allowed, but never unaudited.

Human reviewers remain accountable for every accepted output.
The standard of acceptance is independent verification against repo source of
truth, architecture guardrails, and deterministic evidence, not confidence in
the model.

## Mandatory pass criteria

### 1. Human accountability
- [ ] A named human owner accepts responsibility for every adopted AI-assisted output.
- [ ] A human reviewer has checked the output against the relevant source of truth rather than trusting the model's explanation.
- [ ] Decision rights are clear for accepting, rejecting, or reworking AI-produced content.
- [ ] High-risk AI-assisted changes receive reviewer attention appropriate to the risk.

### 2. Provenance and traceability
- [ ] The change records whether AI materially contributed to the accepted output.
- [ ] For high-risk changes, the model, tool, and version used are recorded.
- [ ] For high-risk changes, the accepted artifact can be traced back to the review context that justified adoption.
- [ ] Hidden provenance is not allowed for material accepted outputs.

### 3. Prompt and data handling
- [ ] Secrets, credentials, tokens, private keys, and production secrets are not placed into prompts.
- [ ] Sensitive personal data, regulated data, customer data, or confidential business data is not placed into prompts without explicit approval and handling controls.
- [ ] Prompt inputs are minimized to the least sensitive context needed.
- [ ] Any approved sensitive-context use is documented with owner and rationale.

### 4. Independent verification and deterministic evidence
- [ ] Accepted AI output is independently verified against code, docs, schema, architecture rules, or other primary repo evidence.
- [ ] The change is not accepted only because the model claimed it was correct, compliant, or secure.
- [ ] Behavior-changing output is backed by deterministic tests or equivalent deterministic verification evidence.
- [ ] Security-critical, persistence-critical, and contract-critical paths are verified with repo-appropriate executable evidence.

### 5. Dependency, license, and provenance review
- [ ] Generated code, snippets, dependencies, and copied patterns have been reviewed for license, origin, and supply-chain risk.
- [ ] New packages, services, or external tools suggested by the model are reviewed under the normal dependency-governance expectations.
- [ ] The team can explain where materially adopted third-party logic came from or why its provenance risk is acceptable.
- [ ] Unverifiable generated code with unclear origin is not silently shipped into the repo.

### 6. Architecture and boundary compliance
- [ ] AI-assisted output has been checked against `AGENTS.md`, architecture docs, ADRs, and feature-boundary rules.
- [ ] AI-assisted changes do not silently introduce cross-feature coupling, contract drift, migration-risk shortcuts, or shared-seam violations.
- [ ] Durable-data, API, routing, persistence, and integration compatibility rules are still met.
- [ ] The accepted output reflects repo conventions rather than model-default patterns that conflict with local standards.

### 7. High-risk change controls
- [ ] High-risk changes have model/tool/version traceability when AI materially contributed.
- [ ] Authentication, authorization, cryptography, secrets handling, security controls, compliance controls, and incident/monitoring logic are not accepted from AI output without expert human review.
- [ ] Non-deterministic generation risk has been mitigated by review depth and reproducible verification evidence.
- [ ] Material model or tool changes that could affect repeated high-risk work are treated as controlled process changes.

### 8. Operational learning and containment
- [ ] The team knows how to correct or roll back accepted AI-assisted output if later review finds defects.
- [ ] Review notes or artifacts are sufficient to revisit why the output was accepted.
- [ ] Known limitations or uncertain areas introduced by AI assistance are called out rather than hidden.
- [ ] Over-trust in AI-generated output is treated as a review failure, not an acceptable workflow shortcut.

## Required design questions

Before approval, answer these:

1. What parts of this change were materially AI-assisted?
2. Who is accountable for accepting the output?
3. What source of truth was used to verify the output independently?
4. Did any prompt include secrets, sensitive data, or confidential context?
5. What deterministic evidence proves the accepted behavior?
6. Does the change introduce generated code or dependencies with unclear origin or license posture?
7. Is any part of the accepted output security-sensitive or compliance-sensitive?
8. For high-risk changes, what model, tool, and version were used?

## Evidence required

A passing review should include:

- human owner
- AI-assistance/provenance note
- prompt/data-handling note
- independent verification note
- deterministic test or verification evidence
- dependency/license review note when generated code or snippets are adopted
- model/tool/version traceability for high-risk changes
- expert-review note for AI-assisted security or compliance controls

## Fail conditions

Block the change if any of the following are true:

- no human owner accepts responsibility for adopted AI output
- material AI assistance is hidden or unverifiable
- secrets or sensitive data were placed into prompts without approval
- the change relies on "model said so" rather than independent verification
- generated code or dependencies have unknown license, provenance, or review status
- AI-assisted output violates architecture boundaries or compatibility guardrails
- high-risk changes lack deterministic evidence or model/tool/version traceability
- AI-generated security controls are accepted without expert human review
