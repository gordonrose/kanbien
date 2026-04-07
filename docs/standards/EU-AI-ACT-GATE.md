# EU AI Act Gate

## Purpose

Use this gate to determine whether a proposed architecture decision, feature, model integration, workflow, or product behavior is in scope for the EU AI Act and whether the team has considered the obligations that may apply.

## Important framing

This gate is required whenever the change:
- builds an AI system
- embeds or exposes AI features
- integrates an external model or AI service
- materially changes model behavior, autonomy, or decision support
- uses AI in a workflow affecting people, rights, access, safety, or regulated decisions

If a change has no AI capability at all, it may be marked not applicable.

This gate does not replace `AI-ASSISTED-DEVELOPMENT-GATE.md` for internal use
of generative AI during design, coding, testing, or documentation work.

## Core rule

Do not treat “uses an API from an AI vendor” as outside scope by default.
The first question is whether the feature is an AI system or depends on one.

## Mandatory pass criteria

### 1. Scope and classification
- [ ] The team has explicitly determined whether the change is in scope for the EU AI Act.
- [ ] The role of the organization is understood: provider, deployer, importer, distributor, or product integrator as applicable.
- [ ] The use case has been screened for prohibited practices risk.
- [ ] The use case has been screened for high-risk classification risk.
- [ ] General-purpose AI model dependency is identified where relevant.

### 2. Use-case risk understanding
- [ ] The intended purpose of the AI feature is documented.
- [ ] The system boundaries are documented: model, prompts, tools, data sources, automations, outputs, and human decision points.
- [ ] A misuse/abuse analysis exists.
- [ ] Human impact is understood, especially if the output influences eligibility, ranking, access, employment, education, credit, safety, or rights.

### 3. Human oversight and control
- [ ] Human oversight is defined where required by the use case.
- [ ] The design makes clear what is automated versus advisory.
- [ ] Operators can identify, challenge, or override outputs where required.
- [ ] Escalation paths exist for harmful or clearly wrong AI outputs.

### 4. Transparency and disclosure
- [ ] The user-facing behavior makes clear when AI is being used where disclosure is required or appropriate.
- [ ] The boundaries of the system are not misleadingly represented.
- [ ] Records exist for key prompts, inputs, outputs, or decisions where needed for review and accountability.
- [ ] Documentation exists describing intended purpose, constraints, and known limitations.

### 5. Data and model governance
- [ ] Input data sources and major dependencies are identified.
- [ ] Material model/provider dependencies are documented.
- [ ] Safety, bias, or reliability concerns have been considered for the use case.
- [ ] Evaluation and monitoring plans exist for model-driven behavior.
- [ ] Changes to prompts, models, tools, or routing are treated as controlled changes when they materially affect behavior.

### 6. Operational readiness
- [ ] Incident response considerations exist for harmful, unsafe, or non-compliant model behavior.
- [ ] Logging and monitoring are sufficient to investigate significant failures.
- [ ] Rollback or disablement exists for the AI capability.
- [ ] The organization knows who owns the AI behavior in production.

### 7. Legal and policy alignment
- [ ] The change has been checked against internal AI-use policy if one exists.
- [ ] Contractual, privacy, IP, and regulatory implications have been considered for the specific AI use case.
- [ ] AI literacy or training implications have been considered for staff using or operating the system.

## Required design questions

1. Is this feature an AI system, or does it materially depend on one?
2. What is the intended purpose?
3. Could the use fall into a prohibited or high-risk category?
4. Who is accountable for the AI behavior in production?
5. What human oversight exists?
6. What is logged for investigation and accountability?
7. Can the AI feature be disabled or rolled back quickly?

## Evidence required

A passing review should include:
- AI scope determination
- intended-purpose note
- model/provider dependency note
- human oversight note
- monitoring/rollback note
- accountability owner

## Fail conditions

Block the change if any of the following are true:
- AI is being introduced but no one has determined whether the AI Act is in scope
- the team cannot explain intended purpose or human oversight
- model/provider dependency is unknown
- there is no rollback or disablement path for a risky AI feature
- the change could affect people materially but has no accountability trail
